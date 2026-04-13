import PostCard from "../components/PostCard";
import StoryBubble from "../components/StoryBubble";
import { PlusIcon } from "../components/Icons";

export default function FeedPage({ posts, stories, currentUser, onLike, onBookmark, onComment, onOpenCompose, onOpenProfile }) {
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "flex", gap: 10, padding: "18px 16px", overflowX: "auto", borderBottom: "1px solid var(--border)" }}>
        <button onClick={onOpenCompose} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", flexShrink: 0, width: 72 }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", background: "var(--bg-tertiary)", border: "2px dashed var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
            <PlusIcon />
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>Your Story</span>
        </button>
        {stories.map((s, i) => (
          <StoryBubble key={i} story={s} onClick={() => onOpenProfile(s.user)} />
        ))}
      </div>
      <div style={{ padding: "14px 10px", display: "flex", flexDirection: "column", gap: 14 }}>
        {posts.map((p, i) => (
          <PostCard
            key={p.id}
            post={p}
            currentUser={currentUser}
            onLike={onLike}
            onBookmark={onBookmark}
            onComment={onComment}
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>
    </div>
  );
}
