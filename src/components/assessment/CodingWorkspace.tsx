"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Maximize2, Minimize2, Terminal, Layers, FileText, CheckCircle2, XCircle } from "lucide-react";
import type { AssessmentQuestion } from "@/lib/types";
import { useTheme } from "../ThemeProvider";
import { sanitizeHtml } from "@/lib/text";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANG_OPTIONS = [
  { id: "solidity", label: "Solidity", piston: "solidity" },
  { id: "javascript", label: "JavaScript", piston: "javascript" },
  { id: "typescript", label: "TypeScript", piston: "typescript" },
  { id: "python", label: "Python", piston: "python" },
  { id: "cpp", label: "C++", piston: "cpp" },
  { id: "c", label: "C", piston: "c" },
  { id: "java", label: "Java", piston: "java" },
];

const TEST_CASES_DATA: Record<string, { name: string; input: string; expected: string }[]> = {
  "8.8-0": [
    { name: "Task Struct definition", input: "Validate struct Task", expected: "id (uint), content (string), completed (bool)" },
    { name: "Task storage mapping/array", input: "Validate tasks storage", expected: "Task[] public tasks" },
    { name: "createTask implementation", input: "createTask('Buy milk')", expected: "Emits TaskCreated('Buy milk')" },
    { name: "toggleCompleted implementation", input: "toggleCompleted(0)", expected: "Task 0 completed = true" },
    { name: "getTaskCount & getAllTasks", input: "getTaskCount()", expected: "Returns task count" }
  ],
  "8.8-1": [
    { name: "Describe blocks", input: "Mocha hooks check", expected: "Uses describe() blocks to group test suites" },
    { name: "Deployment tests", input: "Hardhat contract deployment", expected: "Deploys contract using factory or deployContract" },
    { name: "createTask assertions", input: "Test creation logic", expected: "Includes assertions for task content and event emission" },
    { name: "toggleCompleted assertions", input: "Test toggling logic", expected: "Includes assertions for task completion state" }
  ],
  "8.8-2": [
    { name: "Ethers factory usage", input: "getContractFactory()", expected: "Uses ethers.getContractFactory('TodoList')" },
    { name: "Deploy method execution", input: "await todoList.deploy()", expected: "Calls deploy() to trigger transaction" },
    { name: "Log contract address", input: "console.log(todoList.address)", expected: "Logs deployed address on completion" }
  ],
  "8.8-3": [
    { name: "Component definition", input: "Validate TodoList App", expected: "Defines React functional component" },
    { name: "State management hooks", input: "useState() / useEffect()", expected: "Tracks tasks list and active account state" },
    { name: "Web3 integration", input: "window.ethereum / BridgeKey", expected: "Initializes provider for wallets" },
    { name: "UI markup elements", input: "JSX tags", expected: "Renders task list, inputs, and connect buttons" }
  ],
  "16.2-q11": [
    { name: "Check Struct Definition", input: "Validate struct Capability", expected: "maxAmount (uint), expiry (uint), active (bool)" },
    { name: "Check Permissions Mapping", input: "Validate permissions mapping", expected: "mapping(address => Capability) public permissions" },
    { name: "Check grantPermission Function", input: "grantPermission(agent, 1000, 3600)", expected: "permissions[agent] = { maxAmount: 1000, expiry: block.timestamp + 3600, active: true }" },
    { name: "Check onlyPermitted Modifier", input: "spendWithPermission(500) vs spendWithPermission(1500)", expected: "Checks active status, non-expiration, and spend limit" },
    { name: "Check spendWithPermission Function", input: "spendWithPermission(500)", expected: "Applies onlyPermitted modifier check" },
    { name: "Check revokePermission Function", input: "revokePermission(agent)", expected: "Sets active = false for agent" }
  ],
  "21.1-q14": [
    { name: "Checks-Effects-Interactions (State Update)", input: "bid() with higher value", expected: "highestBidder and highestBid updated before refund low-level call" },
    { name: "Pull-over-Push Refund Queuing", input: "Multiple outbid calls", expected: "Refunds stored in pendingReturns mapping; no direct value transfer in bid()" },
    { name: "Withdraw Refund Function", input: "withdraw() called by outbid address", expected: "Funds sent securely via low-level call" },
    { name: "Withdraw Reentrancy Guard (CEI)", input: "Reentrancy attack during withdraw()", expected: "User balance is reset to 0 before call, preventing reentrancy" }
  ],
  "21.2-q14": [
    { name: "Block Confirmations Wait", input: "token.deployTransaction.wait(5)", expected: "Execution waits for 5 confirmations before verification" },
    { name: "Network-Aware Verification", input: "network.name === 'mst_mainnet'", expected: "Checks network name to prevent local verification error" },
    { name: "Dependency Injection", input: "Staking deployment parameters", expected: "Deploys Staking passing token.address to constructor" }
  ]
};

interface CodingWorkspaceProps {
  question: AssessmentQuestion;
  questionIndex?: number;
  value: string;
  onChange: (v: string, codingResults?: any) => void;
  submoduleId?: string;
}

export function CodingWorkspace({
  question,
  questionIndex,
  value,
  onChange,
  submoduleId,
}: CodingWorkspaceProps) {
  const { theme } = useTheme();
  
  // Set default editor language dynamically
  const [language, setLanguage] = useState(() => {
    if (submoduleId === "21.2") return "javascript";
    const text = question.text.toLowerCase();
    if (text.includes(".sol")) return "solidity";
    if (text.includes(".py")) return "python";
    if (text.includes(".cpp")) return "cpp";
    if (text.includes(".c ")) return "c";
    if (text.includes(".ts")) return "typescript";
    if (text.includes(".js") || text.includes("javascript") || text.includes("hardhat") || text.includes("react")) return "javascript";
    return question.language || "solidity";
  });
  
  const [running, setRunning] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [activeTab, setActiveTab] = useState<"testCases" | "customInput" | "output">("testCases");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const editorRef = useRef<any>(null);
  
  // Compilation & Output results
  const [compileSuccess, setCompileSuccess] = useState<boolean | null>(null);
  const [compileOutput, setCompileOutput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [testResults, setTestResults] = useState<
    { name: string; pass: boolean; detail: string }[]
  >([]);
  const [execTime, setExecTime] = useState("");
  const [execMemory, setExecMemory] = useState("");

  const defaultStarter =
    question.starterCode ||
    (language === "solidity"
      ? "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract Solution {\n    \n}"
      : language === "python"
        ? "def solve():\n    pass\n\nif __name__ == '__main__':\n    print(solve())"
        : language === "cpp"
          ? "#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}"
          : language === "c"
            ? "#include <stdio.h>\n\nint main() {\n    return 0;\n}"
            : language === "java"
              ? "public class Main {\n    public static void main(String[] args) {\n        \n    }\n}"
              : "function solve() {\n  // your code\n}\nconsole.log(solve());");

  const editorValue = value || defaultStarter;

  // Predefined test cases for UI
  const qKey = `${submoduleId || ""}-${questionIndex !== undefined ? questionIndex : question.id}`;
  const displayTestCases = TEST_CASES_DATA[qKey] || TEST_CASES_DATA[`${submoduleId || ""}-${question.id}`] || [
    { name: "Standard Run Execution", input: customInput || "(no input)", expected: "Exit code 0" }
  ];

  // Save changes locally
  useEffect(() => {
    if (!value) {
      onChange(defaultStarter);
    }
  }, [language, defaultStarter, value, onChange]);

  function handleEditorMount(editor: any, monaco: any) {
    editorRef.current = editor;

    editor.updateOptions({
      contextmenu: false,
      dragAndDrop: false,
      copyWithSyntaxHighlighting: false,
      quickSuggestions: true,
      mouseWheelZoom: false,
    });

    editor.onKeyDown((event: any) => {
      if ((event.ctrlKey || event.metaKey) && [
        monaco.KeyCode.KeyC,
        monaco.KeyCode.KeyX,
        monaco.KeyCode.KeyA,
        monaco.KeyCode.KeyV,
      ].includes(event.keyCode)) {
        event.preventDefault();
      }
    });

    const dom = editor.getDomNode?.();
    if (dom) {
      dom.addEventListener("copy", (e: Event) => e.preventDefault());
      dom.addEventListener("cut", (e: Event) => e.preventDefault());
      dom.addEventListener("paste", (e: Event) => e.preventDefault());
      dom.addEventListener("contextmenu", (e: Event) => e.preventDefault());
    }
  }

  async function runCode() {
    setRunning(true);
    setActiveTab("output");
    setCompileSuccess(null);
    setCompileOutput("");
    setConsoleOutput("");
    setTestResults([]);
    setExecTime("");
    setExecMemory("");

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code: editorValue,
          questionId: question.id,
          submoduleId,
          questionIndex,
          customInput
        }),
      });
      const data = await res.json();
      
      setCompileSuccess(data.compileSuccess);
      setCompileOutput(data.compile_output || "");
      setConsoleOutput(data.stdout || data.stderr || data.message || "(no output)");
      setExecTime(data.time || "0.05s");
      setExecMemory(data.memory || "15 MB");
      
      const results = data.testResults || [];
      setTestResults(results);
      setCodeSubmitted(true);

      // Save the results into UserAnswer for final assessment submission
      const passedCount = results.filter((t: any) => t.pass).length;
      onChange(editorValue, {
        passed: passedCount,
        failed: results.length - passedCount,
        testCases: results.map((t: any) => ({
          name: t.name,
          pass: t.pass,
          input: displayTestCases.find(tc => tc.name === t.name)?.input || "Standard input",
          expected: displayTestCases.find(tc => tc.name === t.name)?.expected || "Success",
          actual: t.detail || "Success"
        }))
      });
      
    } catch (e) {
      setConsoleOutput(e instanceof Error ? e.message : "Run failed");
      setCompileSuccess(false);
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    onChange(question.starterCode || defaultStarter);
    setCompileSuccess(null);
    setCompileOutput("");
    setConsoleOutput("");
    setTestResults([]);
    setExecTime("");
    setExecMemory("");
    setCodeSubmitted(false);
  }

  return (
    <div
      className={`flex h-full min-h-0 flex-col lg:flex-row bg-[var(--bg)] text-[var(--text)] transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 p-4" : "relative border-t border-[var(--border)]"
      }`}
    >
      {/* LEFT PANEL: QUESTION DESCRIPTION */}
      <div className="flex w-full flex-col border-b border-[var(--border)] lg:w-[42%] lg:border-b-0 lg:border-r border-[var(--border)] min-h-0 h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded bg-mst-red/10 px-2.5 py-1 text-xs font-bold text-mst-red uppercase tracking-wider">
              {question.difficulty || "Medium"}
            </span>
            <span className="rounded bg-[var(--bg-muted)] px-2.5 py-1 text-xs font-bold text-[var(--text-muted)]">
              {question.marks} mark{question.marks !== 1 ? "s" : ""}
            </span>
            <span className="rounded bg-[var(--bg-muted)] px-2.5 py-1 text-xs font-bold text-[var(--text-muted)] capitalize">
              {language}
            </span>
          </div>

          <h2 className="text-xl font-bold mb-4 tracking-tight text-[var(--text)]">
            Problem Description
          </h2>
          
          <div
            className="prose prose-sm max-w-none text-[var(--text)] leading-relaxed mb-6"
            style={{ color: "var(--text)" }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.text) }}
          />

          {question.starterCode && (
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Examples / Starter Code
              </h4>
              <pre className="overflow-x-auto rounded-xl bg-[var(--bg-muted)] border border-[var(--border)] p-4 font-mono text-xs text-[var(--text)]">
                {question.starterCode.slice(0, 1000)}
                {question.starterCode.length > 1000 ? "\n..." : ""}
              </pre>
            </div>
          )}

          <div className="rounded-xl bg-[var(--bg-muted)] border border-[var(--border)] p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-mst-red mb-2">
              Constraints & Requirements
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-[var(--text-muted)]">
              <li>Write clean, valid code.</li>
              <li>For Solidity, ensure compilation under version 0.8.20.</li>
              <li>Verify that all structural checks pass.</li>
              <li>Time limit: 10s execution timeout.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: EDITOR + TABS */}
      <div className="flex min-h-0 flex-1 flex-col h-full bg-[var(--bg-elevated)]">
        {/* Editor Controls Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)] px-4 py-2">
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-bold text-[var(--text)] focus:border-mst-red focus:outline-none"
            >
              {LANG_OPTIONS.map((l) => (
                <option key={l.id} value={l.piston}>
                  {l.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={runCode}
              disabled={running}
              className="inline-flex items-center gap-1.5 rounded-full bg-mst-red px-4 py-1.5 text-xs font-bold text-white hover:bg-mst-red-dark disabled:opacity-50 transition"
            >
              <Play size={12} fill="white" /> {running ? "Submitting…" : "Submit Code"}
            </button>

            <button
              type="button"
              onClick={reset}
              title="Reset code to starter"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs hover:bg-[var(--bg-muted)] transition"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Editor"}
              className="rounded-full p-2 border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)] transition"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>


        {/* Monaco Editor Container */}
        <div className="flex-1 min-h-[300px] relative">
          <MonacoEditor
            height="100%"
            language={
              language === "solidity"
                ? "solidity"
                : language === "python"
                  ? "python"
                  : language === "java"
                    ? "java"
                    : language === "cpp"
                      ? "cpp"
                      : language === "c"
                        ? "c"
                        : language === "typescript"
                          ? "typescript"
                          : "javascript"
            }
            theme={theme === "dark" ? "vs-dark" : "light"}
            value={editorValue}
            onChange={(v) => onChange(v || "")}
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              formatOnPaste: false,
              contextmenu: false,
              dragAndDrop: false,
              copyWithSyntaxHighlighting: false,
              scrollbar: {
                vertical: "visible",
                horizontal: "visible"
              }
            }}
          />
        </div>

        {/* BOTTOM TABS PANEL */}
        <div className="h-[320px] shrink-0 border-t border-[var(--border)] bg-[var(--bg)] flex flex-col min-h-0">
          {/* Tabs bar */}
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-muted)] px-2">
            <div className="flex gap-1 py-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("testCases")}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === "testCases"
                    ? "bg-[var(--bg)] text-mst-red shadow-sm"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg)]/50 hover:text-[var(--text)]"
                }`}
              >
                <Layers size={13} /> Test Cases
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("customInput")}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === "customInput"
                    ? "bg-[var(--bg)] text-mst-red shadow-sm"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg)]/50 hover:text-[var(--text)]"
                }`}
              >
                <FileText size={13} /> Custom Input
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("output")}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === "output"
                    ? "bg-[var(--bg)] text-mst-red shadow-sm"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg)]/50 hover:text-[var(--text)]"
                }`}
              >
                <Terminal size={13} /> Output
                {testResults.length > 0 && (
                  <span className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    testResults.every(r => r.pass) ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                  }`}>
                    {testResults.filter(r => r.pass).length}/{testResults.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tab contents wrapper */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-[var(--bg)]">
            {activeTab === "testCases" && (
              <div className="space-y-3">
                {displayTestCases.map((tc, idx) => (
                  <div key={idx} className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-3">
                    <p className="text-xs font-bold text-[var(--text)] mb-2">{tc.name}</p>
                    <div className="grid gap-3 sm:grid-cols-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Input:</span>
                        <pre className="mt-1 rounded bg-[var(--surface-2)] border border-[var(--border)] p-2 font-mono text-[var(--text)] overflow-x-auto">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Expected Output:</span>
                        <pre className="mt-1 rounded bg-[var(--surface-2)] border border-[var(--border)] p-2 font-mono text-[var(--text)] overflow-x-auto">
                          {tc.expected}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "customInput" && (
              <div className="h-full flex flex-col">
                <label className="text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider block">
                  Write standard input (stdin) for execution:
                </label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Provide stdin here (one per line, e.g. 5\n10)…"
                  className="flex-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-3 text-xs text-[var(--text)] font-mono focus:border-mst-red focus:outline-none resize-none"
                />
              </div>
            )}

            {activeTab === "output" && (
              <div className="space-y-4">
                {/* Status Badges */}
                {compileSuccess !== null && (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                      compileSuccess 
                        ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}>
                      {compileSuccess ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      {compileSuccess ? "Compilation Successful" : "Compilation Failed"}
                    </span>
                    
                    {compileSuccess && testResults.length > 0 && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                        testResults.every(t => t.pass)
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                      }`}>
                        Passed: {testResults.filter(t => t.pass).length} / {testResults.length}
                      </span>
                    )}

                    {execTime && (
                      <span className="text-xs font-semibold text-[var(--text-muted)] font-mono">
                        Time: {execTime}
                      </span>
                    )}

                    {execMemory && (
                      <span className="text-xs font-semibold text-[var(--text-muted)] font-mono">
                        Memory: {execMemory}
                      </span>
                    )}
                  </div>
                )}

                {/* Compilation Logs */}
                {compileOutput && (
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] overflow-hidden">
                    <div className="border-b border-[var(--border)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface-2)]">
                      Compiler Output & Diagnostics
                    </div>
                    <pre className="p-3 font-mono text-xs text-[var(--text)] whitespace-pre-wrap overflow-x-auto max-h-[140px] overflow-y-auto">
                      {compileOutput}
                    </pre>
                  </div>
                )}

                {/* Test Cases Results List */}
                {testResults.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">Test Suite Checks</p>
                    <div className="space-y-1.5">
                      {testResults.map((tr, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-2.5 rounded-lg border px-3 py-2 text-xs transition ${
                            tr.pass 
                              ? "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400" 
                              : "border-red-500/25 bg-red-500/5 text-red-600 dark:text-red-400"
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">
                            {tr.pass ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          </span>
                          <div>
                            <span className="font-bold">{tr.name}</span>
                            <p className="mt-1 text-[11px] text-[var(--text-muted)] leading-relaxed">
                              {tr.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Console Stdout */}
                {consoleOutput && (
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] overflow-hidden">
                    <div className="border-b border-[var(--border)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface-2)]">
                      Execution Output (stdout)
                    </div>
                    <pre className="p-3 font-mono text-xs text-[var(--text)] whitespace-pre-wrap overflow-x-auto max-h-[160px] overflow-y-auto">
                      {consoleOutput}
                    </pre>
                  </div>
                )}

                {compileSuccess === null && !running && (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-[var(--text-muted)]">
                    <Terminal size={24} className="mb-2 opacity-40 animate-pulse" />
                    <p className="text-xs">No code has been submitted yet.</p>
                    <p className="text-[10px] mt-1">Click "Submit Code" above to compile and verify your solution.</p>
                  </div>
                )}

                {running && (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-[var(--text-muted)] animate-pulse">
                    <Terminal size={24} className="mb-2 text-mst-red" />
                    <p className="text-xs">Compiling and executing code against tests…</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
