import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { loginUser, registerUser } from "../services/api";

export default function AuthPage() {
  const { login } = useAppContext();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  function switchMode() {
    setIsLoginMode(!isLoginMode);
    setError("");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!loginUsername.trim() || !loginPassword) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(loginUsername.trim(), loginPassword);
      login(data.user);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!regFirstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!regLastName.trim()) {
      setError("Last name is required");
      return;
    }
    if (!regUsername.trim()) {
      setError("Username is required");
      return;
    }
    if (regUsername.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(
        regFirstName.trim(),
        regLastName.trim(),
        regUsername.trim(),
        regPassword
      );
      login(data.user);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left side - Branding */}
        <div className="auth-branding">
          <div className="auth-logo">📘</div>
          <h1>
            M365 Learning <span>Hub</span>
          </h1>
          <p>
            Master Microsoft 365 through interactive learning modules, quizzes,
            and friendly competition.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <span>📚</span>
              <span>6 Learning Modules</span>
            </div>
            <div className="auth-feature">
              <span>📝</span>
              <span>90 Quiz Questions</span>
            </div>
            <div className="auth-feature">
              <span>🏆</span>
              <span>Live Leaderboard</span>
            </div>
            <div className="auth-feature">
              <span>⭐</span>
              <span>Earn Points & Badges</span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-form-container">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLoginMode ? "active" : ""}`}
              onClick={() => switchMode()}
              disabled={isLoginMode}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${!isLoginMode ? "active" : ""}`}
              onClick={() => switchMode()}
              disabled={!isLoginMode}
            >
              Register
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {isLoginMode ? (
            /* ===== LOGIN FORM ===== */
            <form onSubmit={handleLogin} className="auth-form">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your learning journey</p>

              <div className="form-group">
                <label htmlFor="loginUsername">Username</label>
                <input
                  id="loginUsername"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <input
                  id="loginPassword"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? "⏳ Signing in..." : "🚀 Sign In"}
              </button>

              <p className="auth-switch">
                Don't have an account?{" "}
                <span onClick={switchMode} className="auth-link">
                  Register here
                </span>
              </p>
            </form>
          ) : (
            /* ===== REGISTER FORM ===== */
            <form onSubmit={handleRegister} className="auth-form">
              <h2>Create Account</h2>
              <p>Join the M365 Learning Hub</p>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="regFirstName">First Name</label>
                  <input
                    id="regFirstName"
                    type="text"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="John"
                    maxLength={40}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="regLastName">Last Name</label>
                  <input
                    id="regLastName"
                    type="text"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Doe"
                    maxLength={40}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="regUsername">Username</label>
                <input
                  id="regUsername"
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Choose a unique username"
                  maxLength={40}
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="regPassword">Password</label>
                <input
                  id="regPassword"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="regConfirmPassword">Confirm Password</label>
                <input
                  id="regConfirmPassword"
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? "⏳ Creating account..." : "🎓 Create Account"}
              </button>

              <p className="auth-switch">
                Already have an account?{" "}
                <span onClick={switchMode} className="auth-link">
                  Sign in here
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}