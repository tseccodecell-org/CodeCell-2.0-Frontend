"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Clock, RotateCw } from "lucide-react";
import { getSubmissionHistory, ApiError } from "@/lib/api-client";
import type { SubmissionResult } from "@/lib/types/submission";

const tokens = {
  panelAlt: "#0d0f14",
  borderAlt: "#22262f",
  ink: "#F4F1EA",
  muted: "#8B93A7",
  dim: "#5A5850",
  green: "#34D399",
  red: "#E2574C",
  gold: "#D9A404",
};

interface SubmissionHistoryProps {
  problemId: string;
  /** bump this after a new submission completes to force a refetch */
  refreshKey?: number;
}

function verdictColor(status: SubmissionResult["status"], verdict: string) {
  if (status === "FAILED") return tokens.red;
  if (status === "QUEUED" || status === "RUNNING") return tokens.gold;
  if (verdict === "ACCEPTED" || verdict === "SUCCESS") return tokens.green;
  return tokens.red;
}

export default function SubmissionHistory({
  problemId,
  refreshKey = 0,
}: SubmissionHistoryProps) {
  const [items, setItems] = useState<SubmissionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          const color = verdictColor(item.status, item.verdict);
          const isBusy = item.status === "QUEUED" || item.status === "RUNNING";
          return (
            <div
              key={item.id}
              className="rounded border px-3 py-2.5"
              style={{ borderColor: tokens.borderAlt, background: tokens.panelAlt }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide"
                  style={{ color }}
                >
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
                className="mt-1.5 flex items-center gap-3 font-mono text-[10px]"
                style={{ color: tokens.muted }}
              >
                {item.status === "COMPLETED" && (
                  <>
                    <span>{item.score ?? 0} pts</span>
                    <span>{item.executionTimeMs} ms</span>
                  </>
                )}
                {item.submittedAt && (
                  <span>{new Date(item.submittedAt).toLocaleString()}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
