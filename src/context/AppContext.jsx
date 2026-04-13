import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const STORAGE_KEY = "m365hub_state";

function getDefaultState() {
  return {
    user: null, // { id, firstName, lastName, username, displayName }
    totalScore: 0,
    moduleProgress: {},
    bestStreak: 0,
  };
}

function loadFromStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && data.user) return data;
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

  // Check if user is logged in
  const isAuthenticated = appState.user !== null;

  function login(userData) {
    setAppState((prev) => ({
      ...prev,
      user: userData,
    }));
  }

  function logout() {
    setAppState(getDefaultState());
    localStorage.removeItem(STORAGE_KEY);
    setCurrentPage("dashboard");
  }

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

      let totalScore = 0;
      Object.values(newModuleProgress).forEach((mp) => {
        totalScore += mp.bestScore || 0;
      });

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
    isAuthenticated,
    login,
    logout,
    getModuleProgress,
    updateModuleProgress,
    navigateTo,
    startQuizForModule,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}