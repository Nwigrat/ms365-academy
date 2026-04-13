import { useAppContext } from "../context/AppContext";
import MODULES from "../data/modules";

export default function Dashboard() {
  const { appState, getModuleProgress, navigateTo } = useAppContext();

  const completedCount = Object.values(appState.moduleProgress).filter(
    (p) => p.passed
  ).length;
  const quizzesPassed = completedCount;
  const displayName = appState.user?.firstName || "Agent";

  return (
    <div>
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

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{appState.totalScore}</div>
          <div className="stat-label">Total Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completedCount}</div>
          <div className="stat-label">Modules Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{quizzesPassed}</div>
          <div className="stat-label">Quizzes Passed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{appState.bestStreak}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>

      <h2 style={{ color: "#4fc3f7", marginBottom: 16 }}>📌 Continue Learning</h2>
      <div className="module-grid">
        {MODULES.map((mod) => {
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
                    <span className="badge badge-completed">✓ Completed</span>
                  ) : progress.quizAttempts > 0 ? (
                    <span className="badge badge-in-progress">In Progress</span>
                  ) : (
                    <span className="badge badge-not-started">Not Started</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}