// server/index.js — Blackcard API
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection (Railway sets DATABASE_URL automatically)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

app.use(cors());
app.use(express.json());

// ─── Auth Middleware ───
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ─── INVITE CODE VALIDATION ───
app.post('/api/validate-invite', async (req, res) => {
  try {
    const { code } = req.body;
    const result = await pool.query(
      'SELECT * FROM invite_codes WHERE code = $1 AND status = $2',
      [code.toUpperCase(), 'active']
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired invite code' });
    }
    res.json({ valid: true, codeId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── REGISTER ───
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, inviteCode } = req.body;

    // Validate invite code
    const codeResult = await pool.query(
      'SELECT * FROM invite_codes WHERE code = $1 AND status = $2',
      [inviteCode.toUpperCase(), 'active']
    );
    if (codeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid invite code' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const handle = '@' + username.toLowerCase().replace(/\s/g, '');

    // Create user
    const userResult = await pool.query(
      `INSERT INTO users (username, handle, email, password_hash, invite_code_used)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, username, handle, email, avatar_url, bio`,
      [username, handle, email, passwordHash, codeResult.rows[0].id]
    );

    // Mark invite code as used
    await pool.query(
      'UPDATE invite_codes SET status = $1, used_by = $2, used_at = NOW() WHERE id = $3',
      ['used', userResult.rows[0].id, codeResult.rows[0].id]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: userResult.rows[0].id, username: userResult.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user: userResult.rows[0], token });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Username or email already taken' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── LOGIN ───
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: { id: user.id, username: user.username, handle: user.handle, email: user.email, avatar_url: user.avatar_url, bio: user.bio },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET FEED ───
app.get('/api/feed', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username, u.handle, u.avatar_url,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
        EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) AS liked,
        EXISTS(SELECT 1 FROM bookmarks WHERE post_id = p.id AND user_id = $1) AS bookmarked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── CREATE POST ───
app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { text_content, image_url } = req.body;
    const result = await pool.query(
      'INSERT INTO posts (user_id, text_content, image_url) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, text_content, image_url || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── LIKE / UNLIKE ───
app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const existing = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
      [req.user.id, req.params.id]
    );
    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [req.user.id, req.params.id]);
      res.json({ liked: false });
    } else {
      await pool.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [req.user.id, req.params.id]);
      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── COMMENTS ───
app.get('/api/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.username, u.handle, u.avatar_url
       FROM comments c JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1 ORDER BY c.created_at ASC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { text_content } = req.body;
    const result = await pool.query(
      'INSERT INTO comments (user_id, post_id, text_content) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, req.params.id, text_content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── FOLLOW / UNFOLLOW ───
app.post('/api/users/:id/follow', authenticateToken, async (req, res) => {
  try {
    const existing = await pool.query(
      'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
      [req.user.id, req.params.id]
    );
    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM follows WHERE follower_id = $1 AND following_id = $2', [req.user.id, req.params.id]);
      res.json({ following: false });
    } else {
      await pool.query('INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)', [req.user.id, req.params.id]);
      res.json({ following: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── USER PROFILE ───
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.handle, u.email, u.avatar_url, u.bio, u.invites_remaining, u.created_at,
        (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS post_count,
        (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS follower_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count,
        EXISTS(SELECT 1 FROM follows WHERE follower_id = $2 AND following_id = u.id) AS is_following
       FROM users u WHERE u.id = $1`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GENERATE INVITE CODE ───
app.post('/api/invites/generate', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT invites_remaining FROM users WHERE id = $1', [req.user.id]);
    if (user.rows[0].invites_remaining <= 0) {
      return res.status(400).json({ error: 'No invites remaining' });
    }

    const code = 'BC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    await pool.query(
      'INSERT INTO invite_codes (code, created_by) VALUES ($1, $2)',
      [code, req.user.id]
    );
    await pool.query(
      'UPDATE users SET invites_remaining = invites_remaining - 1 WHERE id = $1',
      [req.user.id]
    );

    res.json({ code });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET MY INVITES ───
app.get('/api/invites', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ic.*, u.username AS used_by_name
       FROM invite_codes ic
       LEFT JOIN users u ON ic.used_by = u.id
       WHERE ic.created_by = $1
       ORDER BY ic.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── BOOKMARK ───
app.post('/api/posts/:id/bookmark', authenticateToken, async (req, res) => {
  try {
    const existing = await pool.query(
      'SELECT * FROM bookmarks WHERE user_id = $1 AND post_id = $2',
      [req.user.id, req.params.id]
    );
    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM bookmarks WHERE user_id = $1 AND post_id = $2', [req.user.id, req.params.id]);
      res.json({ bookmarked: false });
    } else {
      await pool.query('INSERT INTO bookmarks (user_id, post_id) VALUES ($1, $2)', [req.user.id, req.params.id]);
      res.json({ bookmarked: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── SEARCH USERS ───
app.get('/api/search', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    const result = await pool.query(
      `SELECT id, username, handle, avatar_url, bio FROM users
       WHERE username ILIKE $1 OR handle ILIKE $1
       LIMIT 20`,
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── NOTIFICATIONS ───
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT n.*, u.username, u.handle, u.avatar_url
       FROM notifications n
       JOIN users u ON n.from_user_id = u.id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC
       LIMIT 30`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Health check ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Blackcard API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`⬛ Blackcard API running on port ${PORT}`);
});
