import PostCard from "../components/PostCard";
import { TicketIcon, LogoutIcon } from "../components/Icons";
import { formatNumber } from "../utils/formatNumber";

export default function ProfilePage({ user, posts, currentUser, isCurrentUser, onShowInvites, onLogout, onLike, onBookmark, onComment }) {
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ height: 180, background: "var(--gradient-warm)", borderRadius: "0 0 var(--radius-lg) var(--radius-lg)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.5 }} />
      </div>
      <div style={{ padding: "0 20px", marginTop: -40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <img src={user.avatar_url || user.avatar} alt="" style={{ width: 86, height: 86, borderRadius: "50%", objectFit: "cover", border: "4px solid var(--bg-primary)" }} />
          {isCurrentUser ? (
            <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
              <button onClick={onShowInvites} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent-soft)", border: "1px solid rgba(232,168,73,0.3)", color: "var(--accent)", padding: "8px 16px", borderRadius: 20, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                <TicketIcon /> Invites
              </button>
              <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid var(--border-light)", color: "var(--text-muted)", padding: "8px 14px", borderRadius: 20, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                <LogoutIcon />
              </button>
            </div>
          ) : (
            <button style={{ background: "var(--gradient-warm)", border: "none", color: "#fff", padding: "8px 24px", borderRadius: 20, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>Follow</button>
          )}
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22 }}>{user.username || user.name}</div>
          <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 2 }}>{user.handle}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 14.5, marginTop: 10, lineHeight: 1.5 }}>{user.bio}</div>
        </div>
        <div style={{ display: "flex", gap: 28, marginTop: 18 }}>
          {[["Posts", user.post_count ?? user.posts ?? 0], ["Followers", formatNumber(user.follower_count ?? user.followers ?? 0)], ["Following", formatNumber(user.following_count ?? user.following ?? 0)]].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)" }}>{v}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />
      <div style={{ padding: "0 6px 80px", display: "flex", flexDirection: "column", gap: 14 }}>
        {posts.length === 0
          ? <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)", fontSize: 14 }}>No posts yet</div>
          : posts.map(p => (
              <PostCard key={p.id} post={p} currentUser={currentUser} onLike={onLike} onBookmark={onBookmark} onComment={onComment} />
            ))
        }
      </div>
    </div>
  );
}
