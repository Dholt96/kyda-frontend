import { useState, useRef } from "react";
import { LockIcon } from "../components/Icons";

export default function InviteGate({ onAccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setChecking(true);
    setError(false);
    try {
      const res = await fetch("/api/validate-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (res.ok) {
        onAccess(code.trim());
      } else {
        setError(true);
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
      }
    } catch {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `radial-gradient(circle at 25% 25%, var(--accent) 1px, transparent 1px), radial-gradient(circle at 75% 75%, var(--accent) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,168,73,0.08) 0%, transparent 70%)", animation: "gateGlow 4s ease-in-out infinite", pointerEvents: "none" }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 380, width: "100%", position: "relative", zIndex: 1, animation: "fadeUp 0.8s ease" }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-card)", border: "1px solid var(--border)", marginBottom: 28, animation: "gateGlow 4s ease-in-out infinite" }}>
          <LockIcon />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "var(--text-primary)", letterSpacing: -1, marginBottom: 6 }}>
          <span style={{ color: "var(--accent)" }}>■</span> Blackcard
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14.5, textAlign: "center", lineHeight: 1.6, marginBottom: 40, maxWidth: 280 }}>
          An invite-only space for those who belong. Enter your code to continue.
        </p>

        <div style={{ width: "100%", position: "relative", animation: shaking ? "shake 0.4s ease" : "none" }}>
          <input
            ref={inputRef}
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError(false); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="ENTER INVITE CODE"
            maxLength={20}
            style={{ width: "100%", background: "var(--bg-card)", border: `1.5px solid ${error ? "var(--danger)" : "var(--border)"}`, borderRadius: 16, padding: "18px 20px", color: "var(--text-primary)", fontSize: 16, fontWeight: 600, letterSpacing: 3, textAlign: "center", outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.3s" }}
            onFocus={e => { if (!error) e.target.style.borderColor = "var(--accent)"; }}
            onBlur={e => { if (!error) e.target.style.borderColor = "var(--border)"; }}
          />
          {error && <div style={{ color: "var(--danger)", fontSize: 13, fontWeight: 500, textAlign: "center", marginTop: 10, animation: "fadeUp 0.3s ease" }}>Invalid invite code. Try again.</div>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={checking || !code.trim()}
          style={{ width: "100%", marginTop: 18, padding: "16px 24px", borderRadius: 16, background: code.trim() ? "var(--gradient-warm)" : "var(--bg-tertiary)", border: "none", color: code.trim() ? "#fff" : "var(--text-muted)", fontSize: 15, fontWeight: 700, letterSpacing: 0.5, cursor: code.trim() && !checking ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s", position: "relative", overflow: "hidden" }}
        >
          {checking ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              Verifying...
            </span>
          ) : "Enter the Circle"}
          {checking && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
              <div style={{ width: "40%", height: "100%", background: "#fff", animation: "shimmerLine 1s ease infinite" }} />
            </div>
          )}
        </button>

        <p style={{ color: "var(--text-muted)", fontSize: 12, textAlign: "center", marginTop: 24, lineHeight: 1.5, opacity: 0.7 }}>
          Don't have a code? Ask a current member to invite you.
        </p>
        <button
          onClick={() => { setCode("BLACKCARD"); inputRef.current?.focus(); }}
          style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "8px 18px", borderRadius: 20, fontSize: 12, cursor: "pointer", marginTop: 16, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >Use demo code</button>
      </div>
    </div>
  );
}
