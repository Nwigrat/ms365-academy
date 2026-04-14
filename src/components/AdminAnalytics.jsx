import { useState, useEffect } from "react";
import { getAnalytics } from "../services/api";

const BADGE_NAMES = {
  "first-steps": "🌟 First Steps",
  "first-pass": "✅ Passing Grade",
  "perfectionist": "💯 Perfectionist",
  "three-down": "🎯 Halfway There",
  "completionist": "🏆 Completionist",
  "scholar": "📚 Scholar",
  "expert": "🎓 Expert",
  "master": "👑 M365 Master",
  "persistent": "🔄 Persistent",
  "dedicated": "💪 Dedicated Learner",
  "quick-learner": "⚡ Quick Learner",
  "well-rounded": "🌐 Well Rounded",
};

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const analytics = await getAnalytics();
        setData(analytics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#8aa4c0" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>📊</div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#ef9a9a" }}>
        <p>❌ {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { overview, passRate, moduleStats, topPerformers, recentActivity, registrationTrend, badgeStats } = data;

  return (
    <div>
      <h2 style={{ color: "#fff", marginBottom: 6, fontSize: "1.4rem" }}>📊 Analytics Dashboard</h2>
      <p style={{ color: "#8aa4c0", marginBottom: 24 }}>
        Comprehensive overview of learning progress across all agents.
      </p>

      {/* KPI Cards */}
      <div className="analytics-kpi-row">
        <div className="analytics-kpi">
          <div className="analytics-kpi-icon">👥</div>
          <div className="analytics-kpi-number">{overview.total_users}</div>
          <div className="analytics-kpi-label">Total Users</div>
        </div>
        <div className="analytics-kpi">
          <div className="analytics-kpi-icon">📚</div>
          <div className="analytics-kpi-number">{overview.active_learners}</div>
          <div className="analytics-kpi-label">Active Learners</div>
        </div>
        <div className="analytics-kpi">
          <div className="analytics-kpi-icon">📝</div>
          <div className="analytics-kpi-number">{overview.total_quizzes_taken}</div>
          <div className="analytics-kpi-label">Quizzes Taken</div>
        </div>
        <div className="analytics-kpi">
          <div className="analytics-kpi-icon">✅</div>
          <div className="analytics-kpi-number">{overview.total_quizzes_passed}</div>
          <div className="analytics-kpi-label">Quizzes Passed</div>
        </div>
        <div className="analytics-kpi">
          <div className="analytics-kpi-icon">📈</div>
          <div className="analytics-kpi-number">{passRate}%</div>
          <div className="analytics-kpi-label">Pass Rate</div>
        </div>
        <div className="analytics-kpi">
          <div className="analytics-kpi-icon">🛡️</div>
          <div className="analytics-kpi-number">{overview.total_admins}</div>
          <div className="analytics-kpi-label">Admins</div>
        </div>
      </div>

      {/* Module Performance */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#4fc3f7", marginBottom: 16 }}>📊 Module Performance</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Users Attempted</th>
                <th>Total Attempts</th>
                <th>Users Passed</th>
                <th>Avg Score</th>
                <th>Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {(moduleStats || []).map((mod) => (
                <tr key={mod.id}>
                  <td>
                    <span style={{ marginRight: 8 }}>{mod.icon}</span>
                    <strong style={{ color: "#e0e6ed" }}>{mod.title}</strong>
                  </td>
                  <td style={{ color: "#8aa4c0" }}>{mod.users_attempted}</td>
                  <td style={{ color: "#8aa4c0" }}>{mod.total_attempts}</td>
                  <td style={{ color: "#81c784" }}>{mod.users_passed}</td>
                  <td style={{ color: "#ffd54f", fontWeight: 600 }}>{mod.avg_score} pts</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar-container" style={{ flex: 1, height: 8, marginBottom: 0 }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${mod.pass_rate}%`,
                            background: mod.pass_rate >= 70 ? "#4caf50" : mod.pass_rate >= 40 ? "#ffd54f" : "#f44336",
                          }}
                        />
                      </div>
                      <span style={{ color: "#e0e6ed", fontSize: "0.85rem", fontWeight: 600, minWidth: 45 }}>
                        {mod.pass_rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Top Performers */}
        <div className="card">
          <h3 style={{ color: "#4fc3f7", marginBottom: 16 }}>🏆 Top Performers</h3>
          {(topPerformers || []).map((user, i) => (
            <div
              key={user.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                background: i < 3 ? "rgba(255,213,79,0.08)" : "transparent",
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, color: i === 0 ? "#ffd54f" : i === 1 ? "#b0bec5" : i === 2 ? "#cd7f32" : "#8aa4c0", fontSize: "0.9rem", width: 24 }}>
                  #{i + 1}
                </span>
                <div>
                  <strong style={{ color: "#e0e6ed", fontSize: "0.9rem" }}>
                    {user.first_name} {user.last_name}
                  </strong>
                  <div style={{ color: "#8aa4c0", fontSize: "0.75rem" }}>
                    {user.modules_completed} modules · {user.badges_earned} badges
                  </div>
                </div>
              </div>
              <span style={{ color: "#ffd54f", fontWeight: 700, fontSize: "0.95rem" }}>
                {user.total_score} pts
              </span>
            </div>
          ))}
          {(topPerformers || []).length === 0 && (
            <p style={{ color: "#8aa4c0", textAlign: "center", padding: 20 }}>No data yet</p>
          )}
        </div>

        {/* Badge Distribution */}
        <div className="card">
          <h3 style={{ color: "#4fc3f7", marginBottom: 16 }}>🏅 Badge Distribution</h3>
          {(badgeStats || []).map((badge) => (
            <div
              key={badge.badge_id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ color: "#e0e6ed", fontSize: "0.9rem" }}>
                {BADGE_NAMES[badge.badge_id] || badge.badge_id}
              </span>
              <span style={{ color: "#4fc3f7", fontWeight: 600 }}>
                {badge.times_earned} earned
              </span>
            </div>
          ))}
          {(badgeStats || []).length === 0 && (
            <p style={{ color: "#8aa4c0", textAlign: "center", padding: 20 }}>No badges earned yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 style={{ color: "#4fc3f7", marginBottom: 16 }}>🕐 Recent Activity</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Module</th>
                <th>Score</th>
                <th>Status</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {(recentActivity || []).map((activity, i) => (
                <tr key={i}>
                  <td style={{ color: "#e0e6ed" }}>
                    {activity.first_name} {activity.last_name}
                  </td>
                  <td>
                    <span style={{ marginRight: 6 }}>{activity.module_icon}</span>
                    <span style={{ color: "#8aa4c0" }}>{activity.module_title}</span>
                  </td>
                  <td style={{ color: "#ffd54f", fontWeight: 600 }}>{activity.best_score} pts</td>
                  <td>
                    {activity.passed ? (
                      <span className="badge badge-completed">✅ Passed</span>
                    ) : (
                      <span className="badge badge-not-started">❌ Failed</span>
                    )}
                  </td>
                  <td style={{ color: "#8aa4c0", fontSize: "0.8rem" }}>
                    {activity.last_attempt ? new Date(activity.last_attempt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
              {(recentActivity || []).length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 30, color: "#8aa4c0" }}>
                    No activity yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Trend */}
      {registrationTrend && registrationTrend.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ color: "#4fc3f7", marginBottom: 16 }}>📈 New Registrations (Last 30 Days)</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 120, padding: "0 8px" }}>
            {registrationTrend.map((day, i) => {
              const maxVal = Math.max(...registrationTrend.map(d => d.new_users), 1);
              const height = (day.new_users / maxVal) * 100;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    minWidth: 8,
                    background: "linear-gradient(180deg, #4fc3f7, #0078d4)",
                    height: `${Math.max(height, 4)}%`,
                    borderRadius: "4px 4px 0 0",
                    position: "relative",
                  }}
                  title={`${new Date(day.date).toLocaleDateString()}: ${day.new_users} new users`}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: "0.7rem", color: "#8aa4c0" }}>
            <span>{registrationTrend.length > 0 ? new Date(registrationTrend[0].date).toLocaleDateString() : ""}</span>
            <span>{registrationTrend.length > 0 ? new Date(registrationTrend[registrationTrend.length - 1].date).toLocaleDateString() : ""}</span>
          </div>
        </div>
      )}
    </div>
  );
}