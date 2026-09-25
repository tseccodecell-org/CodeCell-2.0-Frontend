"use client";

import type { FinaleStandings, FinaleStandingsCell, FinaleStandingsProblem } from "@/lib/api-client";

const GOLD = "#D9A404";
const FLAG = "#E2574C";
const INK = "#06070B";
const MUTED = "#8B93A7";
const PANEL = "#0B0E15";

export function formatContestTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`;
}

function firstSolveTimes(standings: FinaleStandings): Map<string, number> {
  const first = new Map<string, number>();
  for (const row of standings.rows) {
    for (const cell of row.cells) {
      if (!cell.solved || cell.solvedAtSeconds === undefined) continue;
      const best = first.get(cell.problemId);
      if (best === undefined || cell.solvedAtSeconds < best) {
        first.set(cell.problemId, cell.solvedAtSeconds);
      }
    }
  }
  return first;
}

function describeCell(problem: FinaleStandingsProblem, cell: FinaleStandingsCell, first: boolean): string {
  const tries =
    cell.wrongAttempts > 0
      ? `${cell.wrongAttempts} wrong ${cell.wrongAttempts === 1 ? "attempt" : "attempts"}`
      : "";
  if (cell.solved) {
    const when = formatContestTime(cell.solvedAtSeconds ?? 0);
    const parts = [`Problem ${problem.label} solved for ${cell.points} points at ${when}`];
    if (first) parts.push("first to solve");
    if (tries) parts.push(`after ${tries}`);
    return parts.join(", ");
  }
  if (cell.pending) return `Problem ${problem.label} being judged${tries ? `, ${tries} so far` : ""}`;
  if (tries) return `Problem ${problem.label} not solved, ${tries}`;
  return `Problem ${problem.label} not attempted`;
}

function WrongTries({ count, onGold }: { count: number; onGold?: boolean }) {
  return (
    <span className="font-mono text-[10px] tabular-nums leading-none" style={{ color: onGold ? INK : FLAG }}>
      {"−"}
      {count}
    </span>
  );
}

function JudgingRing() {
  return (
    <span
      className="inline-block h-2.5 w-2.5 animate-pulse rounded-full border motion-reduce:animate-none"
      style={{ borderColor: GOLD }}
    />
  );
}

function ScoreCell({ cell, first }: { cell: FinaleStandingsCell; first: boolean }) {
  if (cell.solved) {
    return (
      <div
        className="relative mx-auto flex h-12 w-[4.75rem] flex-col items-center justify-center rounded-[3px]"
        style={
          first
            ? { background: GOLD, color: INK }
            : { boxShadow: `inset 0 0 0 1px ${GOLD}59`, color: GOLD }
        }
      >
        <span className="font-mono text-sm font-semibold tabular-nums leading-none">{cell.points}</span>
        <span
          className="mt-1.5 font-mono text-[10px] tabular-nums leading-none"
          style={{ color: first ? INK : MUTED, opacity: first ? 0.7 : 1 }}
        >
          {formatContestTime(cell.solvedAtSeconds ?? 0)}
        </span>
        {cell.wrongAttempts > 0 && (
          <span className="absolute right-1.5 top-1">
            <WrongTries count={cell.wrongAttempts} onGold={first} />
          </span>
        )}
      </div>
    );
  }

  if (cell.pending || cell.wrongAttempts > 0) {
    return (
      <div className="mx-auto flex h-12 w-[4.75rem] items-center justify-center gap-2">
        {cell.wrongAttempts > 0 && <WrongTries count={cell.wrongAttempts} />}
        {cell.pending && <JudgingRing />}
      </div>
    );
  }

  return <div className="mx-auto h-12 w-[4.75rem]" />;
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 font-sans text-xs text-[#8B93A7]">
      <span className="flex items-center gap-2">
        <span className="inline-block h-3.5 w-5 rounded-[2px]" style={{ background: GOLD }} />
        First to solve
      </span>
      <span className="flex items-center gap-2">
        <span
          className="inline-block h-3.5 w-5 rounded-[2px]"
          style={{ boxShadow: `inset 0 0 0 1px ${GOLD}59` }}
        />
        Solved, with the contest time of the accept
      </span>
      <span className="flex items-center gap-2">
        <WrongTries count={2} />
        Wrong tries before the accept
      </span>
      <span className="flex items-center gap-2">
        <JudgingRing />
        Being judged
      </span>
    </div>
  );
}

export default function FinaleStandingsTable({
  standings,
  currentUserId,
}: {
  standings: FinaleStandings | null;
  currentUserId?: string | number;
}) {
  if (standings === null) {
    return (
      <p className="mt-4 border border-[#14161e] bg-[#0B0E15] px-5 py-6 font-sans text-sm text-[#8B93A7]">
        Loading the standings.
      </p>
    );
  }

  if (standings.rows.length === 0) {
    return (
      <p className="mt-4 border border-[#14161e] bg-[#0B0E15] px-5 py-6 font-sans text-sm text-[#8B93A7]">
        No seats have been granted yet.
      </p>
    );
  }

  const first = firstSolveTimes(standings);
  const you = currentUserId === undefined ? null : String(currentUserId);

  return (
    <>
      <div className="mt-4 overflow-x-auto border border-[#14161e]" style={{ background: PANEL }}>
        <table className="w-full border-collapse">
          <caption className="sr-only">Live standings</caption>
          <thead>
            <tr className="border-b border-[#14161e]">
              <th
                scope="col"
                className="sticky left-0 z-10 w-14 px-4 py-3 text-left font-sans text-xs font-medium text-[#8B93A7]"
                style={{ background: PANEL }}
              >
                Rank
              </th>
              <th
                scope="col"
                className="sticky left-14 z-10 min-w-[8rem] px-3 py-3 sm:min-w-[10rem] text-left font-sans text-xs font-medium text-[#8B93A7]"
                style={{ background: PANEL }}
              >
                Participant
              </th>
              {standings.problems.map((problem) => (
                <th
                  key={problem.id}
                  scope="col"
                  title={problem.title ? `${problem.label}. ${problem.title}` : undefined}
                  className="px-1 py-3 text-center"
                >
                  <span className="block font-mono text-sm font-semibold text-[#F4F1EA]">{problem.label}</span>
                  <span className="mt-0.5 block font-mono text-[10px] tabular-nums text-[#5A5850]">
                    {problem.points}
                  </span>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-right font-sans text-xs font-medium text-[#8B93A7]">
                Score
              </th>
              <th scope="col" className="px-4 py-3 text-right font-sans text-xs font-medium text-[#8B93A7]">
                Penalty
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.rows.map((row) => {
              const isYou = you !== null && String(row.userId) === you;
              return (
                <tr
                  key={row.userId}
                  data-testid={isYou ? "standings-you" : undefined}
                  className="border-b border-[#14161e] last:border-b-0"
                >
                  <td
                    className="sticky left-0 z-10 px-4 py-2 font-mono text-sm tabular-nums text-[#F4F1EA]"
                    style={{ background: PANEL, boxShadow: isYou ? `inset 2px 0 0 ${GOLD}` : undefined }}
                  >
                    {row.rank}
                  </td>
                  <th
                    scope="row"
                    className="sticky left-14 z-10 max-w-[9rem] px-3 py-2 text-left font-normal sm:max-w-[14rem]"
                    style={{ background: PANEL }}
                  >
                    <span
                      className="block truncate font-sans text-sm"
                      style={{ color: isYou ? GOLD : "#F4F1EA" }}
                    >
                      {row.name}
                      {isYou && <span className="sr-only"> (you)</span>}
                    </span>
                    {row.username && row.username !== row.name && (
                      <span className="block truncate font-mono text-[11px] text-[#5A5850]">
                        @{row.username}
                      </span>
                    )}
                  </th>
                  {standings.problems.map((problem) => {
                    const cell =
                      row.cells.find((c) => c.problemId === problem.id) ??
                      ({ problemId: problem.id, solved: false, points: 0, wrongAttempts: 0, pending: false } as FinaleStandingsCell);
                    const isFirst =
                      cell.solved &&
                      cell.solvedAtSeconds !== undefined &&
                      first.get(problem.id) === cell.solvedAtSeconds;
                    return (
                      <td key={problem.id} className="px-1 py-1.5" aria-label={describeCell(problem, cell, isFirst)}>
                        <ScoreCell cell={cell} first={isFirst} />
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 text-right font-mono text-base font-semibold tabular-nums text-[#F4F1EA]">
                    {row.score}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-sm tabular-nums text-[#8B93A7]">
                    {row.solved > 0 ? formatContestTime(row.penaltySeconds) : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Legend />
      <p className="mt-3 max-w-2xl font-sans text-xs leading-relaxed text-[#5A5850]">
        Ranked by score. Equal scores are split by penalty, the contest time of the last accepted
        solve, and paused time never counts. Refreshes every 20 seconds.
      </p>
    </>
  );
}
