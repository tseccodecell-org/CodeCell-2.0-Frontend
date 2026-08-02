"use client";

/**
 * ProblemPanel
 * ------------
 * A left-side panel that renders the response of GET /api/problems/{problemId}.
 *
 * Usage — pass data you already fetched:
 *   <ProblemPanel problem={problemData} />
 *
 * Usage — let the panel fetch it for you:
 *   <ProblemPanel problemId="11111111-1111-1111-1111-111111111111" />
 *
 * Usage — custom fetch base (e.g. different API host):
 *   <ProblemPanel problemId={id} apiBaseUrl="https://api.example.com" />
 */

import { useEffect, useState } from "react";
import { getProblem, ApiError } from "@/lib/api-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  MemoryStick,
  Trophy,
  ChevronDown,
  Copy,
  Check,
  Tag as TagIcon,
  AlertTriangle,
} from "lucide-react";
import type { ProblemDetail, ProblemExample } from "@/lib/types/problem";
import { MarkdownRenderer } from "@/components/layout/MarkdownRenderer";

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------

interface ProblemPanelProps {
  /** Fully-loaded problem data. Skips fetching entirely if provided. */
  problem?: ProblemDetail;
  /** Problem id to fetch from the API. Ignored if `problem` is provided. */
  problemId?: string;
  /** Base URL to prefix onto /api/problems/{id}. Defaults to same-origin. */
  apiBaseUrl?: string;
  /** Called once the problem has been fetched, so the page can share it. */
  onLoaded?: (problem: ProblemDetail) => void;
  /** Extra class names for the outer panel. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Design tokens — CodeCell brand palette, kept in sync with CodeEditor.tsx,
// VerdictPanel.tsx and the Solve page.
// ---------------------------------------------------------------------------
// bg base      #06070B   panel        #0B0D13 / #0D0F14
// border       #1A1C24   border alt   #22262F
// text primary #F4F1EA   text muted   #8B93A7   text dim #5A5850
// accent gold  #D9A404   gold soft    #F5C451   gold deep  #D97706
// easy green   #34D399   (difficulty only)
// error red    #E2574C

const tokens = {
  bg: "#06070B",
  panel: "#0b0d13",
  panelAlt: "#0d0f14",
  border: "#1a1c24",
  borderAlt: "#22262f",
  ink: "#F4F1EA",
  muted: "#8B93A7",
  dim: "#5A5850",
  green: "#34D399",
  goldSoft: "#F5C451",
  goldDeep: "#D97706",
  gold: "#D9A404",
  red: "#E2574C",
};

const difficultyColor = (difficulty: string) => {
  const d = difficulty.toUpperCase();
  if (d === "EASY") return tokens.green;
  if (d === "HARD") return tokens.red;
  return tokens.gold; // MEDIUM or unknown
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5"
      style={{
        border: `1px solid ${tokens.borderAlt}`,
        background: tokens.panelAlt,
        color: tokens.muted,
      }}
    >
      <span style={{ color: tokens.gold }}>{icon}</span>
      <span className="text-[11px] tracking-wide font-mono">{label}</span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="w-1 h-3 rounded-full" style={{ background: tokens.gold }} />
        <h3
          className="text-[11px] font-mono font-bold uppercase tracking-[0.14em]"
          style={{ color: tokens.gold }}
        >
          {title}
        </h3>
      </div>
      <div
        className="text-[13.5px] leading-relaxed font-sans"
        style={{ color: tokens.ink, opacity: 0.9 }}
      >
        {children}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          // clipboard access denied — fail silently, nothing to recover
        }
      }}
      className="flex items-center gap-1 rounded px-1.5 py-1 text-[10px] font-mono uppercase tracking-wide transition-colors cursor-pointer hover:bg-white/5"
      style={{ color: copied ? tokens.gold : tokens.muted }}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ExampleCard({ example, index }: { example: ProblemExample; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: `1px solid ${tokens.border}`, background: tokens.panelAlt }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2.5 cursor-pointer"
        style={{ background: "rgba(217,164,4,0.05)" }}
      >
        <span
          className="text-[11px] font-mono font-semibold uppercase tracking-wide"
          style={{ color: tokens.ink }}
        >
          Example {index + 1}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={14} style={{ color: tokens.muted }} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="flex flex-col gap-2.5 px-3 pb-3 pt-1">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wide" style={{ color: tokens.muted }}>
                    Input
                  </span>
                  <CopyButton text={example.input} />
                </div>
                <pre
                  className="whitespace-pre-wrap break-words rounded-md px-2.5 py-2 text-[12px] font-mono"
                  style={{
                    background: tokens.bg,
                    color: tokens.gold,
                    border: `1px solid ${tokens.border}`,
                  }}
                >
                  {example.input || "\u2014"}
                </pre>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wide" style={{ color: tokens.muted }}>
                    Output
                  </span>
                  <CopyButton text={example.output} />
                </div>
                <pre
                  className="whitespace-pre-wrap break-words rounded-md px-2.5 py-2 text-[12px] font-mono"
                  style={{
                    background: tokens.bg,
                    color: tokens.gold,
                    border: `1px solid ${tokens.border}`,
                  }}
                >
                  {example.output || "\u2014"}
                </pre>
              </div>

              {example.explanation && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wide" style={{ color: tokens.muted }}>
                    Explanation
                  </span>
                  <div className="mt-1 text-[12.5px] leading-relaxed font-sans" style={{ color: tokens.ink, opacity: 0.85 }}>
                    <MarkdownRenderer content={example.explanation} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading / error states
// ---------------------------------------------------------------------------

function PanelSkeleton() {
  const bar = (w: string) => (
    <div
      className="h-3 rounded animate-pulse"
      style={{ width: w, background: "rgba(217,164,4,0.08)" }}
    />
  );
  return (
    <div className="flex flex-col gap-4 p-6">
      {bar("40%")}
      {bar("70%")}
      <div className="flex gap-2 pt-2">
        {bar("28%")}
        {bar("28%")}
        {bar("28%")}
      </div>
      <div className="pt-4 flex flex-col gap-2">
        {bar("100%")}
        {bar("95%")}
        {bar("85%")}
      </div>
    </div>
  );
}

function PanelError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(226,87,76,0.1)", border: `1px solid rgba(226,87,76,0.3)` }}>
        <AlertTriangle size={16} style={{ color: tokens.red }} />
      </div>
      <span className="text-[11px] font-mono font-bold uppercase tracking-wide" style={{ color: tokens.red }}>
        Couldn't load this problem
      </span>
      <p className="text-[13px] font-sans" style={{ color: tokens.muted }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 font-mono text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-opacity hover:opacity-90 cursor-pointer"
          style={{ color: tokens.bg, background: `linear-gradient(180deg, ${tokens.goldSoft} 0%, ${tokens.goldDeep} 100%)` }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const DEFAULT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function ProblemPanel({
  problem: problemProp,
  problemId,
  apiBaseUrl = DEFAULT_API_BASE_URL,
  onLoaded,
  className = "",
}: ProblemPanelProps) {
  const [problem, setProblem] = useState<ProblemDetail | null>(problemProp ?? null);
  const [loading, setLoading] = useState<boolean>(!problemProp && !!problemId);
  const [error, setError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    if (problemProp || !problemId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);


    getProblem(problemId, apiBaseUrl)
      .then((data) => {
        if (cancelled) return;
        setProblem(data);
        onLoaded?.(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : err?.message ??
                "Something went wrong fetching this problem. Check your connection and try again."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [problemId, problemProp, apiBaseUrl, retryTick, onLoaded]);

  return (
    <aside
      className={`flex h-full w-full shrink-0 flex-col overflow-y-auto ${className}`}
      style={{ background: tokens.panel }}
    >
      {loading && <PanelSkeleton />}
      {!loading && error && (
        <PanelError message={error} onRetry={() => setRetryTick((t) => t + 1)} />
      )}
      {!loading && !error && !problem && (
        <div className="flex flex-col items-start gap-2 p-6">
          <span className="text-[11px] font-mono uppercase tracking-wide" style={{ color: tokens.dim }}>
            No problem selected
          </span>
        </div>
      )}

      {!loading && !error && problem && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col gap-6 p-6"
        >
          {/* Title + difficulty */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: difficultyColor(problem.difficulty) }}
              />
              <span
                className="text-[11px] font-mono font-semibold uppercase tracking-[0.14em]"
                style={{ color: difficultyColor(problem.difficulty) }}
              >
                {problem.difficulty}
              </span>
            </div>
            <h1
              className="text-[24px] font-bold leading-tight font-sans"
              style={{ color: tokens.ink }}
            >
              {problem.title}
            </h1>
          </div>

          {/* Stat row */}
          <div className="flex flex-wrap gap-2">
            <StatChip icon={<Clock size={12} />} label={`${problem.timeLimitMs} ms`} />
            <StatChip icon={<MemoryStick size={12} />} label={`${problem.memoryLimitMb} MB`} />
            <StatChip icon={<Trophy size={12} />} label={`${problem.maxScore} pts`} />
          </div>

          {/* Tags */}
          {problem.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <TagIcon size={12} style={{ color: tokens.muted }} />
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2.5 py-0.5 text-[10.5px] font-mono tracking-wide"
                  style={{
                    color: tokens.gold,
                    border: `1px solid ${tokens.borderAlt}`,
                    background: tokens.panelAlt,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ borderTop: `1px solid ${tokens.border}` }} />

          {/* Description */}
          <Section title="Description">
            <MarkdownRenderer content={problem.description} />
          </Section>

          {/* Input / Output format */}
          {(problem.inputFormat || problem.outputFormat) && (
            <div className="grid grid-cols-1 gap-4">
              {problem.inputFormat && (
                <Section title="Input">
                  <MarkdownRenderer content={problem.inputFormat} />
                </Section>
              )}
              {problem.outputFormat && (
                <Section title="Output">
                  <MarkdownRenderer content={problem.outputFormat} />
                </Section>
              )}
            </div>
          )}

          {/* Constraints */}
          {problem.constraints && (
            <Section title="Constraints">
              <MarkdownRenderer content={problem.constraints} />
            </Section>
          )}

          {/* Examples */}
          {problem.examples.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3 rounded-full" style={{ background: tokens.gold }} />
                <h3
                  className="text-[11px] font-mono font-bold uppercase tracking-[0.14em]"
                  style={{ color: tokens.gold }}
                >
                  Examples
                </h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {problem.examples.map((ex, i) => (
                  <ExampleCard key={i} example={ex} index={i} />
                ))}
              </div>
            </div>
          )}

        </motion.div>
      )}
    </aside>
  );
}