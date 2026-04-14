const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Signup failed');
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  }
};

export const eventsAPI = {
  getAll: async (chapterId) => {
    const response = await fetch(`${API_BASE_URL}/events?chapter=${chapterId}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  rsvp: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('RSVP failed');
    return response.json();
  }
};

export const proposalsAPI = {
  getAll: async (chapterId) => {
    const response = await fetch(`${API_BASE_URL}/proposals?chapter=${chapterId}`);
    if (!response.ok) throw new Error('Failed to fetch proposals');
    return response.json();
  },

  create: async (proposalData) => {
    const response = await fetch(`${API_BASE_URL}/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(proposalData),
    });
    if (!response.ok) throw new Error('Failed to create proposal');
    return response.json();
  },

  vote: async (proposalId) => {
    const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/vote`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Vote failed');
    return response.json();
  }
};

export const chaptersAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/chapters`);
    if (!response.ok) throw new Error('Failed to fetch chapters');
    return response.json();
  }
};
