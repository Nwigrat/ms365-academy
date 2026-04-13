import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const STORAGE_KEY = "m365hub_state";

function getDefaultState() {
  return {
    userName: "",
    totalScore: 0,
    moduleProgress: {},
    bestStreak: 0,
  };
}

function loadFromStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && data.userName) return data;
  } catch (e) {
    /* ignore */
  }
  return getDefaultState();
}

export function AppProvider({ children }) {
  const [appState, setAppState] = useState(loadFromStorage);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [quizModuleId, setQuizModuleId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  function getModuleProgress(moduleId) {
    return (
      appState.moduleProgress[moduleId] || {
        learningCompleted: false,
        quizAttempts: 0,
        bestScore: 0,
        passed: false,
        lastAttempt: null,
      }
    );
  }

  function updateModuleProgress(moduleId, updates) {
    setAppState((prev) => {
      const existing = prev.moduleProgress[moduleId] || {
        learningCompleted: false,
        quizAttempts: 0,
        bestScore: 0,
        passed: false,
        lastAttempt: null,
      };
      const updated = { ...existing, ...updates };
      const newModuleProgress = {
        ...prev.moduleProgress,
        [moduleId]: updated,
      };

      // Recalculate total score
      let totalScore = 0;
      Object.values(newModuleProgress).forEach((mp) => {
        totalScore += mp.bestScore || 0;
      });

      // Recalculate streak
      const passedCount = Object.values(newModuleProgress).filter(
        (mp) => mp.passed
      ).length;

      return {
        ...prev,
        moduleProgress: newModuleProgress,
        totalScore,
        bestStreak: Math.max(prev.bestStreak, passedCount),
      };
    });
  }

  function setUserName(name) {
    setAppState((prev) => ({ ...prev, userName: name }));
  }

  function navigateTo(page, moduleId = null) {
    setCurrentPage(page);
    if (moduleId) setSelectedModuleId(moduleId);
  }

  function startQuizForModule(moduleId) {
    setQuizModuleId(moduleId);
    setCurrentPage("quiz");
  }

  const value = {
    appState,
    currentPage,
    selectedModuleId,
    quizModuleId,
    getModuleProgress,
    updateModuleProgress,
    setUserName,
    navigateTo,
    startQuizForModule,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}