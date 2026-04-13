import { useAppContext } from "../context/AppContext";

export default function NavTabs() {
  const { currentPage, navigateTo, appState } = useAppContext();

  const isAdmin = appState.user?.role === "admin";

  const tabs = [
    { id: "dashboard", label: "🏠 Dashboard" },
    { id: "modules", label: "📚 Modules" },
    { id: "leaderboard", label: "🏆 Leaderboard" },
    { id: "profile", label: "👤 Profile" },
  ];

  // Add admin tab if user is admin
  if (isAdmin) {
    tabs.push({ id: "admin", label: "🛡️ Admin" });
  }

  return (
    <div className="nav-tabs">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`nav-tab ${currentPage === tab.id ? "active" : ""}`}
          onClick={() => navigateTo(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}