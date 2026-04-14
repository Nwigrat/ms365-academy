import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { fetchModuleDetail, submitScore, checkBadges } from "../services/api";
import {
  QUIZ_QUESTION_COUNT,
  PASS_THRESHOLD,
  POINTS_PER_CORRECT,
  BONUS_PERFECT,
} from "../data/modules";
import QuizResults from "./QuizResults";

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz() {
  const {
    quizModuleId,
    navigateTo,
    appState,
    getModuleProgress,
    updateModuleProgress,
    refreshStats,
  } = useAppContext();

  const [moduleData, setModuleData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingModule, setLoadingModule] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [newBadges, setNewBadges] = useState([]);

  // Fetch module and questions from the database
  useEffect(() => {
    async function loadQuiz() {
      setLoadingModule(true);
      try {
        const data = await fetchModuleDetail(quizModuleId);
        const mod = data.module;
        setModuleData(mod);

        // Pick 5 random questions from the pool
        const allQuestions = mod.questions || [];
        const shuffled = shuffleArray(allQuestions);
        const selected = shuffled.slice(0, QUIZ_QUESTION_COUNT);
        setQuestions(selected);
      } catch (err) {
        console.error("Failed to load quiz:", err);
      } finally {
        setLoadingModule(false);
      }
    }

    if (quizModuleId) {
      // Reset state for new quiz
      setCurrentIndex(0);
      setSelectedOption(null);
      setAnswered(false);
      setAnswers([]);
      setShowResults(false);
      setNewBadges([]);
      loadQuiz();
    }
  }, [quizModuleId]);

  // Loading state
  if (loadingModule) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#8aa4c0" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  // No module or questions found
  if (!moduleData || questions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#ef9a9a" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚠️</div>
        <p>No questions available for this module.</p>
        <button
          className="btn btn-secondary"
          onClick={() => navigateTo("modules")}
          style={{ marginTop: 16 }}
        >
          ← Back to Modules
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  function handleSelect(index) {
    if (answered) return;
    setSelectedOption(index);
    setAnswered(true);

    const isCorrect = index === currentQ.a;
    setAnswers((prev) => [
      ...prev,
      { selected: index, correct: currentQ.a, isCorrect },
    ]);
  }

  async function handleNext() {
    if (currentIndex + 1 >= QUIZ_QUESTION_COUNT) {
      // Calculate final results
      const finalAnswers = [...answers];
      const finalScore = finalAnswers.filter((a) => a.isCorrect).length;
      const points =
        finalScore * POINTS_PER_CORRECT +
        (finalScore === QUIZ_QUESTION_COUNT ? BONUS_PERFECT : 0);
      const passed = finalScore >= PASS_THRESHOLD;

      // Update local state
      const progress = getModuleProgress(moduleData.id);
      const newData = {
        quizAttempts: progress.quizAttempts + 1,
        lastAttempt: new Date().toISOString(),
      };
      if (points > progress.bestScore) newData.bestScore = points;
      if (passed && !progress.passed) newData.passed = true;
      updateModuleProgress(moduleData.id, newData);

      // ===== SEND SCORE TO DATABASE =====
      try {
        await submitScore(appState.user.id, moduleData.id, points, passed);
        console.log("Score submitted to database successfully");
      } catch (err) {
        console.error("Failed to submit score to database:", err);
      }

      // ===== CHECK FOR NEW BADGES =====
      try {
        const badgeResult = await checkBadges(appState.user.id);
        if (badgeResult.newlyUnlocked && badgeResult.newlyUnlocked.length > 0) {
          console.log("New badges unlocked!", badgeResult.newlyUnlocked);
          setNewBadges(badgeResult.newlyUnlocked);
        }
      } catch (err) {
        console.error("Failed to check badges:", err);
      }
      // ===== REFRESH DB STATS =====
      try {
        await refreshStats();
      } catch (err) {
        console.error("Failed to refresh stats:", err);
      }

      setShowResults(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  }

  function handleLeaveQuiz() {
    if (
      !answered &&
      currentIndex < QUIZ_QUESTION_COUNT &&
      !window.confirm(
        "Are you sure you want to leave? Your quiz progress will be lost."
      )
    )
      return;
    navigateTo("modules");
  }

  // Show results screen
  if (showResults) {
    const finalScore = answers.filter((a) => a.isCorrect).length;
    const points =
      finalScore * POINTS_PER_CORRECT +
      (finalScore === QUIZ_QUESTION_COUNT ? BONUS_PERFECT : 0);
    return (
      <QuizResults
        mod={moduleData}
        score={finalScore}
        total={QUIZ_QUESTION_COUNT}
        points={points}
        answers={answers}
        questions={questions}
        newBadges={newBadges}
      />
    );
  }

  // Quiz question screen
  const qNum = currentIndex + 1;

  return (
    <div>
      <div className="back-link" onClick={handleLeaveQuiz}>
        ← Leave Quiz
      </div>

      <div className="quiz-container">
        <div className="quiz-header">
          <div>
            <h2 style={{ color: "#fff", fontSize: "1.2rem" }}>
              {moduleData.icon} {moduleData.title} Quiz
            </h2>
          </div>
          <div className="quiz-progress">
            Question {qNum} of {QUIZ_QUESTION_COUNT}
          </div>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(qNum / QUIZ_QUESTION_COUNT) * 100}%` }}
          />
        </div>

        <div className="question-card">
          <h3>
            Q{qNum}. {currentQ.q}
          </h3>
          <div className="options">
            {currentQ.o.map((opt, i) => {
              let className = "option-btn";
              if (answered) {
                className += " disabled";
                if (i === currentQ.a) className += " correct";
                if (i === selectedOption && i !== currentQ.a)
                  className += " incorrect";
                if (i === selectedOption) className += " selected";
              } else if (i === selectedOption) {
                className += " selected";
              }

              return (
                <button
                  key={i}
                  className={className}
                  onClick={() => handleSelect(i)}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              );
            })}
          </div>

          {answered && (
            <div
              className={`feedback ${
                selectedOption === currentQ.a ? "correct" : "incorrect"
              }`}
            >
              {selectedOption === currentQ.a
                ? "✅ Correct! Well done."
                : `❌ Incorrect. The correct answer was: ${String.fromCharCode(
                    65 + currentQ.a
                  )}. ${currentQ.o[currentQ.a]}`}
            </div>
          )}
        </div>

        {answered && (
          <div style={{ textAlign: "right", marginTop: 12 }}>
            <button className="btn btn-primary" onClick={handleNext}>
              {qNum < QUIZ_QUESTION_COUNT
                ? "Next Question →"
                : "See Results →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}