"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Camera, LogIn } from "lucide-react";
import { Playfair_Display } from "next/font/google";

import { getWrapped, ApiError, LOGIN_URL } from "@/lib/api-client";
import type { WrappedResponse } from "@/lib/api-client";

const playfair = Playfair_Display({ subsets: ["latin"] });

const GOLD = "#D9A404";

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; wrapped: WrappedResponse }
  | { kind: "unauthenticated" }
  | { kind: "error"; message: string };

function hourLabel(hour: number): string {
  if (hour === 0) return "midnight";
  if (hour === 12) return "noon";
  const suffix = hour < 12 ? "am" : "pm";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}${suffix}`;
}

function hourVerdict(hour: number): string {
  if (hour < 5) return "The rest of us were asleep.";
  if (hour < 12) return "Early, and steady with it.";
  if (hour < 18) return "Straight through the afternoon.";
  return "Evening was your hour.";
}

function dateLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

function Stat({
  value,
  label,
  note,
  wide = false,
}: {
  value: string;
  label: string;
  note?: string;
  wide?: boolean;
}) {
  return (
    <div className={`border border-[#14161e] bg-[#0B0E15] p-6 ${wide ? "sm:col-span-2" : ""}`}>
      <p className={`${playfair.className} text-4xl md:text-5xl`} style={{ color: GOLD }}>
        {value}
      </p>
      <p className="mt-3 font-sans text-sm text-[#F4F1EA]">{label}</p>
      {note && <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#8B93A7]">{note}</p>}
    </div>
  );
}

export default function SeasonRecap() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    getWrapped()
      .then((wrapped) => {
        if (!cancelled) setState({ kind: "ready", wrapped });
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          setState({ kind: "unauthenticated" });
          return;
        }
        setState({
          kind: "error",
          message:
            err instanceof ApiError
              ? err.message
              : "Couldn't load your recap. Check your connection and try again.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") {
    return (
      <Frame>
        <p className="font-mono text-xs uppercase tracking-widest text-[#8B93A7]">
          Reading your season
        </p>
      </Frame>
    );
  }

  if (state.kind === "unauthenticated") {
    return (
      <Frame>
        <h1 className="font-sans text-2xl font-bold">Sign in to see your recap</h1>
        <p className="font-sans text-sm text-[#8B93A7]">
          Your recap is built from your own submissions.
        </p>
        <button
          onClick={() => (window.location.href = LOGIN_URL)}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[#05070C] transition-opacity hover:opacity-90 cursor-pointer"
          style={{ background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)" }}
        >
          <LogIn size={14} />
          Sign in with Google
        </button>
      </Frame>
    );
  }

  if (state.kind === "error") {
    return (
      <Frame>
        <h1 className="font-sans text-2xl font-bold">Something went wrong</h1>
        <p className="font-sans text-sm text-[#8B93A7]">{state.message}</p>
      </Frame>
    );
  }

  const w = state.wrapped;

  if (!w.hasData) {
    return (
      <Frame>
        <h1 className="font-sans text-2xl font-bold">Nothing to recap yet</h1>
        <p className="font-sans text-sm text-[#8B93A7]">
          Solve a problem and your season starts writing itself.
        </p>
        <Link
          href="/events/weekly-challenges/timeline"
          className="inline-flex items-center gap-2 border border-[#D9A404] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#D9A404] transition-colors hover:bg-[#D9A404] hover:text-[#05070C]"
        >
          Go to this week
        </Link>
      </Frame>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070C] text-[#F4F1EA]">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href="/events/finale"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#8B93A7] transition-colors hover:text-[#D9A404]"
          >
            <ChevronLeft size={14} />
            Back to the finale
          </Link>
          <p className="inline-flex items-center gap-2 font-sans text-xs text-[#8B93A7]">
            <Camera size={13} />
            Screenshot this and post it
          </p>
        </div>

        <header className="mt-10 border-b border-[#14161e] pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: GOLD }}>
            CodeCell &middot; Season 2026
          </p>
          <h1 className={`${playfair.className} mt-3 text-4xl leading-[0.95] md:text-6xl`}>
            My season in numbers
          </h1>
          <p className="mt-4 font-sans text-sm text-[#8B93A7]">
            {dateLabel(w.firstSubmission)} to {dateLabel(w.lastSubmission)}
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Stat
            value={String(w.problemsSolved)}
            label={w.problemsSolved === 1 ? "problem solved" : "problems solved"}
            note={`${w.totalSubmissions} submissions, ${w.acceptanceRate}% of them accepted.`}
          />

          <Stat
            value={hourLabel(w.peakHour)}
            label="your hour"
            note={`${w.peakHourCount} submissions landed then. ${hourVerdict(w.peakHour)}`}
          />

          {w.favouriteLanguage && (
            <Stat
              value={w.favouriteLanguage === "CPP" ? "C++" : titleCase(w.favouriteLanguage)}
              label="the language you trusted"
              note={`${w.favouriteLanguageCount} of your ${w.totalSubmissions} submissions.`}
            />
          )}

          <Stat
            value={String(w.longestStreakDays)}
            label={w.longestStreakDays === 1 ? "day streak" : "day streak"}
            note={`Active on ${w.activeDays} days this season.`}
          />

          {w.nemesisProblem && (
            <Stat
              wide
              value={String(w.nemesisAttempts)}
              label={`attempts on ${w.nemesisProblem}`}
              note={
                w.nemesisSolved
                  ? "It took a while. You got it in the end."
                  : "Still standing. There is always next season."
              }
            />
          )}

          {w.lateNightSubmissions > 0 && (
            <Stat
              value={String(w.lateNightSubmissions)}
              label="submissions after midnight"
              note="Between midnight and five in the morning."
            />
          )}

          {w.busiestDay && (
            <Stat
              value={String(w.busiestDayCount)}
              label={`submissions on ${dateLabel(w.busiestDay)}`}
              note="Your busiest day of the season."
            />
          )}

          {w.fastestRuntimeMs > 0 && (
            <Stat
              value={`${w.fastestRuntimeMs}ms`}
              label="your fastest accepted run"
              note="The judge has seen slower."
            />
          )}
        </div>

        <p className="mt-10 font-sans text-xs text-[#5A5850]">
          Counts exclude practice runs and any submission that was later invalidated.
        </p>
      </div>
    </div>
  );
}

function titleCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05070C] px-6 py-20 text-[#F4F1EA]">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
        {children}
      </div>
    </div>
  );
}
