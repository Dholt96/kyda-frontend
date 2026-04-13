const BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  validateInvite: (code) =>
    request("/validate-invite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) }),

  register: (username, email, password, inviteCode) =>
    request("/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, email, password, inviteCode }) }),

  login: (email, password) =>
    request("/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }),

  getFeed: () =>
    request("/feed", { headers: authHeaders() }),

  createPost: (text_content, image_url) =>
    request("/posts", { method: "POST", headers: authHeaders(), body: JSON.stringify({ text_content, image_url }) }),

  likePost: (id) =>
    request(`/posts/${id}/like`, { method: "POST", headers: authHeaders() }),

  bookmarkPost: (id) =>
    request(`/posts/${id}/bookmark`, { method: "POST", headers: authHeaders() }),

  getComments: (id) =>
    request(`/posts/${id}/comments`, { headers: authHeaders() }),

  addComment: (id, text_content) =>
    request(`/posts/${id}/comments`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ text_content }) }),

  getUser: (id) =>
    request(`/users/${id}`, { headers: authHeaders() }),

  followUser: (id) =>
    request(`/users/${id}/follow`, { method: "POST", headers: authHeaders() }),

  search: (q) =>
    request(`/search?q=${encodeURIComponent(q)}`, { headers: authHeaders() }),

  generateInvite: () =>
    request("/invites/generate", { method: "POST", headers: authHeaders() }),

  getInvites: () =>
    request("/invites", { headers: authHeaders() }),

  getNotifications: () =>
    request("/notifications", { headers: authHeaders() }),
};
