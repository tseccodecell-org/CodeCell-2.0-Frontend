"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, Clock } from "lucide-react";
import { getWeek, getWeekProblems } from "@/lib/api-client";

type Difficulty = "easy" | "medium" | "hard";

interface Problem {
  problemId: string;
  title: string;
  difficulty: Difficulty;
  points: number;
  solved: boolean;
}

interface WeekData {
  weekId: string; // real backend UUID
  weekNumber: number;
  title: string;
  glyph: string;
  dateRange: string;
  isLive: boolean;
  hasEnded: boolean;
  problems: Problem[];
}

const GLYPHS = ["♟", "♞", "♝", "♜", "♛", "♚"];

function normalizeDifficulty(raw: string): Difficulty {
  const lower = raw.toLowerCase();
  if (lower.includes("hard") || lower.includes("expert") || lower.includes("master")) return "hard";
  if (lower.includes("easy")) return "easy";
  return "medium";
}

function formatDateRange(startsAt: string, endsAt: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
  const start = new Date(startsAt).toLocaleDateString("en-US", opts).toUpperCase();
  const end = new Date(endsAt).toLocaleDateString("en-US", opts).toUpperCase();
  return `${start} – ${end}`;
}

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  easy: "text-[#6FCF97] border-[#6FCF97]/30",
  medium: "text-[#D9A404] border-[#D9A404]/30",
  hard: "text-[#E2574C] border-[#E2574C]/30",
};

export default function WeekPage() {
  const params = useParams<{ weekId: string }>();
  const router = useRouter();
  const weekId = params.weekId;

  const [week, setWeek] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // returning from the solve page can restore this component without
  // remounting, so a solve made a moment ago would still read as unsolved
  // until a hard reload. refetch whenever the tab is looked at again.
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const refetch = () => {
      if (document.visibilityState === "visible") setReloadKey((k) => k + 1);
    };
    window.addEventListener("focus", refetch);
    document.addEventListener("visibilitychange", refetch);
    return () => {
      window.removeEventListener("focus", refetch);
      document.removeEventListener("visibilitychange", refetch);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    Promise.all([getWeek(weekId), getWeekProblems(weekId)])
      .then(([weekRes, problemsRes]) => {
        if (cancelled) return;
        if (!weekRes) {
          setError(true);
          return;
        }
        setWeek({
          weekId: weekRes.id,
          weekNumber: weekRes.week_number,
          title: weekRes.chapter_name,
          glyph: GLYPHS[(weekRes.week_number - 1) % GLYPHS.length],
          dateRange: formatDateRange(weekRes.starts_at, weekRes.ends_at),
          isLive: weekRes.is_active,
          hasEnded: new Date(weekRes.ends_at).getTime() < Date.now(),
          problems: problemsRes.map((p) => ({
            problemId: p.id,
            title: p.title,
            difficulty: normalizeDifficulty(p.difficulty),
            points: p.base_points,
            solved: p.solved === true,
          })),
        });
      })
      .catch((err) => {
        console.error(`WeekPage: failed to fetch week ${weekId}:`, err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [weekId, reloadKey]);

  if (loading) return <WeekLoading />;

  if (error || !week) {
    return (
      <div className="min-h-screen bg-[#06070B] flex items-center justify-center">
        <p className="font-mono text-sm text-[#8B93A7]">
          Couldn&apos;t load this week. <span className="text-[#D9A404]">Try again.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070B] px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto relative overflow-hidden">
      {/* giant faint chess piece, right side */}
      <span
        aria-hidden
        className="hidden lg:block absolute -right-10 top-24 text-[420px] leading-none text-[#D9A404] select-none pointer-events-none"
        style={{ opacity: 0.05 }}
      >
        {week.glyph}
      </span>

      <button
        onClick={() => router.push("/events/weekly-challenges/timeline")}
        className="flex items-center gap-2 font-mono text-xs text-[#8B93A7] hover:text-[#D9A404] transition-colors mb-8 relative z-10"
      >
        <ChevronLeft size={14} />
        BACK TO TIMELINE
      </button>

      <div className="border-b border-[#1a1c24] pb-8 mb-8 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] text-[#D9A404] tracking-[0.2em]">
            WK.0{week.weekNumber} // {week.dateRange}
          </span>
          {week.isLive && (
            <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] text-[#D9A404] border border-[#D9A404]/40 px-2 py-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#D9A404] animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D9A404]" />
              </span>
              LIVE
            </span>
          )}
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-[#F4F1EA]">{week.title}</span>
        </h1>
        <p className="font-sans text-sm text-[#8B93A7] mt-3">
          {week.problems.filter((p) => p.solved).length} of {week.problems.length} cleared
        </p>

        {week.hasEnded && (
          <p className="mt-4 border border-[#D9A404]/30 bg-[#0b0d13] px-4 py-3 font-mono text-[11px] leading-relaxed text-[#D9A404]">
            This week has ended. Problems stay open for practice, but submissions no longer award
            points.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        {week.problems.map((problem, i) => (
          <button
            key={problem.problemId}
            onClick={() => router.push(`/events/weekly-challenges/solve/${problem.problemId}`)}
            className="group flex items-center gap-5 border-t border-[#1a1c24] bg-[#0b0d13] hover:bg-[#101219] px-6 py-5 text-left transition-colors"
          >
            <span className="font-mono text-xs w-6 flex items-center">
              {problem.solved ? (
                <Check size={14} className="text-[#6FCF97]" />
              ) : (
                <span className="text-[#5A5850]">{String(i + 1).padStart(2, "0")}</span>
              )}
            </span>

            <span
              className={[
                "font-mono text-[9px] tracking-[0.1em] border px-2 py-1 uppercase",
                DIFFICULTY_STYLE[problem.difficulty],
              ].join(" ")}
            >
              {problem.difficulty}
            </span>

            <span className="flex-1 font-sans text-sm md:text-base font-medium text-[#F4F1EA] group-hover:text-[#D9A404] transition-colors">
              {problem.title}
            </span>

            <span className="font-mono text-xs text-[#8B93A7] hidden sm:block">
              {problem.points} PTS
            </span>

            {problem.solved ? (
              <span className="flex items-center gap-1.5 font-mono text-[9px] text-[#6FCF97]">
                <Check size={12} /> SOLVED
              </span>
            ) : (
              <ChevronRight
                size={16}
                className="text-[#5A5850] group-hover:text-[#D9A404] group-hover:translate-x-0.5 transition-all"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function WeekLoading() {
  return (
    <div className="min-h-screen bg-[#06070B] px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col items-center justify-center gap-6">
      <span
        aria-hidden
        className="text-6xl text-[#D9A404] week-loading-spin"
        style={{ opacity: 0.7 }}
      >
        ♞
      </span>
      <p className="font-mono text-xs text-[#8B93A7] tracking-[0.15em]">
        SETTING UP THE BOARD<span className="week-loading-dots">...</span>
      </p>

      <div className="w-full max-w-2xl flex flex-col gap-3 mt-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 border-t border-[#1a1c24] bg-[#0b0d13] week-loading-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <style jsx>{`
        .week-loading-spin {
          display: inline-block;
          animation: week-spin 1.8s ease-in-out infinite;
        }
        @keyframes week-spin {
          0%,
          100% {
            transform: rotate(-8deg);
          }
          50% {
            transform: rotate(8deg);
          }
        }
        .week-loading-pulse {
          animation: week-pulse 1.4s ease-in-out infinite;
        }
        @keyframes week-pulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.9;
          }
        }
        .week-loading-dots {
          animation: week-dots 1.2s steps(4, end) infinite;
        }
        @keyframes week-dots {
          0% {
            opacity: 0.2;
          }
          100% {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .week-loading-spin,
          .week-loading-pulse,
          .week-loading-dots {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}