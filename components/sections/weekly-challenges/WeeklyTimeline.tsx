"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Check } from "lucide-react";
import { getWeeks, type Week as BackendWeek } from "@/lib/api-client";

type WeekStatus = "completed" | "live" | "locked";

interface Week {
  weekId: string; // real backend UUID, not a small int
  weekNumber: number;
  title: string;
  glyph: string;
  dateRange: string;
  status: WeekStatus;
}

// Visual-only glyphs — no backend equivalent, cycles by position.
const GLYPHS = ["♟", "♞", "♝", "♜", "♛", "♚"];

function formatDateRange(startsAt: string, endsAt: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
  const start = new Date(startsAt).toLocaleDateString("en-US", opts).toUpperCase();
  const end = new Date(endsAt).toLocaleDateString("en-US", opts).toUpperCase();
  return `${start} – ${end}`;
}

function deriveStatus(week: BackendWeek): WeekStatus {
  if (week.is_active) return "live";
  if (new Date(week.ends_at).getTime() < Date.now()) return "completed";
  return "locked";
}

function mapWeek(week: BackendWeek, index: number): Week {
  return {
    weekId: week.id,
    weekNumber: week.week_number,
    title: week.chapter_name,
    glyph: GLYPHS[index % GLYPHS.length],
    dateRange: formatDateRange(week.starts_at, week.ends_at),
    status: deriveStatus(week),
  };
}

export default function WeeklyTimeline() {
  const router = useRouter();
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getWeeks()
      .then((data) => {
        if (cancelled) return;
        const sorted = [...data].sort((a, b) => a.week_number - b.week_number);
        setWeeks(sorted.map(mapWeek));
      })
      .catch((err) => {
        console.error("WeeklyTimeline: failed to fetch weeks:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-6">
        <span className="font-mono text-[10px] text-[#D9A404] tracking-[0.2em]">
          SEASON_01 // RANK_TIMELINE
        </span>
        <span className="font-mono text-[10px] text-[#5A5850] hidden sm:block">
          {weeks.length} WEEKS · 1 BOARD
        </span>
      </div>

      {loading ? (
        <p className="font-mono text-xs text-[#8B93A7]">Loading weeks…</p>
      ) : weeks.length === 0 ? (
        <p className="font-mono text-xs text-[#8B93A7]">No weeks available yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {weeks.map((week) => {
            const isLive = week.status === "live";
            const isLocked = week.status === "locked";
            const isDone = week.status === "completed";

            return (
              <button
                key={week.weekId}
                disabled={isLocked}
                onClick={() => {
                  if (!isLocked) router.push(`/events/weekly-challenges/week/${week.weekId}`);
                }}
                className={[
                  "relative text-left border-t px-6 py-6 flex flex-col gap-4 bg-[#0b0d13]",
                  "transition-colors duration-300",
                  isLive ? "border-t-[#D9A404]" : isDone ? "border-t-[#4a4530]" : "border-t-[#22262f]",
                  isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-[#101219]",
                  isLive ? "chess-live-card" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={[
                      "flex items-center justify-center w-9 h-9 rounded border",
                      isLive ? "border-[#D9A404]/60 text-[#D9A404]" : "border-[#22262f] text-[#5A5850]",
                    ].join(" ")}
                  >
                    <span className="text-lg leading-none" aria-hidden>
                      {week.glyph}
                    </span>
                  </span>

                  <span className="font-mono text-[9px] text-[#5A5850] tracking-widest pt-1">
                    WK.0{week.weekNumber}
                  </span>
                </div>

                <div>
                  <p className="font-mono text-2xl font-bold tracking-tight">
                    <span className="text-[#D9A404]">&gt;</span>
                    <span className={isLocked ? "text-[#5A5850]" : "text-[#F4F1EA]"}>
                      {week.title.toUpperCase()}
                    </span>
                    <span className="text-[#D9A404] chess-cursor">_</span>
                  </p>
                  <p className="font-mono text-[10px] text-[#8B93A7] mt-2">{week.dateRange}</p>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] pt-3 mt-auto border-t border-[#1a1c24]">
                  <span className="pt-3 flex items-center gap-1.5">
                    {isLive && (
                      <>
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-[#D9A404] chess-ping" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D9A404]" />
                        </span>
                        <span className="text-[#D9A404]">LIVE NOW</span>
                      </>
                    )}
                    {isDone && (
                      <span className="flex items-center gap-1.5 text-[#8B93A7]">
                        <Check size={10} /> CLEARED
                      </span>
                    )}
                    {isLocked && (
                      <span className="flex items-center gap-1.5 text-[#5A5850]">
                        <Lock size={10} /> OPENS {week.dateRange.split("–")[0].trim()}
                      </span>
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .chess-live-card {
          animation: chess-check-glow 2.2s ease-in-out infinite;
        }
        @keyframes chess-check-glow {
          0%,
          100% {
            box-shadow: inset 0 1px 0 0 rgba(217, 164, 4, 0.4), 0 0 0 rgba(217, 164, 4, 0);
          }
          50% {
            box-shadow: inset 0 1px 0 0 rgba(217, 164, 4, 0.9), 0 8px 24px -8px rgba(217, 164, 4, 0.35);
          }
        }
        .chess-ping {
          animation: chess-ping-anim 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes chess-ping-anim {
          75%,
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .chess-cursor {
          animation: chess-blink 1.1s steps(1) infinite;
        }
        @keyframes chess-blink {
          50% {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .chess-live-card,
          .chess-ping,
          .chess-cursor {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}