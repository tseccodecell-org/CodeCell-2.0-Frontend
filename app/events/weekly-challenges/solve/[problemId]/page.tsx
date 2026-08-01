"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ProblemPanel from "@/components/sections/weekly-challenges/solve_page/ProblemPanel";
import CodeEditor from "@/components/sections/weekly-challenges/solve_page/CodeEditor";
import VerdictPanel from "@/components/sections/weekly-challenges/solve_page/VerdictPanel";
import SubmissionHistory from "@/components/sections/weekly-challenges/solve_page/SubmissionHistory";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { runCode, submitCode, getSubmission, getRun } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import {
  checkRuntimeHealth,
  getLocalToolchainStatus,
  executeLocalCode,
} from "@/lib/runtime-api";

import type { LanguageKey, RunResponse } from "@/lib/runtime-api";

import type { ProblemDetail } from "@/lib/types/problem";
import type { SubmissionState, Language } from "@/lib/types/submission";

type PageProps = {
  params: Promise<{ problemId: string }>;
};

const POLL_INTERVAL_MS = 1000;
const RUN_POLL_INTERVAL_MS = 2000;
const MAX_POLL_ERRORS = 3;
const LOCAL_TIME_LIMIT_MS = 3000;
const SUBMIT_COOLDOWN_SECONDS = 10;

const RUNTIME_LANGUAGE: Record<Language, LanguageKey> = {
  CPP: "cpp",
  JAVA: "java",
  PYTHON: "python",
};

const LOCAL_VERDICT: Record<string, string> = {
  "Accepted": "ACCEPTED",
  "Compile Error": "COMPILATION_ERROR",
  "Runtime Error": "RUNTIME_ERROR",
  "Time Limit Exceeded": "TIME_LIMIT_EXCEEDED",
  "System Error": "SYSTEM_ERROR",
};

function normalizeLocalVerdict(verdict: string): string {
  return LOCAL_VERDICT[verdict] ?? verdict.toUpperCase().replace(/ /g, "_");
}

async function tryLocalRun(
  code: string,
  language: Language,
  stdin: string
): Promise<RunResponse | null> {
  try {
    if (!(await checkRuntimeHealth())) return null;

    const toolchains = await getLocalToolchainStatus();
    const info = toolchains?.[RUNTIME_LANGUAGE[language]];
    if (!info?.available) return null;

    return await executeLocalCode({
      language: RUNTIME_LANGUAGE[language],
      source: code,
      stdin,
      time_limit_ms: LOCAL_TIME_LIMIT_MS,
    });
  } catch (err) {
    console.warn("Local runtime unavailable, falling back to the judge:", err);
    return null;
  }
}

const difficultyColor = (difficulty?: string) => {
  const d = (difficulty ?? "").toUpperCase();
  if (d === "EASY") return "#34D399";
  if (d === "HARD") return "#E2574C";
  return "#D9A404";
};

export default function Solve({ params }: PageProps) {
  const { problemId } = React.use(params);
  const { isBanned } = useAuth();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [activeAction, setActiveAction] = useState<"RUN" | "SUBMIT" | null>(null);
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "IDLE",
    testResults: [],
  });
  const [leftTab, setLeftTab] = useState<"statement" | "submissions">("statement");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [resultMode, setResultMode] = useState<"RUN" | "SUBMIT" | null>(null);
  const [lastInput, setLastInput] = useState("");
  const [runOrigin, setRunOrigin] = useState<"local" | "server" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loadRequest, setLoadRequest] = useState<{
    language: Language;
    code: string;
    nonce: number;
  } | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const timer = setTimeout(() => setCooldownLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldownLeft]);

  const isMountedRef = useRef(true);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollErrorCountRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
    };
  }, []);

  const starterCode = useMemo(() => {
    const map: Partial<Record<Language, string>> = {};
    for (const lang of problem?.languages ?? []) {
      if (lang.starterCode) map[lang.language as Language] = lang.starterCode;
    }
    return map;
  }, [problem]);

  const handleLoadCode = useCallback((language: Language, code: string) => {
    setLoadRequest({ language, code, nonce: Date.now() });
  }, []);

  const stopPolling = () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  };

  const pollSubmission = async (submissionId: string) => {
    if (!isMountedRef.current) return;

    try {
      const result = await getSubmission(submissionId);
      if (!isMountedRef.current) return;

      pollErrorCountRef.current = 0;

      setSubmission((prev) => ({
        ...prev,
        status: result.status,
        verdict: result.verdict,
        score: result.score,
        executionTime: result.executionTimeMs,
        memoryUsed: result.memoryUsedKb,
        queuePosition: result.queuePosition,
        testResults: result.testResults ?? [],
        errorMessage: result.errorMessage,
      }));

      if (result.status === "COMPLETED" || result.status === "FAILED") {
        setActiveAction(null);
        stopPolling();
        setHistoryRefreshKey((k) => k + 1);
        return;
      }

      pollTimeoutRef.current = setTimeout(() => {
        pollSubmission(submissionId);
      }, POLL_INTERVAL_MS);
    } catch (err) {
      console.error("Polling failed:", err);

      if (!isMountedRef.current) return;

      if (isApiError(err) && err.status === 404) {
        setSubmission((prev) => ({
          ...prev,
          status: "FAILED",
          errorMessage: "The judge lost track of this submission. Please submit again.",
        }));
        setActiveAction(null);
        stopPolling();
        return;
      }

      pollErrorCountRef.current += 1;

      if (pollErrorCountRef.current >= MAX_POLL_ERRORS) {
        setSubmission((prev) => ({
          ...prev,
          status: "FAILED",
          errorMessage:
            "Lost connection to the judge after several attempts. Please try submitting again.",
        }));
        setActiveAction(null);
        stopPolling();
        return;
      }

      pollTimeoutRef.current = setTimeout(() => {
        pollSubmission(submissionId);
      }, POLL_INTERVAL_MS);
    }
  };

  const pollRun = async (runId: string) => {
    if (!isMountedRef.current) return;

    try {
      const result = await getRun(runId);
      if (!isMountedRef.current) return;

      pollErrorCountRef.current = 0;

      const done = result.status === "COMPLETED" || result.status === "FAILED";

      setSubmission((prev) => ({
        ...prev,
        status: done ? "COMPLETED" : "RUNNING",
        stdout: result.stdout,
        stderr: result.stderr,
        executionTime: result.executionTimeMs,
      }));

      if (done) {
        setActiveAction(null);
        stopPolling();
        return;
      }

      pollTimeoutRef.current = setTimeout(() => pollRun(runId), RUN_POLL_INTERVAL_MS);
    } catch (err) {
      console.error("Run polling failed:", err);

      if (!isMountedRef.current) return;

      if (isApiError(err) && err.status === 404) {
        setSubmission((prev) => ({
          ...prev,
          status: "FAILED",
          errorMessage: "The judge lost track of this run. Please try again.",
        }));
        setActiveAction(null);
        stopPolling();
        return;
      }

      pollErrorCountRef.current += 1;

      if (pollErrorCountRef.current >= MAX_POLL_ERRORS) {
        setSubmission((prev) => ({
          ...prev,
          status: "FAILED",
          errorMessage: "Lost connection while running your code. Please try again.",
        }));
        setActiveAction(null);
        stopPolling();
        return;
      }

      pollTimeoutRef.current = setTimeout(() => pollRun(runId), RUN_POLL_INTERVAL_MS);
    }
  };

  function isApiError(
    err: unknown
  ): err is { status: number; code?: string; message: string } {
    return (
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      typeof (err as { status: unknown }).status === "number" &&
      "message" in err &&
      typeof (err as { message: unknown }).message === "string"
    );
  }

  function getCooldownSeconds(err: { code?: string; message: string }): number {
    const stated = /(\d+)\s*second/i.exec(err.message);
    if (stated) return Math.min(90, parseInt(stated[1], 10));
    if (err.code === "RATE_LIMIT_EXCEEDED") return 60;
    return SUBMIT_COOLDOWN_SECONDS;
  }

  function getRunErrorMessage(err: unknown): string {
    if (isApiError(err)) {
      if (err.code === "VALIDATION_ERROR" || err.code === "PROBLEM_NOT_FOUND") {
        return err.message;
      }
      if (err.status === 429) return err.message;
      if (err.status === 400) return err.message || "Your code could not be accepted.";
      if (err.status >= 500)
        return "The judge is having trouble right now. Please try again shortly.";
    }
    return "Couldn't run your code. Check your connection and try again.";
  }

  function getSubmitErrorMessage(err: unknown): string {
    if (isApiError(err)) {
      if (err.status === 401) return "Your session has expired. Please sign in again.";
      if (err.status === 404) return "This problem could not be found.";
      if (err.status === 400)
        return "There was a problem with your submission. Please check your code and try again.";
      if (err.status >= 500)
        return "Something went wrong on our end. Please try again shortly.";
    }
    return "Couldn't submit your solution. Check your connection and try again.";
  }

  const handleRun = async (code: string, language: Language, stdin: string) => {
    if (!problemId) return;

    if (isBanned) {
      setNotice("Your account is suspended, so you cannot run code.");
      return;
    }

    try {
      setActiveAction("RUN");
      setResultMode("RUN");
      setLastInput(stdin);
      pollErrorCountRef.current = 0;
      setSubmission({
        status: "RUNNING",
        verdict: undefined,
        errorMessage: undefined,
        stdout: undefined,
        stderr: undefined,
        testResults: [],
      });

      const local = await tryLocalRun(code, language, stdin);

      if (!isMountedRef.current) return;

      if (local) {
        const verdict = normalizeLocalVerdict(local.verdict);
        setRunOrigin("local");
        setSubmission((prev) => ({
          ...prev,
          status: "COMPLETED",
          verdict: verdict === "ACCEPTED" ? undefined : verdict,
          executionTime: local.execution_time_ms,
          compileTime: local.compile_time_ms,
          stdout: local.stdout,
          stderr: local.stderr,
          errorMessage: local.error,
          testResults: [],
        }));
        setActiveAction(null);
        return;
      }

      setRunOrigin("server");

      const response = await runCode(problemId, { language, sourceCode: code, stdin });

      if (!isMountedRef.current) return;

      const settled = response.status === "COMPLETED" || response.status === "FAILED";

      setSubmission((prev) => ({
        ...prev,
        status: settled ? "COMPLETED" : "RUNNING",
        verdict: response.verdict,
        score: response.score,
        executionTime: response.executionTimeMs,
        memoryUsed: response.memoryUsedKb,
        stdout: response.stdout,
        stderr: response.stderr,
        errorMessage: response.errorMessage,
        testResults: response.testResults ?? [],
      }));

      if (settled) {
        setActiveAction(null);
        return;
      }

      pollRun(response.runId);
    } catch (err) {
      console.error("Run failed:", err);
      if (isMountedRef.current) {
        setActiveAction(null);
        setSubmission((prev) => ({
          ...prev,
          status: "FAILED",
          errorMessage: getRunErrorMessage(err),
        }));
      }
    }
  };

  const handleSubmit = async (code: string, language: Language) => {
    if (!problemId) return;

    if (isBanned) {
      setNotice("Your account is suspended, so you cannot submit solutions.");
      return;
    }

    try {
      setActiveAction("SUBMIT");
      setNotice(null);
      pollErrorCountRef.current = 0;

      const response = await submitCode(problemId, { language, sourceCode: code });

      if (!isMountedRef.current) return;

      setResultMode("SUBMIT");
      setActiveAction(null);
      setSubmission({
        status: "QUEUED",
        submissionId: response.submissionId,
        queuePosition: response.queuePosition,
        testResults: [],
      });
      setHistoryRefreshKey((k) => k + 1);

      stopPolling();
      pollSubmission(response.submissionId);
    } catch (err) {
      console.error("Submit failed:", err);
      if (!isMountedRef.current) return;

      setActiveAction(null);

      if (isApiError(err) && err.status === 429) {
        setCooldownLeft(getCooldownSeconds(err));
        setNotice(err.message || "You have hit the submission limit. Try again shortly.");
        return;
      }

      setResultMode("SUBMIT");
      setSubmission((prev) => ({
        ...prev,
        status: "FAILED",
        errorMessage: getSubmitErrorMessage(err),
      }));
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(45);
  const [editorHeight, setEditorHeight] = useState(62);
  const draggingRef = useRef<"horizontal" | "vertical" | null>(null);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (draggingRef.current === "horizontal" && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        setLeftWidth(Math.min(70, Math.max(25, pct)));
      } else if (draggingRef.current === "vertical" && rightColRef.current) {
        const rect = rightColRef.current.getBoundingClientRect();
        const pct = ((e.clientY - rect.top) / rect.height) * 100;
        setEditorHeight(Math.min(85, Math.max(32, pct)));
      }
    }
    function onMouseUp() {
      draggingRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const startDrag = (axis: "horizontal" | "vertical") => {
    draggingRef.current = axis;
    document.body.style.cursor = axis === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
  };

  const handleProblemLoaded = useCallback((loaded: ProblemDetail) => {
    setProblem(loaded);
  }, []);

  if (!problemId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#06070B] px-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2574C]/30 bg-[#E2574C]/10 text-[#E2574C]">
          <TriangleAlert size={18} />
        </div>
        <p className="font-mono text-sm text-[#F4F1EA]">Problem not found.</p>
        <p className="font-mono text-xs text-[#8B93A7]">
          The problem you are looking for does not exist or may have been removed.
        </p>
        <Link
          href="/events/weekly-challenges/timeline"
          className="mt-2 rounded-xl px-5 py-2 font-mono text-xs font-bold uppercase tracking-widest text-[#06070B] transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)" }}
        >
          Back to Challenges
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#06070B]">
      <header className="flex h-11 shrink-0 items-center justify-between gap-4 border-b border-[#1a1c24] bg-[#0d0f14] px-3">
        <Link
          href="/events/weekly-challenges/timeline"
          className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#8B93A7] transition-colors hover:text-[#F4F1EA]"
        >
          <ArrowLeft size={14} />
          Challenges
        </Link>

        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-sans text-sm font-semibold text-[#F4F1EA]">
            {problem?.title ?? ""}
          </span>
          {problem && (
            <span
              className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: difficultyColor(problem.difficulty) }}
            >
              {problem.difficulty}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-[#8B93A7]">
          {problem && (
            <>
              <span>{problem.timeLimitMs} ms</span>
              <span className="text-[#22262f]">|</span>
              <span>{problem.memoryLimitMb} MB</span>
              <span className="text-[#22262f]">|</span>
              <span>{problem.maxScore} pts</span>
            </>
          )}
        </div>
      </header>

      <div ref={containerRef} className="relative flex min-h-0 flex-1">
        <div
          style={{ width: `${leftWidth}%` }}
          className="flex h-full shrink-0 flex-col overflow-hidden border-r border-[#1a1c24] bg-[#0b0d13]"
        >
          <div className="flex h-10 shrink-0 items-center gap-1 border-b border-[#1a1c24] bg-[#0d0f14] px-2">
            {(
              [
                { key: "statement", text: "Statement" },
                { key: "submissions", text: "Submissions" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setLeftTab(tab.key)}
                className={`rounded px-2.5 py-1 font-mono text-[11px] tracking-wide transition-colors cursor-pointer ${
                  leftTab === tab.key
                    ? "bg-[#151821] text-[#D9A404]"
                    : "text-[#8B93A7] hover:text-[#F4F1EA]"
                }`}
              >
                {tab.text}
              </button>
            ))}
          </div>

          <div className={leftTab === "statement" ? "min-h-0 flex-1" : "hidden"}>
            <ProblemPanel problemId={problemId} onLoaded={handleProblemLoaded} />
          </div>

          <div className={leftTab === "submissions" ? "min-h-0 flex-1" : "hidden"}>
            <SubmissionHistory
              problemId={problemId}
              refreshKey={historyRefreshKey}
              onLoadCode={handleLoadCode}
            />
          </div>
        </div>

        <div
          onMouseDown={() => startDrag("horizontal")}
          className="w-1 shrink-0 cursor-col-resize bg-[#1a1c24] transition-colors hover:bg-[#D9A404]/40"
        />

        <div
          ref={rightColRef}
          style={{ width: `calc(${100 - leftWidth}% - 4px)` }}
          className="flex h-full min-w-0 flex-col"
        >
          <div
            style={{ height: `${editorHeight}%` }}
            className="min-h-0 shrink-0 overflow-hidden"
          >
            <CodeEditor
              problemId={problemId}
              status={submission.status}
              activeAction={activeAction}
              starterCode={starterCode}
              loadRequest={loadRequest}
              cooldownLeft={cooldownLeft}
              banned={isBanned}
              onRun={handleRun}
              onSubmit={handleSubmit}
            />
          </div>

          <div
            onMouseDown={() => startDrag("vertical")}
            className="h-1 shrink-0 cursor-row-resize bg-[#1a1c24] transition-colors hover:bg-[#D9A404]/40"
          />

          <div className="min-h-0 flex-1">
            <VerdictPanel
              status={submission.status}
              mode={resultMode}
              input={lastInput}
              origin={resultMode === "RUN" ? runOrigin : null}
              notice={notice}
              compileTime={submission.compileTime}
              verdict={submission.verdict}
              executionTime={submission.executionTime}
              memoryUsed={submission.memoryUsed}
              score={submission.score}
              stdout={submission.stdout}
              stderr={submission.stderr}
              errorMessage={submission.errorMessage}
              queuePosition={submission.queuePosition}
              testResults={submission.testResults}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
