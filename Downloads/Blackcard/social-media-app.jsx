import { useState, useEffect, useRef } from "react";

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

:root {
  --bg-primary: #0E0D0B;
  --bg-secondary: #1A1815;
  --bg-tertiary: #242119;
  --bg-card: #1E1C18;
  --bg-hover: #2A2720;
  --accent: #E8A849;
  --accent-soft: #E8A84920;
  --accent-glow: #E8A84940;
  --text-primary: #F5F0E8;
  --text-secondary: #A69E8E;
  --text-muted: #6B6357;
  --border: #2E2A24;
  --border-light: #3A352D;
  --danger: #D94F4F;
  --success: #5BAD6A;
  --gradient-warm: linear-gradient(135deg, #E8A849 0%, #D4763A 100%);
  --gradient-dark: linear-gradient(180deg, #1A1815 0%, #0E0D0B 100%);
  --shadow-card: 0 2px 16px rgba(0,0,0,0.3);
  --shadow-elevated: 0 8px 32px rgba(0,0,0,0.5);
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 50%;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: var(--bg-primary); color: var(--text-primary); }

@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
@keyframes heartPop { 0% { transform: scale(1); } 30% { transform: scale(1.35); } 60% { transform: scale(0.95); } 100% { transform: scale(1); } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes gateGlow {
  0%,100% { box-shadow: 0 0 40px rgba(232,168,73,0.15), 0 0 80px rgba(232,168,73,0.05); }
  50% { box-shadow: 0 0 60px rgba(232,168,73,0.3), 0 0 120px rgba(232,168,73,0.1); }
}
@keyframes shimmerLine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-6px); }
  40%,80% { transform: translateX(6px); }
}
@keyframes spin { to { transform: rotate(360deg); } }
`;

const AVATARS = [
  "https://i.pravatar.cc/150?img=1","https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=3","https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=12","https://i.pravatar.cc/150?img=15",
  "https://i.pravatar.cc/150?img=20","https://i.pravatar.cc/150?img=25",
];
const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
];
const POST_IMAGES = [
  "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=80",
  "https://images.unsplash.com/photo-1540206395-68808572332f?w=600&q=80",
];
const USERS = [
  { id:1,name:"Margaux Bellamy",handle:"@margaux",avatar:AVATARS[0],bio:"Wandering through light & shadow ✦ Photographer",followers:12400,following:340,posts:89 },
  { id:2,name:"Theo Ashford",handle:"@theoash",avatar:AVATARS[1],bio:"Design systems & espresso shots",followers:8700,following:512,posts:145 },
  { id:3,name:"Isla Moreno",handle:"@islaaa",avatar:AVATARS[2],bio:"Writing my way through the noise",followers:23100,following:198,posts:67 },
  { id:4,name:"Ren Watanabe",handle:"@renwat",avatar:AVATARS[3],bio:"Code · Music · Mountains",followers:5600,following:890,posts:234 },
  { id:5,name:"Celeste Dubois",handle:"@celeste.d",avatar:AVATARS[4],bio:"Architect of tiny moments",followers:19200,following:267,posts:112 },
  { id:6,name:"Kai Andersen",handle:"@kaiand",avatar:AVATARS[5],bio:"Filmmaker | Dreamer | Coffee addict",followers:31500,following:445,posts:78 },
];
const CURRENT_USER = { id:0,name:"You",handle:"@you",avatar:AVATARS[6],bio:"Just vibing ✨",followers:1200,following:380,posts:42 };
const INITIAL_POSTS = [
  { id:1,user:USERS[0],text:"Golden hour never disappoints. Captured this while hiking the coastal trail — the way the light catches the mist is otherworldly.",image:POST_IMAGES[0],likes:847,comments:[{user:USERS[2],text:"This is breathtaking! Where was this?"},{user:USERS[4],text:"The light here is absolutely magical ✦"}],timestamp:"2h ago",liked:false,bookmarked:false },
  { id:2,user:USERS[1],text:"Been working on a new design system built around warmth and texture. Moving away from the cold, sterile patterns we've all been using. Every pixel should feel intentional.",image:null,likes:324,comments:[{user:USERS[3],text:"Love this approach! Ship it."}],timestamp:"4h ago",liked:false,bookmarked:false },
  { id:3,user:USERS[2],text:"Sometimes the best stories are the ones you overhear on the subway at 2am.",image:POST_IMAGES[1],likes:1203,comments:[{user:USERS[0],text:"Tell us more 👀"},{user:USERS[5],text:"This gave me chills"},{user:USERS[1],text:"You should write a book."}],timestamp:"6h ago",liked:false,bookmarked:false },
  { id:4,user:USERS[3],text:"Deployed the new API at 3am. Everything broke. Fixed it by 3:15. That's the developer experience.",image:null,likes:567,comments:[{user:USERS[1],text:"Speedrun any% bug fixing"}],timestamp:"8h ago",liked:false,bookmarked:false },
  { id:5,user:USERS[4],text:"Found this hidden cove while sailing last weekend. No people, no signal, just waves and sky.",image:POST_IMAGES[2],likes:2100,comments:[{user:USERS[5],text:"Take me with you next time"},{user:USERS[0],text:"Paradise exists and you found it"}],timestamp:"12h ago",liked:false,bookmarked:false },
  { id:6,user:USERS[5],text:"Wrapped the short film today. 14 months of work in 12 minutes of footage. Every frame is a piece of my heart.",image:POST_IMAGES[3],likes:3400,comments:[{user:USERS[2],text:"Can't wait to see it!"},{user:USERS[3],text:"Incredible dedication, Kai."}],timestamp:"1d ago",liked:false,bookmarked:false },
];
const STORIES = USERS.map((u,i) => ({ user:u,seen:i>2,image:COVER_IMAGES[i%COVER_IMAGES.length] }));
const VALID_CODES = ["BLACKCARD","ELITE2026","INNER-CIRCLE","FOUNDING","VIP-ACCESS"];

/* ─── Icons ─── */
const HeartIcon = ({filled}) => <svg width="22" height="22" viewBox="0 0 24 24" fill={filled?"var(--danger)":"none"} stroke={filled?"var(--danger)":"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const CommentIcon = () => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const ShareIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>;
const BookmarkIcon = ({filled}) => <svg width="20" height="20" viewBox="0 0 24 24" fill={filled?"var(--accent)":"none"} stroke={filled?"var(--accent)":"currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
const HomeIcon = ({active}) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active?"var(--accent)":"none"} stroke={active?"var(--accent)":"var(--text-muted)"} strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const SearchIcon = ({active}) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active?"var(--accent)":"var(--text-muted)"} strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const PlusIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const BellIcon = ({active}) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active?"var(--accent)":"none"} stroke={active?"var(--accent)":"var(--text-muted)"} strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const UserIcon = ({active}) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active?"var(--accent)":"none"} stroke={active?"var(--accent)":"var(--text-muted)"} strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ImageIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const SendIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)" stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CopyIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const LockIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const TicketIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>;
const LogoutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

function formatNumber(n) {
  if (n>=1e6) return (n/1e6).toFixed(1)+"M";
  if (n>=1e3) return (n/1e3).toFixed(1)+"K";
  return n.toString();
}

/* ═══════════════════════════════════════════
   INVITE GATE
   ═══════════════════════════════════════════ */
function InviteGate({ onAccess }) {
  const [code,setCode] = useState("");
  const [error,setError] = useState(false);
  const [shaking,setShaking] = useState(false);
  const [checking,setChecking] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (!code.trim()) return;
    setChecking(true); setError(false);
    setTimeout(() => {
      if (VALID_CODES.includes(code.trim().toUpperCase())) { onAccess(); }
      else { setError(true); setShaking(true); setChecking(false); setTimeout(() => setShaking(false),500); }
    },1200);
  };

  return (
    <div style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"var(--bg-primary)",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",inset:0,opacity:0.03,backgroundImage:`radial-gradient(circle at 25% 25%, var(--accent) 1px, transparent 1px), radial-gradient(circle at 75% 75%, var(--accent) 1px, transparent 1px)`,backgroundSize:"60px 60px" }}/>
      <div style={{ position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle, rgba(232,168,73,0.08) 0%, transparent 70%)",animation:"gateGlow 4s ease-in-out infinite",pointerEvents:"none" }}/>

      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",maxWidth:380,width:"100%",position:"relative",zIndex:1,animation:"fadeUp 0.8s ease" }}>
        <div style={{ width:72,height:72,borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg-card)",border:"1px solid var(--border)",marginBottom:28,animation:"gateGlow 4s ease-in-out infinite" }}>
          <LockIcon/>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display', serif",fontSize:36,fontWeight:700,color:"var(--text-primary)",letterSpacing:-1,marginBottom:6 }}>
          <span style={{ color:"var(--accent)" }}>■</span> Blackcard
        </h1>
        <p style={{ color:"var(--text-muted)",fontSize:14.5,textAlign:"center",lineHeight:1.6,marginBottom:40,maxWidth:280 }}>
          An invite-only space for those who belong. Enter your code to continue.
        </p>

        <div style={{ width:"100%",position:"relative",animation:shaking?"shake 0.4s ease":"none" }}>
          <input ref={inputRef} value={code} onChange={e => { setCode(e.target.value.toUpperCase()); setError(false); }}
            onKeyDown={e => e.key==="Enter"&&handleSubmit()} placeholder="ENTER INVITE CODE" maxLength={20}
            style={{ width:"100%",background:"var(--bg-card)",border:`1.5px solid ${error?"var(--danger)":"var(--border)"}`,borderRadius:16,padding:"18px 20px",color:"var(--text-primary)",fontSize:16,fontWeight:600,letterSpacing:3,textAlign:"center",outline:"none",fontFamily:"'DM Sans', sans-serif",transition:"border-color 0.3s" }}
            onFocus={e => { if(!error) e.target.style.borderColor="var(--accent)"; }}
            onBlur={e => { if(!error) e.target.style.borderColor="var(--border)"; }}
          />
          {error && <div style={{ color:"var(--danger)",fontSize:13,fontWeight:500,textAlign:"center",marginTop:10,animation:"fadeUp 0.3s ease" }}>Invalid invite code. Try again.</div>}
        </div>

        <button onClick={handleSubmit} disabled={checking||!code.trim()} style={{
          width:"100%",marginTop:18,padding:"16px 24px",borderRadius:16,
          background:code.trim()?"var(--gradient-warm)":"var(--bg-tertiary)",
          border:"none",color:code.trim()?"#fff":"var(--text-muted)",
          fontSize:15,fontWeight:700,letterSpacing:0.5,
          cursor:code.trim()&&!checking?"pointer":"default",
          fontFamily:"'DM Sans', sans-serif",transition:"all 0.3s",
          position:"relative",overflow:"hidden",
        }}>
          {checking ? (
            <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
              <span style={{ width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block" }}/>
              Verifying...
            </span>
          ) : "Enter the Circle"}
          {checking && <div style={{ position:"absolute",bottom:0,left:0,right:0,height:3,background:"rgba(255,255,255,0.2)",overflow:"hidden" }}><div style={{ width:"40%",height:"100%",background:"#fff",animation:"shimmerLine 1s ease infinite" }}/></div>}
        </button>

        <p style={{ color:"var(--text-muted)",fontSize:12,textAlign:"center",marginTop:24,lineHeight:1.5,opacity:0.7 }}>
          Don't have a code? Ask a current member to invite you.
        </p>
        <button onClick={() => { setCode("BLACKCARD"); inputRef.current?.focus(); }}
          style={{ background:"none",border:"1px solid var(--border)",color:"var(--text-muted)",padding:"8px 18px",borderRadius:20,fontSize:12,cursor:"pointer",marginTop:16,fontFamily:"'DM Sans', sans-serif",transition:"all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.color="var(--accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-muted)"; }}
        >Use demo code</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INVITE PANEL (in-app)
   ═══════════════════════════════════════════ */
function InvitePanel({ onClose }) {
  const [invites] = useState([
    { code:"BC-"+Math.random().toString(36).substring(2,8).toUpperCase(),status:"active",created:"Today" },
    { code:"BC-"+Math.random().toString(36).substring(2,8).toUpperCase(),status:"active",created:"Today" },
    { code:"BC-"+Math.random().toString(36).substring(2,8).toUpperCase(),status:"used",created:"3d ago",usedBy:"Sophie M." },
  ]);
  const [copied,setCopied] = useState(null);
  const copyCode = (code) => { setCopied(code); setTimeout(() => setCopied(null),2000); };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,animation:"scaleIn 0.25s ease" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background:"var(--bg-card)",borderRadius:"var(--radius-lg)",border:"1px solid var(--border)",width:"100%",maxWidth:420,margin:16,boxShadow:"var(--shadow-elevated)",overflow:"hidden" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:"1px solid var(--border)" }}>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer" }}><CloseIcon/></button>
          <span style={{ fontFamily:"'Playfair Display', serif",fontWeight:600,fontSize:17,color:"var(--text-primary)",display:"flex",alignItems:"center",gap:8 }}><TicketIcon/> Your Invites</span>
          <div style={{ width:20 }}/>
        </div>
        <div style={{ padding:20 }}>
          <div style={{ background:"var(--accent-soft)",borderRadius:14,padding:16,marginBottom:18,border:"1px solid rgba(232,168,73,0.15)" }}>
            <div style={{ fontSize:13,color:"var(--accent)",fontWeight:600,marginBottom:4 }}>{invites.filter(i=>i.status==="active").length} invites remaining</div>
            <div style={{ fontSize:12.5,color:"var(--text-muted)",lineHeight:1.5 }}>Share a code with someone you trust. Each code works once.</div>
          </div>
          {invites.map((inv,i) => (
            <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:i<invites.length-1?"1px solid var(--border)":"none",animation:`fadeUp 0.3s ease ${i*0.08}s both` }}>
              <div style={{ width:38,height:38,borderRadius:10,background:inv.status==="active"?"var(--accent-soft)":"var(--bg-tertiary)",display:"flex",alignItems:"center",justifyContent:"center" }}><TicketIcon/></div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'DM Sans', monospace",fontWeight:700,fontSize:14,letterSpacing:1.5,color:inv.status==="active"?"var(--text-primary)":"var(--text-muted)" }}>{inv.code}</div>
                <div style={{ fontSize:12,color:"var(--text-muted)",marginTop:2 }}>{inv.status==="used"?`Used by ${inv.usedBy} · ${inv.created}`:`Created ${inv.created}`}</div>
              </div>
              {inv.status==="active" && (
                <button onClick={() => copyCode(inv.code)} style={{ display:"flex",alignItems:"center",gap:5,background:copied===inv.code?"var(--success)":"var(--bg-tertiary)",border:"1px solid var(--border)",color:copied===inv.code?"#fff":"var(--text-secondary)",padding:"6px 14px",borderRadius:10,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans', sans-serif",transition:"all 0.2s" }}>
                  {copied===inv.code?"Copied!":<><CopyIcon/> Copy</>}
                </button>
              )}
              {inv.status==="used" && <span style={{ fontSize:11,color:"var(--text-muted)",background:"var(--bg-tertiary)",padding:"4px 10px",borderRadius:8,fontWeight:500 }}>Used</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared Components ─── */
function StoryBubble({ story, onClick }) {
  return (
    <button onClick={onClick} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",flexShrink:0,width:72 }}>
      <div style={{ width:62,height:62,borderRadius:"50%",padding:2.5,background:story.seen?"var(--border)":"var(--gradient-warm)" }}>
        <img src={story.user.avatar} alt="" style={{ width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover",border:"2.5px solid var(--bg-primary)" }}/>
      </div>
      <span style={{ fontSize:11,color:story.seen?"var(--text-muted)":"var(--text-secondary)",fontWeight:500,width:68,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{story.user.name.split(" ")[0]}</span>
    </button>
  );
}

function PostCard({ post, onLike, onBookmark, onComment, style }) {
  const [showComments,setShowComments] = useState(false);
  const [newComment,setNewComment] = useState("");
  const [heartAnim,setHeartAnim] = useState(false);
  const handleLike = () => { setHeartAnim(true); onLike(post.id); setTimeout(() => setHeartAnim(false),500); };
  const handleSubmitComment = () => { if(newComment.trim()){ onComment(post.id,newComment.trim()); setNewComment(""); }};

  return (
    <div style={{ background:"var(--bg-card)",borderRadius:"var(--radius-lg)",border:"1px solid var(--border)",overflow:"hidden",animation:"fadeUp 0.5s ease forwards",...style }}>
      <div style={{ display:"flex",alignItems:"center",padding:"16px 18px",gap:12 }}>
        <img src={post.user.avatar} alt="" style={{ width:42,height:42,borderRadius:"50%",objectFit:"cover" }}/>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600,fontSize:14.5,color:"var(--text-primary)" }}>{post.user.name}</div>
          <div style={{ fontSize:12.5,color:"var(--text-muted)",marginTop:1 }}>{post.user.handle} · {post.timestamp}</div>
        </div>
        <button style={{ background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer",padding:4 }}>⋯</button>
      </div>
      <div style={{ padding:"0 18px 14px",fontSize:14.5,lineHeight:1.6,color:"var(--text-primary)",letterSpacing:0.1 }}>{post.text}</div>
      {post.image && (
        <div style={{ position:"relative",overflow:"hidden" }}>
          <img src={post.image} alt="" style={{ width:"100%",height:320,objectFit:"cover",display:"block" }}/>
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 60%,rgba(0,0,0,0.3) 100%)" }}/>
        </div>
      )}
      <div style={{ display:"flex",alignItems:"center",padding:"12px 18px",gap:4 }}>
        <button onClick={handleLike} style={{ display:"flex",alignItems:"center",gap:7,background:"none",border:"none",color:post.liked?"var(--danger)":"var(--text-secondary)",cursor:"pointer",fontSize:13.5,fontWeight:500,padding:"6px 10px",borderRadius:"var(--radius-sm)",transition:"all 0.2s",animation:heartAnim?"heartPop 0.5s ease":"none" }}>
          <HeartIcon filled={post.liked}/><span>{formatNumber(post.likes)}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} style={{ display:"flex",alignItems:"center",gap:7,background:"none",border:"none",color:showComments?"var(--accent)":"var(--text-secondary)",cursor:"pointer",fontSize:13.5,fontWeight:500,padding:"6px 10px",borderRadius:"var(--radius-sm)",transition:"all 0.2s" }}>
          <CommentIcon/><span>{post.comments.length}</span>
        </button>
        <button style={{ display:"flex",alignItems:"center",gap:7,background:"none",border:"none",color:"var(--text-secondary)",cursor:"pointer",padding:"6px 10px",borderRadius:"var(--radius-sm)" }}><ShareIcon/></button>
        <div style={{ flex:1 }}/>
        <button onClick={() => onBookmark(post.id)} style={{ background:"none",border:"none",color:"var(--text-secondary)",cursor:"pointer",padding:"6px 8px",borderRadius:"var(--radius-sm)" }}>
          <BookmarkIcon filled={post.bookmarked}/>
        </button>
      </div>
      {showComments && (
        <div style={{ borderTop:"1px solid var(--border)",padding:"12px 18px",animation:"slideDown 0.3s ease" }}>
          {post.comments.map((c,i) => (
            <div key={i} style={{ display:"flex",gap:10,marginBottom:12,alignItems:"flex-start" }}>
              <img src={c.user.avatar} alt="" style={{ width:30,height:30,borderRadius:"50%",objectFit:"cover",marginTop:2 }}/>
              <div><span style={{ fontWeight:600,fontSize:13,color:"var(--text-primary)" }}>{c.user.name}</span><span style={{ fontSize:13,color:"var(--text-secondary)",marginLeft:6 }}>{c.text}</span></div>
            </div>
          ))}
          <div style={{ display:"flex",gap:10,alignItems:"center",marginTop:8 }}>
            <img src={CURRENT_USER.avatar} alt="" style={{ width:28,height:28,borderRadius:"50%",objectFit:"cover" }}/>
            <div style={{ flex:1,display:"flex",background:"var(--bg-tertiary)",borderRadius:20,border:"1px solid var(--border)",overflow:"hidden" }}>
              <input value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key==="Enter"&&handleSubmitComment()} placeholder="Write a comment..." style={{ flex:1,background:"none",border:"none",padding:"8px 14px",color:"var(--text-primary)",fontSize:13,outline:"none",fontFamily:"'DM Sans', sans-serif" }}/>
              <button onClick={handleSubmitComment} style={{ background:"none",border:"none",padding:"8px 12px",cursor:"pointer",opacity:newComment.trim()?1:0.3,transition:"opacity 0.2s" }}><SendIcon/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComposeModal({ onClose, onPost }) {
  const [text,setText] = useState("");
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,animation:"scaleIn 0.25s ease" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background:"var(--bg-card)",borderRadius:"var(--radius-lg)",border:"1px solid var(--border)",width:"100%",maxWidth:520,margin:16,boxShadow:"var(--shadow-elevated)",overflow:"hidden" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:"1px solid var(--border)" }}>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer" }}><CloseIcon/></button>
          <span style={{ fontFamily:"'Playfair Display', serif",fontWeight:600,fontSize:17,color:"var(--text-primary)" }}>New Post</span>
          <button onClick={() => { if(text.trim()){onPost(text);onClose();}}} style={{ background:text.trim()?"var(--gradient-warm)":"var(--bg-tertiary)",border:"none",color:text.trim()?"#fff":"var(--text-muted)",padding:"7px 20px",borderRadius:20,fontWeight:600,fontSize:13.5,cursor:text.trim()?"pointer":"default",transition:"all 0.3s",fontFamily:"'DM Sans', sans-serif" }}>Post</button>
        </div>
        <div style={{ padding:20,display:"flex",gap:14 }}>
          <img src={CURRENT_USER.avatar} alt="" style={{ width:40,height:40,borderRadius:"50%",objectFit:"cover" }}/>
          <textarea autoFocus value={text} onChange={e => setText(e.target.value)} placeholder="What's on your mind?" rows={5} style={{ flex:1,background:"none",border:"none",color:"var(--text-primary)",fontSize:15,lineHeight:1.6,resize:"none",outline:"none",fontFamily:"'DM Sans', sans-serif" }}/>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 20px",borderTop:"1px solid var(--border)" }}>
          <button style={{ display:"flex",alignItems:"center",gap:6,background:"var(--bg-tertiary)",border:"1px solid var(--border)",color:"var(--text-secondary)",padding:"7px 14px",borderRadius:20,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans', sans-serif" }}><ImageIcon/> Photo</button>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ user, posts, isCurrentUser, onShowInvites, onLogout }) {
  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <div style={{ height:180,background:"var(--gradient-warm)",borderRadius:"0 0 var(--radius-lg) var(--radius-lg)",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,background:"url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80')",backgroundSize:"cover",backgroundPosition:"center",opacity:0.5 }}/>
      </div>
      <div style={{ padding:"0 20px",marginTop:-40 }}>
        <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between" }}>
          <img src={user.avatar} alt="" style={{ width:86,height:86,borderRadius:"50%",objectFit:"cover",border:"4px solid var(--bg-primary)" }}/>
          {isCurrentUser ? (
            <div style={{ display:"flex",gap:8,marginBottom:4 }}>
              <button onClick={onShowInvites} style={{ display:"flex",alignItems:"center",gap:6,background:"var(--accent-soft)",border:"1px solid rgba(232,168,73,0.3)",color:"var(--accent)",padding:"8px 16px",borderRadius:20,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans', sans-serif" }}>
                <TicketIcon/> Invites
              </button>
              <button onClick={onLogout} style={{ display:"flex",alignItems:"center",gap:5,background:"none",border:"1px solid var(--border-light)",color:"var(--text-muted)",padding:"8px 14px",borderRadius:20,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans', sans-serif" }}>
                <LogoutIcon/>
              </button>
            </div>
          ) : (
            <button style={{ background:"var(--gradient-warm)",border:"none",color:"#fff",padding:"8px 24px",borderRadius:20,fontWeight:600,fontSize:13.5,cursor:"pointer",fontFamily:"'DM Sans', sans-serif",marginBottom:4 }}>Follow</button>
          )}
        </div>
        <div style={{ marginTop:14 }}>
          <div style={{ fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:22 }}>{user.name}</div>
          <div style={{ color:"var(--text-muted)",fontSize:14,marginTop:2 }}>{user.handle}</div>
          <div style={{ color:"var(--text-secondary)",fontSize:14.5,marginTop:10,lineHeight:1.5 }}>{user.bio}</div>
        </div>
        <div style={{ display:"flex",gap:28,marginTop:18 }}>
          {[["Posts",user.posts],["Followers",formatNumber(user.followers)],["Following",formatNumber(user.following)]].map(([l,v]) => (
            <div key={l}><div style={{ fontWeight:700,fontSize:17,color:"var(--text-primary)" }}>{v}</div><div style={{ fontSize:12.5,color:"var(--text-muted)",marginTop:2 }}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ height:1,background:"var(--border)",margin:"24px 0" }}/>
      <div style={{ padding:"0 6px 80px",display:"flex",flexDirection:"column",gap:14 }}>
        {posts.length===0?<div style={{ textAlign:"center",padding:40,color:"var(--text-muted)",fontSize:14 }}>No posts yet</div>:
          posts.map(p => <PostCard key={p.id} post={p} onLike={()=>{}} onBookmark={()=>{}} onComment={()=>{}}/>)}
      </div>
    </div>
  );
}

function NotificationsPage() {
  const notifs = [
    {user:USERS[0],action:"liked your post",time:"2m ago",type:"like"},
    {user:USERS[2],action:"started following you",time:"1h ago",type:"follow"},
    {user:USERS[4],action:"commented on your post",time:"3h ago",type:"comment"},
    {user:USERS[1],action:"liked your comment",time:"5h ago",type:"like"},
    {user:USERS[5],action:"mentioned you in a post",time:"8h ago",type:"mention"},
    {user:USERS[3],action:"started following you",time:"1d ago",type:"follow"},
  ];
  return (
    <div style={{ padding:"0 4px 80px",animation:"fadeUp 0.4s ease" }}>
      <h2 style={{ fontFamily:"'Playfair Display', serif",fontSize:24,fontWeight:700,padding:"0 14px 18px" }}>Notifications</h2>
      {notifs.map((n,i) => (
        <div key={i} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px",borderRadius:"var(--radius-md)",cursor:"pointer",transition:"background 0.2s",animation:`fadeUp 0.4s ease ${i*0.06}s both`,background:i<2?"var(--accent-soft)":"transparent" }}
          onMouseEnter={e => e.currentTarget.style.background="var(--bg-hover)"}
          onMouseLeave={e => e.currentTarget.style.background=i<2?"var(--accent-soft)":"transparent"}>
          <img src={n.user.avatar} alt="" style={{ width:44,height:44,borderRadius:"50%",objectFit:"cover" }}/>
          <div style={{ flex:1 }}>
            <span style={{ fontWeight:600,fontSize:14 }}>{n.user.name} </span>
            <span style={{ color:"var(--text-secondary)",fontSize:14 }}>{n.action}</span>
            <div style={{ color:"var(--text-muted)",fontSize:12.5,marginTop:3 }}>{n.time}</div>
          </div>
          {n.type==="follow"&&<button style={{ background:"var(--gradient-warm)",border:"none",color:"#fff",padding:"6px 16px",borderRadius:16,fontWeight:600,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans', sans-serif" }}>Follow</button>}
        </div>
      ))}
    </div>
  );
}

function SearchPage() {
  const [query,setQuery] = useState("");
  const filtered = USERS.filter(u => u.name.toLowerCase().includes(query.toLowerCase())||u.handle.toLowerCase().includes(query.toLowerCase()));
  const trending = ["#DesignSystems","#GoldenHour","#CodeAtNight","#FilmMaking","#Wanderlust"];
  return (
    <div style={{ padding:"0 4px 80px",animation:"fadeUp 0.4s ease" }}>
      <div style={{ padding:"0 10px 16px" }}>
        <div style={{ display:"flex",alignItems:"center",background:"var(--bg-tertiary)",borderRadius:24,border:"1px solid var(--border)",padding:"0 16px" }}>
          <SearchIcon active={false}/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people, topics..." style={{ flex:1,background:"none",border:"none",padding:"13px 12px",color:"var(--text-primary)",fontSize:14.5,outline:"none",fontFamily:"'DM Sans', sans-serif" }}/>
        </div>
      </div>
      {!query&&(
        <div style={{ padding:"0 14px",marginBottom:24 }}>
          <h3 style={{ fontFamily:"'Playfair Display', serif",fontSize:18,fontWeight:600,marginBottom:14 }}>Trending</h3>
          <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
            {trending.map(t => <span key={t} style={{ background:"var(--accent-soft)",color:"var(--accent)",padding:"7px 16px",borderRadius:20,fontSize:13.5,fontWeight:500,cursor:"pointer" }}>{t}</span>)}
          </div>
        </div>
      )}
      <div style={{ padding:"0 10px" }}>
        <h3 style={{ fontFamily:"'Playfair Display', serif",fontSize:18,fontWeight:600,marginBottom:14,padding:"0 4px" }}>{query?"Results":"Suggested for you"}</h3>
        {filtered.map((u,i) => (
          <div key={u.id} style={{ display:"flex",alignItems:"center",gap:14,padding:"12px 8px",borderRadius:"var(--radius-md)",cursor:"pointer",transition:"background 0.2s",animation:`fadeUp 0.4s ease ${i*0.05}s both` }}
            onMouseEnter={e => e.currentTarget.style.background="var(--bg-hover)"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}>
            <img src={u.avatar} alt="" style={{ width:48,height:48,borderRadius:"50%",objectFit:"cover" }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600,fontSize:14.5 }}>{u.name}</div>
              <div style={{ color:"var(--text-muted)",fontSize:13 }}>{u.handle}</div>
              <div style={{ color:"var(--text-secondary)",fontSize:12.5,marginTop:2 }}>{u.bio}</div>
            </div>
            <button style={{ background:"none",border:"1px solid var(--border-light)",color:"var(--text-primary)",padding:"6px 16px",borderRadius:16,fontWeight:600,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans', sans-serif" }}>Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function App() {
  const [authenticated,setAuthenticated] = useState(false);
  const [page,setPage] = useState("home");
  const [posts,setPosts] = useState(INITIAL_POSTS);
  const [showCompose,setShowCompose] = useState(false);
  const [showInvites,setShowInvites] = useState(false);
  const [profileUser,setProfileUser] = useState(null);
  const scrollRef = useRef(null);

  const handleLike = id => setPosts(posts.map(p => p.id===id?{...p,liked:!p.liked,likes:p.liked?p.likes-1:p.likes+1}:p));
  const handleBookmark = id => setPosts(posts.map(p => p.id===id?{...p,bookmarked:!p.bookmarked}:p));
  const handleComment = (id,text) => setPosts(posts.map(p => p.id===id?{...p,comments:[...p.comments,{user:CURRENT_USER,text}]}:p));
  const handlePost = text => setPosts([{id:Date.now(),user:CURRENT_USER,text,image:null,likes:0,comments:[],timestamp:"now",liked:false,bookmarked:false},...posts]);
  const openProfile = user => { setProfileUser(user); setPage("profile-view"); };

  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTop=0; },[page]);

  if (!authenticated) return <><style dangerouslySetInnerHTML={{__html:FONTS_CSS}}/><InviteGate onAccess={() => setAuthenticated(true)}/></>;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:FONTS_CSS}}/>
      <div style={{ maxWidth:480,margin:"0 auto",minHeight:"100vh",background:"var(--bg-primary)",position:"relative",borderLeft:"1px solid var(--border)",borderRight:"1px solid var(--border)" }}>
        <div ref={scrollRef} style={{ height:"100vh",overflowY:"auto",paddingBottom:80 }}>
          {/* Header */}
          <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(14,13,11,0.85)",backdropFilter:"blur(16px)",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid var(--border)" }}>
            <h1 style={{ fontFamily:"'Playfair Display', serif",fontSize:22,fontWeight:700,color:"var(--text-primary)",letterSpacing:-0.5 }}>
              <span style={{ color:"var(--accent)" }}>■</span> Blackcard
            </h1>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <button onClick={() => setShowInvites(true)} style={{ background:"none",border:"none",color:"var(--accent)",cursor:"pointer",padding:4,display:"flex",alignItems:"center",opacity:0.8,transition:"opacity 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity="1"} onMouseLeave={e => e.currentTarget.style.opacity="0.8"}>
                <TicketIcon/>
              </button>
              <button onClick={() => setPage("profile")} style={{ width:34,height:34,borderRadius:"50%",overflow:"hidden",border:page==="profile"?"2px solid var(--accent)":"2px solid var(--border)",background:"none",cursor:"pointer",padding:0 }}>
                <img src={CURRENT_USER.avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
              </button>
            </div>
          </div>

          {page==="home"&&(
            <div style={{ animation:"fadeUp 0.4s ease" }}>
              <div style={{ display:"flex",gap:10,padding:"18px 16px",overflowX:"auto",borderBottom:"1px solid var(--border)" }}>
                <button onClick={() => setShowCompose(true)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",flexShrink:0,width:72 }}>
                  <div style={{ width:62,height:62,borderRadius:"50%",background:"var(--bg-tertiary)",border:"2px dashed var(--border-light)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent)" }}><PlusIcon/></div>
                  <span style={{ fontSize:11,color:"var(--text-muted)",fontWeight:500 }}>Your Story</span>
                </button>
                {STORIES.map((s,i) => <StoryBubble key={i} story={s} onClick={() => openProfile(s.user)}/>)}
              </div>
              <div style={{ padding:"14px 10px",display:"flex",flexDirection:"column",gap:14 }}>
                {posts.map((p,i) => <PostCard key={p.id} post={p} onLike={handleLike} onBookmark={handleBookmark} onComment={handleComment} style={{ animationDelay:`${i*0.08}s` }}/>)}
              </div>
            </div>
          )}
          {page==="search"&&<SearchPage/>}
          {page==="notifications"&&<NotificationsPage/>}
          {page==="profile"&&<ProfilePage user={CURRENT_USER} posts={posts.filter(p=>p.user.id===CURRENT_USER.id)} isCurrentUser onShowInvites={()=>setShowInvites(true)} onLogout={()=>setAuthenticated(false)}/>}
          {page==="profile-view"&&profileUser&&<ProfilePage user={profileUser} posts={posts.filter(p=>p.user.id===profileUser.id)} isCurrentUser={false}/>}
        </div>

        {/* Bottom Nav */}
        <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(14,13,11,0.92)",backdropFilter:"blur(16px)",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-around",padding:"10px 0 14px",zIndex:50 }}>
          {[{id:"home",icon:HomeIcon},{id:"search",icon:SearchIcon},{id:"compose",icon:null},{id:"notifications",icon:BellIcon},{id:"profile",icon:UserIcon}].map(item =>
            item.id==="compose"?(
              <button key="compose" onClick={()=>setShowCompose(true)} style={{ width:46,height:46,borderRadius:"50%",background:"var(--gradient-warm)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",boxShadow:"0 4px 16px var(--accent-glow)",marginTop:-12,transition:"transform 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><PlusIcon/></button>
            ):(
              <button key={item.id} onClick={()=>{setPage(item.id);setProfileUser(null);}} style={{ background:"none",border:"none",cursor:"pointer",padding:"6px 14px",display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
                <item.icon active={page===item.id}/>
                {page===item.id&&<div style={{ width:4,height:4,borderRadius:"50%",background:"var(--accent)" }}/>}
              </button>
            )
          )}
        </div>

        {showCompose&&<ComposeModal onClose={()=>setShowCompose(false)} onPost={handlePost}/>}
        {showInvites&&<InvitePanel onClose={()=>setShowInvites(false)}/>}
      </div>
    </>
  );
}
