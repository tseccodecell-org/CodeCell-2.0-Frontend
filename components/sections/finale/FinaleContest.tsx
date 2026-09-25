"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Lock, TriangleAlert, RefreshCw, LogIn } from "lucide-react";

import {
  getCurrentFinale,
  getFinaleProblems,
  listTemplates,
  getFinaleBoard,
  ApiError,
  LOGIN_URL,
} from "@/lib/api-client";
import type { FinaleStatusResponse, WeekProblem, TemplateResponse } from "@/lib/api-client";
import type { FinaleBoardEntry } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import { estimateRoundEnd } from "@/lib/finale-clock";
import { FinaleCountdown } from "./FinaleLobby";

const FINALE_STATUS_REFRESH_MS = 15000;
const BOARD_REFRESH_MS = 20000;

const GOLD = "#D9A404";

const CONTEST_INSTRUCTIONS = [
  "The round runs for two hours from the moment an organiser starts it. The timer above is the one that counts.",
  "Open a problem to get the statement, your editor and the judge you have used all season. You can move between problems freely.",
  "Run as often as you like. Submitting is what scores, and only your accepted solutions count toward your standing.",
  "If scoring is paused, keep working. You can still run and submit, and anything submitted while paused is not scored until scoring resumes.",
  "Ties break on total time to your last accepted solve, the same rule the weekly boards use.",
];

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; status: FinaleStatusResponse; endsAt: number | null }
  | { kind: "unauthenticated" }
  | { kind: "forbidden" }
  | { kind: "not-found" }
  | { kind: "error"; message: string };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06070B] px-6 py-16 text-[#F4F1EA]">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        {children}
      </div>
    </div>
  );
}

export default function FinaleContest() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [problems, setProblems] = useState<WeekProblem[]>([]);
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [board, setBoard] = useState<FinaleBoardEntry[]>([]);
  const { user } = useAuth();

  const load = useCallback(async (silent = false) => {
    if (!silent) setState({ kind: "loading" });

    try {
      const sentAt = Date.now();
      const status = await getCurrentFinale();
      const receivedAt = Date.now();
      setState((prev) => {
        const previousEnd = prev.kind === "ready" ? prev.endsAt : null;
        const endsAt =
          status.state === "LIVE"
            ? estimateRoundEnd(status.remainingSeconds, sentAt, receivedAt, previousEnd)
            : null;
        return { kind: "ready", status, endsAt };
      });
    } catch (err) {
      if (silent) return;
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setState({ kind: "unauthenticated" });
          return;
        }
        if (err.status === 403) {
          setState({ kind: "forbidden" });
          return;
        }
        if (err.status === 404) {
          setState({ kind: "not-found" });
          return;
        }
        setState({ kind: "error", message: err.message });
        return;
      }
      setState({
        kind: "error",
        message: "Couldn't reach the server. Check your connection and try again.",
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // this screen is where a participant waits for the round to open, so it has
  // to keep asking rather than trusting the status it read on arrival
  useEffect(() => {
    const interval = setInterval(() => {
      load(true);
    }, FINALE_STATUS_REFRESH_MS);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (state.kind !== "ready") return;

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
  }, [state.kind]);

  useEffect(() => {
    if (state.kind !== "ready") return;
    const weekId = state.status.weekId;

    let cancelled = false;

    const readBoard = () => {
      getFinaleBoard(weekId)
        .then((rows) => {
          if (!cancelled) setBoard(rows);
        })
        .catch(() => {
          // the board is a nicety during the round, never a blocker
        });
    };

    readBoard();
    const interval = setInterval(readBoard, BOARD_REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [state]);

  useEffect(() => {
    if (state.kind !== "ready" || state.status.state === "DRAFT") return;
    const weekId = state.status.weekId;

    let cancelled = false;
    getFinaleProblems(weekId)
      .then((list) => {
        if (!cancelled) setProblems(list);
      })
      .catch(() => {
        // the banner above already explains why the list may be empty
      });

    return () => {
      cancelled = true;
    };
  }, [state]);

  if (state.kind === "loading") {
    return (
      <Shell>
        <span className="font-mono text-xs uppercase tracking-widest text-[#8B93A7]">
          Loading the contest
        </span>
      </Shell>
    );
  }

  if (state.kind === "unauthenticated") {
    return (
      <Shell>
        <Lock size={28} className="text-[#D9A404]" />
        <h1 className="font-sans text-2xl font-bold">Sign in required</h1>
        <p className="font-sans text-sm text-[#8B93A7]">Sign in to enter the contest.</p>
        <button
          onClick={() => (window.location.href = LOGIN_URL)}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[#06070B] transition-opacity hover:opacity-90 cursor-pointer"
          style={{ background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)" }}
        >
          <LogIn size={14} />
          Sign in with Google
        </button>
      </Shell>
    );
  }

  if (state.kind === "forbidden") {
    return (
      <Shell>
        <Lock size={28} className="text-[#E2574C]" />
        <h1 className="font-sans text-2xl font-bold">You don&apos;t have access</h1>
        <p className="font-sans text-sm text-[#8B93A7]">
          This finale is restricted and your account hasn&apos;t been granted access. Reach out to
          the organizers if you believe this is a mistake.
        </p>
      </Shell>
    );
  }

  if (state.kind === "not-found") {
    return (
      <Shell>
        <TriangleAlert size={28} className="text-[#8B93A7]" />
        <h1 className="font-sans text-2xl font-bold">Finale not available</h1>
        <p className="font-sans text-sm text-[#8B93A7]">
          There is no finale published right now. Check back closer to the event.
        </p>
      </Shell>
    );
  }

  if (state.kind === "error") {
    return (
      <Shell>
        <TriangleAlert size={28} className="text-[#E2574C]" />
        <h1 className="font-sans text-2xl font-bold">Something went wrong</h1>
        <p className="font-sans text-sm text-[#8B93A7]">{state.message}</p>
        <button
          onClick={() => load()}
          className="flex items-center gap-2 rounded-xl border border-[#22262f] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[#F4F1EA] transition-colors hover:border-[#D9A404]/60 cursor-pointer"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      </Shell>
    );
  }

  const { status } = state;
  const waiting = status.state === "DRAFT";

  if (waiting && !status.entryOpen) {
    return (
      <Shell>
        <Lock size={28} style={{ color: GOLD }} />
        <h1 className="font-sans text-2xl font-bold">The doors are not open yet</h1>
        <p className="font-sans text-sm text-[#8B93A7]">
          An organiser opens this room shortly before the round. Keep this page open, it updates on
          its own.
        </p>
        <Link
          href="/events/finale/templates"
          className="inline-flex items-center gap-2 border border-[#22262f] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8B93A7] transition-colors hover:border-[#D9A404]/60 hover:text-[#F4F1EA]"
        >
          Back to your templates
        </Link>
      </Shell>
    );
  }
  const endsAt = state.endsAt !== null ? new Date(state.endsAt).toISOString() : undefined;

  const heading = waiting
    ? "The round hasn't started"
    : status.state === "PAUSED"
      ? "Scoring paused"
      : status.state === "ENDED"
        ? "The round has ended"
        : "The round is live";

  return (
    <div className="min-h-screen bg-[#06070B] text-[#F4F1EA]">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <Link
          href="/events/finale/templates"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#8B93A7] transition-colors hover:text-[#D9A404]"
        >
          <ChevronLeft size={14} />
          Back to your templates
        </Link>

        <header className="mt-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#14161e] pb-8">
          <h1 className="font-sans text-3xl font-bold md:text-4xl">{heading}</h1>

          {waiting ? (
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#5A5850]">
                <Lock size={13} />
                Problems locked
              </span>
              {status.scheduledStartAt && (
                <span data-testid="finale-start-countdown" className="font-mono text-2xl" style={{ color: GOLD }}>
                  <FinaleCountdown target={status.scheduledStartAt} />
                </span>
              )}
            </div>
          ) : (
            endsAt && (
              <span data-testid="finale-timer" className="font-mono text-2xl" style={{ color: GOLD }}>
                <FinaleCountdown target={endsAt} />
              </span>
            )
          )}
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div>
        <section>
          <h2 className="font-sans text-xl font-semibold">Problems</h2>
          {waiting ? (
            <div className="relative mt-4 overflow-hidden border border-[#22262f] bg-[#0B0E15]">
              <div aria-hidden className="select-none blur-sm">
                {["Problem one", "Problem two", "Problem three"].map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between border-b border-[#14161e] px-5 py-4 last:border-b-0"
                  >
                    <span className="font-sans text-sm text-[#F4F1EA]">{name}</span>
                    <span className="font-mono text-[11px] uppercase tracking-wide text-[#8B93A7]">
                      000 pts
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#06070B]/70 px-6 text-center">
                <Lock size={22} style={{ color: GOLD }} />
                <p className="font-sans text-sm text-[#F4F1EA]">Sealed until the round starts</p>
                <p className="font-sans text-xs text-[#8B93A7]">
                  They unlock the moment an organiser begins. This page updates on its own.
                </p>
              </div>
            </div>
          ) : problems.length === 0 ? (
            <p className="mt-4 border border-[#22262f] bg-[#0B0E15] px-5 py-6 font-sans text-sm text-[#8B93A7]">
              No problems have been published for this round yet.
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              {problems.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() => router.push(`/events/finale/workspace/${problem.id}`)}
                  className="flex items-center justify-between rounded-lg border border-[#22262f] bg-[#0d0f14] px-5 py-4 text-left font-sans text-sm text-[#F4F1EA] transition-colors hover:border-[#D9A404]/50 cursor-pointer"
                >
                  <span>{problem.title}</span>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-[#8B93A7]">
                    {problem.difficulty} &middot; {problem.base_points} pts
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-sans text-xl font-semibold">How the round works</h2>
          <ul className="mt-4 space-y-3 border border-[#14161e] bg-[#0B0E15] p-6">
            {CONTEST_INSTRUCTIONS.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: GOLD }} />
                <span className="font-sans text-sm leading-relaxed text-[#8B93A7]">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-sans text-xl font-semibold">Templates you brought</h2>
          <p className="mt-2 font-sans text-sm text-[#8B93A7]">
            Reference only. Open a problem to write code.
          </p>
          {templates.length === 0 ? (
            <p className="mt-4 border border-[#22262f] bg-[#0B0E15] px-5 py-6 font-sans text-sm text-[#8B93A7]">
              You saved no templates before the round.
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {templates.map((template) => (
                <details
                  key={template.id}
                  className="border border-[#14161e] bg-[#0B0E15] [&_summary]:cursor-pointer"
                >
                  <summary className="flex items-center justify-between px-5 py-3 font-sans text-sm text-[#F4F1EA]">
                    {template.name}
                    <span className="font-mono text-[11px] uppercase tracking-wide text-[#8B93A7]">
                      {template.language}
                    </span>
                  </summary>
                  <pre className="overflow-x-auto border-t border-[#14161e] px-5 py-4 font-mono text-xs leading-relaxed text-[#8B93A7]">
                    {template.sourceCode}
                  </pre>
                </details>
              ))}
            </div>
          )}
        </section>
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <h2 className="font-sans text-xl font-semibold">Live standings</h2>
            {board.length === 0 ? (
              <p className="mt-4 border border-[#14161e] bg-[#0B0E15] px-4 py-5 font-sans text-sm text-[#8B93A7]">
                No seats have been granted yet.
              </p>
            ) : (
              <ol className="mt-4 divide-y divide-[#14161e] border border-[#14161e] bg-[#0B0E15]">
                {board.map((entry) => {
                  const isYou = String(entry.userId) === String(user?.id ?? "");
                  return (
                    <li
                      key={entry.userId}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                      style={isYou ? { background: "#0d0f14" } : undefined}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className="w-6 shrink-0 font-mono text-xs"
                          style={{ color: entry.rank <= 3 ? GOLD : "#8B93A7" }}
                        >
                          {entry.rank}
                        </span>
                        <span
                          className="truncate font-sans text-sm"
                          style={{ color: isYou ? GOLD : "#F4F1EA" }}
                        >
                          {entry.name}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-[#8B93A7]">
                        {entry.score}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
            <p className="mt-2 font-sans text-xs text-[#5A5850]">Refreshes on its own.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
