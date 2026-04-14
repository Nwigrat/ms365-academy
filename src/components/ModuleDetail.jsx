import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { fetchModuleDetail } from "../services/api";

export default function ModuleDetail() {
  const {
    selectedModuleId,
    getModuleProgress,
    updateModuleProgress,
    navigateTo,
    startQuizForModule,
  } = useAppContext();

  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!selectedModuleId) {
        setError("No module selected");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching module detail for:", selectedModuleId);
        const data = await fetchModuleDetail(selectedModuleId);
        console.log("Module data received:", data);

        if (data.module) {
          setMod(data.module);
        } else {
          setError("Module not found in response");
        }
      } catch (err) {
        console.error("Failed to load module:", err);
        setError(err.message || "Failed to load module");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [selectedModuleId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "#8aa4c0" }}>
        ⏳ Loading module...
      </div>
    );
  }

  if (error || !mod) {
    return (
      <div>
        <div className="back-link" onClick={() => navigateTo("modules")}>
          ← Back to Modules
        </div>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚠️</div>
          <p style={{ color: "#ef9a9a", marginBottom: 16 }}>
            {error || "Module not found."}
          </p>
          <p style={{ color: "#8aa4c0", fontSize: "0.85rem", marginBottom: 16 }}>
            Module ID: "{selectedModuleId || "none"}"
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => navigateTo("modules")}
          >
            ← Back to Modules
          </button>
        </div>
      </div>
    );
  }

  const progress = getModuleProgress(mod.id);
  const resources = mod.resources || [];
  const questionCount = (mod.questions || []).length;

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
            <h3 style={{ color: "#fff", fontSize: "1.3rem" }}>
              {mod.title}
            </h3>
            <p style={{ color: "#8aa4c0" }}>{mod.description}</p>
          </div>
        </div>
      </div>

      {/* Learning Resources */}
      <div className="learning-section">
        <h2>📖 Learning Resources</h2>
        {resources.length > 0 ? (
          <ul className="resource-list">
            {resources.map((res, i) => (
              <li key={res.id || i}>
                <span className="resource-icon">{res.icon}</span>
                <div className="resource-text">
                  <strong>
                    {res.url ? (
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {res.title}
                      </a>
                    ) : (
                      res.title
                    )}
                  </strong>
                  <span>{res.description}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#8aa4c0", padding: "12px 0" }}>
            No learning resources available yet for this module.
          </p>
        )}
        {!progress.learningCompleted && resources.length > 0 && (
          <button
            className="btn btn-secondary"
            style={{ marginTop: 12 }}
            onClick={handleMarkLearningComplete}
          >
            ✅ Mark Learning as Complete
          </button>
        )}
        {progress.learningCompleted && (
          <p
            style={{
              color: "#81c784",
              marginTop: 12,
              fontWeight: 600,
            }}
          >
            ✅ Learning marked as complete!
          </p>
        )}
      </div>

      {/* Quiz Section */}
      <div className="learning-section">
        <h2>📝 Knowledge Quiz</h2>
        <div className="card">
          {questionCount > 0 ? (
            <>
              <p>
                Test your knowledge with <strong>5 random questions</strong>{" "}
                from a pool of {questionCount}. You need at least{" "}
                <strong>3 out of 5</strong> correct to pass.
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
                      <span style={{ color: "#ffd54f" }}>
                        Not yet passed
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => startQuizForModule(mod.id)}
                >
                  🚀{" "}
                  {progress.quizAttempts > 0 ? "Retry Quiz" : "Start Quiz"}
                </button>
              </div>
            </>
          ) : (
            <p style={{ color: "#8aa4c0" }}>
              📝 No quiz questions available yet for this module. An admin
              needs to add questions first.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}