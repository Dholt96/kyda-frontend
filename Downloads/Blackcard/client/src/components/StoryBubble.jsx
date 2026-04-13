export default function StoryBubble({ story, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", flexShrink: 0, width: 72 }}>
      <div style={{ width: 62, height: 62, borderRadius: "50%", padding: 2.5, background: story.seen ? "var(--border)" : "var(--gradient-warm)" }}>
        <img src={story.user.avatar_url || story.user.avatar} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2.5px solid var(--bg-primary)" }} />
      </div>
      <span style={{ fontSize: 11, color: story.seen ? "var(--text-muted)" : "var(--text-secondary)", fontWeight: 500, width: 68, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {(story.user.username || story.user.name || "").split(" ")[0]}
      </span>
    </button>
  );
}
