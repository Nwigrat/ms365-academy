import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import {
  adminGetUsers,
  adminGetStats,
  adminDeleteUser,
  adminPromoteUser,
  adminDemoteUser,
  adminResetUserScores,
  adminResetAllScores,
  adminDeleteAllUsers,
} from "../services/api";

export default function AdminPanel() {
  const { appState, navigateTo } = useAppContext();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [usersData, statsData] = await Promise.all([
        adminGetUsers(),
        adminGetStats(),
      ]);
      setUsers(usersData.users || []);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function showMessage(msg, isError = false) {
    setActionMessage({ text: msg, isError });
    setTimeout(() => setActionMessage(null), 4000);
  }

  async function handleDeleteUser(userId, username) {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${username}"? This will also delete all their scores and badges.`
      )
    )
      return;
    try {
      await adminDeleteUser(userId);
      showMessage(`User "${username}" deleted successfully`);
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    }
  }

  async function handlePromote(userId, username) {
    if (!window.confirm(`Promote "${username}" to admin?`)) return;
    try {
      await adminPromoteUser(userId);
      showMessage(`"${username}" is now an admin`);
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    }
  }

  async function handleDemote(userId, username) {
    if (!window.confirm(`Remove admin access from "${username}"?`)) return;
    try {
      await adminDemoteUser(userId);
      showMessage(`"${username}" is now a regular user`);
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    }
  }

  async function handleResetScores(userId, username) {
    if (!window.confirm(`Reset all scores for "${username}"?`)) return;
    try {
      await adminResetUserScores(userId);
      showMessage(`Scores reset for "${username}"`);
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    }
  }

  async function handleResetAllScores() {
    if (
      !window.confirm(
        "⚠️ This will reset ALL scores for ALL users. Are you sure?"
      )
    )
      return;
    if (!window.confirm("This cannot be undone. Are you absolutely sure?"))
      return;
    try {
      await adminResetAllScores();
      showMessage("All scores have been reset");
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    }
  }

  async function handleDeleteAllUsers() {
    if (
      !window.confirm(
        "⚠️ This will delete ALL users and scores (except yours). Are you sure?"
      )
    )
      return;
    if (
      !window.confirm("This CANNOT be undone. Are you absolutely sure?")
    )
      return;
    try {
      await adminDeleteAllUsers();
      showMessage("All users deleted (except you)");
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    }
  }

  // Filter users by search
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#8aa4c0" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#ef9a9a" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔒</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: "#fff", marginBottom: 6, fontSize: "1.4rem" }}>
        🛡️ Admin Panel
      </h2>
      <p style={{ color: "#8aa4c0", marginBottom: 24 }}>
        Manage users, roles, and scores.
      </p>

      {/* Admin sub-navigation */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <button className="btn btn-primary">
          👥 User Management
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigateTo("admin-analytics")}
        >
          📊 Analytics Dashboard
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigateTo("admin-modules")}
        >
          📚 Module Manager
        </button>
      </div>   
      {/* Action message */}
      {actionMessage && (
        <div
          className={`admin-message ${
            actionMessage.isError ? "error" : "success"
          }`}
        >
          {actionMessage.isError ? "❌" : "✅"} {actionMessage.text}
        </div>
      )}

      {/* Stats cards */}
      {stats && (
        <div className="stats-row" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalAdmins}</div>
            <div className="stat-label">Admins</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalQuizzesTaken}</div>
            <div className="stat-label">Quizzes Taken</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalQuizzesPassed}</div>
            <div className="stat-label">Quizzes Passed</div>
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className="card admin-danger-zone" style={{ marginBottom: 24 }}>
        <h3 style={{ color: "#ef9a9a", marginBottom: 12 }}>⚠️ Danger Zone</h3>
        <div className="btn-group">
          <button className="btn btn-danger" onClick={handleResetAllScores}>
            🔄 Reset All Scores
          </button>
          <button className="btn btn-danger" onClick={handleDeleteAllUsers}>
            🗑️ Delete All Users
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="🔍 Search users by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search"
        />
      </div>

      {/* Users table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Score</th>
              <th>Modules</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "#8aa4c0",
                  }}
                >
                  {searchTerm
                    ? "No users match your search"
                    : "No users found"}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isYou = user.id === appState.user?.id;
                const isAdmin = user.role === "admin";

                return (
                  <tr
                    key={user.id}
                    style={
                      isYou
                        ? { background: "rgba(0,120,212,0.1)" }
                        : {}
                    }
                  >
                    <td style={{ color: "#8aa4c0" }}>#{user.id}</td>
                    <td>
                      <strong style={{ color: "#e0e6ed" }}>
                        {user.first_name} {user.last_name}
                      </strong>
                      {isYou && (
                        <span className="admin-you-badge">YOU</span>
                      )}
                    </td>
                    <td style={{ color: "#8aa4c0" }}>@{user.username}</td>
                    <td>
                      <span
                        className={`admin-role-badge ${
                          isAdmin ? "role-admin" : "role-user"
                        }`}
                      >
                        {isAdmin ? "🛡️ Admin" : "👤 User"}
                      </span>
                    </td>
                    <td
                      style={{ fontWeight: 600, color: "#ffd54f" }}
                    >
                      {user.total_score} pts
                    </td>
                    <td style={{ color: "#8aa4c0" }}>
                      {user.modules_completed}/
                      {appState.modules?.length || 6}
                    </td>
                    <td
                      style={{
                        color: "#8aa4c0",
                        fontSize: "0.8rem",
                      }}
                    >
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="admin-actions">
                        {/* Promote / Demote */}
                        {!isYou && (
                          <>
                            {isAdmin ? (
                              <button
                                className="admin-action-btn demote"
                                onClick={() =>
                                  handleDemote(user.id, user.username)
                                }
                                title="Remove admin access"
                              >
                                ⬇️
                              </button>
                            ) : (
                              <button
                                className="admin-action-btn promote"
                                onClick={() =>
                                  handlePromote(user.id, user.username)
                                }
                                title="Promote to admin"
                              >
                                ⬆️
                              </button>
                            )}
                          </>
                        )}

                        {/* Reset scores */}
                        <button
                          className="admin-action-btn reset"
                          onClick={() =>
                            handleResetScores(user.id, user.username)
                          }
                          title="Reset scores"
                        >
                          🔄
                        </button>

                        {/* Delete user */}
                        {!isYou && (
                          <button
                            className="admin-action-btn delete"
                            onClick={() =>
                              handleDeleteUser(user.id, user.username)
                            }
                            title="Delete user"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p
        style={{
          color: "#8aa4c0",
          fontSize: "0.8rem",
          marginTop: 16,
          textAlign: "center",
        }}
      >
        Showing {filteredUsers.length} of {users.length} users
      </p>
    </div>
  );
}