"use client";

import React, { useEffect, useRef, useState } from "react";
import ProblemPanel from "@/components/sections/weekly-challenges/solve_page/ProblemPanel";
import CodeEditor from "@/components/sections/weekly-challenges/solve_page/CodeEditor";
import VerdictPanel from "@/components/sections/weekly-challenges/solve_page/VerdictPanel";
import { GripVertical, GripHorizontal, TriangleAlert } from "lucide-react";
import SubmissionHistory from "@/components/sections/weekly-challenges/solve_page/SubmissionHistory";
import { History } from "lucide-react";
import {
  runCode,
  submitCode,
  getSubmission,
} from "@/lib/api-client";

import type { SubmissionState, Language } from "@/lib/types/submission";

/**
 * CodeCell brand palette (kept in sync with CodeEditor.tsx / VerdictPanel.tsx)
 * ------------------------------------------------------------------
 * bg base      #06070B   panel        #0B0D13 / #0D0F14
 * border       #1A1C24   border alt   #22262F
 * text primary #F4F1EA   text muted   #8B93A7   text dim #5A5850
 * accent green #34D399   green soft   #6FCF97   green deep #12A87E
 */

type PageProps = {
  params: Promise<{
    problemId: string;
  }>;
};

const POLL_INTERVAL_MS = 1000;
const MAX_POLL_ERRORS = 3;

export default function Solve({ params }: PageProps) {
  // params is a Promise even in the client — React.use() is the correct way
  // to unwrap it here, since a client component cannot be `async`.
  const { problemId } = React.use(params);

  const [activeAction, setActiveAction] = useState<"RUN" | "SUBMIT" | null>(null);
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "IDLE",
    testResults: [],
  });

  // Track mounted state + in-flight timers/errors so polling never leaks
  // and never spins forever on repeated failures.
  const isMountedRef = useRef(true);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollErrorCountRef = useRef(0);
  const [historyOpen, setHistoryOpen] = useState(false);
const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

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

      pollErrorCountRef.current += 1;

      if (!isMountedRef.current) return;

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

      // Back off and retry rather than giving up on a single transient error.
      pollTimeoutRef.current = setTimeout(() => {
        pollSubmission(submissionId);
      }, POLL_INTERVAL_MS);
    }
  };

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

  function getSubmitErrorMessage(err: unknown): string {
    if (isApiError(err)) {
      if (err.status === 429) {
        const isRateLimit =
          err.code === "RATE_LIMIT_EXCEEDED" ||
          (/limit/i.test(err.message) && !/wait a few seconds|cooldown/i.test(err.message));
        return isRateLimit
          ? "You have reached the submission limit. Please wait before submitting again."
          : "Please wait a few seconds before submitting this problem again.";
      }
      if (err.status === 401) return "Your session has expired. Please sign in again.";
      if (err.status === 404) return "This problem could not be found.";
      if (err.status === 400) return "There was a problem with your submission. Please check your code and try again.";
      if (err.status >= 500) return "Something went wrong on our end. Please try again shortly.";
    }
    return "Couldn't submit your solution. Check your connection and try again.";
  }

  const handleRun = async (code: string, language: Language) => {
    if (!problemId) return;

    try {
      setActiveAction("RUN");
      setSubmission((prev) => ({
        ...prev,
        status: "RUNNING",
        verdict: undefined,
        errorMessage: undefined,
      }));

      const response = await runCode(problemId, {
        language,
        sourceCode: code,
      });

      if (!isMountedRef.current) return;

      // Reflect the run result in the verdict panel so "Run" is visibly
      // doing something, same as "Submit" does.
      setSubmission((prev) => ({
        ...prev,
        status: (response.status ?? "COMPLETED") as any,
        verdict: response.verdict,
        score: response.score,
        executionTime: response.executionTimeMs,
        memoryUsed: response.memoryUsedKb,
        stdout: response.stdout,
        stderr: response.stderr,
        errorMessage: response.errorMessage,
        testResults: response.testResults ?? [],
      }));
    } catch (err) {
      console.error("Run failed:", err);
      if (isMountedRef.current) {
        setSubmission((prev) => ({
          ...prev,
          status: "FAILED",
          errorMessage: "Couldn't run your code. Check your connection and try again.",
        }));
      }
    } finally {
      if (isMountedRef.current) {
        setActiveAction(null);
      }
    }
  };

  const handleSubmit = async (code: string, language: Language) => {
    if (!problemId) return;

    try {
      setActiveAction("SUBMIT");

      const response = await submitCode(problemId, {
        language,
        sourceCode: code,
      });

      if (!isMountedRef.current) return;

      setSubmission({
  status: "QUEUED",
  submissionId: response.submissionId,
  queuePosition: response.queuePosition,
  testResults: [],
});

      pollSubmission(response.submissionId);
    } catch (err) {
  console.error("Submit failed:", err);
  if (isMountedRef.current) {
    setActiveAction(null);
    setSubmission((prev) => ({
      ...prev,
      status: "FAILED",
      errorMessage: getSubmitErrorMessage(err),
    }));
  }
}
  };

  // ---- Panel layout (draggable, LeetCode-style) ----
  // Purely presentational: controls the widths/heights of the three panels.
  // None of the run/submit/poll logic above is affected by this.
  const containerRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(45); // % of container width
  const [editorHeight, setEditorHeight] = useState(60); // % of right column height
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
        setEditorHeight(Math.min(80, Math.max(25, pct)));
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

  const startHorizontalDrag = () => {
    draggingRef.current = "horizontal";
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };
  const startVerticalDrag = () => {
    draggingRef.current = "vertical";
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  if (!problemId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#06070B] text-center px-6">
        <div className="w-10 h-10 rounded-xl bg-[#E2574C]/10 border border-[#E2574C]/30 flex items-center justify-center text-[#E2574C]">
          <TriangleAlert size={18} />
        </div>
        <p className="font-mono text-sm text-[#F4F1EA]">Problem not found.</p>
        <p className="font-mono text-xs text-[#8B93A7]">
          The problem you're looking for doesn't exist or may have been removed.
        </p>
        <a
          href="/weekly-challenges"
          className="mt-2 font-mono text-xs font-bold uppercase tracking-widest text-[#06070B] px-5 py-2 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(180deg, #6FCF97 0%, #12A87E 100%)" }}
        >
          Back to Challenges
        </a>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-screen overflow-hidden bg-[#06070B]">
      {/* Left Panel - problem */}
       <div
         style={{ width: `${leftWidth}%` }}
         className="relative h-screen overflow-y-auto flex-shrink-0 border-r border-[#1a1c24]"
       >
         <ProblemPanel problemId={problemId} />

        <button
          onClick={() => setHistoryOpen(true)}
          title="Submission history"
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#22262f] bg-[#0d0f14]/90 backdrop-blur text-[#8B93A7] hover:text-[#34D399] hover:border-[#34D399]/40 font-mono text-[10px] uppercase tracking-wide transition-colors cursor-pointer"
        >
          <History size={13} />
          History
        </button>

        <SubmissionHistory
          problemId={problemId}
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          refreshKey={historyRefreshKey}
        />
       </div>

      {/* Horizontal drag handle */}
      <div
        onMouseDown={startHorizontalDrag}
        className="group relative w-1.5 flex-shrink-0 cursor-col-resize bg-[#1a1c24] hover:bg-[#34D399]/40 transition-colors"
      >
        <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical size={12} className="text-[#34D399]" />
        </div>
      </div>

      {/* Right Panel - editor + verdict */}
      <div ref={rightColRef} style={{ width: `${100 - leftWidth}%` }} className="h-screen flex flex-col min-w-0">
        <div style={{ height: `${editorHeight}%` }} className="flex-shrink-0 min-h-0">
          <CodeEditor
            status={submission.status}
            activeAction={activeAction}
            onRun={handleRun}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Vertical drag handle */}
        <div
          onMouseDown={startVerticalDrag}
          className="group relative h-1.5 flex-shrink-0 cursor-row-resize bg-[#1a1c24] hover:bg-[#34D399]/40 transition-colors"
        >
          <div className="absolute inset-x-0 -top-1.5 -bottom-1.5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripHorizontal size={12} className="text-[#34D399]" />
          </div>
        </div>

        <div style={{ height: `${100 - editorHeight}%` }} className="min-h-0">
          <VerdictPanel
            status={submission.status}
            verdict={submission.verdict}
            executionTime={submission.executionTime}
            memoryUsed={submission.memoryUsed}
            score={submission.score}
            stdout={submission.stdout}
            stderr={submission.stderr}
            errorMessage={submission.errorMessage}
            testResults={submission.testResults}
          />

           
        </div>
      </div>
    </div>
  );
}