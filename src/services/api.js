const API_BASE = '/api';

// Get current user from localStorage
function getCurrentUserId() {
  try {
    const state = JSON.parse(localStorage.getItem('m365hub_state'));
    return state?.user?.id || null;
  } catch {
    return null;
  }
}

// ===== AUTH =====
export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function registerUser(firstName, lastName, username, password) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

// ===== SCORES =====
export async function submitScore(userId, moduleId, score, passed) {
  const res = await fetch(`${API_BASE}/submit-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, moduleId, score, passed }),
  });
  return res.json();
}

export async function getLeaderboard() {
  const res = await fetch(`${API_BASE}/leaderboard`);
  return res.json();
}

export async function getUserProgress(userId) {
  const res = await fetch(`${API_BASE}/user-progress?userId=${userId}`);
  return res.json();
}

// ===== ADMIN =====
function adminHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-admin-user-id': String(getCurrentUserId()),
  };
}

export async function adminGetUsers() {
  const res = await fetch(`${API_BASE}/admin?action=list-users`, {
    headers: adminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
  return data;
}

export async function adminGetStats() {
  const res = await fetch(`${API_BASE}/admin?action=stats`, {
    headers: adminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
  return data;
}

export async function adminDeleteUser(userId) {
  const res = await fetch(`${API_BASE}/admin?action=delete-user`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete user');
  return data;
}

export async function adminPromoteUser(userId) {
  const res = await fetch(`${API_BASE}/admin?action=promote-user`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to promote user');
  return data;
}

export async function adminDemoteUser(userId) {
  const res = await fetch(`${API_BASE}/admin?action=demote-user`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to demote user');
  return data;
}

export async function adminResetUserScores(userId) {
  const res = await fetch(`${API_BASE}/admin?action=reset-user-scores`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset scores');
  return data;
}

export async function adminResetAllScores() {
  const res = await fetch(`${API_BASE}/admin?action=reset-all-scores`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset all scores');
  return data;
}

export async function adminDeleteAllUsers() {
  const res = await fetch(`${API_BASE}/admin?action=delete-all-users`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete all users');
  return data;
}