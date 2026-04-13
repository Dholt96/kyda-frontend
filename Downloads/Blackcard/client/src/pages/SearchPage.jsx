import { useState, useEffect } from "react";
import { SearchIcon } from "../components/Icons";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const trending = ["#DesignSystems", "#GoldenHour", "#CodeAtNight", "#FilmMaking", "#Wanderlust"];

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => setResults(Array.isArray(data) ? data : []))
      .catch(() => {});
    return () => controller.abort();
  }, [query]);

  return (
    <div style={{ padding: "0 4px 80px", animation: "fadeUp 0.4s ease" }}>
      <div style={{ padding: "0 10px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", background: "var(--bg-tertiary)", borderRadius: 24, border: "1px solid var(--border)", padding: "0 16px" }}>
          <SearchIcon active={false} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people, topics..." style={{ flex: 1, background: "none", border: "none", padding: "13px 12px", color: "var(--text-primary)", fontSize: 14.5, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
        </div>
      </div>
      {!query && (
        <div style={{ padding: "0 14px", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Trending</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {trending.map(t => (
              <span key={t} style={{ background: "var(--accent-soft)", color: "var(--accent)", padding: "7px 16px", borderRadius: 20, fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}>{t}</span>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding: "0 10px" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, marginBottom: 14, padding: "0 4px" }}>{query ? "Results" : "Suggested for you"}</h3>
        {results.map((u, i) => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 8px", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "background 0.2s", animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <img src={u.avatar_url} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14.5 }}>{u.username}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{u.handle}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 12.5, marginTop: 2 }}>{u.bio}</div>
            </div>
            <button style={{ background: "none", border: "1px solid var(--border-light)", color: "var(--text-primary)", padding: "6px 16px", borderRadius: 16, fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
}
