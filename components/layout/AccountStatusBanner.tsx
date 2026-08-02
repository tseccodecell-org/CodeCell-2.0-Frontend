"use client";

import { useEffect, useState } from "react";
import { TriangleAlert, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const ACK_KEY = "codecell_warning_ack";

export default function AccountStatusBanner({ compact = false }: { compact?: boolean }) {
  const { isLoading, isAuthenticated, isBanned, banReason, warningCount, latestWarning } = useAuth();
  const [acked, setAcked] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setAcked(localStorage.getItem(ACK_KEY));
  }, []);

  if (isLoading || !isAuthenticated) return null;
  if (!isBanned && warningCount === 0) return null;

  if (isBanned) {
    return (
      <div
        className="w-full border-b px-5 py-3"
        style={{ borderColor: "#E2574C66", background: "#1a0f0f" }}
      >
        <div className="mx-auto flex max-w-7xl items-start gap-3">
          <TriangleAlert size={compact ? 14 : 16} className="mt-0.5 shrink-0 text-[#E2574C]" />
          <div className="min-w-0">
            <p
              className={`font-mono ${compact ? "text-[11px]" : "text-xs"} leading-relaxed text-[#E2574C]`}
            >
              Your account is suspended. You cannot submit solutions or appear on the leaderboard.
            </p>
            {!compact && banReason && (
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#E2574C]/70">
                Reason: {banReason}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const warningId = latestWarning?.id ?? "none";
  if (acked === warningId) return null;

  return (
    <div
      className="w-full border-b px-5 py-3"
      style={{ borderColor: "#D9A40466", background: "#14120a" }}
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3">
        <TriangleAlert size={compact ? 14 : 16} className="mt-0.5 shrink-0 text-[#D9A404]" />
        <div className="min-w-0 flex-1">
          <p
            className={`font-mono ${compact ? "text-[11px]" : "text-xs"} leading-relaxed text-[#D9A404]`}
          >
            You have {warningCount} {warningCount === 1 ? "warning" : "warnings"} on your record.
            Another violation may lead to a ban.
          </p>
          {!compact && latestWarning?.reason && (
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#D9A404]/70">
              Reason: {latestWarning.reason}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            localStorage.setItem(ACK_KEY, warningId);
            setAcked(warningId);
          }}
          aria-label="Dismiss"
          className="shrink-0 text-[#D9A404]/60 transition-colors hover:text-[#D9A404]"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
