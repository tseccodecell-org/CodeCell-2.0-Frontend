"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, LogIn, Lock, TriangleAlert, RefreshCw, Check, Ban } from "lucide-react";

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

export const FINALE_BUFFERS_KEY = "codecell_finale_buffers";

const FINALE_STATUS_REFRESH_MS = 30000;

const GOLD = "#D9A404";
const FLAG = "#E2574C";

const TEMPLATE_ALLOWED = [
  "Input and output scaffolding: fast readers, buffered writers, the main you start every problem from.",
  "Macros, typedefs and small helpers you reach for on every problem, whatever it turns out to be.",
  "Debug and timing utilities you strip out before you submit.",
];

const TEMPLATE_FORBIDDEN = [
  "A solution, or any part of one, to a specific problem.",
  "Code kept from a past contest, editorial or judge submission to paste in on the day.",
  "Anything written for one problem rather than for every problem.",
];

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

function saveWorkspaceBuffers(buffers: Partial<Record<Language, string>>, activeLanguage: Language) {
  if (typeof window === "undefined") return;
  try {
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

function RuleColumn({
  heading,
  rules,
  tone,
}: {
  heading: string;
  rules: string[];
  tone: "allow" | "deny";
}) {
  const accent = tone === "allow" ? GOLD : FLAG;
  const Icon = tone === "allow" ? Check : Ban;

  return (
    <div className="border border-[#14161e] bg-[#0B0E15] p-6">
      <h3 className="font-sans text-base font-semibold text-[#F4F1EA]" style={{ color: accent }}>
        {heading}
      </h3>
      <ul className="mt-4 space-y-3">
        {rules.map((rule) => (
          <li key={rule} className="flex gap-3">
            <Icon size={14} className="mt-1 shrink-0" style={{ color: accent }} aria-hidden />
            <span className="font-sans text-sm leading-relaxed text-[#8B93A7]">{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FinaleLobby() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [problems, setProblems] = useState<WeekProblem[]>([]);
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const buffersRef = useRef<{
    buffers: Partial<Record<Language, string>>;
    activeLanguage: Language;
  }>({ buffers: {}, activeLanguage: "CPP" });

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
    if (state.kind !== "ready") return;

    let cancelled = false;
    listTemplates()
      .then((list) => {
        if (cancelled) return;
        setTemplates(list);
        setTemplatesLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setTemplates([]);
        setTemplatesLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [state.kind]);

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

  const handleBuffersChange = useCallback(
    (buffers: Partial<Record<Language, string>>, activeLanguage: Language) => {
      buffersRef.current = { buffers, activeLanguage };
    },
    []
  );

  const openWorkspace = useCallback(
    (problemId: string) => {
      const { buffers, activeLanguage } = buffersRef.current;
      saveWorkspaceBuffers(buffers, activeLanguage);
      router.push(`/events/finale/workspace/${problemId}`);
    },
    [router]
  );

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

  const heading =
    status.state === "DRAFT"
      ? "Finale lobby"
      : status.state === "LIVE"
        ? "The finale is live"
        : status.state === "PAUSED"
          ? "Scoring paused"
          : "Contest ended";

  const standfirst =
    status.state === "DRAFT"
      ? "The round hasn't started. Use the time to get your templates in order, they are saved to your account as you type."
      : status.state === "LIVE"
        ? "Your templates are saved. Pick a problem to open your workspace."
        : status.state === "PAUSED"
          ? "An organizer has paused scoring. You can still write, run and submit code, it just won't count until scoring resumes."
          : "The finale has ended. Your workspace stays open for practice, nothing you run or submit now affects the standings.";

  const enterLabel =
    status.state === "LIVE"
      ? "Enter contest"
      : status.state === "PAUSED"
        ? "Open workspace"
        : "Practice in workspace";

  return (
    <div className="min-h-screen bg-[#06070B] text-[#F4F1EA]">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <Link
          href="/events/finale"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#8B93A7] transition-colors hover:text-[#D9A404]"
        >
          <ChevronLeft size={14} />
          Back to the finale
        </Link>

        <header className="mt-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#14161e] pb-8">
          <div className="max-w-xl">
            <h1 className="font-sans text-3xl font-bold md:text-4xl">{heading}</h1>
            <p className="mt-3 font-sans text-sm leading-relaxed text-[#8B93A7]">{standfirst}</p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            {endsAt && (
              <div
                data-testid="finale-timer"
                className="font-mono text-sm tracking-wide"
                style={{ color: GOLD }}
              >
                <FinaleCountdown endsAt={endsAt} />
              </div>
            )}
            {status.state !== "DRAFT" && (
              <button
                onClick={() => firstProblemId && openWorkspace(firstProblemId)}
                disabled={!firstProblemId}
                className="inline-flex items-center gap-2 border border-[#D9A404] bg-[#D9A404]/10 px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A404] transition-colors hover:bg-[#D9A404] hover:text-[#06070B] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                {enterLabel}
              </button>
            )}
          </div>
        </header>

        <section className="mt-12">
          <h2 className="font-sans text-xl font-semibold">What a template may contain</h2>
          <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-[#8B93A7]">
            Bring the scaffolding you would otherwise retype, so you start the round writing the
            solution instead of the setup. Every template is read before the round, and anything
            that amounts to a stored answer is removed.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <RuleColumn heading="Bring this" rules={TEMPLATE_ALLOWED} tone="allow" />
            <RuleColumn heading="Leave this out" rules={TEMPLATE_FORBIDDEN} tone="deny" />
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-sans text-xl font-semibold">Your templates</h2>
            <p className="font-sans text-sm text-[#8B93A7]">
              Keep as many as you like, in any of the three languages. Edits save on their own.
            </p>
          </div>

          <div className="mt-6 h-[560px] overflow-hidden rounded-lg border border-[#14161e]">
            {templatesLoaded ? (
              <TemplateLoader
                initialTemplates={templates}
                onContinue={() => {}}
                showContinue={false}
                onBuffersChange={handleBuffersChange}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-mono text-xs uppercase tracking-widest text-[#8B93A7]">
                  Loading your templates
                </span>
              </div>
            )}
          </div>
        </section>

        {problems.length > 0 && (
          <section className="mt-12">
            <h2 className="font-sans text-xl font-semibold">Problems</h2>
            <div className="mt-4 flex flex-col gap-2">
              {problems.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() => openWorkspace(problem.id)}
                  className="flex items-center justify-between rounded-lg border border-[#22262f] bg-[#0d0f14] px-4 py-3 text-left font-sans text-sm text-[#F4F1EA] transition-colors hover:border-[#D9A404]/50 cursor-pointer"
                >
                  <span>{problem.title}</span>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-[#8B93A7]">
                    {problem.difficulty} &middot; {problem.base_points} pts
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
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
