const API_BASE = '/api';

function getCurrentUserId() {
  try {
    const state = JSON.parse(localStorage.getItem('m365hub_state'));
    return state?.user?.id || null;
  } catch { return null; }
}

function adminHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-admin-user-id': String(getCurrentUserId()),
  };
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

// ===== MODULES (Public) =====
export async function fetchModules() {
  const res = await fetch(`${API_BASE}/modules`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch modules');
  return data;
}

export async function fetchModuleDetail(moduleId) {
  const res = await fetch(`${API_BASE}/modules?id=${moduleId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch module');
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

// ===== ADMIN: Users =====
export async function adminGetUsers() {
  const res = await fetch(`${API_BASE}/admin?action=list-users`, { headers: adminHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminGetStats() {
  const res = await fetch(`${API_BASE}/admin?action=stats`, { headers: adminHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminDeleteUser(userId) {
  const res = await fetch(`${API_BASE}/admin?action=delete-user`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminPromoteUser(userId) {
  const res = await fetch(`${API_BASE}/admin?action=promote-user`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminDemoteUser(userId) {
  const res = await fetch(`${API_BASE}/admin?action=demote-user`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminResetUserScores(userId) {
  const res = await fetch(`${API_BASE}/admin?action=reset-user-scores`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminResetAllScores() {
  const res = await fetch(`${API_BASE}/admin?action=reset-all-scores`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify({}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminDeleteAllUsers() {
  const res = await fetch(`${API_BASE}/admin?action=delete-all-users`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify({}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

// ===== ADMIN: Modules =====
export async function adminGetModules() {
  const res = await fetch(`${API_BASE}/modules`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminGetModuleDetail(moduleId) {
  const res = await fetch(`${API_BASE}/modules?id=${moduleId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminCreateModule(moduleData) {
  const res = await fetch(`${API_BASE}/modules`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify(moduleData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminUpdateModule(moduleData) {
  const res = await fetch(`${API_BASE}/modules`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify(moduleData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminDeleteModule(moduleId) {
  const res = await fetch(`${API_BASE}/modules?id=${moduleId}`, {
    method: 'DELETE', headers: adminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

// ===== ADMIN: Questions =====
export async function adminAddQuestion(questionData) {
  const res = await fetch(`${API_BASE}/questions`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify(questionData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminUpdateQuestion(questionData) {
  const res = await fetch(`${API_BASE}/questions`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify(questionData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminDeleteQuestion(questionId) {
  const res = await fetch(`${API_BASE}/questions?id=${questionId}`, {
    method: 'DELETE', headers: adminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

// ===== ADMIN: Resources =====
export async function adminAddResource(resourceData) {
  const res = await fetch(`${API_BASE}/resources`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify(resourceData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminUpdateResource(resourceData) {
  const res = await fetch(`${API_BASE}/resources`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify(resourceData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function adminDeleteResource(resourceId) {
  const res = await fetch(`${API_BASE}/resources?id=${resourceId}`, {
    method: 'DELETE', headers: adminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

// ===== BADGES =====
export async function getUserBadges(userId) {
  const res = await fetch(`${API_BASE}/badges?userId=${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function checkBadges(userId) {
  const res = await fetch(`${API_BASE}/badges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

// ===== ANALYTICS =====
export async function getAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`, {
    headers: adminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}