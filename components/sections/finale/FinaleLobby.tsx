"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, LogIn, Lock, TriangleAlert, RefreshCw, Check, Ban } from "lucide-react";

import { getCurrentFinale, listTemplates, ApiError, LOGIN_URL } from "@/lib/api-client";
import type { FinaleStatusResponse, TemplateResponse } from "@/lib/api-client";
import TemplateLoader from "./TemplateLoader";

export const FINALE_BUFFERS_KEY = "codecell_finale_buffers";

const FINALE_STATUS_REFRESH_MS = 30000;

const GOLD = "#D9A404";
const FLAG = "#E2574C";

const TEMPLATE_ALLOWED = [
  "Input and output scaffolding: fast readers, buffered writers, the main you start every problem from.",
  "Standard algorithms kept as reusable library code: segment trees, sieves, DSU, string matching and the like.",
  "Macros, typedefs, debug and timing helpers you reach for whatever the problem turns out to be.",
];

const TEMPLATE_FORBIDDEN = [
  "A solution, or any part of one, to a specific problem.",
  "Code kept from a past contest, editorial or judge submission that answers a particular problem.",
  "Anything written for one problem rather than for any problem that might need it.",
];

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; status: FinaleStatusResponse }
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
      <h3 className="font-sans text-base font-semibold" style={{ color: accent }}>
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
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setState({ kind: "loading" });

    try {
      const status = await getCurrentFinale();
      setState({ kind: "ready", status });
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
          Sign in to check the finale&apos;s status and load your templates.
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
  const contestOpen = status.state !== "DRAFT";
  const locked = status.templatesLocked;

  const heading = contestOpen ? "The contest is open" : "Finale lobby";

  const standfirst = locked
    ? "Templates are locked for review. You can still read what you saved, but it can no longer be edited."
    : contestOpen
      ? "Your templates are saved. Head through when you are ready."
      : "The round hasn't started. Use the time to get your templates in order, they save to your account as you type.";

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

          <Link
            href="/events/finale"
            className="inline-flex items-center gap-2 border border-[#22262f] px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A7] transition-colors hover:border-[#D9A404]/60 hover:text-[#F4F1EA]"
          >
            Back to the finale
          </Link>
        </header>

        <section className="mt-12">
          <h2 className="font-sans text-xl font-semibold">What a template may contain</h2>
          <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-[#8B93A7]">
            Bring the scaffolding and library code you would otherwise retype, so you start the
            round solving the problem instead of rebuilding your toolkit. General-purpose
            algorithms are fine. Every template is read before the round, and anything that amounts
            to a stored answer to a specific problem is removed.
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
              {locked
                ? "Read-only until the organisers reopen them."
                : "Keep as many as you like, in any of the three languages. Edits save on their own."}
            </p>
          </div>

          {locked && (
            <p
              role="status"
              className="mt-4 flex items-center gap-2 border border-[#22262f] bg-[#0B0E15] px-4 py-3 font-sans text-sm text-[#8B93A7]"
            >
              <Lock size={14} style={{ color: GOLD }} />
              Your template library has been locked for review.
            </p>
          )}

          <div className="mt-6 h-[70vh] min-h-[420px] overflow-hidden rounded-lg border border-[#14161e] md:h-[560px]">
            {templatesLoaded ? (
              <TemplateLoader
                initialTemplates={templates}
                onContinue={() => {}}
                showContinue={false}
                readOnly={locked}
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
      </div>
    </div>
  );
}

export function FinaleCountdown({ target }: { target: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const ms = new Date(target).getTime() - Date.now();
      if (ms <= 0) {
        setLabel("0:00");
        return;
      }
      const totalSeconds = Math.floor(ms / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const formatted =
        days > 0
          ? `${days}d ${hours}h`
          : hours > 0
            ? `${hours}h ${String(minutes).padStart(2, "0")}m`
            : `${minutes}:${String(seconds).padStart(2, "0")}`;
      setLabel(formatted);
      timer = setTimeout(tick, 1000);
    };

    tick();
    return () => clearTimeout(timer);
  }, [target]);

  return <span>{label}</span>;
}
