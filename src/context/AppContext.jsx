import { createContext, useContext, useState, useEffect } from "react";
import { fetchModules } from "../services/api";

const AppContext = createContext();
const STORAGE_KEY = "m365hub_state";

function getDefaultState() {
  return { user: null, totalScore: 0, moduleProgress: {}, bestStreak: 0 };
}

function loadFromStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // Validate the data has the new structure
    if (data && data.user && data.user.id && data.user.username) {
      return data;
    }
  } catch (e) {
    /* ignore */
  }
  // Clear invalid/old data
  localStorage.removeItem(STORAGE_KEY);
  return getDefaultState();
}

export function AppProvider({ children }) {
  const [appState, setAppState] = useState(loadFromStorage);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [quizModuleId, setQuizModuleId] = useState(null);
  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  // Load modules from API when user is authenticated
  useEffect(() => {
    if (appState.user) {
      loadModules();
    } else {
      setModules([]);
      setModulesLoading(false);
    }
  }, [appState.user]);

  async function loadModules() {
    setModulesLoading(true);
    try {
      const data = await fetchModules();
      setModules(data.modules || []);
    } catch (err) {
      console.error("Failed to load modules:", err);
      setModules([]);
    } finally {
      setModulesLoading(false);
    }
  }

  async function refreshModules() {
    await loadModules();
  }

  const isAuthenticated = appState.user !== null;

  function login(userData) {
    setAppState((prev) => ({ ...prev, user: userData }));
  }

  function logout() {
    setAppState(getDefaultState());
    localStorage.removeItem(STORAGE_KEY);
    setCurrentPage("dashboard");
    setModules([]);
  }

  function getModuleProgress(moduleId) {
    return appState.moduleProgress[moduleId] || {
      learningCompleted: false, quizAttempts: 0, bestScore: 0, passed: false, lastAttempt: null,
    };
  }

  function updateModuleProgress(moduleId, updates) {
    setAppState((prev) => {
      const existing = prev.moduleProgress[moduleId] || {
        learningCompleted: false, quizAttempts: 0, bestScore: 0, passed: false, lastAttempt: null,
      };
      const updated = { ...existing, ...updates };
      const newModuleProgress = { ...prev.moduleProgress, [moduleId]: updated };

      let totalScore = 0;
      Object.values(newModuleProgress).forEach((mp) => { totalScore += mp.bestScore || 0; });
      const passedCount = Object.values(newModuleProgress).filter((mp) => mp.passed).length;

      return { ...prev, moduleProgress: newModuleProgress, totalScore, bestStreak: Math.max(prev.bestStreak, passedCount) };
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
    appState, currentPage, selectedModuleId, quizModuleId,
    modules, modulesLoading, isAuthenticated,
    login, logout, getModuleProgress, updateModuleProgress,
    navigateTo, startQuizForModule, refreshModules,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}