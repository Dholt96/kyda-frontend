import { useState, useEffect } from "react";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    fetch("/api/notifications", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(r => r.json())
      .then(data => setNotifs(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: "0 4px 80px", animation: "fadeUp 0.4s ease" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, padding: "0 14px 18px" }}>Notifications</h2>
      {notifs.map((n, i) => (
        <div key={n.id || i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "background 0.2s", animation: `fadeUp 0.4s ease ${i * 0.06}s both`, background: !n.is_read ? "var(--accent-soft)" : "transparent" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = !n.is_read ? "var(--accent-soft)" : "transparent"}>
          <img src={n.avatar_url} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{n.username} </span>
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {n.type === "like" && "liked your post"}
              {n.type === "comment" && "commented on your post"}
              {n.type === "follow" && "started following you"}
              {n.type === "mention" && "mentioned you in a post"}
            </span>
            <div style={{ color: "var(--text-muted)", fontSize: 12.5, marginTop: 3 }}>{n.created_at}</div>
          </div>
          {n.type === "follow" && (
            <button style={{ background: "var(--gradient-warm)", border: "none", color: "#fff", padding: "6px 16px", borderRadius: 16, fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Follow</button>
          )}
        </div>
      ))}
      {notifs.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontSize: 14 }}>No notifications yet</div>
      )}
    </div>
  );
}
