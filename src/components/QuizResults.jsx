import { useAppContext } from "../context/AppContext";
import { PASS_THRESHOLD } from "../data/modules";

export default function QuizResults({
  mod,
  score,
  total,
  points,
  answers,
  questions,
  newBadges = [],
}) {
  const { navigateTo, startQuizForModule } = useAppContext();
  const passed = score >= PASS_THRESHOLD;

  return (
    <div className="quiz-container">
      <div className="results-card">
        <div style={{ fontSize: "3rem" }}>{passed ? "🎉" : "📚"}</div>
        <h2 style={{ color: "#fff", marginTop: 12 }}>
          {passed ? "Quiz Passed!" : "Not Quite Yet"}
        </h2>
        <div className={`results-score ${passed ? "pass" : "fail"}`}>
          {score}/{total}
        </div>
        <p className="results-message">
          {passed ? (
            <>
              Great job! You earned{" "}
              <strong style={{ color: "#ffd54f" }}>{points} points</strong>!
              {score === total && " 🌟 Perfect score bonus!"}
            </>
          ) : (
            `You need at least ${PASS_THRESHOLD}/${total} to pass. Review the learning materials and try again!`
          )}
        </p>

        {/* New badges unlocked */}
        {newBadges.length > 0 && (
          <div
            style={{
              background: "rgba(255,213,79,0.1)",
              border: "1px solid rgba(255,213,79,0.3)",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 20,
              maxWidth: 500,
              margin: "0 auto 20px",
            }}
          >
            <h3
              style={{
                color: "#ffd54f",
                fontSize: "1rem",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              🏅 New Badges Unlocked!
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {newBadges.map((badge) => (
                <div
                  key={badge.id}
                  style={{
                    background: "rgba(255,213,79,0.1)",
                    borderRadius: 10,
                    padding: "12px 16px",
                    textAlign: "center",
                    minWidth: 120,
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: 4 }}>
                    {badge.icon}
                  </div>
                  <div
                    style={{
                      color: "#ffd54f",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    {badge.name}
                  </div>
                  <div
                    style={{
                      color: "#8aa4c0",
                      fontSize: "0.7rem",
                      marginTop: 2,
                    }}
                  >
                    {badge.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer summary */}
        <div
          style={{ textAlign: "left", maxWidth: 500, margin: "0 auto 20px" }}
        >
          {questions.map((qData, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                marginBottom: 6,
                borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>
                {answers[i].isCorrect ? "✅" : "❌"}
              </span>
              <span
                style={{ color: "#9eb8d6", fontSize: "0.85rem", flex: 1 }}
              >
                Q{i + 1}:{" "}
                {answers[i].isCorrect
                  ? "Correct"
                  : `Incorrect — Answer: ${String.fromCharCode(
                      65 + answers[i].correct
                    )}`}
              </span>
            </div>
          ))}
        </div>

        <div className="btn-group" style={{ justifyContent: "center" }}>
          <button
            className="btn btn-secondary"
            onClick={() => startQuizForModule(mod.id)}
          >
            🔄 Retry Quiz
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigateTo("module-detail", mod.id)}
          >
            📖 Back to Module
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigateTo("dashboard")}
          >
            🏠 Dashboard
          </button>
          {newBadges.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => navigateTo("badges")}
              style={{
                borderColor: "rgba(255,213,79,0.3)",
                color: "#ffd54f",
              }}
            >
              🏅 View All Badges
            </button>
          )}
        </div>
      </div>
    </div>
  );
}