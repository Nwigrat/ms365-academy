import { useAppContext } from "../context/AppContext";

const SIMULATED_OTHERS = [
  { name: "Sarah Johnson", score: 480, modules: 5 },
  { name: "Mike Chen", score: 420, modules: 4 },
  { name: "Priya Patel", score: 380, modules: 4 },
  { name: "Carlos Rodriguez", score: 320, modules: 3 },
  { name: "Emma Williams", score: 280, modules: 3 },
  { name: "James O'Brien", score: 240, modules: 2 },
  { name: "Aisha Khan", score: 200, modules: 2 },
  { name: "David Kim", score: 160, modules: 2 },
  { name: "Lisa Thompson", score: 100, modules: 1 },
  { name: "Ryan Murphy", score: 60, modules: 1 },
];

export default function Leaderboard() {
  const { appState } = useAppContext();

  const completedModules = Object.values(appState.moduleProgress).filter(
    (p) => p.passed
  ).length;

  const allEntries = [
    ...SIMULATED_OTHERS,
    {
      name: appState.userName || "You",
      score: appState.totalScore,
      modules: completedModules,
      isCurrentUser: true,
    },
  ].sort((a, b) => b.score - a.score);

  function getRankClass(rank) {
    if (rank === 1) return "rank-1";
    if (rank === 2) return "rank-2";
    if (rank === 3) return "rank-3";
    return "rank-other";
  }

  function getRankEmoji(rank) {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  }

  return (
    <div>
      <h2 style={{ color: "#fff", marginBottom: 6, fontSize: "1.4rem" }}>
        🏆 Leaderboard
      </h2>
      <p style={{ color: "#8aa4c0", marginBottom: 24 }}>
        See how you stack up against other agents.
      </p>

      {/* Current user summary card */}
      <div
        className="card"
        style={{
          background: "rgba(0,120,212,0.15)",
          borderColor: "rgba(0,120,212,0.3)",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h3 style={{ color: "#fff", marginBottom: 4 }}>
              Your Position
            </h3>
            <p style={{ color: "#8aa4c0", marginBottom: 0 }}>
              {appState.totalScore} points · {completedModules} module
              {completedModules !== 1 ? "s" : ""} completed
            </p>
          </div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#ffd54f",
            }}
          >
            #{allEntries.findIndex((e) => e.isCurrentUser) + 1}
          </div>
        </div>
      </div>

      {/* Leaderboard table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Agent</th>
              <th>Score</th>
              <th>Modules</th>
            </tr>
          </thead>
          <tbody>
            {allEntries.map((entry, i) => {
              const rank = i + 1;
              return (
                <tr
                  key={i}
                  style={
                    entry.isCurrentUser
                      ? {
                          background: "rgba(0,120,212,0.15)",
                          borderLeft: "3px solid #4fc3f7",
                        }
                      : {}
                  }
                >
                  <td>
                    <span className={`rank-badge ${getRankClass(rank)}`}>
                      {rank}
                    </span>
                    {getRankEmoji(rank) && (
                      <span style={{ marginLeft: 6 }}>
                        {getRankEmoji(rank)}
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      fontWeight: entry.isCurrentUser ? 700 : 400,
                      color: entry.isCurrentUser ? "#4fc3f7" : "#e0e6ed",
                    }}
                  >
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: "0.75rem",
                          background: "rgba(79,195,247,0.2)",
                          color: "#4fc3f7",
                          padding: "2px 8px",
                          borderRadius: 10,
                          fontWeight: 600,
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      fontWeight: 600,
                      color: entry.isCurrentUser ? "#ffd54f" : "#e0e6ed",
                    }}
                  >
                    {entry.score} pts
                  </td>
                  <td>
                    <span style={{ color: "#8aa4c0" }}>
                      {entry.modules}/{6}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Motivational message */}
      <div
        style={{
          textAlign: "center",
          marginTop: 24,
          padding: "20px",
          color: "#8aa4c0",
          fontSize: "0.9rem",
        }}
      >
        {appState.totalScore === 0 ? (
          <p>
            🚀 Complete your first module quiz to get on the board!
          </p>
        ) : allEntries.findIndex((e) => e.isCurrentUser) === 0 ? (
          <p>
            👑 You're in first place! Keep up the amazing work!
          </p>
        ) : (
          <p>
            💪 Keep learning and completing quizzes to climb the ranks!
            You need{" "}
            <strong style={{ color: "#ffd54f" }}>
              {allEntries[allEntries.findIndex((e) => e.isCurrentUser) - 1]
                .score - appState.totalScore}{" "}
              more points
            </strong>{" "}
            to move up one spot.
          </p>
        )}
      </div>
    </div>
  );
}