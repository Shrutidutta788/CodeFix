import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState('print("Hello World"');
  const [result, setResult] = useState(null);
  const [fixedCode, setFixedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // =========================
  // ANALYZE CODE
  // =========================
  const analyzeCode = async () => {
    if (!code.trim()) {
      setResult({
        status: "error",
        message: "Please enter Python code.",
      });

      setFixedCode("");
      return;
    }

    setLoading(true);
    setResult(null);
    setFixedCode("");
    setCopied(false);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          language: "python",
          code: code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Something went wrong."
        );
      }

      setResult(data);

      if (data.fix && data.fix.fixed_code) {
        setFixedCode(data.fix.fixed_code);
      }
    } catch (error) {
      console.error("Analysis Error:", error);

      setResult({
        status: "error",
        message:
          "Unable to connect with CodeFix backend. Make sure FastAPI server is running on port 8000.",
      });

      setFixedCode("");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // COPY CORRECTED CODE
  // =========================
  const copyFixedCode = async () => {
    if (!fixedCode) return;

    try {
      await navigator.clipboard.writeText(fixedCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);

      // Fallback copy method
      const textArea = document.createElement("textarea");

      textArea.value = fixedCode;

      document.body.appendChild(textArea);

      textArea.select();

      document.execCommand("copy");

      document.body.removeChild(textArea);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // =========================
  // APPLY FIX
  // =========================
  const applyFix = () => {
    if (!fixedCode) return;

    setCode(fixedCode);

    setResult({
      ...result,
      status: "fixed",
      message: "Fix applied successfully!",
    });
  };

  // =========================
  // CLEAR ALL
  // =========================
  const clearAll = () => {
    setCode("");
    setResult(null);
    setFixedCode("");
    setCopied(false);
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="header">

        <div className="brand">

          <h1>CodeFix</h1>

          <p>
            Write, analyze and fix your Python code instantly.
          </p>

        </div>

        <div className="header-badge">

          <span className="status-dot"></span>

          Python Analyzer

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="main-container">

        {/* ================= LEFT SIDE ================= */}

        <section className="editor-section">

          <div className="section-heading">

            <div>

              <h2>Code Editor</h2>

              <p>
                Paste or write your Python code below.
              </p>

            </div>

            <button
              className="clear-btn"
              onClick={clearAll}
              type="button"
            >
              Clear
            </button>

          </div>

          {/* LANGUAGE */}

          <div className="language-row">

            <label htmlFor="language">
              Programming Language
            </label>

            <select
              id="language"
              value="python"
              disabled
            >
              <option value="python">
                Python
              </option>
            </select>

          </div>

          {/* CODE EDITOR */}

          <div className="code-editor">

            <div className="editor-top">

              <div className="window-buttons">

                <span></span>
                <span></span>
                <span></span>

              </div>

              <span className="file-name">
                main.py
              </span>

            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write or paste your Python code here..."
              spellCheck="false"
            />

          </div>

          {/* ANALYZE BUTTON */}

          <button
            className="analyze-btn"
            onClick={analyzeCode}
            disabled={loading}
            type="button"
          >

            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Code
                <span className="arrow">→</span>
              </>
            )}

          </button>

        </section>

        {/* ================= RIGHT SIDE ================= */}

        <section className="result-section">

          {/* ================= ANALYSIS RESULT ================= */}

          <div className="result-card">

            <div className="card-title">

              <div>

                <h2>Analysis Result</h2>

                <p>
                  CodeFix will explain the detected issue.
                </p>

              </div>

              {result && (
                <span
                  className={`result-status ${
                    result.status === "success"
                      ? "success"
                      : result.status === "fixed"
                      ? "fixed"
                      : "error"
                  }`}
                >

                  {result.status === "success"
                    ? "SAFE"
                    : result.status === "fixed"
                    ? "FIXED"
                    : "ERROR"}

                </span>
              )}

            </div>

            <div className="analysis-content">

              {!result ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    ⌘
                  </div>

                  <h3>
                    No analysis yet
                  </h3>

                  <p>
                    Enter your Python code and click
                    <strong> Analyze Code</strong>.
                  </p>

                </div>

              ) : (

                <div className="analysis-details">

                  {/* MESSAGE */}

                  <div className="message-box">

                    <span className="message-label">
                      MESSAGE
                    </span>

                    <p>
                      {result.message}
                    </p>

                  </div>

                  {/* ERRORS */}

                  {result.errors &&
                    result.errors.length > 0 && (

                      <div className="error-list">

                        <h3>
                          Detected Issues
                        </h3>

                        {result.errors.map(
                          (error, index) => (

                            <div
                              className="error-item"
                              key={index}
                            >

                              <div className="error-number">
                                {index + 1}
                              </div>

                              <div className="error-info">

                                <strong>
                                  {error.type ||
                                    "Python Error"}
                                </strong>

                                <p>
                                  {error.message ||
                                    "An issue was detected in your code."}
                                </p>

                                {error.line && (
                                  <small>
                                    Line{" "}
                                    {error.line}

                                    {error.column
                                      ? `, Column ${error.column}`
                                      : ""}
                                  </small>
                                )}

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  {/* SUGGESTION */}

                  {result.suggestion && (

                    <div className="suggestion-box">

                      <span className="suggestion-icon">
                        💡
                      </span>

                      <div>

                        <strong>
                          Suggestion
                        </strong>

                        <p>
                          {result.suggestion}
                        </p>

                      </div>

                    </div>

                  )}

                </div>

              )}

            </div>

          </div>

          {/* ================= CORRECTED CODE ================= */}

          <div className="fixed-card">

            <div className="card-title">

              <div>

                <h2>
                  Corrected Code
                </h2>

                <p>
                  Your corrected Python code will appear here.
                </p>

              </div>

              {fixedCode && (
                <span className="fixed-label">
                  READY
                </span>
              )}

            </div>

            {/* FIXED CODE BOX */}

            <div className="fixed-editor">

              {fixedCode ? (

                <>

                  {/* FIXED CODE HEADER */}

                  <div className="fixed-editor-header">

                    <span>
                      corrected.py
                    </span>

                    {/* COPY BUTTON */}

                    <button
                      className={`copy-btn ${
                        copied ? "copied" : ""
                      }`}
                      onClick={copyFixedCode}
                      title={
                        copied
                          ? "Copied!"
                          : "Copy corrected code"
                      }
                      type="button"
                    >

                      {copied ? "✓" : "📋"}

                    </button>

                  </div>

                  {/* CODE */}

                  <pre>
                    <code>
                      {fixedCode}
                    </code>
                  </pre>

                </>

              ) : (

                <div className="fixed-empty">

                  <span className="fixed-empty-icon">
                    ✓
                  </span>

                  <p>
                    Corrected code will appear here after analysis.
                  </p>

                </div>

              )}

            </div>

            {/* APPLY FIX */}

            <button
              className="apply-btn"
              onClick={applyFix}
              disabled={!fixedCode}
              type="button"
            >
              ✓ Apply Fix
            </button>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer>

        <span>
          CodeFix
        </span>

        <span>
          •
        </span>

        <span>
          Python Code Analysis & Fixing Tool
        </span>

      </footer>

    </div>
  );
}

export default App;