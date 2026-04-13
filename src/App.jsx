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

function AppContent() {
  const { currentPage, isAuthenticated } = useAppContext();

  // If not logged in, show the auth page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  function renderPage() {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "modules":
        return <Modules />;
      case "module-detail":
        return <ModuleDetail />;
      case "quiz":
        return <Quiz />;
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
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