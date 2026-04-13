import { useAppContext } from "../context/AppContext";
import MODULES from "../data/modules";

export default function Modules() {
  const { getModuleProgress, navigateTo } = useAppContext();

  return (
    <div>
      <h2 style={{ color: "#fff", marginBottom: 6, fontSize: "1.4rem" }}>
        📚 All Learning Modules
      </h2>
      <p style={{ color: "#8aa4c0", marginBottom: 24 }}>
        Complete each module's learning resources, then test your knowledge with
        a quiz.
      </p>
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
                <span>Best: {progress.bestScore} pts</span>
                <span>Attempts: {progress.quizAttempts}</span>
              </div>
              <div style={{ marginTop: 8 }}>
                {progress.passed ? (
                  <span className="badge badge-completed">✓ Completed</span>
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