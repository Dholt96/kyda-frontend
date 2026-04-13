import { useState, useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { api } from "./api/client";
import InviteGate from "./pages/InviteGate";
import FeedPage from "./pages/FeedPage";
import SearchPage from "./pages/SearchPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import ComposeModal from "./components/ComposeModal";
import InvitePanel from "./components/InvitePanel";
import { HomeIcon, SearchIcon, PlusIcon, BellIcon, UserIcon, TicketIcon } from "./components/Icons";

export default function App() {
  const { user, token, login, logout } = useAuth();
  const [page, setPage] = useState("home");
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [showInvites, setShowInvites] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (token) {
      api.getFeed()
        .then(data => setPosts(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [page]);

  const handleLike = async (id) => {
    const { liked } = await api.likePost(id);
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, liked, like_count: liked ? (p.like_count ?? 0) + 1 : (p.like_count ?? 1) - 1 }
      : p
    ));
  };

  const handleBookmark = async (id) => {
    const { bookmarked } = await api.bookmarkPost(id);
    setPosts(prev => prev.map(p => p.id === id ? { ...p, bookmarked } : p));
  };

  const handleComment = async (id, text_content) => {
    const comment = await api.addComment(id, text_content);
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, comments: [...(p.comments || []), { ...comment, user }] }
      : p
    ));
  };

  const handlePost = async (text_content) => {
    const post = await api.createPost(text_content, null);
    setPosts(prev => [{ ...post, user, like_count: 0, comment_count: 0, comments: [], liked: false, bookmarked: false }, ...prev]);
  };

  const openProfile = (profileData) => {
    setProfileUser(profileData);
    setPage("profile-view");
  };

  // Not authenticated — show invite gate
  if (!token) {
    return (
      <InviteGate onAccess={(code) => {
        // After invite validation, show a simple register form
        // For now we just redirect to register — you can expand this
        setPage("register");
      }} />
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "var(--bg-primary)", position: "relative", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
      <div ref={scrollRef} style={{ height: "100vh", overflowY: "auto", paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(14,13,11,0.85)", backdropFilter: "blur(16px)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: -0.5 }}>
            <span style={{ color: "var(--accent)" }}>■</span> Blackcard
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setShowInvites(true)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", opacity: 0.8, transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0.8"}>
              <TicketIcon />
            </button>
            <button onClick={() => setPage("profile")} style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: page === "profile" ? "2px solid var(--accent)" : "2px solid var(--border)", background: "none", cursor: "pointer", padding: 0 }}>
              <img src={user?.avatar_url || `https://i.pravatar.cc/150?u=${user?.id}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          </div>
        </div>

        {/* Pages */}
        {page === "home" && (
          <FeedPage
            posts={posts}
            stories={[]}
            currentUser={user}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onComment={handleComment}
            onOpenCompose={() => setShowCompose(true)}
            onOpenProfile={openProfile}
          />
        )}
        {page === "search" && <SearchPage />}
        {page === "notifications" && <NotificationsPage />}
        {page === "profile" && (
          <ProfilePage
            user={user}
            posts={posts.filter(p => p.user_id === user?.id)}
            currentUser={user}
            isCurrentUser={true}
            onShowInvites={() => setShowInvites(true)}
            onLogout={logout}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onComment={handleComment}
          />
        )}
        {page === "profile-view" && profileUser && (
          <ProfilePage
            user={profileUser}
            posts={posts.filter(p => p.user_id === profileUser.id)}
            currentUser={user}
            isCurrentUser={false}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onComment={handleComment}
          />
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(14,13,11,0.92)", backdropFilter: "blur(16px)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 0 20px", zIndex: 50 }}>
        {[
          { id: "home", Icon: HomeIcon },
          { id: "search", Icon: SearchIcon },
          { id: "compose", Icon: PlusIcon, isAction: true },
          { id: "notifications", Icon: BellIcon },
          { id: "profile", Icon: UserIcon },
        ].map(({ id, Icon, isAction }) => (
          <button key={id} onClick={() => isAction ? setShowCompose(true) : setPage(id)}
            style={{ background: isAction ? "var(--gradient-warm)" : "none", border: "none", cursor: "pointer", padding: isAction ? "10px" : "8px", borderRadius: isAction ? "50%" : 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            <Icon active={page === id} />
          </button>
        ))}
      </div>

      {showCompose && <ComposeModal currentUser={user} onClose={() => setShowCompose(false)} onPost={handlePost} />}
      {showInvites && <InvitePanel onClose={() => setShowInvites(false)} />}
    </div>
  );
}
