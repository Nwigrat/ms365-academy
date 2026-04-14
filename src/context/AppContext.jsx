import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext();
const STORAGE_KEY = "m365hub_state";
const API_BASE = "/api";

function getDefaultState() {
  return { user: null, totalScore: 0, moduleProgress: {}, bestStreak: 0 };
}

function loadFromStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && data.user && data.user.id && data.user.username) return data;
  } catch (e) {}
  localStorage.removeItem(STORAGE_KEY);
  return getDefaultState();
}

export function AppProvider({ children }) {
  const [appState, setAppState] = useState(loadFromStorage);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [quizModuleId, setQuizModuleId] = useState(null);
  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [dbStats, setDbStats] = useState(null);
  const [dbStatsLoading, setDbStatsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  // Load modules
  const loadModules = useCallback(async () => {
    setModulesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/content`);
      const data = await res.json();
      setModules(data.modules || []);
    } catch (err) {
      console.error("Failed to load modules:", err);
      setModules([]);
    } finally {
      setModulesLoading(false);
    }
  }, []);

  // Load user stats from DB
  const loadDbStats = useCallback(async () => {
    if (!appState.user?.id) return;
    setDbStatsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/scores?action=user-stats&userId=${appState.user.id}`
      );
      const data = await res.json();
      console.log("DB stats loaded:", data);
      setDbStats(data);

      // Sync local moduleProgress with DB data
      if (data.moduleProgress && data.moduleProgress.length > 0) {
        setAppState((prev) => {
          const newProgress = { ...prev.moduleProgress };
          data.moduleProgress.forEach((mp) => {
            newProgress[mp.module_id] = {
              learningCompleted: prev.moduleProgress[mp.module_id]?.learningCompleted || false,
              quizAttempts: mp.quiz_attempts,
              bestScore: mp.best_score,
              passed: mp.passed,
              lastAttempt: mp.last_attempt,
            };
          });
          return {
            ...prev,
            moduleProgress: newProgress,
            totalScore: data.totalScore,
            bestStreak: Math.max(prev.bestStreak, data.modulesCompleted),
          };
        });
      }
    } catch (err) {
      console.error("Failed to load DB stats:", err);
    } finally {
      setDbStatsLoading(false);
    }
  }, [appState.user?.id]);

  useEffect(() => {
    if (appState.user) {
      loadModules();
      loadDbStats();
    } else {
      setModules([]);
      setDbStats(null);
    }
  }, [appState.user, loadModules, loadDbStats]);

  const isAuthenticated = appState.user !== null;

  function login(userData) {
    setAppState((prev) => ({ ...prev, user: userData }));
  }

  function logout() {
    setAppState(getDefaultState());
    localStorage.removeItem(STORAGE_KEY);
    setCurrentPage("dashboard");
    setModules([]);
    setDbStats(null);
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

  async function refreshModules() { await loadModules(); }
  async function refreshStats() { await loadDbStats(); }

  const value = {
    appState, currentPage, selectedModuleId, quizModuleId,
    modules, modulesLoading, dbStats, dbStatsLoading,
    isAuthenticated,
    login, logout, getModuleProgress, updateModuleProgress,
    navigateTo, startQuizForModule, refreshModules, refreshStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}