cat > src/App.js << 'EOF'
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Bell, User, ArrowLeft, Check, ShoppingBag, Shirt, Star } from 'lucide-react';

const KYDACommunityApp = () => {
  const [currentView, setCurrentView] = useState('login');
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [chapterVotes, setChapterVotes] = useState({});
  const [proposedEvents, setProposedEvents] = useState([
    { id: 'p1', title: 'Sunrise Yoga + Run', type: 'run', location: 'National Mall, DC', 
      proposedBy: 'Sarah M.', votes: 23, chapter: 'DC', votedBy: [], description: 'Start with yoga, then a 5K run' }
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">KYDA</h1>
          <p className="text-gray-600">Community-driven sportswear - Coming Soon!</p>
        </div>
      </div>
    </div>
  );
};

export default KYDACommunityApp;
EOF
