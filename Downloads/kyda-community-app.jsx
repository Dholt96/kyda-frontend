import { useState } from "react";
import {
  Home, Users, ShoppingBag, Bell, User,
  MapPin, Calendar, ChevronDown, ThumbsUp,
  Plus, Check, X, LogOut, ChevronRight,
  Zap, Award, Star
} from "lucide-react";

/* ─── DATA ─── */
const CHAPTERS = [
  { id: "dc",      name: "DC",      active: true,  members: 2100, label: "2.1K members" },
  { id: "nyc",     name: "NYC",     active: false, votes: 47 },
  { id: "miami",   name: "Miami",   active: false, votes: 32 },
  { id: "atlanta", name: "Atlanta", active: false, votes: 28 },
  { id: "chicago", name: "Chicago", active: false, votes: 19 },
  { id: "nc",      name: "NC",      active: false, votes: 15 },
];

const EVENTS = [
  {
    id: 1,
    title: "Morning Run — National Mall",
    type: "run",
    date: "Sat, Apr 19 · 7:00 AM",
    location: "Lincoln Memorial, DC",
    attendees: 38,
    capacity: 50,
    chapter: "dc",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80",
    rsvp: false,
  },
  {
    id: 2,
    title: "Georgetown Popup Brunch",
    type: "popup",
    date: "Sun, Apr 20 · 11:00 AM",
    location: "Georgetown Waterfront, DC",
    attendees: 24,
    capacity: 30,
    chapter: "dc",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    rsvp: false,
  },
  {
    id: 3,
    title: "Cherry Blossom Walk",
    type: "walk",
    date: "Sat, Apr 26 · 9:00 AM",
    location: "Tidal Basin, DC",
    attendees: 61,
    capacity: 75,
    chapter: "dc",
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&q=80",
    rsvp: false,
  },
];

const PROPOSALS = [
  {
    id: 1,
    title: "Rooftop Sunset Run",
    proposedBy: "Marcus T.",
    type: "run",
    location: "Southwest Waterfront",
    description: "A 3-mile sunset run along the waterfront with a post-run mixer.",
    votes: 34,
    voted: false,
  },
  {
    id: 2,
    title: "Gallery Hop + Wine Night",
    proposedBy: "Aisha M.",
    type: "popup",
    location: "14th Street Arts District",
    description: "Tour 3 galleries then unwind at a private wine tasting.",
    votes: 28,
    voted: false,
  },
  {
    id: 3,
    title: "Anacostia Trail Walk",
    proposedBy: "Devon K.",
    type: "walk",
    location: "Anacostia Riverwalk",
    description: "Easy 4-mile walk along the Anacostia — great for all fitness levels.",
    votes: 19,
    voted: false,
  },
];

const INTERESTS = [
  "Running", "Walking", "Cycling", "Yoga",
  "Networking", "Art & Culture", "Food & Drink", "Music",
];

const TYPE_COLORS = {
  run:   { bg: "#FEF3C7", text: "#92400E", label: "Run"   },
  walk:  { bg: "#DCFCE7", text: "#166534", label: "Walk"  },
  popup: { bg: "#EDE9FE", text: "#5B21B6", label: "Popup" },
};

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

function TypeBadge({ type }) {
  const c = TYPE_COLORS[type] ?? { bg: "#F3F4F6", text: "#374151", label: type };
  return (
    <span style={{
      background: c.bg, color: c.text,
      fontSize: 11, fontWeight: 600, padding: "2px 8px",
      borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.5,
    }}>
      {c.label}
    </span>
  );
}

/* ═══════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════ */
function LoginScreen({ onLogin, onGoSignup }) {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");

  const handleLogin = () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    onLogin({ name: email.split("@")[0], email });
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

          {error && (
            <div style={{ background: "#450A0A", color: "#FCA5A5", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              style={{ width: "100%", background: "#1A1A1A", border: "1px solid #333", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 15, outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••••"
              style={{ width: "100%", background: "#1A1A1A", border: "1px solid #333", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 15, outline: "none" }}
            />
          </div>

          <button
            onClick={handleLogin}
            style={{ width: "100%", background: "#fff", color: "#000", fontWeight: 700, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer" }}
          >
            Sign In
          </button>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ color: "#6B7280", fontSize: 14 }}>No account? </span>
            <button onClick={onGoSignup} style={{ color: "#A78BFA", fontWeight: 600, fontSize: 14, background: "none", border: "none", cursor: "pointer" }}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SIGNUP
═══════════════════════════════════════════ */
function SignupScreen({ onSignup, onGoLogin }) {
  const [form, setForm] = useState({ name: "", email: "", city: "", password: "" });
  const [error, setError] = useState("");

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(""); };

  const handleSignup = () => {
    if (!form.name || !form.email || !form.city || !form.password) {
      setError("Please fill in all fields."); return;
    }
    onSignup(form);
  };

  const Field = ({ label, field, type = "text", placeholder }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={set(field)}
        placeholder={placeholder}
        style={{ width: "100%", background: "#1A1A1A", border: "1px solid #333", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 15, outline: "none" }}
      />
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

          {error && (
            <div style={{ background: "#450A0A", color: "#FCA5A5", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <Field label="FULL NAME" field="name" placeholder="Your name" />
          <Field label="EMAIL" field="email" type="email" placeholder="you@example.com" />
          <Field label="CITY" field="city" placeholder="Washington DC" />
          <Field label="PASSWORD" field="password" type="password" placeholder="••••••••" />

          <button
            onClick={handleSignup}
            style={{ width: "100%", background: "#fff", color: "#000", fontWeight: 700, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer", marginTop: 8 }}
          >
            Join KYDA
          </button>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ color: "#6B7280", fontSize: 14 }}>Already a member? </span>
            <button onClick={onGoLogin} style={{ color: "#A78BFA", fontWeight: 600, fontSize: 14, background: "none", border: "none", cursor: "pointer" }}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROPOSE MODAL
═══════════════════════════════════════════ */
function ProposeModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", type: "run", location: "", description: "" });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.title || !form.location) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 448, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>Propose an Event</h2>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="#374151" />
          </button>
        </div>

        {[
          { label: "Event Title", key: "title", placeholder: "e.g. Morning Run at the Mall" },
          { label: "Location", key: "location", placeholder: "e.g. Lincoln Memorial, DC" },
        ].map(({ label, key, placeholder }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ color: "#374151", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
            <input
              value={form[key]}
              onChange={set(key)}
              placeholder={placeholder}
              style={{ width: "100%", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", color: "#111" }}
            />
          </div>
        ))}

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "#374151", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Event Type</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["run", "walk", "popup"].map(t => (
              <button
                key={t}
                onClick={() => setForm(f => ({ ...f, type: t }))}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10, border: "1.5px solid",
                  borderColor: form.type === t ? "#7C3AED" : "#E5E7EB",
                  background: form.type === t ? "#EDE9FE" : "#fff",
                  color: form.type === t ? "#5B21B6" : "#6B7280",
                  fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ color: "#374151", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Description</label>
          <textarea
            value={form.description}
            onChange={set("description")}
            placeholder="Describe the event..."
            rows={3}
            style={{ width: "100%", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", color: "#111", resize: "none" }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{ width: "100%", background: "#111", color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 0", borderRadius: 12, border: "none", cursor: "pointer" }}
        >
          Submit Proposal
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HOME VIEW
═══════════════════════════════════════════ */
function HomeView({ user, events, setEvents, proposals, setProposals, chapters, setChapters }) {
  const [selectedChapter, setSelectedChapter] = useState("dc");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeChapter = chapters.find(c => c.id === selectedChapter);
  const chapterEvents = events.filter(e => e.chapter === selectedChapter);
  const myEventsCount = events.filter(e => e.rsvp).length;

  const handleRsvp = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, rsvp: !e.rsvp, attendees: e.rsvp ? e.attendees - 1 : e.attendees + 1 } : e));
  };

  const handleChapterVote = (id) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, votes: c.votes + 1 } : c));
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: "#000", padding: "16px 20px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>KYDA</div>
            <div style={{ color: "#6B7280", fontSize: 12 }}>Hey, {user.name.split(" ")[0]} 👋</div>
          </div>
          {/* Chapter Selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#1A1A1A", border: "1px solid #333", borderRadius: 20, padding: "8px 14px", cursor: "pointer" }}
            >
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{activeChapter?.name ?? "Chapter"}</span>
              <ChevronDown size={14} color="#9CA3AF" />
            </button>
            {dropdownOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#111", border: "1px solid #222", borderRadius: 14, overflow: "hidden", zIndex: 20, minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                {chapters.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedChapter(c.id); setDropdownOpen(false); }}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      width: "100%", padding: "12px 16px", background: selectedChapter === c.id ? "#1E1E1E" : "transparent",
                      border: "none", cursor: "pointer", color: "#fff",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: c.active ? "#6EE7B7" : "#F9A8D4" }}>
                      {c.active ? "Active" : `${c.votes} votes`}
                    </span>
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
            {/* Stats Row */}
            <div style={{ padding: "16px 16px 0" }}>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { label: "Upcoming", value: chapterEvents.length, icon: <Calendar size={16} color="#7C3AED" /> },
                  { label: "My Events", value: myEventsCount, icon: <Check size={16} color="#059669" /> },
                  { label: "Members", value: "2.1K", icon: <Users size={16} color="#2563EB" /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "14px 12px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#111", lineHeight: 1 }}>{value}</div>
                    <div style={{ color: "#9CA3AF", fontSize: 11, marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div style={{ padding: "20px 16px 0" }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 12 }}>Upcoming Events</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {chapterEvents.map(event => (
                  <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
                ))}
                {chapterEvents.length === 0 && (
                  <div style={{ textAlign: "center", color: "#9CA3AF", padding: "32px 0", fontSize: 14 }}>
                    No events yet for this chapter.
                  </div>
                )}
              </div>
            </div>

            {/* Proposal Preview */}
            <div style={{ padding: "20px 16px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#111" }}>Community Proposals</div>
                <span style={{ color: "#7C3AED", fontSize: 13, fontWeight: 600 }}>See all</span>
              </div>
              <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                {proposals.slice(0, 2).map((p, i) => (
                  <div key={p.id} style={{ padding: "14px 16px", borderBottom: i < 1 ? "1px solid #F3F4F6" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1, marginRight: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <TypeBadge type={p.type} />
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{p.title}</div>
                      <div style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>by {p.proposedBy}</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#7C3AED" }}>{p.votes}</div>
                      <div style={{ color: "#9CA3AF", fontSize: 11 }}>votes</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Inactive Chapter Launch Card */
          <div style={{ padding: 16 }}>
            <div style={{ background: "linear-gradient(135deg,#5B21B6,#7C3AED)", borderRadius: 20, padding: 28, textAlign: "center", color: "#fff" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Launch KYDA {activeChapter?.name}</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
                Help us launch in {activeChapter?.name}! We need 100 votes to activate this chapter.
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 0", marginBottom: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 32 }}>{activeChapter?.votes}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>of 100 votes</div>
              </div>
              {/* Progress bar */}
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, height: 8, marginBottom: 20 }}>
                <div style={{ background: "#fff", borderRadius: 99, height: 8, width: `${Math.min((activeChapter?.votes / 100) * 100, 100)}%` }} />
              </div>
              <button
                onClick={() => handleChapterVote(activeChapter.id)}
                style={{ background: "#fff", color: "#5B21B6", fontWeight: 700, fontSize: 15, padding: "12px 32px", borderRadius: 12, border: "none", cursor: "pointer" }}
              >
                Vote to Launch
              </button>
            </div>

            {/* Other inactive chapters */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 12 }}>Other Chapters</div>
              <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                {chapters.filter(c => !c.active && c.id !== selectedChapter).map((c, i, arr) => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{c.name}</div>
                      <div style={{ color: "#9CA3AF", fontSize: 12 }}>{c.votes} votes</div>
                    </div>
                    <button
                      onClick={() => handleChapterVote(c.id)}
                      style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}
                    >
                      Vote
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

function EventCard({ event, onRsvp }) {
  const pct = Math.round((event.attendees / event.capacity) * 100);
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ position: "relative", height: 160 }}>
        <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <TypeBadge type={event.type} />
        </div>
        {event.rsvp && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "#059669", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#fff" }}>
            GOING
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 8 }}>{event.title}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13 }}>
            <Calendar size={13} /> {event.date}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6B7280", fontSize: 13 }}>
            <MapPin size={13} /> {event.location}
          </div>
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
        <button
          onClick={() => onRsvp(event.id)}
          style={{
            width: "100%", padding: "11px 0", borderRadius: 10, border: "none", cursor: "pointer",
            background: event.rsvp ? "#F3F4F6" : "#111",
            color: event.rsvp ? "#374151" : "#fff",
            fontWeight: 700, fontSize: 14,
          }}
        >
          {event.rsvp ? "Cancel RSVP" : "RSVP"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMMUNITY VIEW
═══════════════════════════════════════════ */
function CommunityView({ user, proposals, setProposals }) {
  const [showModal, setShowModal] = useState(false);

  const handleVote = (id) => {
    setProposals(prev => prev.map(p =>
      p.id === id ? { ...p, votes: p.voted ? p.votes - 1 : p.votes + 1, voted: !p.voted } : p
    ));
  };

  const handleSubmit = (form) => {
    setProposals(prev => [{
      id: Date.now(), title: form.title, proposedBy: user.name,
      type: form.type, location: form.location,
      description: form.description, votes: 0, voted: false,
    }, ...prev]);
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: "#000", padding: "16px 20px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Community</div>
          <button
            onClick={() => setShowModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "none", borderRadius: 20, padding: "8px 14px", cursor: "pointer" }}
          >
            <Plus size={15} color="#111" />
            <span style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>Propose</span>
          </button>
        </div>
      </div>

      <div style={{ background: "#F3F4F6", minHeight: "100vh", padding: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#9CA3AF", marginBottom: 12, letterSpacing: 0.5, textTransform: "uppercase" }}>
          {proposals.length} Proposals · Vote for events you want
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {proposals.map(p => (
            <div key={p.id} style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1, marginRight: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <TypeBadge type={p.type} />
                    <span style={{ color: "#9CA3AF", fontSize: 12 }}>by {p.proposedBy}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 4 }}>{p.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#6B7280", fontSize: 13, marginBottom: 6 }}>
                    <MapPin size={12} /> {p.location}
                  </div>
                  <div style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.5 }}>{p.description}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
                <button
                  onClick={() => handleVote(p.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7, padding: "8px 16px",
                    background: p.voted ? "#EDE9FE" : "#F3F4F6",
                    border: "none", borderRadius: 10, cursor: "pointer",
                  }}
                >
                  <ThumbsUp size={15} color={p.voted ? "#7C3AED" : "#374151"} fill={p.voted ? "#7C3AED" : "none"} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: p.voted ? "#7C3AED" : "#374151" }}>{p.votes}</span>
                  <span style={{ fontSize: 13, color: p.voted ? "#7C3AED" : "#6B7280" }}>{p.voted ? "Voted" : "Vote"}</span>
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D1FAE5" }} />
                  <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>Open for votes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <ProposeModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SHOP VIEW
═══════════════════════════════════════════ */
function ShopView() {
  const items = [
    { id: 1, name: "KYDA Run Tee", price: "$38", tag: "Bestseller", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" },
    { id: 2, name: "Community Cap", price: "$28", tag: "New", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80" },
    { id: 3, name: "Zip Hoodie", price: "$74", tag: null, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80" },
    { id: 4, name: "Water Bottle", price: "$22", tag: "New", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80" },
  ];
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: "#000", padding: "16px 20px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Shop</div>
      </div>
      <div style={{ background: "#F3F4F6", minHeight: "100vh", padding: 16 }}>
        <div style={{ background: "linear-gradient(135deg,#111,#333)", borderRadius: 16, padding: "20px 20px", marginBottom: 20, color: "#fff" }}>
          <div style={{ fontSize: 12, letterSpacing: 1, color: "#9CA3AF", marginBottom: 4, textTransform: "uppercase" }}>Member Exclusive</div>
          <div style={{ fontWeight: 800, fontSize: 20 }}>KYDA Spring Drop</div>
          <div style={{ color: "#D1D5DB", fontSize: 13, marginTop: 4 }}>Limited edition gear for DC chapter</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ position: "relative", height: 130 }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {item.tag && (
                  <div style={{ position: "absolute", top: 8, left: 8, background: "#111", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>
                    {item.tag}
                  </div>
                )}
              </div>
              <div style={{ padding: "10px 12px 12px" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#111", marginBottom: 6 }}>{item.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: "#111" }}>{item.price}</span>
                  <button style={{ background: "#111", color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ALERTS VIEW
═══════════════════════════════════════════ */
function AlertsView() {
  const alerts = [
    { id: 1, icon: "🏃", title: "RSVP Reminder", body: "Morning Run is in 2 days — you're in!", time: "2h ago", unread: true },
    { id: 2, icon: "🗳️", title: "New Chapter Vote", body: "NYC is 3 votes away from launching!", time: "5h ago", unread: true },
    { id: 3, icon: "📣", title: "New Event Posted", body: "Cherry Blossom Walk added for Apr 26.", time: "1d ago", unread: false },
    { id: 4, icon: "💬", title: "Proposal Approved", body: "Rooftop Sunset Run has 34 votes!", time: "2d ago", unread: false },
    { id: 5, icon: "👥", title: "Chapter Update", body: "DC now has 2,100+ active members.", time: "3d ago", unread: false },
  ];
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: "#000", padding: "16px 20px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Alerts</div>
      </div>
      <div style={{ background: "#F3F4F6", minHeight: "100vh", padding: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {alerts.map(a => (
            <div key={a.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: a.unread ? "3px solid #7C3AED" : "3px solid transparent" }}>
              <div style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 8, flexShrink: 0 }}>{a.time}</div>
                </div>
                <div style={{ color: "#6B7280", fontSize: 13, marginTop: 3, lineHeight: 1.4 }}>{a.body}</div>
              </div>
              {a.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C3AED", flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROFILE VIEW
═══════════════════════════════════════════ */
function ProfileView({ user, events, onLogout }) {
  const [interests, setInterests] = useState(["Running", "Networking", "Food & Drink"]);
  const [prefOpen, setPrefOpen] = useState(false);

  const toggleInterest = (interest) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const myEvents = events.filter(e => e.rsvp).length;

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: "#000", padding: "16px 20px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Profile</div>
      </div>

      <div style={{ background: "#F3F4F6", minHeight: "100vh" }}>
        {/* Profile Header */}
        <div style={{ background: "#fff", padding: "28px 20px 20px", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <Avatar name={user.name} size={64} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#111" }}>{user.name}</div>
              <div style={{ color: "#9CA3AF", fontSize: 13, marginTop: 2 }}>DC Chapter · Member</div>
              <div style={{ color: "#7C3AED", fontSize: 13, fontWeight: 600, marginTop: 3 }}>{user.email}</div>
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", gap: 0, background: "#F9FAFB", borderRadius: 14, overflow: "hidden" }}>
            {[
              { label: "Events Attended", value: myEvents, icon: <Check size={16} color="#059669" /> },
              { label: "Proposals", value: 1, icon: <Zap size={16} color="#F59E0B" /> },
              { label: "Chapter Rank", value: "#42", icon: <Award size={16} color="#7C3AED" /> },
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
          {/* Interests */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 14 }}>Interests</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {INTERESTS.map(interest => {
                const active = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    style={{
                      padding: "8px 14px", borderRadius: 20,
                      background: active ? "#111" : "#F3F4F6",
                      color: active ? "#fff" : "#374151",
                      border: "none", cursor: "pointer",
                      fontWeight: 600, fontSize: 13,
                    }}
                  >
                    {active && <Check size={11} style={{ marginRight: 5, display: "inline-block", verticalAlign: "middle" }} />}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferences */}
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 14 }}>
            <button
              onClick={() => setPrefOpen(o => !o)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "none", border: "none", cursor: "pointer" }}
            >
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

          {/* Sign Out */}
          <button
            onClick={onLogout}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", border: "1.5px solid #FEE2E2", borderRadius: 14, padding: "14px 0", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
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
function BottomNav({ active, setActive, alertCount }) {
  const tabs = [
    { id: "events",    label: "Events",    Icon: Home },
    { id: "community", label: "Community", Icon: Users },
    { id: "shop",      label: "Shop",      Icon: ShoppingBag },
    { id: "alerts",    label: "Alerts",    Icon: Bell, badge: alertCount },
    { id: "profile",   label: "Profile",   Icon: User },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 448,
      background: "#fff", borderTop: "1px solid #E5E7EB",
      display: "flex", zIndex: 50,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {tabs.map(({ id, label, Icon, badge }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "10px 0 8px",
              background: "none", border: "none", cursor: "pointer",
              position: "relative",
            }}
          >
            <div style={{ position: "relative" }}>
              <Icon size={22} color={isActive ? "#7C3AED" : "#9CA3AF"} fill={isActive ? "#EDE9FE" : "none"} strokeWidth={isActive ? 2.5 : 1.8} />
              {badge > 0 && (
                <div style={{
                  position: "absolute", top: -4, right: -5,
                  background: "#DC2626", color: "#fff",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {badge}
                </div>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? "#7C3AED" : "#9CA3AF", marginTop: 3 }}>
              {label}
            </span>
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
  const [screen, setScreen]     = useState("login"); // login | signup | app
  const [user, setUser]         = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents]     = useState(EVENTS);
  const [proposals, setProposals] = useState(PROPOSALS);
  const [chapters, setChapters] = useState(CHAPTERS);

  const handleLogin  = (u) => { setUser(u); setScreen("app"); };
  const handleSignup = (u) => { setUser({ ...u }); setScreen("app"); };
  const handleLogout = () => { setUser(null); setScreen("login"); };

  const unreadAlerts = 2;

  if (screen === "login")  return <LoginScreen  onLogin={handleLogin}  onGoSignup={() => setScreen("signup")} />;
  if (screen === "signup") return <SignupScreen onSignup={handleSignup} onGoLogin={() => setScreen("login")} />;

  return (
    <div style={{ maxWidth: 448, margin: "0 auto", position: "relative", minHeight: "100vh", background: "#F3F4F6", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {activeTab === "events"    && <HomeView      user={user} events={events} setEvents={setEvents} proposals={proposals} setProposals={setProposals} chapters={chapters} setChapters={setChapters} />}
      {activeTab === "community" && <CommunityView user={user} proposals={proposals} setProposals={setProposals} />}
      {activeTab === "shop"      && <ShopView />}
      {activeTab === "alerts"    && <AlertsView />}
      {activeTab === "profile"   && <ProfileView  user={user} events={events} onLogout={handleLogout} />}
      <BottomNav active={activeTab} setActive={setActiveTab} alertCount={unreadAlerts} />
    </div>
  );
}
