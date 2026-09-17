"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";

import ProblemPanel from "@/components/sections/weekly-challenges/solve_page/ProblemPanel";
import CodeEditor from "@/components/sections/weekly-challenges/solve_page/CodeEditor";
import VerdictPanel from "@/components/sections/weekly-challenges/solve_page/VerdictPanel";
import SubmissionHistory from "@/components/sections/weekly-challenges/solve_page/SubmissionHistory";
import {
  runCode,
  submitCode,
  getSubmission,
  getRun,
  getFinaleStatus,
  listTemplates,
  ApiError,
} from "@/lib/api-client";
import type { TemplateResponse } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";

import type { ProblemDetail } from "@/lib/types/problem";
import type { SubmissionState, Language } from "@/lib/types/submission";
import type { FinaleState } from "@/lib/schemas/finale";
import { toSubmissionStatus, isTerminalStatus } from "@/lib/schemas/submission";
import { FINALE_BUFFERS_KEY } from "./FinaleLobby";

const POLL_INTERVAL_MS = 1000;
const RUN_POLL_INTERVAL_MS = 2000;
const MAX_POLL_ERRORS = 3;
const FINALE_STATUS_REFRESH_MS = 30000;
const SUBMIT_COOLDOWN_SECONDS = 10;

function readSavedBuffers(): {
  buffers: Partial<Record<Language, string>>;
  activeLanguage?: Language;
} {
  if (typeof window === "undefined") return { buffers: {} };
  try {
    const raw = sessionStorage.getItem(FINALE_BUFFERS_KEY);
    if (!raw) return { buffers: {} };
    // the buffers stay for the whole session so every problem the participant
    // opens gets their templates, not just the first one
    const parsed = JSON.parse(raw) as {
      buffers: Partial<Record<Language, string>>;
      activeLanguage?: Language;
    };
    return { buffers: parsed.buffers ?? {}, activeLanguage: parsed.activeLanguage };
  } catch {
    return { buffers: {} };
  }
}

function readCachedCode(problemId: string, language: Language): string | undefined {
  if (typeof window === "undefined" || !problemId) return undefined;
  try {
    const raw = localStorage.getItem(`codecell_code_${problemId}`);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<Record<Language, string>>;
    return parsed?.[language] || undefined;
  } catch {
    return undefined;
  }
}

function isApiError(err: unknown): err is { status: number; code?: string; message: string } {
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
    if (err.code === "VALIDATION_ERROR" || err.code === "PROBLEM_NOT_FOUND") return err.message;
    if (err.status === 429) return err.message;
    if (err.status === 400) return err.message || "Your code could not be accepted.";
    if (err.status >= 500) return "The judge is having trouble right now. Please try again shortly.";
  }
  return "Couldn't run your code. Check your connection and try again.";
}

function getSubmitErrorMessage(err: unknown): string {
  if (isApiError(err)) {
    if (err.status === 401) return "Your session has expired. Please sign in again.";
    if (err.status === 404) return "This problem could not be found.";
    if (err.status === 400)
      return "There was a problem with your submission. Please check your code and try again.";
    if (err.status >= 500) return "Something went wrong on our end. Please try again shortly.";
  }
  return "Couldn't submit your solution. Check your connection and try again.";
}

const difficultyColor = (difficulty?: string) => {
  const d = (difficulty ?? "").toUpperCase();
  if (d === "EASY") return "#34D399";
  if (d === "HARD") return "#E2574C";
  return "#D9A404";
};

function formatRemaining(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m left`;
  return `${minutes}:${String(secs).padStart(2, "0")} left`;
}

function FinaleTimer({ initialRemainingSeconds }: { initialRemainingSeconds: number }) {
  const [remaining, setRemaining] = useState(initialRemainingSeconds);

  useEffect(() => {
    setRemaining(initialRemainingSeconds);
  }, [initialRemainingSeconds]);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  return (
    <span data-testid="finale-timer" className="font-mono text-[11px] text-[#D9A404]">
      {formatRemaining(remaining)}
    </span>
  );
}

export default function FinaleWorkspace({ problemId }: { problemId: string }) {
  const { isBanned } = useAuth();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [activeAction, setActiveAction] = useState<"RUN" | "SUBMIT" | null>(null);
  const [submission, setSubmission] = useState<SubmissionState>({ status: "IDLE", testResults: [] });
  const [leftTab, setLeftTab] = useState<"statement" | "submissions" | "templates">("statement");
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [mobilePane, setMobilePane] = useState<"problem" | "code" | "result">("problem");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [resultMode, setResultMode] = useState<"RUN" | "SUBMIT" | null>(null);
  const [lastInput, setLastInput] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [loadRequest, setLoadRequest] = useState<{
    language: Language;
    code: string;
    nonce: number;
    skipConfirm?: boolean;
  } | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  const [finaleState, setFinaleState] = useState<FinaleState | null>(null);
  const [finaleRemainingSeconds, setFinaleRemainingSeconds] = useState<number | null>(null);

  const savedBuffers = useMemo(() => readSavedBuffers(), []);

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

  // the finale's status (and thus the timer and pause/end banners) belongs to
  // the week the problem is attached to, not the problem itself
  useEffect(() => {
    const weekId = problem?.weekId;
    if (!weekId) return;

    let cancelled = false;

    const refresh = () => {
      getFinaleStatus(weekId)
        .then((status) => {
          if (cancelled) return;
          setFinaleState(status.state);
          setFinaleRemainingSeconds(status.remainingSeconds);
        })
        .catch((err) => {
          if (cancelled) return;
          // a workspace opened directly (not through the lobby) may not carry
          // finale access — the run/submit endpoints are the real gate, so a
          // failed status check here just means no timer/banner is shown
          if (!(err instanceof ApiError)) console.error("Finale status check failed:", err);
        });
    };

    refresh();
    const interval = setInterval(refresh, FINALE_STATUS_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [problem?.weekId]);

  const starterCode = useMemo(() => {
    const map: Partial<Record<Language, string>> = {};
    for (const lang of problem?.languages ?? []) {
      if (lang.starterCode) map[lang.language as Language] = lang.starterCode;
    }
    // a template chosen in the lobby's loader takes priority over the
    // problem's own starter code for whichever languages it filled in
    return { ...map, ...savedBuffers.buffers };
  }, [problem, savedBuffers]);

  useEffect(() => {
    let cancelled = false;
    listTemplates()
      .then((list) => {
        if (!cancelled) setTemplates(list);
      })
      .catch(() => {
        if (!cancelled) setTemplates([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoadCode = useCallback((language: Language, code: string) => {
    setLoadRequest({ language, code, nonce: Date.now() });
  }, []);

  // switch to the language the participant picked in the template loader so
  // the workspace doesn't open on an empty CPP tab while their real code
  // sits under a different one. code already cached for this problem wins over
  // the template, otherwise reopening a problem would wipe work in progress.
  // skipConfirm because nothing is at risk yet on an initial load
  useEffect(() => {
    const lang = savedBuffers.activeLanguage;
    if (!lang) return;
    const code = readCachedCode(problemId, lang) ?? savedBuffers.buffers[lang];
    if (code === undefined) return;
    setLoadRequest({ language: lang, code, nonce: -1, skipConfirm: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        status: toSubmissionStatus(result.status),
        verdict: result.verdict,
        score: result.score,
        executionTime: result.executionTimeMs,
        memoryUsed: result.memoryUsedKb,
        queuePosition: result.queuePosition,
        testResults: result.testResults,
        errorMessage: result.errorMessage,
      }));

      if (isTerminalStatus(result.status)) {
        setActiveAction(null);
        stopPolling();
        setHistoryRefreshKey((k) => k + 1);
        return;
      }

      pollTimeoutRef.current = setTimeout(() => pollSubmission(submissionId), POLL_INTERVAL_MS);
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
          errorMessage: "Lost connection to the judge after several attempts. Please try submitting again.",
        }));
        setActiveAction(null);
        stopPolling();
        return;
      }

      pollTimeoutRef.current = setTimeout(() => pollSubmission(submissionId), POLL_INTERVAL_MS);
    }
  };

  const pollRun = async (runId: string) => {
    if (!isMountedRef.current) return;

    try {
      const result = await getRun(runId);
      if (!isMountedRef.current) return;

      pollErrorCountRef.current = 0;
      const done = isTerminalStatus(result.status);

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

  const handleRun = async (code: string, language: Language, stdin: string) => {
    if (!problemId) return;

    if (isBanned) {
      setNotice("Your account is suspended, so you cannot run code.");
      return;
    }

    try {
      setActiveAction("RUN");
      setResultMode("RUN");
      setMobilePane("result");
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

      const response = await runCode(problemId, { language, sourceCode: code, stdin });
      if (!isMountedRef.current) return;

      const settled = isTerminalStatus(response.status);

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
        setSubmission((prev) => ({ ...prev, status: "FAILED", errorMessage: getRunErrorMessage(err) }));
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
      setMobilePane("result");
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
      setSubmission((prev) => ({ ...prev, status: "FAILED", errorMessage: getSubmitErrorMessage(err) }));
    }
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
        <Link
          href="/events/finale/contest"
          className="mt-2 rounded-xl px-5 py-2 font-mono text-xs font-bold uppercase tracking-widest text-[#06070B] transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)" }}
        >
          Back to Finale
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#06070B]">
      <header className="flex h-11 shrink-0 items-center justify-between gap-4 border-b border-[#1a1c24] bg-[#0d0f14] px-3">
        <Link
          href="/events/finale/contest"
          className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#8B93A7] transition-colors hover:text-[#F4F1EA]"
        >
          <ArrowLeft size={14} />
          Finale
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
          {finaleState === "LIVE" && finaleRemainingSeconds !== null && (
            <FinaleTimer initialRemainingSeconds={finaleRemainingSeconds} />
          )}
          {finaleState === "PAUSED" && (
            <span className="text-[#D9A404]">Scoring paused</span>
          )}
          {finaleState === "ENDED" && <span className="text-[#8B93A7]">Contest ended</span>}
          {problem && (
            <span className="hidden items-center gap-3 sm:flex">
              <span>{problem.timeLimitMs} ms</span>
              <span className="text-[#22262f]">|</span>
              <span>{problem.memoryLimitMb} MB</span>
              <span className="text-[#22262f]">|</span>
              <span>{problem.maxScore} pts</span>
            </span>
          )}
        </div>
      </header>

      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-[#1a1c24] bg-[#0d0f14] px-2 md:hidden">
        {(
          [
            { key: "problem", text: "Problem" },
            { key: "code", text: "Code" },
            { key: "result", text: "Result" },
          ] as const
        ).map((pane) => (
          <button
            key={pane.key}
            onClick={() => setMobilePane(pane.key)}
            className={`flex-1 rounded px-2.5 py-1 text-center font-mono text-[11px] tracking-wide transition-colors cursor-pointer ${
              mobilePane === pane.key
                ? "bg-[#151821] text-[#D9A404]"
                : "text-[#8B93A7] hover:text-[#F4F1EA]"
            }`}
          >
            {pane.text}
          </button>
        ))}
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
        <div
          className={`h-full w-full flex-col overflow-hidden border-[#1a1c24] bg-[#0b0d13] md:h-full md:w-[45%] md:shrink-0 md:border-r ${
            mobilePane === "problem" ? "flex" : "hidden"
          } md:flex`}
        >
          <div className="flex h-10 shrink-0 items-center gap-1 border-b border-[#1a1c24] bg-[#0d0f14] px-2">
            {(
              [
                { key: "statement", text: "Statement" },
                { key: "templates", text: "Templates" },
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

          <div className={leftTab === "templates" ? "min-h-0 flex-1 overflow-y-auto" : "hidden"}>
            {templates.length === 0 ? (
              <p className="px-4 py-5 font-sans text-sm text-[#8B93A7]">
                You saved no templates before the round.
              </p>
            ) : (
              <div className="flex flex-col gap-2 p-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="rounded-lg border border-[#22262f] bg-[#0d0f14] p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-sans text-sm text-[#F4F1EA]">
                        {template.name}
                      </span>
                      <button
                        onClick={() => handleLoadCode(template.language, template.sourceCode)}
                        className="shrink-0 rounded border border-[#D9A404]/60 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-[#D9A404] transition-colors hover:bg-[#D9A404] hover:text-[#06070B] cursor-pointer"
                      >
                        Load into editor
                      </button>
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-[#8B93A7]">
                      {template.language}
                    </p>
                    <pre className="mt-2 max-h-40 overflow-auto font-mono text-[11px] leading-relaxed text-[#8B93A7]">
                      {template.sourceCode}
                    </pre>
                  </div>
                ))}
              </div>
            )}
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
          className={`h-full w-full min-w-0 flex-col md:flex md:w-[55%] ${
            mobilePane === "code" || mobilePane === "result" ? "flex" : "hidden"
          }`}
        >
          <div
            className={`min-h-0 w-full flex-col overflow-hidden md:h-[62%] md:shrink-0 ${
              mobilePane === "code" ? "flex flex-1" : "hidden"
            } md:flex md:flex-none`}
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
            className={`min-h-0 w-full flex-1 md:flex ${mobilePane === "result" ? "flex" : "hidden"}`}
          >
            <VerdictPanel
              status={submission.status}
              mode={resultMode}
              input={lastInput}
              notice={notice}
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
