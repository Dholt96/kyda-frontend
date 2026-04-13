# CLAUDE.md — Blackcard Project

## Project Overview
Blackcard is an invite-only social media app. Think exclusive, dark, luxurious. Users can only join with a valid invite code from an existing member. The app includes a feed, posts with images, likes, comments, bookmarks, follows, notifications, user profiles, search/discover, invite code generation, and logout.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS optional, DM Sans + Playfair Display fonts
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (hosted on Railway)
- **Auth:** JWT tokens (jsonwebtoken), bcrypt for password hashing
- **Hosting:** Railway (backend + database), frontend can be on Railway or Vercel
- **File uploads:** TBD — likely Cloudflare R2 or Railway volume

## Project Structure
```
blackcard/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components (Feed, Profile, Search, etc.)
│   │   ├── hooks/          # Custom React hooks (useAuth, useFeed, etc.)
│   │   ├── context/        # Auth context provider
│   │   ├── api/            # API client functions
│   │   ├── utils/          # Helpers, formatters
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                 # Express API
│   ├── index.js            # Entry point, middleware, route mounting
│   ├── routes/
│   │   ├── auth.js         # POST /api/validate-invite, /api/register, /api/login
│   │   ├── posts.js        # CRUD posts, likes, comments, bookmarks
│   │   ├── users.js        # Profiles, follow/unfollow, search
│   │   ├── invites.js      # Generate codes, list my invites
│   │   └── notifications.js
│   ├── middleware/
│   │   └── auth.js         # JWT verification middleware
│   ├── db/
│   │   ├── pool.js         # pg Pool setup using DATABASE_URL
│   │   └── schema.sql      # Full database schema
│   ├── package.json
│   └── .env.example
├── CLAUDE.md               # This file
├── .gitignore
└── README.md
```

## Database Schema
8 tables in PostgreSQL:

- **users** — id, username, handle, email, password_hash, avatar_url, bio, invite_code_used, invites_remaining (default 3), created_at, updated_at
- **invite_codes** — id, code (unique), created_by, used_by, status (active/used/expired), created_at, used_at
- **posts** — id, user_id, text_content, image_url, created_at
- **likes** — id, user_id, post_id, created_at (unique constraint on user_id + post_id)
- **comments** — id, user_id, post_id, text_content, created_at
- **follows** — id, follower_id, following_id, created_at (unique constraint on pair)
- **bookmarks** — id, user_id, post_id, created_at (unique constraint on pair)
- **notifications** — id, user_id, from_user_id, type (like/comment/follow/mention), post_id, is_read, created_at

Seed invite codes: BLACKCARD, ELITE2026, INNER-CIRCLE, FOUNDING, VIP-ACCESS

## API Endpoints

### Auth
- `POST /api/validate-invite` — Check if invite code is valid
- `POST /api/register` — Create account with invite code, returns JWT
- `POST /api/login` — Email + password login, returns JWT

### Posts
- `GET /api/feed` — Get feed posts with like/comment counts and user liked/bookmarked status
- `POST /api/posts` — Create new post (text_content, image_url)
- `POST /api/posts/:id/like` — Toggle like
- `POST /api/posts/:id/bookmark` — Toggle bookmark
- `GET /api/posts/:id/comments` — Get comments for a post
- `POST /api/posts/:id/comments` — Add comment

### Users
- `GET /api/users/:id` — Get profile with post/follower/following counts
- `POST /api/users/:id/follow` — Toggle follow
- `GET /api/search?q=` — Search users by name or handle

### Invites
- `POST /api/invites/generate` — Generate new invite code (decrements invites_remaining)
- `GET /api/invites` — List my generated invite codes with usage status

### Notifications
- `GET /api/notifications` — Get my notifications

All endpoints except auth routes require `Authorization: Bearer <token>` header.

## Environment Variables
```
DATABASE_URL=postgresql://...     # Railway auto-sets this
JWT_SECRET=<random-string>        # Set in Railway variables
PORT=3001                         # Railway auto-sets this
NODE_ENV=production               # Set in Railway variables
```

## Design System
- **Theme:** Dark, warm, cinematic — black/brown backgrounds with gold accent
- **Colors:**
  - Background: #0E0D0B (primary), #1A1815 (secondary), #1E1C18 (cards)
  - Accent: #E8A849 (gold), gradient: #E8A849 → #D4763A
  - Text: #F5F0E8 (primary), #A69E8E (secondary), #6B6357 (muted)
  - Borders: #2E2A24
  - Danger: #D94F4F, Success: #5BAD6A
- **Fonts:** Playfair Display (headings, logo), DM Sans (body, UI)
- **Border radius:** 8px (small), 14px (medium), 20px (large)
- **Animations:** fadeUp, scaleIn, heartPop, slideDown, shake (for errors)

## Key Features & UX

### Invite Gate
- Full-screen locked entry with code input
- Auto-uppercases input, 3-letter spacing
- Shake animation + red border on invalid code
- Loading spinner during verification
- "Use demo code" button for testing

### Feed
- Stories row at top (horizontally scrollable avatars)
- Post cards with user info, text, optional image, like/comment/share/bookmark actions
- Inline comment expansion with reply input
- Heart animation on like

### Profile
- Cover image + avatar overlay
- Stats: posts, followers, following
- "Invites" button (own profile) opens invite panel
- "Follow" button (other profiles)
- Logout button on own profile

### Invite System
- Each user gets 3 invites
- Generated codes follow format: BC-XXXXXX
- Panel shows active vs used codes with copy button
- Used codes show who used them

### Search
- Search bar filters users by name/handle
- Trending hashtags section
- Suggested users when no query

### Notifications
- Grouped by type: like, comment, follow, mention
- Unread highlight (gold tint)
- Follow-back button on follow notifications

## Coding Standards
- Use functional React components with hooks
- Keep components in separate files, one component per file
- Use async/await for all API calls
- Wrap API calls in try/catch with proper error handling
- Use parameterized queries ($1, $2) for all SQL — never string interpolation
- JWT middleware on all protected routes
- Return consistent JSON shape: { data } on success, { error: "message" } on failure
- Use environment variables for all secrets and config
- No console.log in production code — use proper error logging

## Deployment (Railway)
1. Push to GitHub
2. Connect repo to Railway project
3. Add PostgreSQL service
4. Set JWT_SECRET in variables
5. Run schema.sql against Railway Postgres
6. Generate domain in service settings
7. Frontend: either serve from Express (static build) or deploy separately

## Current Status
- Frontend React UI: COMPLETE (social-media-app.jsx has full working prototype)
- Backend Express API: COMPLETE (server/index.js has all endpoints)
- Database schema: COMPLETE (schema.sql ready to run)
- Deployment: NOT STARTED
- Frontend-to-API wiring: NOT STARTED
- Image upload: NOT STARTED
- Real-time features: NOT STARTED

## Next Steps (Priority Order)
1. Scaffold Vite project, move frontend code into component files
2. Set up Railway project with PostgreSQL
3. Deploy backend, run schema
4. Wire frontend to real API endpoints
5. Add image upload for posts and avatars
6. Add real-time notifications (optional — websockets or polling)
7. Polish, test, submit by Friday
