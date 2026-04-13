import { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function NameModal() {
  const { appState, setUserName } = useAppContext();
  const [name, setName] = useState("");

  if (appState.userName) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) setUserName(name.trim());
  }

  return (
    <div className="modal-overlay">
      <form className="modal-box" onSubmit={handleSubmit}>
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎓</div>
        <h2>Welcome to M365 Learning Hub</h2>
        <p>Enter your name to get started</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name..."
          maxLength={40}
          autoFocus
        />
        <br />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: 14 }}
        >
          🚀 Start Learning
        </button>
      </form>
    </div>
  );
}