import { useAppContext } from "../context/AppContext";
import MODULES from "../data/modules";

export default function Profile() {
  const { appState, getModuleProgress } = useAppContext();

  const user = appState.user;
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "?";

  const completedCount = Object.values(appState.moduleProgress).filter(
    (p) => p.passed
  ).length;

  let rank = "Beginner";
  if (completedCount >= 6) rank = "M365 Master 🏆";
  else if (completedCount >= 4) rank = "Advanced ⭐";
  else if (completedCount >= 2) rank = "Intermediate 📘";

  return (
    <div>
      <h2 style={{ color: "#fff", marginBottom: 20, fontSize: "1.4rem" }}>
        👤 Your Profile
      </h2>
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div
            className="avatar"
            style={{ width: 60, height: 60, fontSize: "1.5rem" }}
          >
            {initials}
          </div>
          <div>
            <h3 style={{ color: "#fff" }}>
              {user?.displayName || "Agent"}
            </h3>
            <p style={{ color: "#8aa4c0", fontSize: "0.85rem", marginBottom: 4 }}>
              @{user?.username || "unknown"}
            </p>
            <span className="badge badge-in-progress">{rank}</span>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{appState.totalScore}</div>
            <div className="stat-label">Total Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{appState.bestStreak}</div>
            <div className="stat-label">Best Streak</div>
          </div>
        </div>

        <h3 style={{ color: "#4fc3f7", margin: "24px 0 12px" }}>
          📋 Module Progress
        </h3>
        {MODULES.map((mod) => {
          const progress = getModuleProgress(mod.id);
          return (
            <div
              key={mod.id}
              style={{
                padding: "12px 16px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div>
                <span style={{ marginRight: 8 }}>{mod.icon}</span>
                <strong style={{ color: "#e0e6ed" }}>{mod.title}</strong>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#8aa4c0", fontSize: "0.85rem" }}>
                  Best: {progress.bestScore} pts | Attempts:{" "}
                  {progress.quizAttempts}
                </span>
                {progress.passed ? (
                  <span className="badge badge-completed">✓ Passed</span>
                ) : progress.quizAttempts > 0 ? (
                  <span className="badge badge-in-progress">In Progress</span>
                ) : (
                  <span className="badge badge-not-started">Not Started</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}