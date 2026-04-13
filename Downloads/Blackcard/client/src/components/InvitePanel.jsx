import { useState } from "react";
import { CloseIcon, CopyIcon, TicketIcon } from "./Icons";

export default function InvitePanel({ onClose }) {
  const [invites, setInvites] = useState([]);
  const [copied, setCopied] = useState(null);
  const [generating, setGenerating] = useState(false);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateInvite = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/invites/generate", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setInvites(prev => [{ code: data.code, status: "active", created: "Just now" }, ...prev]);
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, animation: "scaleIn 0.25s ease" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", width: "100%", maxWidth: 420, margin: 16, boxShadow: "var(--shadow-elevated)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><CloseIcon /></button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 17, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}><TicketIcon /> Your Invites</span>
          <div style={{ width: 20 }} />
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: "var(--accent-soft)", borderRadius: 14, padding: 16, marginBottom: 18, border: "1px solid rgba(232,168,73,0.15)" }}>
            <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 4 }}>{invites.filter(i => i.status === "active").length} invites remaining</div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5 }}>Share a code with someone you trust. Each code works once.</div>
          </div>
          <button onClick={generateInvite} disabled={generating} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "var(--gradient-warm)", border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>
            {generating ? "Generating..." : "Generate Invite Code"}
          </button>
          {invites.map((inv, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: i < invites.length - 1 ? "1px solid var(--border)" : "none", animation: `fadeUp 0.3s ease ${i * 0.08}s both` }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: inv.status === "active" ? "var(--accent-soft)" : "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center" }}><TicketIcon /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, fontSize: 14, letterSpacing: 1.5, color: inv.status === "active" ? "var(--text-primary)" : "var(--text-muted)" }}>{inv.code}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{inv.status === "used" ? `Used by ${inv.usedBy} · ${inv.created}` : `Created ${inv.created}`}</div>
              </div>
              {inv.status === "active" && (
                <button onClick={() => copyCode(inv.code)} style={{ display: "flex", alignItems: "center", gap: 5, background: copied === inv.code ? "var(--success)" : "var(--bg-tertiary)", border: "1px solid var(--border)", color: copied === inv.code ? "#fff" : "var(--text-secondary)", padding: "6px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
                  {copied === inv.code ? "Copied!" : <><CopyIcon /> Copy</>}
                </button>
              )}
              {inv.status === "used" && <span style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--bg-tertiary)", padding: "4px 10px", borderRadius: 8, fontWeight: 500 }}>Used</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
