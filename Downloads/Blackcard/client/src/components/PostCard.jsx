import { useState } from "react";
import { HeartIcon, CommentIcon, ShareIcon, BookmarkIcon, SendIcon } from "./Icons";
import { formatNumber } from "../utils/formatNumber";

export default function PostCard({ post, currentUser, onLike, onBookmark, onComment, style }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [heartAnim, setHeartAnim] = useState(false);

  const handleLike = () => {
    setHeartAnim(true);
    onLike(post.id);
    setTimeout(() => setHeartAnim(false), 500);
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onComment(post.id, newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden", animation: "fadeUp 0.5s ease forwards", ...style }}>
      <div style={{ display: "flex", alignItems: "center", padding: "16px 18px", gap: 12 }}>
        <img src={post.user.avatar_url || post.user.avatar} alt="" style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5, color: "var(--text-primary)" }}>{post.user.username || post.user.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 1 }}>{post.user.handle} · {post.timestamp || post.created_at}</div>
        </div>
        <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}>⋯</button>
      </div>

      {post.text_content || post.text ? (
        <div style={{ padding: "0 18px 14px", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-primary)", letterSpacing: 0.1 }}>
          {post.text_content || post.text}
        </div>
      ) : null}

      {(post.image_url || post.image) && (
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img src={post.image_url || post.image} alt="" style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 60%,rgba(0,0,0,0.3) 100%)" }} />
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", padding: "12px 18px", gap: 4 }}>
        <button onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: post.liked ? "var(--danger)" : "var(--text-secondary)", cursor: "pointer", fontSize: 13.5, fontWeight: 500, padding: "6px 10px", borderRadius: "var(--radius-sm)", transition: "all 0.2s", animation: heartAnim ? "heartPop 0.5s ease" : "none" }}>
          <HeartIcon filled={post.liked} /><span>{formatNumber(post.like_count ?? post.likes ?? 0)}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: showComments ? "var(--accent)" : "var(--text-secondary)", cursor: "pointer", fontSize: 13.5, fontWeight: 500, padding: "6px 10px", borderRadius: "var(--radius-sm)", transition: "all 0.2s" }}>
          <CommentIcon /><span>{post.comment_count ?? post.comments?.length ?? 0}</span>
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "6px 10px", borderRadius: "var(--radius-sm)" }}><ShareIcon /></button>
        <div style={{ flex: 1 }} />
        <button onClick={() => onBookmark(post.id)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "6px 8px", borderRadius: "var(--radius-sm)" }}>
          <BookmarkIcon filled={post.bookmarked} />
        </button>
      </div>

      {showComments && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "12px 18px", animation: "slideDown 0.3s ease" }}>
          {(post.comments || []).map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
              <img src={c.user?.avatar_url || c.user?.avatar} alt="" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", marginTop: 2 }} />
              <div>
                <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{c.user?.username || c.user?.name} </span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.text_content || c.text}</span>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
            <img src={currentUser?.avatar_url || currentUser?.avatar} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ flex: 1, display: "flex", background: "var(--bg-tertiary)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden" }}>
              <input value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmitComment()} placeholder="Write a comment..." style={{ flex: 1, background: "none", border: "none", padding: "8px 14px", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
              <button onClick={handleSubmitComment} style={{ background: "none", border: "none", padding: "8px 12px", cursor: "pointer", opacity: newComment.trim() ? 1 : 0.3, transition: "opacity 0.2s" }}><SendIcon /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
