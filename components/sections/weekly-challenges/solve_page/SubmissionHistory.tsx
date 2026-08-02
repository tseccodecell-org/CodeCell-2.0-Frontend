"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  FileCode2,
} from "lucide-react";
import { getSubmissionHistory, getSubmission, ApiError } from "@/lib/api-client";
import type { SubmissionResult, Language } from "@/lib/types/submission";

const tokens = {
  panelAlt: "#0d0f14",
  borderAlt: "#22262f",
  ink: "#F4F1EA",
  muted: "#8B93A7",
  dim: "#5A5850",
  green: "#34D399",
  red: "#E2574C",
  gold: "#D9A404",
  violet: "#A78BFA",
};

const PENDING_POLL_MS = 3000;

interface SubmissionHistoryProps {
  problemId: string;
  /** bump this after a new submission completes to force a refetch */
  refreshKey?: number;
  onLoadCode?: (language: Language, code: string) => void;
}

function verdictColor(
  status: SubmissionResult["status"],
  verdict: string,
  invalidated?: boolean
) {
  if (invalidated) return tokens.violet;
  if (status === "FAILED") return tokens.red;
  if (status === "QUEUED" || status === "RUNNING") return tokens.gold;
  if (verdict === "ACCEPTED" || verdict === "SUCCESS") return tokens.green;
  return tokens.red;
}

export default function SubmissionHistory({
  problemId,
  refreshKey = 0,
  onLoadCode,
}: SubmissionHistoryProps) {
  const [items, setItems] = useState<SubmissionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, SubmissionResult>>({});
  const [detailLoading, setDetailLoading] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpanded = useCallback(
    async (id: string) => {
      if (expandedId === id) {
        setExpandedId(null);
        return;
      }
      setExpandedId(id);
      if (details[id]) return;

      setDetailLoading(id);
      setDetailError((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      try {
        const full = await getSubmission(id);
        setDetails((prev) => ({ ...prev, [id]: full }));
      } catch (err) {
        setDetailError((prev) => ({
          ...prev,
          [id]:
            err instanceof ApiError
              ? err.message
              : "Couldn't load this submission's code.",
        }));
      } finally {
        setDetailLoading(null);
      }
    },
    [expandedId, details]
  );

  const copyCode = useCallback(async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500);
    } catch {
      setDetailError((prev) => ({ ...prev, [id]: "Couldn't copy to clipboard." }));
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSubmissionHistory(problemId);
      setItems(data ?? []);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't load submission history. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    fetchHistory();
  }, [refreshKey, fetchHistory]);

  const hasPending = items.some(
    (i) => i.status === "QUEUED" || i.status === "RUNNING"
  );

  useEffect(() => {
    if (!hasPending) return;
    const timer = setInterval(fetchHistory, PENDING_POLL_MS);
    return () => clearInterval(timer);
  }, [hasPending, fetchHistory]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between px-4 pt-4">
        <span
          className="font-mono text-[11px] uppercase tracking-wide"
          style={{ color: tokens.dim }}
        >
          {items.length} submission{items.length === 1 ? "" : "s"}
        </span>
        <button
          onClick={fetchHistory}
          title="Refresh"
          className="rounded p-1.5 transition-colors hover:bg-white/5 cursor-pointer"
          style={{ color: tokens.muted }}
        >
          <RotateCw size={13} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 pt-3">
        {loading && items.length === 0 && (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded"
                style={{ background: "rgba(217,164,4,0.06)" }}
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="font-mono text-xs" style={{ color: tokens.red }}>
            {error}
          </p>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="font-mono text-xs" style={{ color: tokens.dim }}>
            No submissions yet for this problem.
          </p>
        )}

        {items.map((item) => {
          const color = verdictColor(item.status, item.verdict, item.invalidated);
          const isBusy = item.status === "QUEUED" || item.status === "RUNNING";
          const isOpen = expandedId === item.id;
          const detail = details[item.id];
          const rowError = detailError[item.id];
          const language = detail?.language ?? item.language;

          return (
            <div
              key={item.id}
              className="rounded border"
              style={{ borderColor: tokens.borderAlt, background: tokens.panelAlt }}
            >
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full cursor-pointer px-3 py-2.5 text-left transition-colors hover:bg-white/3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide"
                    style={{ color }}
                  >
                    {isOpen ? (
                      <ChevronDown size={12} style={{ color: tokens.muted }} />
                    ) : (
                      <ChevronRight size={12} style={{ color: tokens.muted }} />
                    )}
                    {isBusy ? (
                      <Clock size={12} />
                    ) : color === tokens.green ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {isBusy ? item.status : item.verdict?.replace(/_/g, " ") || item.status}
                  </span>
                  {item.language && (
                    <span
                      className="font-mono text-[10px] uppercase tracking-wide"
                      style={{ color: tokens.muted }}
                    >
                      {item.language}
                    </span>
                  )}
                </div>

                <div
                  className="mt-1.5 flex items-center gap-3 pl-4.5 font-mono text-[10px]"
                  style={{ color: tokens.muted }}
                >
                  {item.status === "COMPLETED" && (
                    <>
                      <span style={item.invalidated ? { textDecoration: "line-through" } : undefined}>
                        {item.score ?? 0} pts
                      </span>
                      <span>{item.executionTimeMs} ms</span>
                    </>
                  )}
                  {item.invalidated && (
                    <span
                      className="border px-1.5 py-0.5 tracking-wide"
                      style={{ color: tokens.violet, borderColor: `${tokens.violet}55` }}
                      title="This submission was invalidated by an admin and awards no points."
                    >
                      INVALIDATED
                    </span>
                  )}
                  {item.status === "QUEUED" && (
                    <span style={{ color: tokens.gold }}>
                      {item.queuePosition
                        ? `#${item.queuePosition} in queue`
                        : "waiting for the judge"}
                    </span>
                  )}
                  {item.status === "RUNNING" && (
                    <span style={{ color: tokens.gold }}>judging now</span>
                  )}
                  {item.submittedAt && (
                    <span>{new Date(item.submittedAt).toLocaleString()}</span>
                  )}
                </div>
              </button>

              {isOpen && (
                <div
                  className="border-t px-3 py-2.5"
                  style={{ borderColor: tokens.borderAlt }}
                >
                  {detailLoading === item.id && (
                    <div
                      className="h-16 animate-pulse rounded"
                      style={{ background: "rgba(217,164,4,0.06)" }}
                    />
                  )}

                  {rowError && (
                    <p className="font-mono text-[11px]" style={{ color: tokens.red }}>
                      {rowError}
                    </p>
                  )}

                  {detail && !detail.sourceCode && (
                    <p className="font-mono text-[11px]" style={{ color: tokens.dim }}>
                      No code stored for this submission.
                    </p>
                  )}

                  {detail?.sourceCode && (
                    <>
                      <div className="mb-2 flex items-center gap-2">
                        <button
                          onClick={() => copyCode(item.id, detail.sourceCode as string)}
                          className="flex cursor-pointer items-center gap-1 rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors hover:bg-white/5"
                          style={{ borderColor: tokens.borderAlt, color: tokens.muted }}
                        >
                          {copiedId === item.id ? (
                            <Check size={11} style={{ color: tokens.green }} />
                          ) : (
                            <Copy size={11} />
                          )}
                          {copiedId === item.id ? "Copied" : "Copy"}
                        </button>
                        {onLoadCode && language && (
                          <button
                            onClick={() =>
                              onLoadCode(language, detail.sourceCode as string)
                            }
                            className="flex cursor-pointer items-center gap-1 rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors hover:bg-white/5"
                            style={{ borderColor: tokens.gold, color: tokens.gold }}
                          >
                            <FileCode2 size={11} />
                            Load into editor
                          </button>
                        )}
                      </div>
                      <pre
                        className="max-h-72 overflow-auto rounded p-2.5 font-mono text-[11px] leading-relaxed"
                        style={{ background: "#0a0c11", color: tokens.ink }}
                      >
                        {detail.sourceCode}
                      </pre>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
