import React, { useState } from 'react';
import { Calendar, MapPin, Users, Bell, User, ArrowLeft, Check, ShoppingBag, Shirt, ChevronRight, Star } from 'lucide-react';

const KYDACommunityApp = () => {
  const [currentView, setCurrentView] = useState('login');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [chapterVotes, setChapterVotes] = useState({});
  const [proposedEvents, setProposedEvents] = useState([
    { id: 'p1', title: 'Sunrise Yoga + Run', type: 'run', location: 'National Mall, DC', 
      proposedBy: 'Sarah M.', votes: 23, chapter: 'DC', votedBy: [], description: 'Start with yoga, then a 5K run' },
    { id: 'p2', title: 'KYDA x Local Artist Collab', type: 'popup', location: 'U Street Corridor, DC',
      proposedBy: 'Mike R.', votes: 18, chapter: 'DC', votedBy: [], description: 'Pop-up shop featuring local artists' },
    { id: 'p3', title: 'Night Run with DJ', type: 'run', location: 'Brooklyn, NYC',
      proposedBy: 'Alex T.', votes: 31, chapter: 'NYC', votedBy: [], description: 'Night run with live DJ and glow gear' },
    { id: 'p4', title: 'Moonlight Monument Walk', type: 'walk', location: 'National Mall, DC',
      proposedBy: 'Jordan K.', votes: 15, chapter: 'DC', votedBy: [], description: 'Night walk under the stars' },
    { id: 'p5', title: 'Coffee & Morning Stroll', type: 'walk', location: 'Dupont Circle, DC',
      proposedBy: 'Taylor P.', votes: 12, chapter: 'DC', votedBy: [], description: 'Casual morning walk with coffee stops' }
  ]);
  const [newProposal, setNewProposal] = useState({
    title: '', type: 'run', location: '', description: ''
  });
  const [userData, setUserData] = useState({
    name: '', email: '', city: '', chapter: 'DC',
    preferences: { distance: '5K', notifications: true },
    interests: { runs: true, popups: true, uniforms: false, walks: true }
  });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '', email: '', password: '', confirmPassword: '', city: ''
  });

  const kydaChapters = [
    { id: 'DC', name: 'KYDA - DC', city: 'Washington DC', members: '2.1K', color: 'bg-blue-600', active: true, votes: 0 },
    { id: 'NYC', name: 'KYDA - NYC', city: 'New York City', members: '3.5K', color: 'bg-purple-600', active: false, votes: 47 },
    { id: 'MIAMI', name: 'KYDA - MIAMI', city: 'Miami', members: '1.8K', color: 'bg-pink-600', active: false, votes: 32 },
    { id: 'ATLANTA', name: 'KYDA - ATL', city: 'Atlanta', members: '0', color: 'bg-red-600', active: false, votes: 28 },
    { id: 'CHICAGO', name: 'KYDA - CHI', city: 'Chicago', members: '0', color: 'bg-orange-600', active: false, votes: 19 },
    { id: 'NC', name: 'KYDA - NC', city: 'North Carolina', members: '1.2K', color: 'bg-green-600', active: false, votes: 15 }
  ];

  const events = [
    { id: 1, type: 'run', title: 'Saturday Morning Run Club', date: '2026-01-18', time: '8:00 AM',
      location: 'Lincoln Park, Washington DC', attendees: 24, capacity: 30, organizer: 'KYDA Run Crew',
      description: 'Join us for our weekly Saturday morning run.', chapter: 'DC',
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80' },
    { id: 2, type: 'popup', title: 'KYDA Spring Collection Drop', date: '2026-01-20', time: '6:00 PM',
      location: '921 H Street NE, Washington DC', attendees: 87, capacity: 150, organizer: 'KYDA HQ',
      description: 'Exclusive first look at our Spring collection.', chapter: 'DC',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80' },
    { id: 6, type: 'walk', title: 'Sunset Walk & Chill', date: '2026-01-19', time: '6:00 PM',
      location: 'Georgetown Waterfront, DC', attendees: 31, capacity: 50, organizer: 'KYDA Walk Crew',
      description: 'Evening walk along the waterfront. Low intensity, all fitness levels welcome.', chapter: 'DC',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80' },
    { id: 7, type: 'walk', title: 'Night Walk - Monument Tour', date: '2026-01-21', time: '8:00 PM',
      location: 'National Mall, Washington DC', attendees: 28, capacity: 40, organizer: 'KYDA Walk Crew',
      description: 'Guided night walk through DC monuments. Safe, social, and scenic.', chapter: 'DC',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80' },
    { id: 3, type: 'run', title: 'Brooklyn Bridge 10K', date: '2026-01-19', time: '7:00 AM',
      location: 'Brooklyn Bridge Park, NYC', attendees: 45, capacity: 60, organizer: 'KYDA NYC',
      description: 'Scenic run across the Brooklyn Bridge.', chapter: 'NYC',
      image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80' },
    { id: 4, type: 'popup', title: 'South Beach Pop-Up', date: '2026-01-21', time: '5:00 PM',
      location: 'Ocean Drive, Miami Beach', attendees: 62, capacity: 100, organizer: 'KYDA Miami',
      description: 'Beach vibes and exclusive Miami collection.', chapter: 'MIAMI',
      image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&q=80' },
    { id: 5, type: 'run', title: 'Charlotte Trail Run', date: '2026-01-22', time: '8:30 AM',
      location: 'Freedom Park, Charlotte', attendees: 18, capacity: 30, organizer: 'KYDA NC',
      description: 'Trail run through Charlotte urban park.', chapter: 'NC',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80' }
  ];

  const handleLogin = () => {
    if (loginData.email && loginData.password) {
      setUserData({ ...userData, name: loginData.email.split('@')[0], email: loginData.email });
      setIsLoggedIn(true);
      setCurrentView('home');
    }
  };

  const handleSignup = () => {
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (signupData.name && signupData.email && signupData.password) {
      setUserData({ ...userData, name: signupData.name, email: signupData.email, city: signupData.city });
      setIsLoggedIn(true);
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('login');
    setUserData({
      name: '', email: '', city: '', chapter: 'DC',
      preferences: { distance: '5K', notifications: true },
      interests: { runs: true, popups: true, uniforms: false, walks: true }
    });
    setRsvpedEvents([]);
  };

  const toggleRSVP = (eventId) => {
    if (rsvpedEvents.includes(eventId)) {
      setRsvpedEvents(rsvpedEvents.filter(id => id !== eventId));
    } else {
      setRsvpedEvents([...rsvpedEvents, eventId]);
    }
  };

  const handleVote = (proposalId) => {
    setProposedEvents(proposedEvents.map(proposal => {
      if (proposal.id === proposalId) {
        const hasVoted = proposal.votedBy.includes(userData.email);
        return {
          ...proposal,
          votes: hasVoted ? proposal.votes - 1 : proposal.votes + 1,
          votedBy: hasVoted 
            ? proposal.votedBy.filter(email => email !== userData.email)
            : [...proposal.votedBy, userData.email]
        };
      }
      return proposal;
    }));
  };

  const handleProposeEvent = () => {
    if (newProposal.title && newProposal.location) {
      const proposal = {
        id: `p${Date.now()}`,
        ...newProposal,
        proposedBy: userData.name,
        votes: 1,
        chapter: userData.chapter,
        votedBy: [userData.email]
      };
      setProposedEvents([...proposedEvents, proposal]);
      setNewProposal({ title: '', type: 'run', location: '', description: '' });
      setShowProposeModal(false);
      alert('Event proposed! Community members can now vote on it.');
    }
  };

  const handleChapterVote = (chapterId) => {
    const hasVoted = chapterVotes[chapterId];
    setChapterVotes({
      ...chapterVotes,
      [chapterId]: !hasVoted
    });
  };

  const getChapterVoteCount = (chapter) => {
    const baseVotes = chapter.votes || 0;
    const userVote = chapterVotes[chapter.id] ? 1 : 0;
    return baseVotes + userVote;
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">KYDA</h1>
              <p className="text-gray-600">Community-driven sportswear</p>
            </div>
            {authView === 'login' ? (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input type="email" value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      placeholder="your@email.com"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <input type="password" value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black" />
                  </div>
                  <button onClick={handleLogin}
                    className="w-full py-3 bg-black text-white rounded-lg font-semibold">Sign In</button>
                  <div className="text-center">
                    <button onClick={() => setAuthView('signup')} className="text-sm text-gray-600">
                      Don't have an account? <span className="font-semibold">Sign Up</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Create Account</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input type="text" value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input type="email" value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      placeholder="your@email.com"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input type="text" value={signupData.city}
                      onChange={(e) => setSignupData({...signupData, city: e.target.value})}
                      placeholder="Washington DC"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <input type="password" value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                    <input type="password" value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      placeholder="••••••••"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black" />
                  </div>
                  <button onClick={handleSignup}
                    className="w-full py-3 bg-black text-white rounded-lg font-semibold">Create Account</button>
                  <div className="text-center">
                    <button onClick={() => setAuthView('login')} className="text-sm text-gray-600">
                      Already have an account? <span className="font-semibold">Sign In</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentChapter = kydaChapters.find(c => c.id === userData.chapter);
  const filteredEvents = events.filter(e => e.chapter === userData.chapter);
  const filteredProposals = proposedEvents.filter(p => p.chapter === userData.chapter).sort((a, b) => b.votes - a.votes);

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen pb-20">
      {currentView === 'home' && (
        <div className="bg-gray-50">
          <div className="bg-black text-white p-6">
            <h1 className="text-3xl font-bold mb-1">KYDA</h1>
            <p className="text-gray-400">Community Events</p>
            
            <div className="mt-4">
              <label className="block text-xs text-gray-400 mb-2">YOUR CHAPTER</label>
              <select 
                value={userData.chapter}
                onChange={(e) => setUserData({...userData, chapter: e.target.value})}
                className="w-full p-3 bg-gray-900 text-white rounded-lg outline-none border-2 border-gray-700 focus:border-white font-semibold"
              >
                {kydaChapters.map(chapter => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.name}{chapter.active ? ` - ${chapter.members} members` : ' (Coming Soon)'}
                  </option>
                ))}
              </select>
              {currentChapter && !currentChapter.active && (
                <div className="mt-3 p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-600/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-bold text-lg mb-1">
                        🚀 Help Launch {currentChapter.name}!
                      </p>
                      <p className="text-purple-200 text-sm">
                        Vote to bring KYDA to {currentChapter.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleChapterVote(currentChapter.id)}
                      className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                        chapterVotes[currentChapter.id]
                          ? 'bg-white text-purple-900'
                          : 'bg-purple-600 text-white hover:bg-purple-500'
                      }`}
                    >
                      {chapterVotes[currentChapter.id] ? '✓ Voted!' : 'Vote for This Chapter'}
                    </button>
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg text-center min-w-[80px]">
                      <p className="text-3xl font-bold text-white">{getChapterVoteCount(currentChapter)}</p>
                      <p className="text-xs text-purple-200">votes</p>
                    </div>
                  </div>
                  <p className="text-purple-200 text-xs mt-3">
                    💡 Chapters with more votes launch sooner!
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <p className="text-2xl font-bold">{filteredEvents.length}</p>
              <p className="text-xs text-gray-600">Upcoming</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <p className="text-2xl font-bold">{rsvpedEvents.length}</p>
              <p className="text-xs text-gray-600">My Events</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              {currentChapter?.active ? (
                <>
                  <p className="text-2xl font-bold">{currentChapter.members}</p>
                  <p className="text-xs text-gray-600">Members</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold">{getChapterVoteCount(currentChapter)}</p>
                  <p className="text-xs text-gray-600">Launch Votes</p>
                </>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upcoming Events</h2>
              <span className="text-sm text-gray-600">{currentChapter?.city}</span>
            </div>
            <div className="space-y-4">
              {filteredEvents.map(event => (
                <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        event.type === 'run' ? 'bg-black text-white' : 
                        event.type === 'walk' ? 'bg-green-600 text-white' : 
                        'bg-purple-600 text-white'
                      }`}>
                        {event.type}
                      </span>
                      {rsvpedEvents.includes(event.id) && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          <Check size={12} /> Going
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{event.attendees}/{event.capacity} attending</span>
                      <button 
                        onClick={() => toggleRSVP(event.id)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                          rsvpedEvents.includes(event.id) 
                            ? 'bg-gray-200 text-gray-800' 
                            : 'bg-black text-white'
                        }`}
                      >
                        {rsvpedEvents.includes(event.id) ? 'Cancel' : 'RSVP'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredEvents.length === 0 && (
                <div className="bg-white rounded-lg p-8 text-center shadow">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="font-bold text-lg mb-2">
                    {currentChapter && !currentChapter.active ? `${currentChapter.name} Coming Soon!` : 'No Events Yet'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {currentChapter && !currentChapter.active 
                      ? `Help us launch in ${currentChapter.city}! Vote above to show your support.` 
                      : 'Check back soon for events in your area!'}
                  </p>
                  {currentChapter && !currentChapter.active && (
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Want KYDA in {currentChapter.city}?</strong>
                        </p>
                        <p className="text-xs text-gray-600">
                          Cast your vote above! Chapters with the most votes will launch first. 
                          We're aiming to bring community runs, pop-ups, and custom uniforms to your city.
                        </p>
                      </div>
                      <button 
                        onClick={() => setUserData({...userData, chapter: 'DC'})}
                        className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800"
                      >
                        View DC Events While You Wait
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Community Proposals</h2>
                  <p className="text-sm text-gray-600">Vote for events you want to see</p>
                </div>
                <button 
                  onClick={() => setCurrentView('community')}
                  className="text-sm text-blue-600 font-semibold hover:text-blue-800"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {filteredProposals.slice(0, 2).map(proposal => {
                  const hasVoted = proposal.votedBy.includes(userData.email);
                  return (
                    <div key={proposal.id} className="bg-white rounded-lg p-4 shadow">
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => handleVote(proposal.id)}
                          className={`flex flex-col items-center justify-center min-w-[60px] p-2 rounded-lg border-2 transition-all ${
                            hasVoted 
                              ? 'border-black bg-black text-white' 
                              : 'border-gray-300 hover:border-black'
                          }`}
                        >
                          <span className="text-2xl font-bold">{proposal.votes}</span>
                          <span className="text-xs">votes</span>
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                              proposal.type === 'run' ? 'bg-blue-100 text-blue-800' : 
                              proposal.type === 'walk' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {proposal.type}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-1">{proposal.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{proposal.location}</p>
                          <p className="text-xs text-gray-500">Proposed by {proposal.proposedBy}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredProposals.length === 0 && (
                  <div className="bg-white rounded-lg p-6 text-center shadow">
                    <Star size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600 mb-3">No proposals yet for {currentChapter?.city}</p>
                    <button 
                      onClick={() => setCurrentView('community')}
                      className="bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm"
                    >
                      Be the First to Propose
                    </button>
                  </div>
                )}
                {filteredProposals.length > 2 && (
                  <button 
                    onClick={() => setCurrentView('community')}
                    className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200"
                  >
                    View All {filteredProposals.length} Proposals
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'community' && (
        <div className="bg-gray-50">
          <div className="bg-black text-white p-6">
            <h1 className="text-3xl font-bold mb-1">Community</h1>
            <p className="text-gray-400">Propose & vote on events</p>
          </div>

          <div className="p-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6 mb-6 shadow-lg">
              <h2 className="text-xl font-bold mb-2">Shape Your Community</h2>
              <p className="text-sm text-purple-100 mb-4">
                Have an event idea? Propose it and let the community vote. 
                Popular proposals become real events!
              </p>
              <button 
                onClick={() => setShowProposeModal(true)}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <Star size={20} /> Propose an Event
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Active Proposals</h2>
                <span className="text-sm text-gray-600">{currentChapter?.city}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Vote for events you want to see happen in your chapter
              </p>
            </div>

            <div className="space-y-3">
              {filteredProposals.map(proposal => {
                const hasVoted = proposal.votedBy.includes(userData.email);
                return (
                  <div key={proposal.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => handleVote(proposal.id)}
                        className={`flex flex-col items-center justify-center min-w-[70px] p-3 rounded-lg border-2 transition-all ${
                          hasVoted 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-300 hover:border-black hover:bg-gray-50'
                        }`}
                      >
                        <Star size={20} className={hasVoted ? 'fill-white' : ''} />
                        <span className="text-2xl font-bold mt-1">{proposal.votes}</span>
                        <span className="text-xs">votes</span>
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            proposal.type === 'run' ? 'bg-blue-100 text-blue-800' : 
                            proposal.type === 'walk' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {proposal.type}
                          </span>
                          {proposal.votes >= 20 && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                              🔥 Trending
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{proposal.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                          <MapPin size={14} />
                          {proposal.location}
                        </p>
                        {proposal.description && (
                          <p className="text-sm text-gray-700 mb-2">{proposal.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">Proposed by {proposal.proposedBy}</p>
                          {proposal.votes >= 30 && (
                            <span className="text-xs text-green-600 font-semibold">
                              ✓ Under Review by KYDA
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredProposals.length === 0 && (
                <div className="bg-white rounded-lg p-8 text-center shadow">
                  <Star size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="font-bold text-lg mb-2">No Proposals Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Be the first to propose an event for {currentChapter?.city}!
                  </p>
                  <button 
                    onClick={() => setShowProposeModal(true)}
                    className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
                  >
                    Propose an Event
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                💡 How Voting Works
              </h3>
              <ul className="text-sm text-blue-900 space-y-1">
                <li>• Propose events you'd like to see in your community</li>
                <li>• Vote on proposals from other members</li>
                <li>• Proposals with 20+ votes get marked as "Trending"</li>
                <li>• Proposals with 30+ votes are reviewed by KYDA organizers</li>
                <li>• Top proposals become official KYDA events!</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {currentView === 'profile' && (
        <div className="bg-gray-50">
          <div className="bg-black text-white p-6">
            <h1 className="text-3xl font-bold">Profile</h1>
          </div>
          <div className="p-4">
            <div className="bg-white rounded-lg p-6 mb-4 shadow text-center">
              <div className="w-24 h-24 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold mb-1">{userData.name}</h2>
              <p className="text-gray-600">{userData.city}</p>
              <p className="text-sm text-gray-500">{userData.email}</p>
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">YOUR CHAPTER</p>
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${currentChapter?.color}`}></div>
                  <span className="font-bold text-lg">{currentChapter?.name}</span>
                  {currentChapter && !currentChapter.active && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 shadow">
              <h3 className="font-bold mb-3">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-black">{rsvpedEvents.length}</p>
                  <p className="text-sm text-gray-600">Events Joined</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-black">0</p>
                  <p className="text-sm text-gray-600">Attended</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 shadow">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Star size={20} />
                What Are You Interested In?
              </h3>
              <p className="text-sm text-gray-600 mb-4">Personalize your experience</p>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Run Events</p>
                      <p className="text-sm text-gray-600">Community runs</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={userData.interests.runs}
                    onChange={(e) => setUserData({
                      ...userData, 
                      interests: {...userData.interests, runs: e.target.checked}
                    })}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Pop-Up Events</p>
                      <p className="text-sm text-gray-600">Product drops</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={userData.interests.popups}
                    onChange={(e) => setUserData({
                      ...userData, 
                      interests: {...userData.interests, popups: e.target.checked}
                    })}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Walk Events</p>
                      <p className="text-sm text-gray-600">Day & night walks</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={userData.interests.walks}
                    onChange={(e) => setUserData({
                      ...userData, 
                      interests: {...userData.interests, walks: e.target.checked}
                    })}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Shirt size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Custom Uniforms</p>
                      <p className="text-sm text-gray-600">Team gear</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={userData.interests.uniforms}
                    onChange={(e) => setUserData({
                      ...userData, 
                      interests: {...userData.interests, uniforms: e.target.checked}
                    })}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 shadow">
              <h3 className="font-bold mb-3">Preferences</h3>
              <div className="py-2">
                <label className="block font-semibold mb-2">Preferred Run Distance</label>
                <select 
                  value={userData.preferences.distance}
                  onChange={(e) => setUserData({
                    ...userData, 
                    preferences: {...userData.preferences, distance: e.target.value}
                  })}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black"
                >
                  <option>3K</option>
                  <option>5K</option>
                  <option>10K</option>
                  <option>Half Marathon</option>
                  <option>Marathon</option>
                </select>
              </div>
            </div>

            <button onClick={handleLogout}
              className="w-full bg-white text-red-600 py-3 rounded-lg font-semibold shadow hover:bg-red-50">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {showProposeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Propose an Event</h2>
              <button onClick={() => setShowProposeModal(false)} className="text-gray-500 hover:text-black">
                <ArrowLeft size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Event Title *</label>
                <input 
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                  placeholder="e.g., Sunset 5K Run"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Event Type *</label>
                <select 
                  value={newProposal.type}
                  onChange={(e) => setNewProposal({...newProposal, type: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black"
                >
                  <option value="run">Run Event</option>
                  <option value="walk">Walk Event</option>
                  <option value="popup">Pop-Up Event</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Location *</label>
                <input 
                  type="text"
                  value={newProposal.location}
                  onChange={(e) => setNewProposal({...newProposal, location: e.target.value})}
                  placeholder="e.g., Lincoln Park, DC"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description (Optional)</label>
                <textarea 
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                  placeholder="Tell us more about your event idea..."
                  rows="3"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg outline-none focus:border-black"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <strong>💡 How it works:</strong> Your proposal will be added to the community board. 
                  If it gets enough votes, KYDA organizers will make it happen!
                </p>
              </div>

              <button 
                onClick={handleProposeEvent}
                disabled={!newProposal.title || !newProposal.location}
                className={`w-full py-3 rounded-lg font-semibold ${
                  newProposal.title && newProposal.location
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
        <button onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-black' : 'text-gray-400'}`}>
          <Calendar size={24} />
          <span className="text-xs font-semibold">Events</span>
        </button>
        <button onClick={() => setCurrentView('community')}
          className={`flex flex-col items-center gap-1 ${currentView === 'community' ? 'text-black' : 'text-gray-400'}`}>
          <Users size={24} />
          <span className="text-xs font-semibold">Community</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <ShoppingBag size={24} />
          <span className="text-xs font-semibold">Shop</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Bell size={24} />
          <span className="text-xs font-semibold">Alerts</span>
        </button>
        <button onClick={() => setCurrentView('profile')}
          className={`flex flex-col items-center gap-1 ${currentView === 'profile' ? 'text-black' : 'text-gray-400'}`}>
          <User size={24} />
          <span className="text-xs font-semibold">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default KYDACommunityApp;
