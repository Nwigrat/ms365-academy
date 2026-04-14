import { AppProvider, useAppContext } from "./context/AppContext";
import AuthPage from "./components/AuthPage";
import Header from "./components/Header";
import NavTabs from "./components/NavTabs";
import Dashboard from "./components/Dashboard";
import Modules from "./components/Modules";
import ModuleDetail from "./components/ModuleDetail";
import Quiz from "./components/Quiz";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";
import Badges from "./components/Badges";
import AdminPanel from "./components/AdminPanel";
import AdminAnalytics from "./components/AdminAnalytics";

function AppContent() {
  const { currentPage, isAuthenticated, appState } = useAppContext();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  function renderPage() {
    switch (currentPage) {
      case "dashboard": return <Dashboard />;
      case "modules": return <Modules />;
      case "module-detail": return <ModuleDetail />;
      case "quiz": return <Quiz />;
      case "leaderboard": return <Leaderboard />;
      case "profile": return <Profile />;
      case "badges": return <Badges />;
      case "admin": return appState.user?.role === "admin" ? <AdminPanel /> : <Dashboard />;
      case "admin-analytics": return appState.user?.role === "admin" ? <AdminAnalytics /> : <Dashboard />;
      default: return <Dashboard />;
    }
  }

  return (
    <>
      <Header />
      <NavTabs />
      <div className="container">{renderPage()}</div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}