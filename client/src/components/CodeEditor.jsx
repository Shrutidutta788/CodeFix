import { useState } from "react";

const sampleCode = `def calculate_total(price, tax):
    total = price + tax
    print("Total:", total

calculate_total(100, 18)`;

function CodeEditor() {
  const [code, setCode] = useState(sampleCode);
  const [correctedCode, setCorrectedCode] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const lines = code.split("\n");

  // ===============================
  // ANALYZE CODE
  // ===============================

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please enter or paste your code first.");
      setResult(null);
      setCorrectedCode("");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setCorrectedCode("");
    setCopied(false);
    setApplied(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language: "python",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to analyze the code."
        );
      }

      setResult(data);

      if (data.fix?.fixed_code) {
        setCorrectedCode(data.fix.fixed_code);
      }
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while analyzing the code."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // COPY CODE
  // ===============================

  const handleCopy = async () => {
    if (!correctedCode) return;

    try {
      await navigator.clipboard.writeText(correctedCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy corrected code.");
    }
  };

  // ===============================
  // APPLY FIX
  // ===============================

  const handleApplyFix = () => {
    if (!correctedCode) return;

    setCode(correctedCode);
    setApplied(true);

    setTimeout(() => {
      setApplied(false);
    }, 2500);
  };

  // ===============================
  // THEME CLASSES
  // ===============================

  const pageBackground = darkMode
    ? "bg-[#060816] text-white"
    : "bg-slate-100 text-slate-900";

  const cardBackground = darkMode
    ? "bg-[#0D1224]/90 border-white/[0.08]"
    : "bg-white border-slate-200";

  const editorBackground = darkMode
    ? "bg-[#070B18]"
    : "bg-slate-50";

  const textColor = darkMode
    ? "text-slate-200"
    : "text-slate-800";

  const mutedText = darkMode
    ? "text-slate-400"
    : "text-slate-500";

  return (
    <div
      className={`min-h-screen ${pageBackground} transition-colors duration-500 overflow-hidden`}
    >
      {/* ========================================= */}
      {/* BACKGROUND GLOW */}
      {/* ========================================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div
          className={`absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full blur-[150px] ${
            darkMode
              ? "bg-blue-600/20"
              : "bg-blue-400/20"
          }`}
        />

        <div
          className={`absolute top-[35%] -right-40 w-[500px] h-[500px] rounded-full blur-[150px] ${
            darkMode
              ? "bg-purple-600/20"
              : "bg-purple-400/20"
          }`}
        />

        <div
          className={`absolute -bottom-60 left-[35%] w-[500px] h-[500px] rounded-full blur-[150px] ${
            darkMode
              ? "bg-cyan-500/10"
              : "bg-cyan-400/10"
          }`}
        />
      </div>

      {/* ========================================= */}
      {/* MAIN CONTAINER */}
      {/* ========================================= */}

      <div className="relative z-10 max-w-[1500px] mx-auto px-5 md:px-8 py-7">

        {/* ========================================= */}
        {/* NAVBAR */}
        {/* ========================================= */}

        <nav
          className={`flex items-center justify-between px-5 py-4 rounded-2xl border ${cardBackground} backdrop-blur-xl shadow-2xl mb-8`}
        >

          <div className="flex items-center gap-3">

            {/* Logo */}

            <div className="relative">

              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="font-black text-white text-lg">
                  {"</>"}
                </span>
              </div>

              <span className="absolute -right-1 -top-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0D1224]" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Fix</span>
              </h1>

              <p
                className={`text-[10px] uppercase tracking-[0.18em] ${mutedText}`}
              >
                Intelligent Code Assistant
              </p>
            </div>

          </div>


          {/* Right Navbar */}

          <div className="flex items-center gap-3">

            <div
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border ${
                darkMode
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

              <span
                className={`text-xs font-semibold ${
                  darkMode
                    ? "text-emerald-300"
                    : "text-emerald-600"
                }`}
              >
                Engine Online
              </span>
            </div>


            {/* Theme Button */}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                darkMode
                  ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 hover:bg-slate-200"
              }`}
              title="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

          </div>
        </nav>


        {/* ========================================= */}
        {/* HERO */}
        {/* ========================================= */}

        <section className="text-center mb-9">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4">
            <span>✦</span>
            <span>WRITE BETTER • DEBUG FASTER</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">

            Turn Your Bugs Into

            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
              Better Code.
            </span>

          </h2>

          <p
            className={`max-w-2xl mx-auto mt-4 text-sm md:text-base leading-7 ${mutedText}`}
          >
            Paste your code, detect errors, understand what went wrong,
            and get a corrected version — all in one powerful workspace.
          </p>

        </section>


        {/* ========================================= */}
        {/* EDITOR WORKSPACE */}
        {/* ========================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


          {/* ========================================= */}
          {/* LEFT: USER CODE */}
          {/* ========================================= */}

          <div
            className={`rounded-2xl border ${cardBackground} backdrop-blur-xl overflow-hidden shadow-2xl`}
          >

            {/* Header */}

            <div
              className={`flex items-center justify-between px-5 py-4 border-b ${
                darkMode
                  ? "border-white/[0.06] bg-white/[0.02]"
                  : "border-slate-200 bg-slate-50"
              }`}
            >

              <div className="flex items-center gap-3">

                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>

                <span className="font-bold text-sm">
                  Your Code
                </span>

              </div>


              {/* Language */}

              <select
                className={`px-3 py-2 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-slate-200"
                    : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <option>Python</option>
                <option>JavaScript</option>
                <option>React JSX</option>
                <option>C</option>
                <option>C++</option>
                <option>Java</option>
                <option>Go</option>
              </select>

            </div>


            {/* Editor */}

            <div className="p-5">

              <div
                className={`relative flex rounded-xl overflow-hidden border ${
                  darkMode
                    ? "border-slate-800"
                    : "border-slate-200"
                }`}
              >

                {/* Line Numbers */}

                <div
                  className={`w-12 shrink-0 pt-5 text-right pr-3 select-none font-mono text-xs leading-7 ${
                    darkMode
                      ? "bg-[#050816] text-slate-700"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >

                  {lines.map((_, index) => (
                    <div key={index}>
                      {index + 1}
                    </div>
                  ))}

                </div>


                {/* Code Input */}

                <textarea
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                    setApplied(false);
                  }}
                  spellCheck="false"
                  placeholder="Write or paste your code here..."
                  className={`w-full min-h-[500px] p-5 font-mono text-sm leading-7 resize-none outline-none ${editorBackground} ${textColor} placeholder:text-slate-500`}
                />

              </div>


              {/* Analyze Button */}

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="group relative mt-5 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 font-bold shadow-xl shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >

                <span className="relative z-10 flex items-center justify-center gap-2">

                  {loading ? (
                    <>
                      <span className="animate-spin text-xl">
                        ◌
                      </span>
                      Analyzing Your Code...
                    </>
                  ) : (
                    <>
                      <span>Analyze Code</span>
                      <span className="text-lg transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}

                </span>

              </button>

            </div>

          </div>


          {/* ========================================= */}
          {/* RIGHT: CORRECTED CODE */}
          {/* ========================================= */}

          <div
            className={`rounded-2xl border ${cardBackground} backdrop-blur-xl overflow-hidden shadow-2xl`}
          >

            {/* Header */}

            <div
              className={`flex items-center justify-between px-5 py-4 border-b ${
                darkMode
                  ? "border-white/[0.06] bg-white/[0.02]"
                  : "border-slate-200 bg-slate-50"
              }`}
            >

              <div className="flex items-center gap-3">

                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>

                <div>
                  <span className="font-bold text-sm">
                    Corrected Code
                  </span>

                  <span className="hidden sm:inline ml-2 text-xs text-emerald-400">
                    FIXED VERSION
                  </span>
                </div>

              </div>


              {correctedCode && (
                <button
                  onClick={handleCopy}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-all ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
                      : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {copied ? "✓ Copied" : "Copy Code"}
                </button>
              )}

            </div>


            {/* Corrected Code Box */}

            <div className="p-5">

              <div
                className={`min-h-[500px] rounded-xl border overflow-auto ${
                  darkMode
                    ? "bg-[#050816] border-slate-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >

                {correctedCode ? (

                  <div className="flex">

                    {/* Corrected Line Numbers */}

                    <div
                      className={`w-12 shrink-0 pt-5 text-right pr-3 select-none font-mono text-xs leading-7 ${
                        darkMode
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >

                      {correctedCode
                        .split("\n")
                        .map((_, index) => (
                          <div key={index}>
                            {index + 1}
                          </div>
                        ))}

                    </div>


                    <pre
                      className={`p-5 font-mono text-sm leading-7 whitespace-pre-wrap ${textColor}`}
                    >
                      <code className="text-emerald-400">
                        {correctedCode}
                      </code>
                    </pre>

                  </div>

                ) : (

                  <div className="min-h-[500px] flex flex-col items-center justify-center text-center px-8">

                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/10 flex items-center justify-center mb-5">

                      <span className="text-3xl">
                        ✨
                      </span>

                    </div>

                    <h3 className="text-lg font-bold mb-2">
                      Your fixed code will appear here
                    </h3>

                    <p
                      className={`max-w-sm text-sm leading-6 ${mutedText}`}
                    >
                      Analyze your code and CodeFix will
                      generate a corrected version whenever
                      a reliable automatic fix is available.
                    </p>

                  </div>

                )}

              </div>


              {/* Apply Fix */}

              {correctedCode && (

                <button
                  onClick={handleApplyFix}
                  className="group mt-5 w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 font-bold shadow-xl shadow-emerald-600/20 hover:-translate-y-0.5 hover:shadow-emerald-500/30 transition-all duration-300"
                >

                  {applied ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-lg">✓</span>
                      Fix Applied Successfully
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Apply Fix
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  )}

                </button>

              )}

            </div>

          </div>

        </div>


        {/* ========================================= */}
        {/* ERROR MESSAGE */}
        {/* ========================================= */}

        {error && (

          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 animate-[fadeIn_0.3s_ease-out]">

            <div className="flex gap-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                !
              </div>

              <div>

                <h3 className="font-bold text-red-400">
                  Request Error
                </h3>

                <p className={`text-sm mt-1 ${mutedText}`}>
                  {error}
                </p>

              </div>

            </div>

          </div>

        )}


        {/* ========================================= */}
        {/* ANALYSIS RESULT */}
        {/* ========================================= */}

        {result && (

          <section className="mt-6">

            <div
              className={`rounded-2xl border ${cardBackground} backdrop-blur-xl p-6 shadow-2xl`}
            >

              {/* Result Header */}

              <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      result.status === "error"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {result.status === "error"
                      ? "!"
                      : "✓"}
                  </div>

                  <div>

                    <h2 className="text-xl font-black">
                      Analysis Report
                    </h2>

                    <p className={`text-xs mt-1 ${mutedText}`}>
                      CodeFix Engine • Detailed Results
                    </p>

                  </div>

                </div>


                <span
                  className={`hidden sm:block px-3 py-1.5 rounded-lg text-xs font-bold ${
                    result.status === "error"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {result.status === "error"
                    ? "ERRORS FOUND"
                    : "CODE PASSED"}
                </span>

              </div>


              {/* Status Message */}

              <div
                className={`p-5 rounded-xl border ${
                  result.status === "error"
                    ? "bg-red-500/5 border-red-500/20"
                    : "bg-emerald-500/5 border-emerald-500/20"
                }`}
              >

                <h3
                  className={`font-bold ${
                    result.status === "error"
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {result.status === "error"
                    ? "Problems detected in your code"
                    : "Your code looks good!"}
                </h3>

                <p className={`text-sm mt-2 ${mutedText}`}>
                  {result.message}
                </p>

              </div>


              {/* ================================= */}
              {/* ERROR LIST */}
              {/* ================================= */}

              {result.errors?.length > 0 && (

                <div className="mt-7">

                  <div className="flex items-center justify-between mb-4">

                    <h3 className="font-bold text-lg">
                      Detected Errors
                    </h3>

                    <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold">
                      {result.errors.length}{" "}
                      {result.errors.length === 1
                        ? "Issue"
                        : "Issues"}
                    </span>

                  </div>


                  <div className="space-y-4">

                    {result.errors.map(
                      (item, index) => (

                        <div
                          key={index}
                          className={`group rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 ${
                            darkMode
                              ? "bg-[#080C1B] border-red-500/15 hover:border-red-500/30"
                              : "bg-white border-red-200 hover:border-red-300"
                          }`}
                        >

                          {/* Error top */}

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            <div className="flex items-center gap-2">

                              <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center text-sm font-bold">
                                !
                              </span>

                              <span className="font-bold text-red-400">
                                {item.type}
                              </span>

                            </div>


                            <div className="flex gap-2">

                              <span className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold">
                                Line {item.line}
                              </span>

                              {item.column && (

                                <span className="px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-400 text-xs font-semibold">
                                  Column {item.column}
                                </span>

                              )}

                            </div>

                          </div>


                          {/* Error message */}

                          <div className="mt-4">

                            <p className={`text-sm leading-6 ${textColor}`}>
                              {item.message}
                            </p>

                          </div>


                          {/* Error suggestion */}

                          {item.suggestion && (

                            <div
                              className={`mt-4 p-4 rounded-lg border ${
                                darkMode
                                  ? "bg-yellow-500/5 border-yellow-500/10"
                                  : "bg-yellow-50 border-yellow-200"
                              }`}
                            >

                              <p className="text-xs font-bold text-yellow-400 mb-1">
                                💡 SUGGESTION
                              </p>

                              <p className={`text-sm ${mutedText}`}>
                                {item.suggestion}
                              </p>

                            </div>

                          )}

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* ================================= */}
              {/* WARNINGS */}
              {/* ================================= */}

              {result.warnings?.length > 0 && (

                <div className="mt-7">

                  <h3 className="font-bold text-lg mb-4">
                    Code Quality Warnings
                  </h3>

                  <div className="space-y-3">

                    {result.warnings.map(
                      (warning, index) => (

                        <div
                          key={index}
                          className={`rounded-xl border p-4 ${
                            darkMode
                              ? "bg-yellow-500/5 border-yellow-500/15"
                              : "bg-yellow-50 border-yellow-200"
                          }`}
                        >

                          <div className="flex gap-3">

                            <span className="text-yellow-400">
                              ⚠
                            </span>

                            <div>

                              <p className="font-semibold text-yellow-400">
                                {warning.type}
                              </p>

                              <p className={`text-sm mt-1 ${mutedText}`}>
                                {warning.message}
                              </p>

                              {warning.suggestion && (

                                <p className={`text-sm mt-2 ${mutedText}`}>
                                  💡 {warning.suggestion}
                                </p>

                              )}

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>

          </section>

        )}


        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}

        <footer className="text-center py-8">

          <p className={`text-xs ${mutedText}`}>
            CodeFix
            <span className="mx-2">•</span>
            Detect
            <span className="mx-2">•</span>
            Understand
            <span className="mx-2">•</span>
            Fix
          </p>

        </footer>

      </div>
    </div>
  );
}

export default CodeEditor;