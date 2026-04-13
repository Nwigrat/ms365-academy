const API_BASE = '/api';

export async function registerUser(username) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  return res.json();
}

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