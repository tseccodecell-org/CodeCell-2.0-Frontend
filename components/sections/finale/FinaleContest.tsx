"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, TriangleAlert, RefreshCw, LogIn } from "lucide-react";

import {
  getCurrentFinale,
  getFinaleProblems,
  listTemplates,
  getFinaleStandings,
  ApiError,
  LOGIN_URL,
} from "@/lib/api-client";
import type { FinaleStatusResponse, WeekProblem, TemplateResponse } from "@/lib/api-client";
import type { FinaleStandings } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import { estimateRoundEnd } from "@/lib/finale-clock";
import FinaleContestView from "./FinaleContestView";

const FINALE_STATUS_REFRESH_MS = 15000;
const BOARD_REFRESH_MS = 20000;

const GOLD = "#D9A404";

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
  const [standings, setStandings] = useState<FinaleStandings | null>(null);
  const [standingsUpdatedAt, setStandingsUpdatedAt] = useState<number | null>(null);
  const [standingsRequest, setStandingsRequest] = useState(0);
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

  const weekId = state.kind === "ready" ? state.status.weekId : null;
  const roundState = state.kind === "ready" ? state.status.state : null;

  useEffect(() => {
    if (weekId === null) return;

    let cancelled = false;

    const readStandings = () => {
      getFinaleStandings(weekId)
        .then((next) => {
          if (cancelled) return;
          setStandings(next);
          setStandingsUpdatedAt(Date.now());
        })
        .catch(() => {});
    };

    readStandings();
    const interval = setInterval(readStandings, BOARD_REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [weekId, roundState, standingsRequest]);

  useEffect(() => {
    if (weekId === null || roundState === null || roundState === "DRAFT") return;

    let cancelled = false;
    const readProblems = () => {
      getFinaleProblems(weekId)
        .then((list) => {
          if (!cancelled) setProblems(list);
        })
        .catch(() => {});
    };

    readProblems();
    const interval = setInterval(readProblems, FINALE_STATUS_REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [weekId, roundState]);

  const roundOver = useCallback(() => {
    load(true);
  }, [load]);

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
  return (
    <FinaleContestView
      status={status}
      endsAt={state.endsAt}
      problems={problems}
      templates={templates}
      standings={standings}
      standingsUpdatedAt={standingsUpdatedAt}
      onRefreshStandings={() => setStandingsRequest((n) => n + 1)}
      currentUserId={user?.id}
      onOpenProblem={(id) => router.push(`/events/finale/workspace/${id}`)}
      onRoundOver={roundOver}
    />
  );
}
