"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Lock, TriangleAlert, RefreshCw } from "lucide-react";

import {
  getCurrentFinale,
  getFinaleProblems,
  listTemplates,
  ApiError,
  LOGIN_URL,
} from "@/lib/api-client";
import type { FinaleStatusResponse, WeekProblem, TemplateResponse } from "@/lib/api-client";
import type { Language } from "@/lib/types/submission";
import TemplateLoader from "./TemplateLoader";

export const FINALE_LOADER_DONE_KEY = "codecell_finale_loader_done";
export const FINALE_BUFFERS_KEY = "codecell_finale_buffers";

const FINALE_STATUS_REFRESH_MS = 30000;

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; status: FinaleStatusResponse }
  | { kind: "unauthenticated" }
  | { kind: "forbidden" }
  | { kind: "not-found" }
  | { kind: "error"; message: string };

function endsAtFromRemaining(remainingSeconds: number): string {
  return new Date(Date.now() + remainingSeconds * 1000).toISOString();
}

function hasCompletedLoader(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(FINALE_LOADER_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveWorkspaceBuffers(buffers: Partial<Record<Language, string>>, activeLanguage: Language) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(FINALE_LOADER_DONE_KEY, "1");
    sessionStorage.setItem(FINALE_BUFFERS_KEY, JSON.stringify({ buffers, activeLanguage }));
  } catch {
    // if session storage is unavailable, the workspace just starts blank
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06070B] px-6 py-16 text-[#F4F1EA]">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        {children}
      </div>
    </div>
  );
}

function ProblemList({
  problems,
  onSelect,
}: {
  problems: WeekProblem[];
  onSelect: (problemId: string) => void;
}) {
  if (problems.length === 0) return null;

  return (
    <div className="mt-4 flex w-full flex-col gap-2 text-left">
      {problems.map((problem) => (
        <button
          key={problem.id}
          onClick={() => onSelect(problem.id)}
          className="flex items-center justify-between rounded-lg border border-[#22262f] bg-[#0d0f14] px-4 py-3 text-left font-sans text-sm text-[#F4F1EA] transition-colors hover:border-[#D9A404]/50 cursor-pointer"
        >
          <span>{problem.title}</span>
          <span className="font-mono text-[11px] uppercase tracking-wide text-[#8B93A7]">
            {problem.difficulty} &middot; {problem.base_points} pts
          </span>
        </button>
      ))}
    </div>
  );
}

export default function FinaleLobby() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [problems, setProblems] = useState<WeekProblem[]>([]);
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [entryTarget, setEntryTarget] = useState<string | null>(null);
  const [loaderOpen, setLoaderOpen] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setState({ kind: "loading" });

    try {
      const status = await getCurrentFinale();
      setState({ kind: "ready", status });
    } catch (err) {
      // a background refresh that fails keeps the last known status on screen
      // rather than throwing the participant onto an error page mid-wait
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

  // participants sit on this screen waiting for an organizer to start, pause or
  // end the contest, so the lobby has to keep asking rather than trusting the
  // status it read on mount
  useEffect(() => {
    const interval = setInterval(() => {
      load(true);
    }, FINALE_STATUS_REFRESH_MS);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (state.kind !== "ready" || state.status.state === "DRAFT") return;
    const weekId = state.status.weekId;

    let cancelled = false;
    getFinaleProblems(weekId)
      .then((list) => {
        if (!cancelled) setProblems(list);
      })
      .catch(() => {
        // an empty problem list here is not worth surfacing as an error, the
        // status banner above already explains what is going on
      });

    return () => {
      cancelled = true;
    };
  }, [state]);

  const openWorkspace = useCallback(
    async (problemId: string) => {
      if (hasCompletedLoader()) {
        router.push(`/events/finale/workspace/${problemId}`);
        return;
      }

      setEntryTarget(problemId);
      try {
        const list = await listTemplates();
        setTemplates(list);
      } catch {
        setTemplates([]);
      }
      setLoaderOpen(true);
    },
    [router]
  );

  // lets a participant write and autosave their language templates before the
  // contest goes live, instead of only reaching the loader through "Enter
  // contest" once it's already LIVE
  const openTemplateManager = useCallback(async () => {
    setEntryTarget(null);
    try {
      const list = await listTemplates();
      setTemplates(list);
    } catch {
      setTemplates([]);
    }
    setLoaderOpen(true);
  }, []);

  const handleContinue = useCallback(
    (buffers: Partial<Record<Language, string>>, activeLanguage: Language) => {
      saveWorkspaceBuffers(buffers, activeLanguage);
      setLoaderOpen(false);
      if (entryTarget) router.push(`/events/finale/workspace/${entryTarget}`);
    },
    [entryTarget, router]
  );

  if (loaderOpen) {
    return (
      <div className="h-screen bg-[#06070B]">
        <TemplateLoader
          initialTemplates={templates}
          onContinue={handleContinue}
          continueLabel={entryTarget ? "Continue" : "Save & return to lobby"}
        />
      </div>
    );
  }

  if (state.kind === "loading") {
    return (
      <Shell>
        <span className="font-mono text-xs uppercase tracking-widest text-[#8B93A7]">
          Loading finale status
        </span>
      </Shell>
    );
  }

  if (state.kind === "unauthenticated") {
    return (
      <Shell>
        <Lock size={28} className="text-[#D9A404]" />
        <h1 className="font-sans text-2xl font-bold">Sign in required</h1>
        <p className="font-sans text-sm text-[#8B93A7]">
          Sign in to check the finale&apos;s status and enter the contest.
        </p>
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
  const endsAt = status.state === "LIVE" ? endsAtFromRemaining(status.remainingSeconds) : undefined;
  const firstProblemId = problems[0]?.id;

  return (
    <Shell>
      {endsAt && (
        <div data-testid="finale-timer" className="font-mono text-xs tracking-wide text-[#D9A404]">
          <FinaleCountdown endsAt={endsAt} />
        </div>
      )}

      {status.state === "DRAFT" && (
        <>
          <h1 className="font-sans text-2xl font-bold">Finale lobby</h1>
          <p className="font-sans text-sm text-[#8B93A7]">
            The finale hasn&apos;t started yet. Once it goes live you&apos;ll be able to enter the
            contest from here. In the meantime you can get your code templates ready.
          </p>
          <button
            onClick={openTemplateManager}
            className="flex items-center gap-2 rounded-xl border border-[#22262f] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[#F4F1EA] transition-colors hover:border-[#D9A404]/60 cursor-pointer"
          >
            Prepare code templates
          </button>
        </>
      )}

      {status.state === "LIVE" && (
        <>
          <h1 className="font-sans text-2xl font-bold">The finale is live</h1>
          <p className="font-sans text-sm text-[#8B93A7]">
            Pick a problem below to start, or jump straight in.
          </p>
          <button
            onClick={() => firstProblemId && openWorkspace(firstProblemId)}
            disabled={!firstProblemId}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[#06070B] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            style={{ background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)" }}
          >
            Enter contest
          </button>
        </>
      )}

      {status.state === "PAUSED" && (
        <>
          <h1 className="font-sans text-2xl font-bold">Scoring paused</h1>
          <p className="font-sans text-sm text-[#8B93A7]">
            An organizer has paused scoring. You can still write, run, and submit code &mdash; it
            just won&apos;t count toward your score until scoring resumes.
          </p>
          <button
            onClick={() => firstProblemId && openWorkspace(firstProblemId)}
            disabled={!firstProblemId}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[#06070B] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            style={{ background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)" }}
          >
            Open workspace
          </button>
        </>
      )}

      {status.state === "ENDED" && (
        <>
          <h1 className="font-sans text-2xl font-bold">Contest ended</h1>
          <p className="font-sans text-sm text-[#8B93A7]">
            The finale has ended. Your workspace stays open for practice &mdash; nothing you run or
            submit now affects the final standings.
          </p>
          <button
            onClick={() => firstProblemId && openWorkspace(firstProblemId)}
            disabled={!firstProblemId}
            className="flex items-center gap-2 rounded-xl border border-[#22262f] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[#F4F1EA] transition-colors hover:border-[#D9A404]/60 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            Practice in workspace
          </button>
        </>
      )}

      <ProblemList problems={problems} onSelect={openWorkspace} />
    </Shell>
  );
}

// a minimal, self-contained mm:ss/h:mm countdown so the lobby does not need to
// reach for WeekTimer's ISO-endsAt semantics, which are meant for a week's
// fixed schedule rather than a remaining-seconds figure the backend recomputes
function FinaleCountdown({ endsAt }: { endsAt: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const ms = new Date(endsAt).getTime() - Date.now();
      if (ms <= 0) {
        setLabel("0:00 left");
        return;
      }
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const formatted =
        hours > 0
          ? `${hours}h ${String(minutes).padStart(2, "0")}m`
          : `${minutes}:${String(seconds).padStart(2, "0")}`;
      setLabel(`${formatted} left`);
      timer = setTimeout(tick, 1000);
    };

    tick();
    return () => clearTimeout(timer);
  }, [endsAt]);

  return <span>{label}</span>;
}
