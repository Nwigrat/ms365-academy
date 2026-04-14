import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { getUserBadges } from "../services/api";

export default function Badges() {
  const { appState } = useAppContext();
  const [badgeData, setBadgeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserBadges(appState.user.id);
        setBadgeData(data);
      } catch (err) {
        console.error("Failed to load badges:", err);
      } finally {
        setLoading(false);
      }
    }
    if (appState.user?.id) load();
  }, [appState.user?.id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#8aa4c0" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
        <p>Loading badges...</p>
      </div>
    );
  }

  if (!badgeData) return null;

  const categories = {
    all: "All Badges",
    milestone: "Milestones",
    excellence: "Excellence",
    points: "Points",
    dedication: "Dedication",
    exploration: "Exploration",
  };

  const filtered =
    filter === "all"
      ? badgeData.badges
      : badgeData.badges.filter((b) => b.category === filter);

  const unlockedCount = badgeData.badges.filter((b) => b.unlocked).length;
  const progressPct = Math.round((unlockedCount / badgeData.totalBadges) * 100);

  return (
    <div>
      <h2 style={{ color: "#fff", marginBottom: 6, fontSize: "1.4rem" }}>🏅 Achievement Badges</h2>
      <p style={{ color: "#8aa4c0", marginBottom: 24 }}>
        Unlock badges by completing quizzes, earning points, and mastering modules.
      </p>

      {/* Progress overview */}
      <div className="card" style={{ marginBottom: 24, background: "rgba(0,120,212,0.15)", borderColor: "rgba(0,120,212,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ color: "#fff", marginBottom: 4 }}>Badge Progress</h3>
            <p style={{ color: "#8aa4c0", marginBottom: 0 }}>
              {unlockedCount} of {badgeData.totalBadges} badges unlocked
            </p>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffd54f" }}>
            {progressPct}%
          </div>
        </div>
        <div className="progress-bar-container" style={{ height: 12 }}>
          <div className="progress-bar-fill" style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #ffd54f, #ff9800)" }} />
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            className={`btn ${filter === key ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setFilter(key)}
            style={{ padding: "6px 14px", fontSize: "0.8rem" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Badge grid */}
      <div className="badge-grid">
        {filtered.map((badge) => (
          <div
            key={badge.id}
            className={`badge-card ${badge.unlocked ? "unlocked" : "locked"}`}
          >
            <div className="badge-icon-large">{badge.icon}</div>
            <h4 className="badge-name">{badge.name}</h4>
            <p className="badge-desc">{badge.description}</p>
            {badge.unlocked ? (
              <span className="badge badge-completed" style={{ marginTop: 8 }}>
                ✓ Unlocked {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : ""}
              </span>
            ) : (
              <span className="badge badge-not-started" style={{ marginTop: 8 }}>🔒 Locked</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}