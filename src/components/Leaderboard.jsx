import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { getLeaderboard } from "../services/api";

export default function Leaderboard() {
  const { appState } = useAppContext();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await getLeaderboard();
        setEntries(data.leaderboard || []);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

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

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#8aa4c0" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#ef9a9a" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚠️</div>
        <p>{error}</p>
        <button
          className="btn btn-secondary"
          style={{ marginTop: 16 }}
          onClick={() => window.location.reload()}
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  // Find current user's position
  const currentUserIndex = entries.findIndex(
    (e) =>
      e.username?.toLowerCase() === appState.user?.username?.toLowerCase()
  );

  return (
    <div>
      <h2 style={{ color: "#fff", marginBottom: 6, fontSize: "1.4rem" }}>
        🏆 Leaderboard
      </h2>
      <p style={{ color: "#8aa4c0", marginBottom: 24 }}>
        Real-time rankings across all agents.
      </p>

      {/* Current user summary card */}
      {currentUserIndex !== -1 && (
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
              <h3 style={{ color: "#fff", marginBottom: 4 }}>Your Position</h3>
              <p style={{ color: "#8aa4c0", marginBottom: 0 }}>
                {entries[currentUserIndex]?.total_score || 0} points ·{" "}
                {entries[currentUserIndex]?.modules_completed || 0} module
                {entries[currentUserIndex]?.modules_completed !== 1
                  ? "s"
                  : ""}{" "}
                completed
              </p>
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#ffd54f",
              }}
            >
              #{currentUserIndex + 1}
            </div>
          </div>
        </div>
      )}

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
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "#8aa4c0",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>🚀</div>
                  No scores yet. Be the first to complete a quiz!
                </td>
              </tr>
            ) : (
              entries.map((entry, i) => {
                const rank = i + 1;
                const isYou =
                  entry.username?.toLowerCase() ===
                  appState.user?.username?.toLowerCase();

                return (
                  <tr
                    key={entry.id}
                    style={
                      isYou
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
                        fontWeight: isYou ? 700 : 400,
                        color: isYou ? "#4fc3f7" : "#e0e6ed",
                      }}
                    >
                      {entry.username}
                      {isYou && (
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
                        color: isYou ? "#ffd54f" : "#e0e6ed",
                      }}
                    >
                      {entry.total_score} pts
                    </td>
                    <td>
                      <span style={{ color: "#8aa4c0" }}>
                        {entry.modules_completed}/6
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
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
        {entries.length === 0 ? (
          <p>🚀 Complete your first module quiz to get on the board!</p>
        ) : currentUserIndex === 0 ? (
          <p>👑 You're in first place! Keep up the amazing work!</p>
        ) : currentUserIndex > 0 ? (
          <p>
            💪 Keep learning to climb the ranks! You need{" "}
            <strong style={{ color: "#ffd54f" }}>
              {Number(entries[currentUserIndex - 1]?.total_score || 0) -
                Number(entries[currentUserIndex]?.total_score || 0)}{" "}
              more points
            </strong>{" "}
            to move up one spot.
          </p>
        ) : (
          <p>📝 Complete a quiz to appear on the leaderboard!</p>
        )}
      </div>
    </div>
  );
}