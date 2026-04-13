import { useState } from "react";
import { CloseIcon, ImageIcon } from "./Icons";

export default function ComposeModal({ currentUser, onClose, onPost }) {
  const [text, setText] = useState("");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, animation: "scaleIn 0.25s ease" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", width: "100%", maxWidth: 520, margin: 16, boxShadow: "var(--shadow-elevated)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><CloseIcon /></button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 17, color: "var(--text-primary)" }}>New Post</span>
          <button
            onClick={() => { if (text.trim()) { onPost(text); onClose(); } }}
            style={{ background: text.trim() ? "var(--gradient-warm)" : "var(--bg-tertiary)", border: "none", color: text.trim() ? "#fff" : "var(--text-muted)", padding: "7px 20px", borderRadius: 20, fontWeight: 600, fontSize: 13.5, cursor: text.trim() ? "pointer" : "default", transition: "all 0.3s", fontFamily: "'DM Sans', sans-serif" }}
          >Post</button>
        </div>
        <div style={{ padding: 20, display: "flex", gap: 14 }}>
          <img src={currentUser?.avatar_url || currentUser?.avatar} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
          <textarea
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            style={{ flex: 1, background: "none", border: "none", color: "var(--text-primary)", fontSize: 15, lineHeight: 1.6, resize: "none", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-tertiary)", border: "1px solid var(--border)", color: "var(--text-secondary)", padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}><ImageIcon /> Photo</button>
        </div>
      </div>
    </div>
  );
}
