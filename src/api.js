const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getToken() {
  return localStorage.getItem("kyda_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Auth
export const api = {
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  register: (name, email, city, password) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, city, password }) }),

  me: () => request("/api/auth/me"),

  updateProfile: (data) =>
    request("/api/auth/profile", { method: "PUT", body: JSON.stringify(data) }),

  // Chapters
  getChapters: () => request("/api/chapters"),
  voteChapter: (id) => request(`/api/chapters/${id}/vote`, { method: "POST" }),
  myChapterVotes: () => request("/api/chapters/votes/mine"),

  // Events
  getEvents: (chapter) => request(`/api/events${chapter ? `?chapter=${chapter}` : ""}`),
  rsvpEvent: (id) => request(`/api/events/${id}/rsvp`, { method: "POST" }),
  myRsvps: () => request("/api/rsvps/mine"),

  // Proposals
  getProposals: (chapter) => request(`/api/proposals${chapter ? `?chapter=${chapter}` : ""}`),
  createProposal: (data) =>
    request("/api/proposals", { method: "POST", body: JSON.stringify(data) }),
  voteProposal: (id) => request(`/api/proposals/${id}/vote`, { method: "POST" }),
  myProposalVotes: () => request("/api/proposals/votes/mine"),

  // Admin
  approveProposal: (id, data = {}) =>
    request(`/api/proposals/${id}/approve`, { method: "POST", body: JSON.stringify(data) }),
  rejectProposal: (id) =>
    request(`/api/proposals/${id}/reject`, { method: "POST" }),
};

export function saveToken(token) {
  localStorage.setItem("kyda_token", token);
}

export function clearToken() {
  localStorage.removeItem("kyda_token");
}
