import { useAppContext } from "../context/AppContext";

export default function Dashboard() {
  const {
    appState,
    modules,
    modulesLoading,
    dbStats,
    dbStatsLoading,
    getModuleProgress,
    navigateTo,
  } = useAppContext();

  const displayName = appState.user?.firstName || "Agent";

  // Use DB stats if available, fallback to local
  const totalScore = dbStats?.totalScore ?? appState.totalScore;
  const modulesCompleted = dbStats?.modulesCompleted ?? Object.values(appState.moduleProgress).filter((p) => p.passed).length;
  const totalAttempts = dbStats?.totalAttempts ?? 0;
  const badgesEarned = dbStats?.badgesEarned ?? 0;
  const leaderboardRank = dbStats?.leaderboardRank ?? 0;
  const totalUsers = dbStats?.totalUsers ?? 0;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div style={{ fontSize: "3rem" }}>🚀</div>
        <div className="welcome-text">
          <h2>Welcome back, {displayName}!</h2>
          <p>
            Continue your Microsoft 365 journey. Complete modules, ace quizzes,
            and climb the leaderboard!
          </p>
        </div>
      </div>

      {/* Stats Row — from DB */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{dbStatsLoading ? "..." : totalScore}</div>
          <div className="stat-label">Total Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {dbStatsLoading ? "..." : `${modulesCompleted}/${dbStats?.totalModules || modules.length}`}
          </div>
          <div className="stat-label">Modules Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{dbStatsLoading ? "..." : totalAttempts}</div>
          <div className="stat-label">Quizzes Taken</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{dbStatsLoading ? "..." : badgesEarned}</div>
          <div className="stat-label">Badges Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {dbStatsLoading
              ? "..."
              : leaderboardRank > 0
              ? `#${leaderboardRank}`
              : "—"}
          </div>
          <div className="stat-label">
            Rank{totalUsers > 0 ? ` / ${totalUsers}` : ""}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {dbStats?.recentActivity && dbStats.recentActivity.length > 0 && (
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#4fc3f7", marginBottom: 16 }}>🕐 Recent Activity</h2>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {dbStats.recentActivity.map((activity, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{ marginRight: 6 }}>{activity.icon}</span>
                      <span style={{ color: "#e0e6ed" }}>{activity.title}</span>
                    </td>
                    <td style={{ color: "#ffd54f", fontWeight: 600 }}>
                      {activity.best_score} pts
                    </td>
                    <td>
                      {activity.passed ? (
                        <span className="badge badge-completed">✅ Passed</span>
                      ) : (
                        <span className="badge badge-not-started">❌ Failed</span>
                      )}
                    </td>
                    <td style={{ color: "#8aa4c0", fontSize: "0.8rem" }}>
                      {activity.last_attempt
                        ? new Date(activity.last_attempt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Continue Learning */}
      <h2 style={{ color: "#4fc3f7", marginBottom: 16 }}>📌 Continue Learning</h2>

      {modulesLoading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#8aa4c0" }}>
          ⏳ Loading modules...
        </div>
      ) : modules.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#8aa4c0" }}>
          <p>No modules available yet. An admin needs to create modules first.</p>
        </div>
      ) : (
        <div className="module-grid">
          {modules.map((mod) => {
            const progress = getModuleProgress(mod.id);
            const pct = progress.passed
              ? 100
              : progress.quizAttempts > 0
              ? 50
              : 0;

            return (
              <div
                key={mod.id}
                className="module-card"
                onClick={() => navigateTo("module-detail", mod.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="module-icon">{mod.icon}</div>
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="progress-label">
                  <span>{pct}% complete</span>
                  <span>
                    {progress.passed ? (
                      <span className="badge badge-completed">
                        ✓ Completed
                      </span>
                    ) : progress.quizAttempts > 0 ? (
                      <span className="badge badge-in-progress">
                        In Progress
                      </span>
                    ) : (
                      <span className="badge badge-not-started">
                        Not Started
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}