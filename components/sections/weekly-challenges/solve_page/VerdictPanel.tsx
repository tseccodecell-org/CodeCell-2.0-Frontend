"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Clock,
  MemoryStick,
  CheckCircle2,
  XCircle,
  Terminal,
  Copy,
  Check,
  Zap,
  X,
  ListChecks,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";
import type {
  SubmissionStatus,
  SubmissionTestResult,
} from "@/lib/types/submission";

export interface VerdictPanelProps {
  status?: SubmissionStatus;
  verdict?: string;
  score?: number;
  executionTime?: number;
  memoryUsed?: number;
  stdout?: string;
  stderr?: string;
  errorMessage?: string;
  testResults?: SubmissionTestResult[];
  onClose?: () => void;
}

type Tab = "stdout" | "stderr" | "testcases";

const ERROR_VERDICTS = [
  "WRONG_ANSWER",
  "RUNTIME_ERROR",
  "COMPILE_ERROR",
  "COMPILATION_ERROR",
  "TIME_LIMIT_EXCEEDED",
  "MEMORY_LIMIT_EXCEEDED",
  "INTERNAL_ERROR",
];

export default function VerdictPanel({
  status = "IDLE",
  verdict,
  score,
  executionTime,
  memoryUsed,
  stdout,
  stderr,
  errorMessage,
  testResults = [],
  onClose,
}: VerdictPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("stdout");
  const [copied, setCopied] = useState(false);

  const isBusy = status === "QUEUED" || status === "RUNNING";
  const isAccepted = verdict === "ACCEPTED" || verdict === "SUCCESS";
  const isErrorVerdict = !!verdict && ERROR_VERDICTS.includes(verdict);

  // Auto-switch tabs on execution failure or errors
  useEffect(() => {
    if (
      status === "FAILED" ||
      verdict === "COMPILE_ERROR" ||
      verdict === "COMPILATION_ERROR" ||
      verdict === "RUNTIME_ERROR" ||
      (stderr && stderr.trim().length > 0 && !stdout)
    ) {
      setActiveTab("stderr");
    } else if (testResults.length > 0 && isErrorVerdict) {
      setActiveTab("testcases");
    }
  }, [status, verdict, stderr, stdout, testResults.length, isErrorVerdict]);

  const passedCount = useMemo(
    () =>
      testResults.filter(
        (t) =>
          (t as any).passed ??
          (t.verdict === "ACCEPTED" || t.verdict === "SUCCESS")
      ).length,
    [testResults]
  );
  const totalCount = testResults.length;

  const firstFailedIdx = useMemo(
    () =>
      testResults.findIndex(
        (t) =>
          !(
            (t as any).passed ??
            (t.verdict === "ACCEPTED" || t.verdict === "SUCCESS")
          )
      ),
    [testResults]
  );

  const resolvedScore =
    status === "COMPLETED"
      ? score ?? (totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : undefined)
      : undefined;

  const formatMemory = (kb?: number) => {
    if (kb === undefined || kb === null) return "--";
    if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${kb} KB`;
  };

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getVerdictBadge = () => {
    if (status === "IDLE") {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#22262f] bg-[#0d0f14] font-mono text-xs text-[#5A5850] uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#5A5850]" /> Ready
        </span>
      );
    }

    if (status === "QUEUED" || status === "RUNNING") {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9A404]/40 bg-[#D9A404]/10 font-mono text-xs text-[#D9A404] uppercase tracking-wider animate-pulse">
          <span className="w-2 h-2 rounded-full bg-[#D9A404] animate-ping" />
          {status === "QUEUED" ? "Queued..." : "Running..."}
        </span>
      );
    }

    if (status === "FAILED") {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#E2574C]/40 bg-[#E2574C]/10 font-mono text-xs text-[#E2574C] font-bold uppercase tracking-wider">
          <XCircle size={14} /> Failed
        </span>
      );
    }

    if (isAccepted) {
      return (
        <span className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#34D399]/40 bg-[#34D399]/10 font-mono text-xs text-[#34D399] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(52,211,153,0.25)]">
          <CheckCircle2 size={15} /> Accepted
          {resolvedScore !== undefined ? ` (${resolvedScore}/100)` : ""}
        </span>
      );
    }

    if (isErrorVerdict) {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#E2574C]/40 bg-[#E2574C]/10 font-mono text-xs text-[#E2574C] font-bold uppercase tracking-wider">
          <XCircle size={14} /> {verdict?.replace(/_/g, " ")}
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#D9A404]/40 bg-[#D9A404]/10 font-mono text-xs text-[#D9A404] font-bold uppercase tracking-wider">
        <Zap size={14} /> {verdict ?? "Completed"}
      </span>
    );
  };

  const getStdoutText = () => {
    if (status === "IDLE") {
      return 'Click "Run" to test your code against the sample input, or "Submit" to grade it against all test cases.';
    }
    if (status === "QUEUED") {
      return "Waiting in the judge queue...";
    }
    if (status === "RUNNING") {
      return "Compiling and executing your code...";
    }
    if (status === "FAILED") {
      return errorMessage || "The judge couldn't process this run. Please try again.";
    }
    if (stdout && stdout.trim()) {
      return stdout;
    }
    return "Program finished with no standard output.";
  };

  const getStderrText = () => {
    if (status === "IDLE") {
      return "Nothing to show yet. Run your code first.";
    }
    if (isBusy) {
      return "Waiting for execution to finish...";
    }
    if (stderr && stderr.trim()) {
      return stderr;
    }
    if (errorMessage && errorMessage.trim()) {
      return errorMessage;
    }
    return "No errors. Clean run.";
  };

  const activeTabText =
    activeTab === "stdout" ? getStdoutText() : activeTab === "stderr" ? getStderrText() : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: "spring", damping: 28, stiffness: 320 }}
      className="w-full h-full bg-[#0b0d13] border border-[#1a1c24] overflow-hidden flex flex-col font-sans text-[#F4F1EA]"
    >
      {/* Top Header Bar */}
      <div className="px-5 py-3 border-b border-[#1a1c24] flex items-center justify-between bg-[#0d0f14] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#34D399]/10 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
            <Terminal size={16} />
          </div>
          <div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#F4F1EA]">
              Execution Output
            </h3>
            <span className="font-mono text-[9px] text-[#34D399] uppercase tracking-widest block -mt-0.5">
              CODECELL RUNTIME RESULT
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getVerdictBadge()}
          {onClose && (
            <button
              onClick={onClose}
              className="text-[#8B93A7] hover:text-[#F4F1EA] p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row (Time, Memory, Score) */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-[#06070B] border-b border-[#1a1c24] font-mono flex-shrink-0">
        <div className="bg-[#0d0f14] border border-[#22262f] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#34D399]" />
            <span className="text-[10px] text-[#8B93A7] uppercase">Time</span>
          </div>
          <span className="text-xs font-bold text-[#F4F1EA]">
            {status === "COMPLETED" && executionTime !== undefined ? `${executionTime} ms` : "--"}
          </span>
        </div>

        <div className="bg-[#0d0f14] border border-[#22262f] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MemoryStick size={14} className="text-[#34D399]" />
            <span className="text-[10px] text-[#8B93A7] uppercase">Memory</span>
          </div>
          <span className="text-xs font-bold text-[#F4F1EA]">
            {status === "COMPLETED" && memoryUsed !== undefined
              ? formatMemory(memoryUsed)
              : "--"}
          </span>
        </div>

        <div className="bg-[#0d0f14] border border-[#22262f] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks size={14} className="text-[#34D399]" />
            <span className="text-[10px] text-[#8B93A7] uppercase">Score</span>
          </div>
          <span className="text-xs font-bold text-[#F4F1EA]">
            {resolvedScore !== undefined ? `${resolvedScore} / 100` : "--"}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 px-4 pt-3 bg-[#06070B] border-b border-[#1a1c24] flex-shrink-0">
        {[
          { key: "stdout" as Tab, label: "Stdout & Logs" },
          { key: "stderr" as Tab, label: "Stderr" },
          {
            key: "testcases" as Tab,
            label: `Test Cases${totalCount ? ` (${passedCount}/${totalCount})` : ""}`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 font-mono text-[10px] uppercase tracking-widest rounded-t-lg border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.key
                ? "text-[#34D399] border-[#34D399] bg-[#0d0f14]"
                : "text-[#8B93A7] border-transparent hover:text-[#F4F1EA]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Output Content Area */}
      <div className="p-4 bg-[#06070B] flex-1 min-h-0 overflow-y-auto">
        {activeTab !== "testcases" ? (
          <>
            <div className="flex items-center justify-end mb-2">
              <button
                onClick={() => copyToClipboard(activeTabText)}
                className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-[#8B93A7] hover:text-[#F4F1EA] px-2 py-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
              >
                {copied ? <Check size={12} className="text-[#34D399]" /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div
              className={`bg-[#0b0d13] border border-[#1a1c24] rounded-xl p-4 font-mono text-xs leading-relaxed shadow-inner min-h-[160px] ${
                activeTab === "stderr" && (stderr || errorMessage)
                  ? "text-[#E2574C]"
                  : "text-[#34D399]"
              }`}
            >
              <pre className="whitespace-pre-wrap break-words">{activeTabText}</pre>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {totalCount === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center bg-[#0b0d13] border border-[#1a1c24] rounded-xl">
                <AlertTriangle size={18} className="text-[#5A5850]" />
                <p className="font-mono text-xs text-[#8B93A7]">
                  {isBusy
                    ? "Test case results will appear here once the judge finishes."
                    : "No test case details available for this run."}
                </p>
              </div>
            ) : (
              testResults.map((test, idx) => (
                <TestCaseCard
                  key={test.testCaseId || idx}
                  test={test}
                  index={idx}
                  defaultOpen={idx === (firstFailedIdx !== -1 ? firstFailedIdx : 0)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Close CTA */}
      {onClose && (
        <div className="p-4 bg-[#0d0f14] border-t border-[#1a1c24] flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-widest text-[#06070B] hover:opacity-90 transition-opacity cursor-pointer"
            style={{
              background: "linear-gradient(180deg, #6FCF97 0%, #12A87E 100%)",
            }}
          >
            Close
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ============================================================================
   Collapsible Accordion Item for Individual Test Cases
   ============================================================================ */

interface TestCaseCardProps {
  test: SubmissionTestResult;
  index: number;
  defaultOpen?: boolean;
}

function TestCaseCard({ test, index, defaultOpen = false }: TestCaseCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const testData = test as Record<string, any>;
  const passed = testData.passed ?? (test.verdict === "ACCEPTED" || test.verdict === "SUCCESS");

  const formatMemory = (kb?: number) => {
    if (kb === undefined || kb === null) return "--";
    if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${kb} KB`;
  };

  return (
    <div
      className={`rounded-xl border font-mono text-xs transition-all overflow-hidden ${
        passed
          ? "border-[#34D399]/30 bg-[#34D399]/5"
          : "border-[#E2574C]/30 bg-[#E2574C]/5"
      }`}
    >
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between cursor-pointer select-none text-left"
      >
        <div className="flex items-center gap-3">
          {passed ? (
            <CheckCircle2 size={16} className="text-[#34D399] flex-shrink-0" />
          ) : (
            <XCircle size={16} className="text-[#E2574C] flex-shrink-0" />
          )}
          <span className="font-bold text-[#F4F1EA]">
            Test Case {test.orderNum !== undefined ? test.orderNum + 1 : index + 1}
          </span>
          {test.verdict && (
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${
                passed
                  ? "bg-[#34D399]/20 text-[#34D399]"
                  : "bg-[#E2574C]/20 text-[#E2574C]"
              }`}
            >
              {test.verdict.replace(/_/g, " ")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-[#8B93A7] text-[11px]">
          {test.timeMs !== undefined && <span>{test.timeMs} ms</span>}
          {test.memoryKb !== undefined && <span>{formatMemory(test.memoryKb)}</span>}
          <div className="text-[#8B93A7] hover:text-[#F4F1EA]">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {/* Accordion Body: Input / Expected Output / Actual Output Diffs */}
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-[#1a1c24] space-y-3 bg-[#0b0d13]/90">
          {testData.input && (
            <div>
              <span className="text-[10px] text-[#8B93A7] uppercase tracking-wider block mb-1">
                Input
              </span>
              <pre className="p-2.5 rounded-lg bg-[#06070B] border border-[#1a1c24] text-[#F4F1EA] overflow-x-auto whitespace-pre-wrap">
                {testData.input}
              </pre>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-[#8B93A7] uppercase tracking-wider block mb-1">
                Your Output
              </span>
              <pre
                className={`p-2.5 rounded-lg border overflow-x-auto whitespace-pre-wrap ${
                  passed
                    ? "bg-[#06070B] border-[#34D399]/30 text-[#34D399]"
                    : "bg-[#06070B] border-[#E2574C]/30 text-[#E2574C]"
                }`}
              >
                {testData.actualOutput || "No output"}
              </pre>
            </div>

            {testData.expectedOutput && (
              <div>
                <span className="text-[10px] text-[#8B93A7] uppercase tracking-wider block mb-1">
                  Expected Output
                </span>
                <pre className="p-2.5 rounded-lg bg-[#06070B] border border-[#1a1c24] text-[#34D399] overflow-x-auto whitespace-pre-wrap">
                  {testData.expectedOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}