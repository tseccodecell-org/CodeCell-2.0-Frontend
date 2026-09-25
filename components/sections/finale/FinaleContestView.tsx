"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import {
  CheckCircle2,
  CircleDashed,
  XCircle,
  Loader2,
  Lock,
  RefreshCw,
  PauseCircle,
  Flag,
  ChevronRight,
} from "lucide-react";

import type {
  FinaleStatusResponse,
  FinaleStandings,
  FinaleStandingsRow,
  TemplateResponse,
  WeekProblem,
} from "@/lib/api-client";
import { FinaleCountdown } from "./FinaleLobby";
import { useTimeReached } from "@/lib/finale-clock";
import FinaleStandingsTable, { CONTEST_COLORS as C, formatContestTime } from "./FinaleStandings";
import FocusGuard from "./FocusGuard";

const CONTEST_TITLE = "CodeCell Grand Finale";

export const CONTEST_RULES = [
  "The round runs for two hours from the moment an organiser starts it. The clock at the top of this page is the one that counts.",
  "Open a problem to get the statement, your editor and the judge you have used all season. You can move between problems freely.",
  "Run as often as you like. Submitting is what scores, and only accepted solutions count.",
  "Every problem is worth its listed points. Wrong submissions cost nothing except time, and compile errors are never counted.",
  "Ties break on total time to your last accepted solve. Time while scoring is paused is left out.",
  "If scoring is paused, keep working. You can still run and submit, but nothing submitted while paused scores.",
];

type Tab = "problems" | "standings" | "rules" | "templates";
const TABS: Tab[] = ["problems", "standings", "rules", "templates"];

function useTab(initial: Tab): [Tab, (tab: Tab) => void] {
  const [tab, setTab] = useState<Tab>(initial);

  useEffect(() => {
    const fromHash = window.location.hash.replace("#", "") as Tab;
    if (TABS.includes(fromHash)) setTab(fromHash);
  }, []);

  const choose = (next: Tab) => {
    setTab(next);
    try {
      window.history.replaceState(null, "", `#${next}`);
    } catch {}
  };

  return [tab, choose];
}

function StatusPill({ state }: { state: FinaleStatusResponse["state"] }) {
  const look = {
    LIVE: { label: "Live", color: C.green, pulse: true },
    PAUSED: { label: "Scoring paused", color: C.amber, pulse: false },
    ENDED: { label: "Ended", color: C.muted, pulse: false },
    DRAFT: { label: "Not started", color: C.muted, pulse: false },
  }[state];

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-sans text-xs font-medium"
      style={{ borderColor: `${look.color}55`, color: look.color, background: `${look.color}14` }}
    >
      <span className="relative flex h-2 w-2">
        {look.pulse && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:animate-none"
            style={{ background: look.color }}
          />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: look.color }} />
      </span>
      {look.label}
    </span>
  );
}

function ContestClock({
  status,
  endsAt,
}: {
  status: FinaleStatusResponse;
  endsAt: number | null;
}) {
  const startReached = useTimeReached(status.scheduledStartAt);

  if (status.state === "DRAFT" && startReached) {
    return (
      <div data-testid="finale-starting-soon" className="text-left sm:text-right">
        <p className="font-sans text-xs" style={{ color: C.muted }}>
          Waiting for an organiser to begin
        </p>
        <p className="mt-1 flex items-center gap-2 font-sans text-2xl font-semibold sm:justify-end" style={{ color: C.gold }}>
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:animate-none"
              style={{ background: C.gold }}
            />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: C.gold }} />
          </span>
          Starting soon
        </p>
      </div>
    );
  }

  if (status.state === "DRAFT") {
    return (
      <div className="text-left sm:text-right">
        <p className="font-sans text-xs" style={{ color: C.muted }}>
          {status.scheduledStartAt ? "Starts in" : "Starts when an organiser begins the round"}
        </p>
        {status.scheduledStartAt && (
          <p data-testid="finale-start-countdown" className="mt-1 font-mono text-3xl font-semibold tabular-nums" style={{ color: C.text }}>
            <FinaleCountdown target={status.scheduledStartAt} />
          </p>
        )}
      </div>
    );
  }

  if (status.state === "ENDED") {
    return (
      <div data-testid="finale-ended" className="text-left sm:text-right">
        <p className="font-sans text-xs" style={{ color: C.muted }}>
          Submissions closed
        </p>
        <p className="mt-1 flex items-center gap-2 font-sans text-2xl font-semibold sm:justify-end" style={{ color: C.text }}>
          <Flag size={20} style={{ color: C.gold }} />
          Contest ended
        </p>
      </div>
    );
  }

  if (status.state === "PAUSED") {
    return (
      <div className="text-left sm:text-right">
        <p className="font-sans text-xs" style={{ color: C.amber }}>
          Clock stopped
        </p>
        <p className="mt-1 font-mono text-3xl font-semibold tabular-nums" style={{ color: C.muted }}>
          {formatContestTime(status.remainingSeconds)}
        </p>
      </div>
    );
  }

  return (
    <div className="text-left sm:text-right">
      <p className="font-sans text-xs" style={{ color: C.muted }}>
        Time remaining
      </p>
      {endsAt !== null && (
        <p data-testid="finale-timer" className="mt-1 font-mono text-3xl font-semibold tabular-nums" style={{ color: C.gold }}>
          <FinaleCountdown target={new Date(endsAt).toISOString()} />
        </p>
      )}
    </div>
  );
}

function TabBar({
  tab,
  onChange,
  counts,
}: {
  tab: Tab;
  onChange: (tab: Tab) => void;
  counts: Partial<Record<Tab, number>>;
}) {
  const names: Record<Tab, string> = {
    problems: "Problems",
    standings: "Standings",
    rules: "Rules",
    templates: "Templates",
  };

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const i = TABS.indexOf(tab);
    if (event.key === "ArrowRight") onChange(TABS[(i + 1) % TABS.length]);
    if (event.key === "ArrowLeft") onChange(TABS[(i - 1 + TABS.length) % TABS.length]);
  };

  return (
    <div role="tablist" aria-label="Contest sections" className="flex gap-1 overflow-x-auto border-b" style={{ borderColor: C.border }}>
      {TABS.map((t) => {
        const selected = t === tab;
        return (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={selected}
            aria-controls={`panel-${t}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t)}
            onKeyDown={onKey}
            className="-mb-px flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-4 py-3 font-sans text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D9A404]"
            style={{
              borderColor: selected ? C.gold : "transparent",
              color: selected ? C.text : C.muted,
            }}
          >
            {names[t]}
            {counts[t] !== undefined && (
              <span
                className="rounded-full px-1.5 py-px font-mono text-[11px] tabular-nums"
                style={{ background: C.raised, color: C.muted }}
              >
                {counts[t]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function DifficultyChip({ difficulty }: { difficulty: string }) {
  const d = difficulty.toUpperCase();
  const color = d === "EASY" ? C.green : d === "HARD" ? C.red : C.amber;
  const label = d.charAt(0) + d.slice(1).toLowerCase();
  return (
    <span className="rounded-md px-2 py-0.5 font-sans text-xs font-medium" style={{ color, background: `${color}1A` }}>
      {label}
    </span>
  );
}

type YourStatus = "solved" | "tried" | "judging" | "none";

function StatusIcon({ status }: { status: YourStatus }) {
  if (status === "solved") return <CheckCircle2 size={18} style={{ color: C.green }} aria-label="Solved" />;
  if (status === "judging")
    return <Loader2 size={18} className="animate-spin motion-reduce:animate-none" style={{ color: C.amber }} aria-label="Being judged" />;
  if (status === "tried") return <XCircle size={18} style={{ color: C.red }} aria-label="Attempted" />;
  return <CircleDashed size={18} style={{ color: C.faint }} aria-label="Not attempted" />;
}

function ProblemsPanel({
  waiting,
  status,
  problems,
  standings,
  you,
  onOpenProblem,
  ended,
}: {
  waiting: boolean;
  status: FinaleStatusResponse;
  problems: WeekProblem[];
  standings: FinaleStandings | null;
  you: FinaleStandingsRow | null;
  onOpenProblem: (id: string) => void;
  ended: boolean;
}) {
  const startReached = useTimeReached(status.scheduledStartAt);

  if (waiting) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border px-6 py-16 text-center" style={{ borderColor: C.border, background: C.panel }}>
        <Lock size={22} style={{ color: C.gold }} />
        <p className="font-sans text-base font-medium" style={{ color: C.text }}>
          Sealed until the round starts
        </p>
        <p className="max-w-md font-sans text-sm" style={{ color: C.muted }}>
          Problems locked. They appear here the moment an organiser starts the round, and this page updates on its own.
        </p>
        {status.scheduledStartAt &&
          (startReached ? (
            <p className="font-sans text-sm font-medium" style={{ color: C.gold }}>
              Starting soon. Keep this page open.
            </p>
          ) : (
            <p className="font-mono text-sm tabular-nums" style={{ color: C.muted }}>
              Scheduled start in <FinaleCountdown target={status.scheduledStartAt} />
            </p>
          ))}
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="rounded-xl border px-6 py-12 text-center font-sans text-sm" style={{ borderColor: C.border, background: C.panel, color: C.muted }}>
        No problems have been published for this round yet.
      </div>
    );
  }

  const labels = new Map((standings?.problems ?? []).map((p) => [p.id, p.label]));
  const seated = standings?.rows.length ?? 0;
  const solvedBy = new Map<string, number>();
  for (const row of standings?.rows ?? []) {
    for (const cell of row.cells) {
      if (cell.solved) solvedBy.set(cell.problemId, (solvedBy.get(cell.problemId) ?? 0) + 1);
    }
  }

  const yourStatus = (problemId: string, fallbackSolved: boolean): YourStatus => {
    const cell = you?.cells.find((c) => c.problemId === problemId);
    if (cell?.solved || fallbackSolved) return "solved";
    if (cell?.pending) return "judging";
    if (cell && cell.wrongAttempts > 0) return "tried";
    return "none";
  };

  const head = "px-4 py-2.5 text-left font-sans text-xs font-medium";

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: C.border, background: C.panel }}>
      <table className="w-full border-collapse">
        <caption className="sr-only">Problems</caption>
        <thead>
          <tr style={{ background: C.raised, color: C.muted }}>
            <th scope="col" className={`${head} w-12 pr-0`}>
              <span className="sr-only">Your status</span>
            </th>
            <th scope="col" className={`${head} w-10`}>
              #
            </th>
            <th scope="col" className={head}>
              Problem
            </th>
            <th scope="col" className={`${head} hidden sm:table-cell`}>
              Difficulty
            </th>
            <th scope="col" className={`${head} text-right`}>
              Points
            </th>
            <th scope="col" className={`${head} hidden text-right md:table-cell`}>
              Solved by
            </th>
            <th scope="col" className={`${head} hidden w-28 sm:table-cell`}>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => {
            const label = labels.get(problem.id) ?? String.fromCharCode(65 + index);
            const mine = yourStatus(problem.id, problem.solved);
            return (
              <tr
                key={problem.id}
                onClick={() => onOpenProblem(problem.id)}
                className="group cursor-pointer border-t transition-colors hover:bg-[#151923]"
                style={{ borderColor: C.border }}
              >
                <td className="px-4 py-3.5">
                  <StatusIcon status={mine} />
                </td>
                <td className="px-4 py-3.5 font-sans text-sm font-semibold" style={{ color: C.muted }}>
                  {label}
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-sans text-sm font-medium" style={{ color: C.text }}>
                    {problem.title}
                  </span>
                  <span className="mt-0.5 block font-sans text-xs" style={{ color: C.faint }}>
                    {problem.time_limit_ms / 1000}s, {problem.memory_limit_mb} MB
                  </span>
                </td>
                <td className="hidden px-4 py-3.5 sm:table-cell">
                  <DifficultyChip difficulty={problem.difficulty} />
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-sm tabular-nums" style={{ color: C.text }}>
                  {problem.base_points}
                </td>
                <td className="hidden px-4 py-3.5 text-right font-mono text-sm tabular-nums md:table-cell" style={{ color: C.muted }}>
                  {solvedBy.get(problem.id) ?? 0}
                  <span style={{ color: C.faint }}> / {seated}</span>
                </td>
                <td className="hidden px-4 py-3.5 text-right sm:table-cell">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenProblem(problem.id);
                    }}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 font-sans text-xs font-medium transition-colors group-hover:border-[#D9A404] group-hover:text-[#D9A404] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
                    style={{ borderColor: C.border, color: C.text }}
                  >
                    {ended ? "View" : mine === "solved" ? "Open" : "Solve"}
                    <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function UpdatedAgo({ at }: { at: number | null }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (at === null) return <span>Updating</span>;
  const seconds = Math.max(0, Math.round((now - at) / 1000));
  return <span>{seconds < 2 ? "Updated just now" : `Updated ${seconds}s ago`}</span>;
}

function YourPosition({ you, seated }: { you: FinaleStandingsRow; seated: number }) {
  const items = [
    { label: "Your rank", value: `${you.rank}`, suffix: ` / ${seated}` },
    { label: "Score", value: `${you.score}` },
    { label: "Solved", value: `${you.solved}` },
    { label: "Penalty", value: formatContestTime(you.penaltySeconds) },
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-4" style={{ borderColor: C.border, background: C.border }}>
      {items.map((item) => (
        <div key={item.label} className="px-5 py-4" style={{ background: C.panel }}>
          <dt className="font-sans text-xs" style={{ color: C.muted }}>
            {item.label}
          </dt>
          <dd className="mt-1 font-mono text-xl font-semibold tabular-nums" style={{ color: C.text }}>
            {item.value}
            {item.suffix && <span className="text-sm font-normal" style={{ color: C.faint }}>{item.suffix}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function StandingsPanel({
  standings,
  you,
  currentUserId,
  updatedAt,
  onRefresh,
}: {
  standings: FinaleStandings | null;
  you: FinaleStandingsRow | null;
  currentUserId?: string | number;
  updatedAt: number | null;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {you && standings && <YourPosition you={you} seated={standings.rows.length} />}
      <div className="flex items-center justify-between gap-4 font-sans text-xs" style={{ color: C.muted }}>
        <span>Refreshes every 20 seconds</span>
        <span className="flex items-center gap-3">
          <UpdatedAgo at={updatedAt} />
          <button
            onClick={onRefresh}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 transition-colors hover:text-[#E7E9EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
            style={{ borderColor: C.border }}
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </span>
      </div>
      <FinaleStandingsTable standings={standings} currentUserId={currentUserId} />
    </div>
  );
}

function RulesPanel() {
  return (
    <div className="rounded-xl border p-6" style={{ borderColor: C.border, background: C.panel }}>
      <h2 className="font-sans text-base font-semibold" style={{ color: C.text }}>
        How the round works
      </h2>
      <ul className="mt-4 space-y-3">
        {CONTEST_RULES.map((line) => (
          <li key={line} className="flex gap-3 font-sans text-sm leading-relaxed" style={{ color: C.muted }}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: C.gold }} />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TemplatesPanel({ templates }: { templates: TemplateResponse[] }) {
  if (templates.length === 0) {
    return (
      <div className="rounded-xl border px-6 py-12 text-center font-sans text-sm" style={{ borderColor: C.border, background: C.panel, color: C.muted }}>
        You saved no templates before the round.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="font-sans text-sm" style={{ color: C.muted }}>
        Reference only. Inside a problem, the Templates tab loads them into your editor.
      </p>
      {templates.map((template) => (
        <details
          key={template.id}
          className="overflow-hidden rounded-xl border [&_summary]:cursor-pointer"
          style={{ borderColor: C.border, background: C.panel }}
        >
          <summary className="flex items-center justify-between px-5 py-3.5 font-sans text-sm font-medium" style={{ color: C.text }}>
            {template.name}
            <span className="rounded-md px-2 py-0.5 font-mono text-xs" style={{ background: C.raised, color: C.muted }}>
              {template.language}
            </span>
          </summary>
          <pre className="overflow-x-auto border-t px-5 py-4 font-mono text-xs leading-relaxed" style={{ borderColor: C.border, color: C.muted }}>
            {template.sourceCode}
          </pre>
        </details>
      ))}
    </div>
  );
}

export default function FinaleContestView({
  status,
  endsAt,
  problems,
  templates,
  standings,
  standingsUpdatedAt,
  onRefreshStandings,
  currentUserId,
  onOpenProblem,
  onRoundOver,
}: {
  status: FinaleStatusResponse;
  endsAt: number | null;
  problems: WeekProblem[];
  templates: TemplateResponse[];
  standings: FinaleStandings | null;
  standingsUpdatedAt: number | null;
  onRefreshStandings: () => void;
  currentUserId?: string | number;
  onOpenProblem: (id: string) => void;
  onRoundOver?: () => void;
}) {
  const timeUp = useTimeReached(status.state === "LIVE" ? endsAt : null);
  const shown: FinaleStatusResponse =
    status.state === "LIVE" && timeUp ? { ...status, state: "ENDED", remainingSeconds: 0 } : status;
  const ended = shown.state === "ENDED";

  useEffect(() => {
    if (timeUp && status.state === "LIVE") onRoundOver?.();
  }, [timeUp, status.state, onRoundOver]);

  const [tab, setTab] = useTab(status.state === "ENDED" ? "standings" : "problems");
  const waiting = status.state === "DRAFT";
  const you =
    currentUserId === undefined
      ? null
      : standings?.rows.find((row) => String(row.userId) === String(currentUserId)) ?? null;

  return (
    <FocusGuard weekId={status.weekId} counting={status.state === "LIVE" && !timeUp} required={!ended} proctor={status.proctor}>
    <div className="min-h-screen bg-[#0A0C10] text-[#E7E9EE]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <header
          className="flex flex-col gap-5 rounded-xl border px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6"
          style={{ borderColor: C.border, background: C.panel }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-sans text-xl font-semibold md:text-2xl" style={{ color: C.text }}>
                {CONTEST_TITLE}
              </h1>
              <StatusPill state={shown.state} />
            </div>
            <p className="mt-1.5 font-sans text-sm" style={{ color: C.muted }}>
              Offline round, 2 hours, individual
            </p>
          </div>
          <ContestClock status={shown} endsAt={endsAt} />
        </header>

        {status.state === "PAUSED" && (
          <div
            role="status"
            className="mt-4 flex items-start gap-3 rounded-xl border px-5 py-3.5 font-sans text-sm"
            style={{ borderColor: `${C.amber}55`, background: `${C.amber}12`, color: C.text }}
          >
            <PauseCircle size={18} className="mt-0.5 shrink-0" style={{ color: C.amber }} />
            Scoring is paused and the clock is stopped. Keep working: you can still run and submit, but nothing submitted now scores.
          </div>
        )}
        {ended && (
          <div
            role="status"
            className="mt-4 flex flex-col gap-4 rounded-xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: `${C.gold}55`, background: `${C.gold}0F` }}
          >
            <div className="flex items-start gap-3">
              <Flag size={20} className="mt-0.5 shrink-0" style={{ color: C.gold }} />
              <div>
                <p className="font-sans text-sm font-semibold" style={{ color: C.text }}>
                  The contest has ended
                </p>
                <p className="mt-0.5 font-sans text-sm" style={{ color: C.muted }}>
                  Submissions are closed and nothing more is scored. The standings are final.
                </p>
              </div>
            </div>
            {tab !== "standings" && (
              <button
                onClick={() => setTab("standings")}
                className="shrink-0 cursor-pointer rounded-lg px-4 py-2 font-sans text-sm font-semibold text-[#0A0C10] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
                style={{ background: C.gold }}
              >
                See final standings
              </button>
            )}
          </div>
        )}

        <div className="mt-6">
          <TabBar
            tab={tab}
            onChange={setTab}
            counts={{
              problems: waiting ? undefined : problems.length,
              standings: standings?.rows.length,
              templates: templates.length,
            }}
          />
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-5">
          {tab === "problems" && (
            <ProblemsPanel
              waiting={waiting}
              status={status}
              problems={problems}
              standings={standings}
              you={you}
              onOpenProblem={onOpenProblem}
              ended={ended}
            />
          )}
          {tab === "standings" && (
            <StandingsPanel
              standings={standings}
              you={you}
              currentUserId={currentUserId}
              updatedAt={standingsUpdatedAt}
              onRefresh={onRefreshStandings}
            />
          )}
          {tab === "rules" && <RulesPanel />}
          {tab === "templates" && <TemplatesPanel templates={templates} />}
        </div>
      </div>
    </div>
    </FocusGuard>
  );
}
