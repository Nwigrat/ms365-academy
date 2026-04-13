import { useAppContext } from "../context/AppContext";

const tabs = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "modules", label: "📚 Modules" },
  { id: "leaderboard", label: "🏆 Leaderboard" },
  { id: "profile", label: "👤 Profile" },
];

export default function NavTabs() {
  const { currentPage, navigateTo } = useAppContext();

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