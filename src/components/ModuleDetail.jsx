import { useAppContext } from "../context/AppContext";
import MODULES from "../data/modules";

export default function ModuleDetail() {
  const {
    selectedModuleId,
    getModuleProgress,
    updateModuleProgress,
    navigateTo,
    startQuizForModule,
  } = useAppContext();

  const mod = MODULES.find((m) => m.id === selectedModuleId);
  if (!mod) return <p>Module not found.</p>;

  const progress = getModuleProgress(mod.id);

  function handleMarkLearningComplete() {
    updateModuleProgress(mod.id, { learningCompleted: true });
  }

  return (
    <div>
      <div className="back-link" onClick={() => navigateTo("modules")}>
        ← Back to Modules
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: "2.5rem" }}>{mod.icon}</div>
          <div>
            <h3 style={{ color: "#fff", fontSize: "1.3rem" }}>{mod.title}</h3>
            <p style={{ color: "#8aa4c0" }}>{mod.description}</p>
          </div>
        </div>
      </div>

      {/* Learning Resources */}
      <div className="learning-section">
        <h2>📖 Learning Resources</h2>
        <ul className="resource-list">
          {mod.resources.map((res, i) => (
            <li key={i}>
              <span className="resource-icon">{res.icon}</span>
              <div className="resource-text">
                <strong>
                  <a href={res.url} target="_blank" rel="noopener noreferrer">
                    {res.title}
                  </a>
                </strong>
                <span>{res.desc}</span>
              </div>
            </li>
          ))}
        </ul>
        {!progress.learningCompleted && (
          <button
            className="btn btn-secondary"
            style={{ marginTop: 12 }}
            onClick={handleMarkLearningComplete}
          >
            ✅ Mark Learning as Complete
          </button>
        )}
        {progress.learningCompleted && (
          <p style={{ color: "#81c784", marginTop: 12, fontWeight: 600 }}>
            ✅ Learning marked as complete!
          </p>
        )}
      </div>

      {/* Quiz Section */}
      <div className="learning-section">
        <h2>📝 Knowledge Quiz</h2>
        <div className="card">
          <p>
            Test your knowledge with <strong>5 random questions</strong> from a
            pool of 15. You need at least <strong>3 out of 5</strong> correct to
            pass.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ color: "#8aa4c0", fontSize: "0.9rem" }}>
              <div>Attempts: {progress.quizAttempts}</div>
              <div>Best Score: {progress.bestScore} pts</div>
              <div>
                Status:{" "}
                {progress.passed ? (
                  <span style={{ color: "#81c784" }}>✅ Passed</span>
                ) : (
                  <span style={{ color: "#ffd54f" }}>Not yet passed</span>
                )}
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => startQuizForModule(mod.id)}
            >
              🚀 {progress.quizAttempts > 0 ? "Retry Quiz" : "Start Quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}