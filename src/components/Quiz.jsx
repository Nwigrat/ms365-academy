import { useState, useMemo, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import MODULES, {
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
  const { quizModuleId, navigateTo, getModuleProgress, updateModuleProgress } =
    useAppContext();

  const mod = MODULES.find((m) => m.id === quizModuleId);

  // Select 5 random questions on mount
  const questions = useMemo(() => {
    if (!mod) return [];
    return shuffleArray(mod.questions).slice(0, QUIZ_QUESTION_COUNT);
  }, [quizModuleId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  if (!mod) return <p>Module not found.</p>;

  const currentQ = questions[currentIndex];
  const score = answers.filter((a) => a.isCorrect).length;

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

  function handleNext() {
    if (currentIndex + 1 >= QUIZ_QUESTION_COUNT) {
      // Calculate final results
      const finalAnswers = [
        ...answers,
      ];
      const finalScore = finalAnswers.filter((a) => a.isCorrect).length;
      const points =
        finalScore * POINTS_PER_CORRECT +
        (finalScore === QUIZ_QUESTION_COUNT ? BONUS_PERFECT : 0);
      const passed = finalScore >= PASS_THRESHOLD;

      const progress = getModuleProgress(mod.id);
      const newData = {
        quizAttempts: progress.quizAttempts + 1,
        lastAttempt: new Date().toISOString(),
      };
      if (points > progress.bestScore) newData.bestScore = points;
      if (passed && !progress.passed) newData.passed = true;

      updateModuleProgress(mod.id, newData);
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

  if (showResults) {
    const finalScore = answers.filter((a) => a.isCorrect).length;
    const points =
      finalScore * POINTS_PER_CORRECT +
      (finalScore === QUIZ_QUESTION_COUNT ? BONUS_PERFECT : 0);
    return (
      <QuizResults
        mod={mod}
        score={finalScore}
        total={QUIZ_QUESTION_COUNT}
        points={points}
        answers={answers}
        questions={questions}
      />
    );
  }

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
              {mod.icon} {mod.title} Quiz
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
              {qNum < QUIZ_QUESTION_COUNT ? "Next Question →" : "See Results →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}