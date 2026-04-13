import { useAppContext } from "../context/AppContext";

export default function Header() {
  const { appState, logout } = useAppContext();

  const displayName = appState.user?.displayName || "Agent";
  const initials = appState.user
    ? `${appState.user.firstName?.[0] || ""}${appState.user.lastName?.[0] || ""}`
        .toUpperCase()
    : "?";

  return (
    <header className="header">
      <h1>
        📘 M365 Learning <span>Hub</span>
      </h1>
      <div className="header-right">
        <div className="score-badge">⭐ {appState.totalScore} pts</div>
        <div className="user-info">
          <div className="avatar">{initials}</div>
          <span style={{ fontWeight: 600, color: "#fff", fontSize: "0.9rem" }}>
            {displayName}
          </span>
        </div>
        <button
          className="btn-logout"
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              logout();
            }
          }}
          title="Log out"
        >
          🚪 Logout
        </button>
      </div>
    </header>
  );
}