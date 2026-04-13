import { useAppContext } from "../context/AppContext";

export default function Header() {
  const { appState } = useAppContext();
  const initials = appState.userName
    ? appState.userName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
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
          <span
            style={{ fontWeight: 600, color: "#fff", fontSize: "0.9rem" }}
          >
            {appState.userName || "Agent"}
          </span>
        </div>
      </div>
    </header>
  );
}