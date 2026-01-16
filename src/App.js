import React, { useState } from 'react';
import { Calendar, MapPin, Users, Bell, User, ArrowLeft, Check, ShoppingBag, Shirt, Star } from 'lucide-react';

const KYDACommunityApp = () => {
  const [currentView, setCurrentView] = useState('login');
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '', city: '' });
  const [userData, setUserData] = useState({
    name: '', email: '', city: '', chapter: 'DC',
    preferences: { distance: '5K' },
    interests: { runs: true, popups: true, walks: true }
  });

  const handleLogin = () => {
    if (loginData.email && loginData.password) {
      setUserData({ ...userData, name: loginData.email.split('@')[0], email: loginData.email });
      setIsLoggedIn(true);
      setCurrentView('home');
    }
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen pb-20">
      <div className="bg-gray-50">
        <div className="bg-black text-white p-6">
          <h1 className="text-3xl font-bold mb-1">KYDA</h1>
          <p className="text-gray-400">Welcome, {userData.name}!</p>
        </div>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Full App Coming Soon!</h2>
          <p className="text-gray-600">Your frontend is connected and ready.</p>
        </div>
      </div>
    </div>
  );
};

export default KYDACommunityApp;
