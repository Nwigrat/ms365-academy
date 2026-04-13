import { useAppContext } from "../context/AppContext";
import { PASS_THRESHOLD } from "../data/modules";

export default function QuizResults({
  mod,
  score,
  total,
  points,
  answers,
  questions,
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
              <span style={{ color: "#9eb8d6", fontSize: "0.85rem", flex: 1 }}>
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
        </div>
      </div>
    </div>
  );
}