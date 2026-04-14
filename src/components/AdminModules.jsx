import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import {
  fetchModules,
  adminCreateModule,
  adminDeleteModule,
  adminGetModuleDetail,
  adminAddQuestion,
  adminDeleteQuestion,
  adminAddResource,
  adminDeleteResource,
} from "../services/api";

export default function AdminModules() {
  const { navigateTo, refreshModules } = useAppContext();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Views: 'list' | 'create' | 'detail'
  const [view, setView] = useState("list");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Create module form
  const [newId, setNewId] = useState("");
  const [newIcon, setNewIcon] = useState("📘");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Add question form
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [qText, setQText] = useState("");
  const [qA, setQA] = useState("");
  const [qB, setQB] = useState("");
  const [qC, setQC] = useState("");
  const [qD, setQD] = useState("");
  const [qCorrect, setQCorrect] = useState(0);

  // Add resource form
  const [showAddResource, setShowAddResource] = useState(false);
  const [resIcon, setResIcon] = useState("📖");
  const [resTitle, setResTitle] = useState("");
  const [resDesc, setResDesc] = useState("");
  const [resUrl, setResUrl] = useState("");

  useEffect(() => {
    loadModules();
  }, []);

  async function loadModules() {
    setLoading(true);
    try {
      const data = await fetchModules();
      setModules(data.modules || []);
    } catch (err) {
      flash(err.message, true);
    } finally {
      setLoading(false);
    }
  }

  function flash(text, isError = false) {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 4000);
  }

  // ===== CREATE MODULE =====
  async function handleCreateModule(e) {
    e.preventDefault();
    if (!newId.trim() || !newTitle.trim()) {
      flash("Module ID and Title are required", true);
      return;
    }
    try {
      await adminCreateModule({
        id: newId.trim().toLowerCase().replace(/\s+/g, "-"),
        icon: newIcon || "📘",
        title: newTitle.trim(),
        description: newDesc.trim(),
      });
      flash("Module created successfully!");
      setNewId("");
      setNewIcon("📘");
      setNewTitle("");
      setNewDesc("");
      setView("list");
      loadModules();
      refreshModules();
    } catch (err) {
      flash(err.message, true);
    }
  }

  // ===== DELETE MODULE =====
  async function handleDeleteModule(moduleId, title) {
    if (
      !window.confirm(
        `Delete module "${title}"? This will also delete all its questions, resources, and user scores for this module.`
      )
    )
      return;
    try {
      await adminDeleteModule(moduleId);
      flash(`Module "${title}" deleted`);
      loadModules();
      refreshModules();
      if (view === "detail") setView("list");
    } catch (err) {
      flash(err.message, true);
    }
  }

  // ===== VIEW MODULE DETAIL =====
  async function openModuleDetail(moduleId) {
    setSelectedModuleId(moduleId);
    setView("detail");
    setDetailLoading(true);
    try {
      const data = await adminGetModuleDetail(moduleId);
      setSelectedModule(data.module);
    } catch (err) {
      flash(err.message, true);
    } finally {
      setDetailLoading(false);
    }
  }

  async function reloadDetail() {
    if (!selectedModuleId) return;
    try {
      const data = await adminGetModuleDetail(selectedModuleId);
      setSelectedModule(data.module);
    } catch (err) {
      flash(err.message, true);
    }
  }

  // ===== ADD QUESTION =====
  async function handleAddQuestion(e) {
    e.preventDefault();
    if (!qText || !qA || !qB || !qC || !qD) {
      flash("All question fields are required", true);
      return;
    }
    try {
      await adminAddQuestion({
        moduleId: selectedModuleId,
        questionText: qText,
        optionA: qA,
        optionB: qB,
        optionC: qC,
        optionD: qD,
        correctAnswer: qCorrect,
      });
      flash("Question added!");
      setQText("");
      setQA("");
      setQB("");
      setQC("");
      setQD("");
      setQCorrect(0);
      setShowAddQuestion(false);
      reloadDetail();
    } catch (err) {
      flash(err.message, true);
    }
  }

  // ===== DELETE QUESTION =====
  async function handleDeleteQuestion(questionId) {
    if (!window.confirm("Delete this question?")) return;
    try {
      await adminDeleteQuestion(questionId);
      flash("Question deleted");
      reloadDetail();
    } catch (err) {
      flash(err.message, true);
    }
  }

  // ===== ADD RESOURCE =====
  async function handleAddResource(e) {
    e.preventDefault();
    if (!resTitle) {
      flash("Resource title is required", true);
      return;
    }
    try {
      await adminAddResource({
        moduleId: selectedModuleId,
        icon: resIcon || "📖",
        title: resTitle,
        description: resDesc,
        url: resUrl,
      });
      flash("Resource added!");
      setResIcon("📖");
      setResTitle("");
      setResDesc("");
      setResUrl("");
      setShowAddResource(false);
      reloadDetail();
    } catch (err) {
      flash(err.message, true);
    }
  }

  // ===== DELETE RESOURCE =====
  async function handleDeleteResource(resourceId) {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await adminDeleteResource(resourceId);
      flash("Resource deleted");
      reloadDetail();
    } catch (err) {
      flash(err.message, true);
    }
  }

  // ===== RENDER =====

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#8aa4c0" }}>
        ⏳ Loading modules...
      </div>
    );
  }

  return (
    <div>
      {/* Back to admin */}
      <div className="back-link" onClick={() => navigateTo("admin")}>
        ← Back to Admin Panel
      </div>

      <h2 style={{ color: "#fff", marginBottom: 6, fontSize: "1.4rem" }}>
        📚 Module Manager
      </h2>
      <p style={{ color: "#8aa4c0", marginBottom: 24 }}>
        Create, edit, and manage learning modules and quiz questions.
      </p>

      {/* Message */}
      {message && (
        <div className={`admin-message ${message.isError ? "error" : "success"}`}>
          {message.isError ? "❌" : "✅"} {message.text}
        </div>
      )}

      {/* ===== LIST VIEW ===== */}
      {view === "list" && (
        <>
          <button
            className="btn btn-primary"
            onClick={() => setView("create")}
            style={{ marginBottom: 20 }}
          >
            ➕ Create New Module
          </button>

          <div className="module-grid">
            {modules.map((mod) => (
              <div key={mod.id} className="module-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div className="module-icon">{mod.icon}</div>
                    <h3>{mod.title}</h3>
                    <p>{mod.description}</p>
                    <div
                      style={{
                        color: "#8aa4c0",
                        fontSize: "0.8rem",
                        marginTop: 8,
                      }}
                    >
                      ID: {mod.id} · {mod.question_count || 0} questions ·{" "}
                      {mod.resource_count || 0} resources
                    </div>
                  </div>
                </div>
                <div
                  className="btn-group"
                  style={{ marginTop: 16 }}
                >
                  <button
                    className="btn btn-secondary"
                    onClick={() => openModuleDetail(mod.id)}
                    style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                  >
                    ✏️ Manage
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteModule(mod.id, mod.title)}
                    style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {modules.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 40,
                color: "#8aa4c0",
              }}
            >
              No modules yet. Create your first module!
            </div>
          )}
        </>
      )}

      {/* ===== CREATE VIEW ===== */}
      {view === "create" && (
        <div className="card">
          <h3 style={{ color: "#4fc3f7", marginBottom: 16 }}>
            ➕ Create New Module
          </h3>
          <form onSubmit={handleCreateModule}>
            <div className="form-row">
              <div className="form-group">
                <label>Module ID (lowercase, no spaces)</label>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) =>
                    setNewId(
                      e.target.value.toLowerCase().replace(/\s+/g, "-")
                    )
                  }
                  placeholder="e.g., copilot-basics"
                  required
                />
              </div>
              <div className="form-group" style={{ maxWidth: 100 }}>
                <label>Icon (emoji)</label>
                <input
                  type="text"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  placeholder="📘"
                  maxLength={4}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Microsoft Copilot Basics"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="A short description of what this module covers"
              />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-primary">
                ✅ Create Module
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setView("list")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== DETAIL VIEW ===== */}
      {view === "detail" && (
        <>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setView("list");
              setSelectedModule(null);
            }}
            style={{ marginBottom: 16 }}
          >
            ← Back to Module List
          </button>

          {detailLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: 40,
                color: "#8aa4c0",
              }}
            >
              ⏳ Loading module...
            </div>
          ) : selectedModule ? (
            <>
              {/* Module header */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: "2.5rem" }}>
                    {selectedModule.icon}
                  </span>
                  <div>
                    <h3 style={{ color: "#fff" }}>
                      {selectedModule.title}
                    </h3>
                    <p
                      style={{
                        color: "#8aa4c0",
                        marginBottom: 0,
                        fontSize: "0.9rem",
                      }}
                    >
                      ID: {selectedModule.id} ·{" "}
                      {(selectedModule.questions || []).length} questions ·{" "}
                      {(selectedModule.resources || []).length} resources
                    </p>
                  </div>
                </div>
              </div>

              {/* ===== QUESTIONS SECTION ===== */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h3 style={{ color: "#4fc3f7" }}>
                    📝 Questions (
                    {(selectedModule.questions || []).length})
                  </h3>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: "0.8rem", padding: "6px 14px" }}
                    onClick={() => setShowAddQuestion(!showAddQuestion)}
                  >
                    {showAddQuestion ? "Cancel" : "➕ Add Question"}
                  </button>
                </div>

                {/* Add question form */}
                {showAddQuestion && (
                  <form
                    onSubmit={handleAddQuestion}
                    style={{
                      background: "rgba(0,120,212,0.1)",
                      border: "1px solid rgba(0,120,212,0.2)",
                      borderRadius: 10,
                      padding: 20,
                      marginBottom: 16,
                    }}
                  >
                    <div className="form-group">
                      <label>Question Text</label>
                      <input
                        type="text"
                        value={qText}
                        onChange={(e) => setQText(e.target.value)}
                        placeholder="Enter the question..."
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Option A</label>
                        <input
                          type="text"
                          value={qA}
                          onChange={(e) => setQA(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Option B</label>
                        <input
                          type="text"
                          value={qB}
                          onChange={(e) => setQB(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Option C</label>
                        <input
                          type="text"
                          value={qC}
                          onChange={(e) => setQC(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Option D</label>
                        <input
                          type="text"
                          value={qD}
                          onChange={(e) => setQD(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Correct Answer</label>
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        {["A", "B", "C", "D"].map((letter, i) => (
                          <label
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              color:
                                qCorrect === i ? "#4fc3f7" : "#8aa4c0",
                              cursor: "pointer",
                              fontWeight:
                                qCorrect === i ? 700 : 400,
                            }}
                          >
                            <input
                              type="radio"
                              name="correct"
                              checked={qCorrect === i}
                              onChange={() => setQCorrect(i)}
                            />
                            {letter}
                          </label>
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      ✅ Add Question
                    </button>
                  </form>
                )}

                {/* Questions list */}
                {(selectedModule.questions || []).map((q, idx) => (
                  <div
                    key={q.id || idx}
                    style={{
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <strong
                          style={{
                            color: "#e0e6ed",
                            fontSize: "0.9rem",
                          }}
                        >
                          Q{idx + 1}: {q.q}
                        </strong>
                        <div
                          style={{
                            color: "#8aa4c0",
                            fontSize: "0.8rem",
                            marginTop: 6,
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "4px 16px",
                          }}
                        >
                          {q.o.map((opt, oi) => (
                            <span
                              key={oi}
                              style={{
                                color:
                                  oi === q.a
                                    ? "#81c784"
                                    : "#8aa4c0",
                                fontWeight:
                                  oi === q.a ? 600 : 400,
                              }}
                            >
                              {String.fromCharCode(65 + oi)}.{" "}
                              {opt}
                              {oi === q.a && " ✓"}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDeleteQuestion(q.id)}
                        title="Delete question"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}

                {(selectedModule.questions || []).length === 0 && (
                  <p
                    style={{
                      color: "#8aa4c0",
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    No questions yet. Add your first question!
                  </p>
                )}
              </div>

              {/* ===== RESOURCES SECTION ===== */}
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h3 style={{ color: "#4fc3f7" }}>
                    📖 Resources (
                    {(selectedModule.resources || []).length})
                  </h3>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: "0.8rem", padding: "6px 14px" }}
                    onClick={() =>
                      setShowAddResource(!showAddResource)
                    }
                  >
                    {showAddResource ? "Cancel" : "➕ Add Resource"}
                  </button>
                </div>

                {/* Add resource form */}
                {showAddResource && (
                  <form
                    onSubmit={handleAddResource}
                    style={{
                      background: "rgba(0,120,212,0.1)",
                      border: "1px solid rgba(0,120,212,0.2)",
                      borderRadius: 10,
                      padding: 20,
                      marginBottom: 16,
                    }}
                  >
                    <div className="form-row">
                      <div
                        className="form-group"
                        style={{ maxWidth: 100 }}
                      >
                        <label>Icon</label>
                        <input
                          type="text"
                          value={resIcon}
                          onChange={(e) => setResIcon(e.target.value)}
                          placeholder="📖"
                          maxLength={4}
                        />
                      </div>
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={resTitle}
                          onChange={(e) => setResTitle(e.target.value)}
                          placeholder="Resource title"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        value={resDesc}
                        onChange={(e) => setResDesc(e.target.value)}
                        placeholder="Short description"
                      />
                    </div>
                    <div className="form-group">
                      <label>URL</label>
                      <input
                        type="url"
                        value={resUrl}
                        onChange={(e) => setResUrl(e.target.value)}
                        placeholder="https://learn.microsoft.com/..."
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      ✅ Add Resource
                    </button>
                  </form>
                )}

                {/* Resources list */}
                {(selectedModule.resources || []).map((r, idx) => (
                  <div
                    key={r.id || idx}
                    style={{
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      marginBottom: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flex: 1,
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>
                        {r.icon}
                      </span>
                      <div>
                        <strong style={{ color: "#e0e6ed", fontSize: "0.9rem" }}>
                          {r.title}
                        </strong>
                        {r.description && (
                          <div
                            style={{
                              color: "#8aa4c0",
                              fontSize: "0.8rem",
                            }}
                          >
                            {r.description}
                          </div>
                        )}
                        {r.url && (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {r.url.substring(0, 60)}...
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      className="admin-action-btn delete"
                      onClick={() => handleDeleteResource(r.id)}
                      title="Delete resource"
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                {(selectedModule.resources || []).length === 0 && (
                  <p
                    style={{
                      color: "#8aa4c0",
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    No resources yet. Add your first resource!
                  </p>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: "#ef9a9a" }}>Module not found</p>
          )}
        </>
      )}
    </div>
  );
}