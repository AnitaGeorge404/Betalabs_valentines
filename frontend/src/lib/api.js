export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// request function (defined below) will include auth token if present
let authToken = null;

export function setAuthToken(token) {
  authToken = token;
  try {
    localStorage.setItem("auth_token", token);
  } catch (e) {
    // ignore
  }
}

export function getAuthToken() {
  if (authToken) return authToken;
  try {
    authToken = localStorage.getItem("auth_token");
    return authToken;
  } catch (e) {
    return null;
  }
}

export function clearAuthToken() {
  authToken = null;
  try {
    localStorage.removeItem("auth_token");
  } catch (e) {
    // ignore
  }
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API request failed");
  }
  return res.json();
}

export function registerUser(email, name) {
  return request("/users/register", {
    method: "POST",
    body: JSON.stringify({ email, name }),
  });
}

export function checkUser(email) {
  return request(`/users/check/${encodeURIComponent(email)}`);
}

export function submitAnswers(email, answers) {
  return request("/users/submit-answers", {
    method: "POST",
    body: JSON.stringify({ email, answers }),
  });
}

export function getQuestions() {
  return request("/questions/");
}

export function searchUsers(query = "") {
  return request(`/users/search?q=${encodeURIComponent(query)}`);
}

export function getAllUsers() {
  return request("/users/all");
}

export function getUser(email) {
  return request(`/users/${encodeURIComponent(email)}`);
}

export function makeMatch(person1Email, person2Email, matcherEmail) {
  return request("/match/make", {
    method: "POST",
    body: JSON.stringify({
      person1_email: person1Email,
      person2_email: person2Email,
      matcher_email: matcherEmail,
    }),
  });
}

export function getCouplesLeaderboard(limit = 20) {
  return request(`/match/leaderboard/couples?limit=${limit}`);
}

export function getUsersLeaderboard(limit = 20) {
  return request(`/match/leaderboard/users?limit=${limit}`);
}
