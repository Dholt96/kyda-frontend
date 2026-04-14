import { useState, useEffect, useCallback } from "react";
import {
  Home, Users, ShoppingBag, Bell, User,
  MapPin, Calendar, ChevronDown, ThumbsUp,
  Plus, Check, X, LogOut, Zap, Award,
} from "lucide-react";
import { api, saveToken, clearToken } from "./api.js";

/* ─── HELPERS ─── */
function Avatar({ name, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg,#7C3AED,#4F46E5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.4, flexShrink: 0,
    }}>
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

const TYPE_COLORS = {
  run:   { bg: "#FEF3C7", text: "#92400E", label: "Run"   },
  walk:  { bg: "#DCFCE7", text: "#166534", label: "Walk"  },
  popup: { bg: "#EDE9FE", text: "#5B21B6", label: "Popup" },
};

function TypeBadge({ type }) {
  const c = TYPE_COLORS[type?.toLowerCase()] ?? { bg: "#F3F4F6", text: "#374151", label: type };
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {c.label}
    </span>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#7C3AED", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ComingSoon({ icon, title, body }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 32px", maxWidth: 300, margin: "0 auto" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: 20, color: "#111", marginBottom: 10 }}>{title}</div>
      <div style={{ color: "#9CA3AF", fontSize: 14, lineHeight: 1.6 }}>{body}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════ */
function LoginScreen({ onLogin, onGoSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const { user, token } = await api.login(email, password);
      saveToken(token);
      onLogin(user);
    } catch (e) {
      setError(e.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -1, marginBottom: 6 }}>KYDA</div>
          <div style={{ color: "#9CA3AF", fontSize: 14 }}>Keep Your Distance Active</div>
        </div>
        <div style={{ background: "#111", borderRadius: 16, padding: 28, border: "1px solid #222" }}>
          <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Welcome back</h2>
          {error && <div style={{ background: "#450A0A", color: "#FCA5A5", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>EMAIL</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com"
              style={{ width: "100%", background: "#1A1A1A", border: "1px solid #333", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 15, outline: "none" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", background: "#1A1A1A", border: "1px solid #333", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 15, outline: "none" }} />
          </div>
          <button onClick={handleLogin} disabled={loading}
            style={{ width: "100%", background: loading ? "#555" : "#fff", color: "#000", fontWeight: 700, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ color: "#6B7280", fontSize: 14 }}>No account? </span>
            <button onClick={onGoSignup} style={{ color: "#A78BFA", fontWeight: 600, fontSize: 14, background: "none", border: "none", cursor: "pointer" }}>Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SIGNUP
═══════════════════════════════════════════ */
const KYDA_CITIES = ["DC", "NYC", "Miami", "Atlanta", "Chicago", "Raleigh"];

function CityPicker({ selected, onChange }) {
  const [open, setOpen] = useState(false);

  const toggle = (city) => {
    const next = selected.includes(city)
      ? selected.filter(c => c !== city)
      : [...selected, city];
    onChange(next);
  };

  const label = selected.length === 0
    ? "Select your city…"
    : selected.join(", ");

  return (
    <div style={{ marginBottom: 14, position: "relative" }}>
      <label style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>CITY</label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "#1A1A1A", border: `1px solid ${open ? "#7C3AED" : "#333"}`,
          borderRadius: 10, padding: "12px 14px", color: selected.length ? "#fff" : "#6B7280",
          fontSize: 15, outline: "none", cursor: "pointer", display: "flex",
          justifyContent: "space-between", alignItems: "center", textAlign: "left",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
        <ChevronDown size={16} color="#9CA3AF" style={{ flexShrink: 0, marginLeft: 8, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
          background: "#1A1A1A", border: "1px solid #333", borderRadius: 10,
          marginTop: 4, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          {KYDA_CITIES.map(city => {
            const isSelected = selected.includes(city);
            return (
              <button
                key={city}
                type="button"
                onClick={() => toggle(city)}
                style={{
                  width: "100%", background: isSelected ? "#2D1B69" : "transparent",
                  border: "none", borderBottom: "1px solid #222", padding: "12px 16px",
                  color: isSelected ? "#A78BFA" : "#fff", fontSize: 15, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  textAlign: "left",
                }}
              >
                {city}
                {isSelected && <Check size={15} color="#A78BFA" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SignupScreen({ onSignup, onGoLogin }) {
  const [form, setForm] = useState({ name: "", email: "", cities: [], password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setError(""); };

  const handleSignup = async () => {
    if (!form.name || !form.email || form.cities.length === 0 || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const { user, token } = await api.register(form.name, form.email, form.cities.join(", "), form.password);
      saveToken(token);
      onSignup(user);
    } catch (e) {
      setError(e.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, field, type = "text", placeholder }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
      <input type={type} value={form[field]} onChange={set(field)} placeholder={placeholder}
        style={{ width: "100%", background: "#1A1A1A", border: "1px solid #333", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 15, outline: "none" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -1, marginBottom: 6 }}>KYDA</div>
          <div style={{ color: "#9CA3AF", fontSize: 14 }}>Keep Your Distance Active</div>
        </div>
        <div style={{ background: "#111", borderRadius: 16, padding: 28, border: "1px solid #222" }}>
          <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Create account</h2>
          {error && <div style={{ background: "#450A0A", color: "#FCA5A5", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <Field label="FULL NAME" field="name" placeholder="Your name" />
          <Field label="EMAIL" field="email" type="email" placeholder="you@example.com" />
          <CityPicker selected={form.cities} onChange={cities => { setForm(f => ({ ...f, cities })); setError(""); }} />
          <Field label="PASSWORD" field="password" type="password" placeholder="••••••••" />
          <button onClick={handleSignup} disabled={loading}
            style={{ width: "100%", background: loading ? "#555" : "#fff", color: "#000", fontWeight: 700, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: 8 }}>
            {loading ? "Creating account…" : "Join KYDA"}
          </button>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ color: "#6B7280", fontSize: 14 }}>Already a member? </span>
            <button onClick={onGoLogin} style={{ color: "#A78BFA", fontWeight: 600, fontSize: 14, background: "none", border: "none", cursor: "pointer" }}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROPOSE MODAL
═══════════════════════════════════════════ */
function ProposeModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ title: "", type: "run", location: "", description: "", contact_phone: "", contact_email: "" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const inputStyle = { width: "100%", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", color: "#111" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 448, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>Propose an Event</h2>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="#374151" />
          </button>
        </div>
        {[{ label: "Event Title", key: "title", placeholder: "e.g. Morning Run at the Mall" }, { label: "Location", key: "location", placeholder: "e.g. Lincoln Memorial, DC" }].map(({ label, key, placeholder }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ color: "#374151", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
            <input value={form[key]} onChange={set(key)} placeholder={placeholder} style={inputStyle} />
          </div>
        ))}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "#374151", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Event Type</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["run", "walk", "popup"].map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1.5px solid", borderColor: form.type === t ? "#7C3AED" : "#E5E7EB", background: form.type === t ? "#EDE9FE" : "#fff", color: form.type === t ? "#5B21B6" : "#6B7280", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "#374151", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Description</label>
          <textarea value={form.description} onChange={set("description")} placeholder="Describe the event..." rows={3}
            style={{ ...inputStyle, resize: "none" }} />
        </div>
        <div style={{ background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 12, letterSpacing: 0.5, textTransform: "uppercase" }}>Contact Info · Only visible to admins</div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ color: "#374151", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Your Phone Number</label>
            <input type="tel" value={form.contact_phone} onChange={set("contact_phone")} placeholder="e.g. (202) 555-0100"
              style={{ ...inputStyle, background: "#fff" }} />
          </div>
          <div>
            <label style={{ color: "#374151", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Your Email</label>
            <input type="email" value={form.contact_email} onChange={set("contact_email")} placeholder="you@example.com"
              style={{ ...inputStyle, background: "#fff" }} />
          </div>
        </div>
        <button onClick={() => onSubmit(form)} disabled={loading || !form.title || !form.location}
          style={{ width: "100%", background: loading || !form.title || !form.location ? "#9CA3AF" : "#111", color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 0", borderRadius: 12, border: "none", cursor: "pointer" }}>
          {loading ? "Submitting…" : "Submit Proposal"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EVENT CARD
═══════════════════════════════════════════ */
const EVENT_IMAGES = {
  run:   "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80",
  walk:  "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&q=80",
  popup: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
};

function EventCard({ event, rsvped, onRsvp, loading }) {
  const pct = Math.round((event.attendees / event.capacity) * 100);
  const img = event.image_url || EVENT_IMAGES[event.type?.toLowerCase()] || EVENT_IMAGES.run;
  const dateStr = event.date
    ? `${new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · ${event.time}`
    : "";

  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ position: "relative", height: 160 }}>
        <img src={img} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 12, left: 12 }}><TypeBadge type={event.type} /></div>
        {rsvped && <div style={{ position: "absolute", top: 12, right: 12, background: "#059669", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#fff" }}>GOING</div>}
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 8 }}>{event.title}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
          {dateStr && <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13 }}><Calendar size={13} /> {dateStr}</div>}
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13 }}><MapPin size={13} /> {event.location}</div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>{event.attendees} / {event.capacity} spots</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: pct >= 80 ? "#DC2626" : "#374151" }}>{pct}%</span>
          </div>
          <div style={{ background: "#F3F4F6", borderRadius: 99, height: 5 }}>
            <div style={{ background: pct >= 80 ? "#DC2626" : "#7C3AED", borderRadius: 99, height: 5, width: `${pct}%` }} />
          </div>
        </div>
        <button onClick={() => onRsvp(event.id)} disabled={loading}
          style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", background: rsvped ? "#F3F4F6" : "#111", color: rsvped ? "#374151" : "#fff", fontWeight: 700, fontSize: 14 }}>
          {loading ? "…" : rsvped ? "Cancel RSVP" : "RSVP"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HOME VIEW
═══════════════════════════════════════════ */
function HomeView({ user, chapters, onChapterVote, chapterVotes }) {
  const defaultChapter = chapters.find(c => c.active)?.id?.toLowerCase() ?? "dc";
  const [selectedChapter, setSelectedChapter] = useState(defaultChapter);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [myRsvps, setMyRsvps] = useState(new Set());
  const [proposals, setProposals] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(null);

  const activeChapter = chapters.find(c => c.id?.toLowerCase() === selectedChapter);

  const loadData = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const chapterId = selectedChapter.toUpperCase();
      const [evts, rsvps, props] = await Promise.all([
        api.getEvents(chapterId),
        api.myRsvps(),
        api.getProposals(chapterId),
      ]);
      setEvents(evts);
      setMyRsvps(new Set(rsvps));
      setProposals(props);
    } catch { /* keep empty on error */ } finally {
      setLoadingEvents(false);
    }
  }, [selectedChapter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRsvp = async (eventId) => {
    setRsvpLoading(eventId);
    try {
      const { rsvped } = await api.rsvpEvent(eventId);
      setMyRsvps(prev => { const n = new Set(prev); rsvped ? n.add(eventId) : n.delete(eventId); return n; });
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendees: e.attendees + (rsvped ? 1 : -1) } : e));
    } catch { /* ignore */ } finally { setRsvpLoading(null); }
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: "#000", padding: "16px 20px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>KYDA</div>
            <div style={{ color: "#6B7280", fontSize: 12 }}>Hey, {user.name?.split(" ")[0]} 👋</div>
          </div>
          <div style={{ position: "relative" }}>
            <button onClick={() => setDropdownOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#1A1A1A", border: "1px solid #333", borderRadius: 20, padding: "8px 14px", cursor: "pointer" }}>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{activeChapter?.name ?? "Chapter"}</span>
              <ChevronDown size={14} color="#9CA3AF" />
            </button>
            {dropdownOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#111", border: "1px solid #222", borderRadius: 14, overflow: "hidden", zIndex: 20, minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                {chapters.map(c => (
                  <button key={c.id} onClick={() => { setSelectedChapter(c.id.toLowerCase()); setDropdownOpen(false); }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "12px 16px", background: selectedChapter === c.id.toLowerCase() ? "#1E1E1E" : "transparent", border: "none", cursor: "pointer", color: "#fff" }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: c.active ? "#6EE7B7" : "#F9A8D4" }}>{c.active ? "Active" : `${c.votes} votes`}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: "#F3F4F6", minHeight: "100vh" }}>
        {activeChapter?.active ? (
          <>
            <div style={{ padding: "16px 16px 0" }}>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { label: "Upcoming",  value: events.length,               icon: <Calendar size={16} color="#7C3AED" /> },
                  { label: "My Events", value: myRsvps.size,                icon: <Check size={16} color="#059669" /> },
                  { label: "Members",   value: activeChapter.members || "—", icon: <Users size={16} color="#2563EB" /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "14px 12px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#111", lineHeight: 1 }}>{value}</div>
                    <div style={{ color: "#9CA3AF", fontSize: 11, marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "20px 16px 0" }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 12 }}>Upcoming Events</div>
              {loadingEvents ? <Spinner /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {events.length === 0
                    ? <ComingSoon icon="🏃" title="Events Coming Soon" body="We're finalizing the lineup for this chapter. Check back soon!" />
                    : events.map(e => <EventCard key={e.id} event={e} rsvped={myRsvps.has(e.id)} onRsvp={handleRsvp} loading={rsvpLoading === e.id} />)}
                </div>
              )}
            </div>
            {proposals.length > 0 && (
              <div style={{ padding: "20px 16px 0" }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 12 }}>Community Proposals</div>
                <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  {proposals.slice(0, 2).map((p, i) => (
                    <div key={p.id} style={{ padding: "14px 16px", borderBottom: i === 0 ? "1px solid #F3F4F6" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ flex: 1, marginRight: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}><TypeBadge type={p.type} /></div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{p.title}</div>
                        <div style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>by {p.proposed_by}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: "#7C3AED" }}>{p.votes}</div>
                        <div style={{ color: "#9CA3AF", fontSize: 11 }}>votes</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: 16 }}>
            <div style={{ background: "linear-gradient(135deg,#5B21B6,#7C3AED)", borderRadius: 20, padding: 28, textAlign: "center", color: "#fff" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Launch KYDA {activeChapter?.name}</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>Help us launch in {activeChapter?.name}! We need 100 votes to activate this chapter.</div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 0", marginBottom: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 32 }}>{activeChapter?.votes ?? 0}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>of 100 votes</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, height: 8, marginBottom: 20 }}>
                <div style={{ background: "#fff", borderRadius: 99, height: 8, width: `${Math.min(((activeChapter?.votes ?? 0) / 100) * 100, 100)}%` }} />
              </div>
              <button onClick={() => onChapterVote(activeChapter.id)}
                style={{ background: "#fff", color: "#5B21B6", fontWeight: 700, fontSize: 15, padding: "12px 32px", borderRadius: 12, border: "none", cursor: "pointer" }}>
                {chapterVotes.has(activeChapter?.id) ? "Voted ✓" : "Vote to Launch"}
              </button>
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 12 }}>Other Chapters</div>
              <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                {chapters.filter(c => !c.active && c.id !== activeChapter?.id).map((c, i, arr) => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{c.name}</div>
                      <div style={{ color: "#9CA3AF", fontSize: 12 }}>{c.votes} votes</div>
                    </div>
                    <button onClick={() => onChapterVote(c.id)}
                      style={{ background: chapterVotes.has(c.id) ? "#EDE9FE" : "#F3F4F6", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: chapterVotes.has(c.id) ? "#7C3AED" : "#374151", cursor: "pointer" }}>
                      {chapterVotes.has(c.id) ? "Voted ✓" : "Vote"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMMUNITY VIEW
═══════════════════════════════════════════ */
const STATUS_STYLE = {
  pending:  { bg: "#D1FAE5", color: "#059669", dot: "#6EE7B7", label: "Open for votes" },
  approved: { bg: "#DBEAFE", color: "#1D4ED8", dot: "#93C5FD", label: "Approved" },
  rejected: { bg: "#FEE2E2", color: "#DC2626", dot: "#FCA5A5", label: "Rejected" },
};

function CommunityView({ user, selectedChapter = "DC" }) {
  const [proposals, setProposals] = useState([]);
  const [myVotes, setMyVotes] = useState(new Set());
  const [myNotify, setMyNotify] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [notifyLoading, setNotifyLoading] = useState(null);
  const isAdmin = user?.is_admin;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [props, votes, notify] = await Promise.all([
          api.getProposals(selectedChapter.toUpperCase()),
          api.myProposalVotes(),
          api.myProposalNotify(),
        ]);
        setProposals(props);
        setMyVotes(new Set(votes));
        setMyNotify(new Set(notify));
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    load();
  }, [selectedChapter]);

  const handleVote = async (id) => {
    setVoteLoading(id);
    try {
      const { voted } = await api.voteProposal(id);
      setMyVotes(prev => { const s = new Set(prev); voted ? s.add(id) : s.delete(id); return s; });
      setProposals(prev => prev.map(p => p.id === id ? { ...p, votes: p.votes + (voted ? 1 : -1) } : p));
      // If un-voting, also clear notify
      if (!voted) {
        setMyNotify(prev => { const s = new Set(prev); s.delete(id); return s; });
      }
    } catch { /* ignore */ } finally { setVoteLoading(null); }
  };

  const handleNotifyToggle = async (id) => {
    const current = myNotify.has(id);
    setNotifyLoading(id);
    try {
      await api.toggleProposalNotify(id, !current);
      setMyNotify(prev => { const s = new Set(prev); current ? s.delete(id) : s.add(id); return s; });
    } catch { /* ignore */ } finally { setNotifyLoading(null); }
  };

  const handleSubmit = async (form) => {
    setSubmitLoading(true);
    try {
      const newProp = await api.createProposal({ ...form, chapter: selectedChapter.toUpperCase() });
      setProposals(prev => [newProp, ...prev]);
      setMyVotes(prev => new Set([...prev, newProp.id]));
      setShowModal(false);
    } catch { /* ignore */ } finally { setSubmitLoading(false); }
  };

  const handleApprove = async (id) => {
    setActionLoading(id + "-approve");
    try {
      await api.approveProposal(id);
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p));
    } catch { /* ignore */ } finally { setActionLoading(null); }
  };

  const handleReject = async (id) => {
    setActionLoading(id + "-reject");
    try {
      await api.rejectProposal(id);
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p));
    } catch { /* ignore */ } finally { setActionLoading(null); }
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: "#000", padding: "16px 20px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Community {isAdmin && <span style={{ fontSize: 11, background: "#7C3AED", color: "#fff", borderRadius: 6, padding: "2px 7px", marginLeft: 6, fontWeight: 700 }}>ADMIN</span>}</div>
          <button onClick={() => setShowModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "none", borderRadius: 20, padding: "8px 14px", cursor: "pointer" }}>
            <Plus size={15} color="#111" />
            <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Propose</span>
          </button>
        </div>
      </div>
      <div style={{ background: "#F3F4F6", minHeight: "100vh", padding: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#9CA3AF", marginBottom: 12, letterSpacing: 0.5, textTransform: "uppercase" }}>
          {proposals.length} Proposals · Vote for events you want
        </div>
        {loading ? <Spinner /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {proposals.length === 0 && <div style={{ textAlign: "center", color: "#9CA3AF", padding: "40px 0", fontSize: 14 }}>No proposals yet — be the first!</div>}
            {proposals.map(p => {
              const voted = myVotes.has(p.id);
              const status = p.status || "pending";
              const st = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
              const isPending = status === "pending";
              return (
                <div key={p.id} style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", opacity: status === "rejected" ? 0.6 : 1 }}>
                  <div style={{ flex: 1, marginRight: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <TypeBadge type={p.type} />
                      <span style={{ color: "#9CA3AF", fontSize: 12 }}>by {p.proposed_by}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 4 }}>{p.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#6B7280", fontSize: 13, marginBottom: 6 }}><MapPin size={12} /> {p.location}</div>
                    <div style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.5 }}>{p.description}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, marginTop: 10, borderTop: "1px solid #F3F4F6" }}>
                    <button onClick={() => handleVote(p.id)} disabled={voteLoading === p.id || !isPending}
                      style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", background: voted ? "#EDE9FE" : "#F3F4F6", border: "none", borderRadius: 10, cursor: isPending ? "pointer" : "default", opacity: isPending ? 1 : 0.5 }}>
                      <ThumbsUp size={15} color={voted ? "#7C3AED" : "#374151"} fill={voted ? "#7C3AED" : "none"} />
                      <span style={{ fontWeight: 700, fontSize: 14, color: voted ? "#7C3AED" : "#374151" }}>{p.votes}</span>
                      <span style={{ fontSize: 13, color: voted ? "#7C3AED" : "#6B7280" }}>{voted ? "Voted" : "Vote"}</span>
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {voted && isPending && (
                        <button onClick={() => handleNotifyToggle(p.id)} disabled={notifyLoading === p.id}
                          title={myNotify.has(p.id) ? "Cancel approval alert" : "Alert me when approved + auto-RSVP"}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", background: myNotify.has(p.id) ? "#FEF3C7" : "#F3F4F6", border: "none", borderRadius: 10, cursor: "pointer" }}>
                          <Bell size={14} color={myNotify.has(p.id) ? "#D97706" : "#9CA3AF"} fill={myNotify.has(p.id) ? "#D97706" : "none"} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: myNotify.has(p.id) ? "#D97706" : "#9CA3AF" }}>
                            {myNotify.has(p.id) ? "Notifying" : "Notify me"}
                          </span>
                        </button>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: st.dot }} />
                        <span style={{ fontSize: 12, color: st.color, fontWeight: 600 }}>{st.label}</span>
                      </div>
                    </div>
                  </div>
                  {isAdmin && (p.contact_phone || p.contact_email) && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6", background: "#FFFBEB", borderRadius: 10, padding: "10px 12px", marginTop: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#92400E", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Contact (admin only)</div>
                      {p.contact_phone && <div style={{ fontSize: 13, color: "#374151", marginBottom: 3 }}>📞 {p.contact_phone}</div>}
                      {p.contact_email && <div style={{ fontSize: 13, color: "#374151" }}>✉️ {p.contact_email}</div>}
                    </div>
                  )}
                  {isAdmin && isPending && (
                    <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                      <button onClick={() => handleApprove(p.id)} disabled={actionLoading === p.id + "-approve"}
                        style={{ flex: 1, background: "#D1FAE5", color: "#065F46", fontWeight: 700, fontSize: 13, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer" }}>
                        {actionLoading === p.id + "-approve" ? "Approving…" : "✓ Approve"}
                      </button>
                      <button onClick={() => handleReject(p.id)} disabled={actionLoading === p.id + "-reject"}
                        style={{ flex: 1, background: "#FEE2E2", color: "#991B1B", fontWeight: 700, fontSize: 13, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer" }}>
                        {actionLoading === p.id + "-reject" ? "Rejecting…" : "✕ Reject"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showModal && <ProposeModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} loading={submitLoading} />}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SHOP VIEW
═══════════════════════════════════════════ */
function ShopView() {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: "#000", padding: "16px 20px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Shop</div>
      </div>
      <div style={{ background: "#F3F4F6", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ComingSoon icon="👟" title="Shop Coming Soon" body="Member-exclusive KYDA gear is on the way. You'll be the first to know." />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ALERTS VIEW
═══════════════════════════════════════════ */
function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function AlertsView({ onRead }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.getNotifications();
        setAlerts(data);
        const unread = data.filter(a => !a.read).length;
        if (unread > 0) {
          await api.markNotificationsRead();
          onRead && onRead();
        }
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: "#000", padding: "16px 20px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Alerts</div>
      </div>
      <div style={{ background: "#F3F4F6", minHeight: "100vh", padding: 16 }}>
        {loading ? <Spinner /> : alerts.length === 0 ? (
          <div style={{ textAlign: "center", color: "#9CA3AF", padding: "48px 0", fontSize: 14 }}>No alerts yet</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alerts.map(a => (
              <div key={a.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: !a.read ? "3px solid #7C3AED" : "3px solid transparent" }}>
                <div style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>{a.icon || "🔔"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 8, flexShrink: 0 }}>{timeAgo(a.created_at)}</div>
                  </div>
                  <div style={{ color: "#6B7280", fontSize: 13, marginTop: 3, lineHeight: 1.4 }}>{a.body}</div>
                </div>
                {!a.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C3AED", flexShrink: 0, marginTop: 6 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROFILE VIEW
═══════════════════════════════════════════ */
const INTERESTS = ["Running", "Walking", "Cycling", "Yoga", "Networking", "Art & Culture", "Food & Drink", "Music"];

function ProfileView({ user, setUser, onLogout }) {
  const [interests, setInterests] = useState(
    user.interests ? Object.keys(user.interests).filter(k => user.interests[k]) : ["Running", "Networking"]
  );
  const [prefOpen, setPrefOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleInterest = async (interest) => {
    const next = interests.includes(interest) ? interests.filter(i => i !== interest) : [...interests, interest];
    setInterests(next);
    setSaving(true);
    try {
      const interestsObj = Object.fromEntries(INTERESTS.map(i => [i, next.includes(i)]));
      const updated = await api.updateProfile({ interests: interestsObj });
      setUser(u => ({ ...u, interests: updated.interests }));
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: "#000", padding: "16px 20px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Profile</div>
      </div>
      <div style={{ background: "#F3F4F6", minHeight: "100vh" }}>
        <div style={{ background: "#fff", padding: "28px 20px 20px", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <Avatar name={user.name} size={64} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#111" }}>{user.name}</div>
              <div style={{ color: "#9CA3AF", fontSize: 13, marginTop: 2 }}>{user.chapter ?? "DC"} Chapter · Member</div>
              <div style={{ color: "#7C3AED", fontSize: 13, fontWeight: 600, marginTop: 3 }}>{user.email}</div>
            </div>
          </div>
          <div style={{ display: "flex", background: "#F9FAFB", borderRadius: 14, overflow: "hidden" }}>
            {[
              { label: "Events",       value: 0,    icon: <Check size={16} color="#059669" /> },
              { label: "Proposals",    value: 0,    icon: <Zap size={16} color="#F59E0B" /> },
              { label: "Chapter Rank", value: "#—", icon: <Award size={16} color="#7C3AED" /> },
            ].map(({ label, value, icon }, i) => (
              <div key={label} style={{ flex: 1, padding: "14px 10px", textAlign: "center", borderRight: i < 2 ? "1px solid #E5E7EB" : "none" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 5 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#111" }}>{value}</div>
                <div style={{ color: "#9CA3AF", fontSize: 11, marginTop: 2, lineHeight: 1.3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>Interests</div>
              {saving && <span style={{ fontSize: 12, color: "#9CA3AF" }}>Saving…</span>}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {INTERESTS.map(interest => {
                const active = interests.includes(interest);
                return (
                  <button key={interest} onClick={() => toggleInterest(interest)}
                    style={{ padding: "8px 14px", borderRadius: 20, background: active ? "#111" : "#F3F4F6", color: active ? "#fff" : "#374151", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                    {active && <Check size={11} style={{ marginRight: 5, display: "inline-block", verticalAlign: "middle" }} />}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 14 }}>
            <button onClick={() => setPrefOpen(o => !o)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "none", border: "none", cursor: "pointer" }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>Preferences</span>
              <ChevronDown size={18} color="#9CA3AF" style={{ transform: prefOpen ? "rotate(180deg)" : "none", transition: "0.2s" }} />
            </button>
            {prefOpen && (
              <div style={{ borderTop: "1px solid #F3F4F6", padding: "0 16px 16px" }}>
                {[
                  { label: "Event Reminders", sub: "Notify me 24h before events" },
                  { label: "Chapter Updates", sub: "New events and announcements" },
                  { label: "Proposal Alerts", sub: "When proposals hit vote milestones" },
                ].map((pref, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{pref.label}</div>
                      <div style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>{pref.sub}</div>
                    </div>
                    <div style={{ width: 44, height: 24, borderRadius: 12, background: "#7C3AED", position: "relative", cursor: "pointer", flexShrink: 0 }}>
                      <div style={{ position: "absolute", right: 3, top: 3, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={onLogout}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", border: "1.5px solid #FEE2E2", borderRadius: 14, padding: "14px 0", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <LogOut size={16} color="#DC2626" />
            <span style={{ fontWeight: 700, fontSize: 14, color: "#DC2626" }}>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BOTTOM NAV
═══════════════════════════════════════════ */
function BottomNav({ active, setActive, unreadCount = 0 }) {
  const tabs = [
    { id: "events",    label: "Events",    Icon: Home },
    { id: "community", label: "Community", Icon: Users },
    { id: "shop",      label: "Shop",      Icon: ShoppingBag },
    { id: "alerts",    label: "Alerts",    Icon: Bell, badge: unreadCount },
    { id: "profile",   label: "Profile",   Icon: User },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 448, background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", zIndex: 50, paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
      {tabs.map(({ id, label, Icon, badge }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => setActive(id)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0 8px", background: "none", border: "none", cursor: "pointer", position: "relative" }}>
            <div style={{ position: "relative" }}>
              <Icon size={22} color={isActive ? "#7C3AED" : "#9CA3AF"} fill={isActive ? "#EDE9FE" : "none"} strokeWidth={isActive ? 2.5 : 1.8} />
              {badge > 0 && <div style={{ position: "absolute", top: -4, right: -5, background: "#DC2626", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{badge}</div>}
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? "#7C3AED" : "#9CA3AF", marginTop: 3 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════ */
export default function KYDACommunityApp() {
  const [screen, setScreen]       = useState("loading");
  const [user, setUser]           = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [chapters, setChapters]   = useState([]);
  const [chapterVotes, setChapterVotes] = useState(new Set());
  const [unreadCount, setUnreadCount]   = useState(0);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("kyda_token");
      if (token) {
        try {
          const [me, chaps, myVotes, notifs] = await Promise.all([
            api.me(), api.getChapters(), api.myChapterVotes(), api.getNotifications(),
          ]);
          setUser(me);
          setChapters(chaps);
          setChapterVotes(new Set(myVotes));
          setUnreadCount(notifs.filter(n => !n.read).length);
          setScreen("app");
          return;
        } catch { clearToken(); }
      }
      setScreen("login");
    };
    init();
  }, []);

  const handleLogin = async (u) => {
    setUser(u);
    try {
      const [chaps, myVotes] = await Promise.all([api.getChapters(), api.myChapterVotes()]);
      setChapters(chaps);
      setChapterVotes(new Set(myVotes));
    } catch { /* use empty chapters */ }
    setScreen("app");
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setChapters([]);
    setScreen("login");
  };

  const handleChapterVote = async (id) => {
    try {
      const { voted } = await api.voteChapter(id);
      setChapterVotes(prev => { const s = new Set(prev); voted ? s.add(id) : s.delete(id); return s; });
      setChapters(prev => prev.map(c => c.id === id ? { ...c, votes: c.votes + (voted ? 1 : -1) } : c));
    } catch { /* ignore */ }
  };

  if (screen === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 32, letterSpacing: -1, marginBottom: 24 }}>KYDA</div>
          <Spinner />
        </div>
      </div>
    );
  }
  if (screen === "login")  return <LoginScreen  onLogin={handleLogin}  onGoSignup={() => setScreen("signup")} />;
  if (screen === "signup") return <SignupScreen onSignup={handleLogin} onGoLogin={() => setScreen("login")} />;

  return (
    <div style={{ maxWidth: 448, margin: "0 auto", position: "relative", minHeight: "100vh", background: "#F3F4F6", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {activeTab === "events"    && <HomeView      user={user} chapters={chapters} onChapterVote={handleChapterVote} chapterVotes={chapterVotes} />}
      {activeTab === "community" && <CommunityView user={user} selectedChapter={user?.chapter ?? "DC"} />}
      {activeTab === "shop"      && <ShopView />}
      {activeTab === "alerts"    && <AlertsView onRead={() => setUnreadCount(0)} />}
      {activeTab === "profile"   && <ProfileView  user={user} setUser={setUser} onLogout={handleLogout} />}
      <BottomNav active={activeTab} setActive={setActiveTab} unreadCount={unreadCount} />
    </div>
  );
}
