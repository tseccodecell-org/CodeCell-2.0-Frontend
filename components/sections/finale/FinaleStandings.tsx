"use client";

import type { FinaleStandings, FinaleStandingsCell, FinaleStandingsProblem } from "@/lib/api-client";

export const CONTEST_COLORS = {
  panel: "#10131A",
  raised: "#151923",
  border: "#1F2430",
  text: "#E7E9EE",
  muted: "#8C93A3",
  faint: "#5B6272",
  gold: "#D9A404",
  green: "#4ADE80",
  greenFill: "rgba(34, 197, 94, 0.14)",
  greenFirst: "rgba(34, 197, 94, 0.32)",
  red: "#F87171",
  amber: "#F59E0B",
};

const C = CONTEST_COLORS;

export function formatContestTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`;
}

export function firstSolveTimes(standings: FinaleStandings): Map<string, number> {
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

function ScoreCell({ cell, first }: { cell: FinaleStandingsCell; first: boolean }) {
  if (cell.solved) {
    return (
      <div
        className="flex h-full min-h-[3.25rem] flex-col items-center justify-center"
        style={{ background: first ? C.greenFirst : C.greenFill }}
      >
        <span className="font-mono text-[13px] font-semibold tabular-nums leading-none" style={{ color: C.green }}>
          {cell.points}
        </span>
        <span className="mt-1 font-mono text-[11px] tabular-nums leading-none" style={{ color: C.muted }}>
          {formatContestTime(cell.solvedAtSeconds ?? 0)}
          {cell.wrongAttempts > 0 && (
            <span style={{ color: C.red }}>
              {" "}
              {"−"}
              {cell.wrongAttempts}
            </span>
          )}
        </span>
      </div>
    );
  }

  if (cell.wrongAttempts > 0 || cell.pending) {
    return (
      <div className="flex h-full min-h-[3.25rem] flex-col items-center justify-center gap-1">
        {cell.wrongAttempts > 0 && (
          <span className="font-mono text-[13px] font-semibold tabular-nums leading-none" style={{ color: C.red }}>
            {"−"}
            {cell.wrongAttempts}
          </span>
        )}
        {cell.pending && (
          <span className="font-sans text-[10px] leading-none" style={{ color: C.amber }}>
            judging
          </span>
        )}
      </div>
    );
  }

  return <div className="min-h-[3.25rem]" />;
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
      <div className="rounded-xl border px-5 py-10 text-center font-sans text-sm" style={{ borderColor: C.border, background: C.panel, color: C.muted }}>
        Loading the standings.
      </div>
    );
  }

  if (standings.rows.length === 0) {
    return (
      <div className="rounded-xl border px-5 py-10 text-center font-sans text-sm" style={{ borderColor: C.border, background: C.panel, color: C.muted }}>
        No seats have been granted yet.
      </div>
    );
  }

  const first = firstSolveTimes(standings);
  const you = currentUserId === undefined ? null : String(currentUserId);
  const headCell = "px-3 py-2.5 font-sans text-xs font-medium";

  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: C.border, background: C.panel }}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <caption className="sr-only">Live standings</caption>
          <colgroup>
            <col style={{ width: "4rem" }} />
            <col />
            <col style={{ width: "5.5rem" }} />
            <col style={{ width: "6.5rem" }} />
            {standings.problems.map((problem) => (
              <col key={problem.id} style={{ width: "5.75rem" }} />
            ))}
          </colgroup>
          <thead>
            <tr style={{ background: C.raised, color: C.muted }}>
              <th scope="col" className={`${headCell} sticky left-0 z-10 text-center`} style={{ background: C.raised }}>
                Rank
              </th>
              <th scope="col" className={`${headCell} sticky left-16 z-10 min-w-[9rem] text-left`} style={{ background: C.raised }}>
                Participant
              </th>
              <th scope="col" className={`${headCell} text-center`}>
                Score
              </th>
              <th scope="col" className={`${headCell} text-center`}>
                Penalty
              </th>
              {standings.problems.map((problem) => (
                <th
                  key={problem.id}
                  scope="col"
                  title={problem.title ? `${problem.label}. ${problem.title}` : undefined}
                  className="border-l px-2 py-2 text-center"
                  style={{ borderColor: C.border }}
                >
                  <span className="block font-sans text-sm font-semibold" style={{ color: C.text }}>
                    {problem.label}
                  </span>
                  <span className="block font-mono text-[10px] tabular-nums" style={{ color: C.faint }}>
                    {problem.points}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.rows.map((row) => {
              const isYou = you !== null && String(row.userId) === you;
              const rowBg = isYou ? "#1A1810" : C.panel;
              return (
                <tr
                  key={row.userId}
                  data-testid={isYou ? "standings-you" : undefined}
                  className="border-t"
                  style={{ borderColor: C.border, background: rowBg }}
                >
                  <td
                    className="sticky left-0 z-10 px-3 text-center font-mono text-sm tabular-nums"
                    style={{
                      background: rowBg,
                      color: C.text,
                      boxShadow: isYou ? `inset 3px 0 0 ${C.gold}` : undefined,
                    }}
                  >
                    {row.rank}
                  </td>
                  <th
                    scope="row"
                    className="sticky left-16 z-10 max-w-[11rem] px-3 py-2 text-left font-normal sm:max-w-none"
                    style={{ background: rowBg }}
                  >
                    <span className="block truncate font-sans text-sm font-medium" style={{ color: isYou ? C.gold : C.text }}>
                      {row.name}
                      {isYou && <span className="sr-only"> (you)</span>}
                    </span>
                    {row.username && row.username !== row.name && (
                      <span className="block truncate font-sans text-xs" style={{ color: C.faint }}>
                        @{row.username}
                      </span>
                    )}
                  </th>
                  <td className="px-3 text-center font-mono text-sm font-semibold tabular-nums" style={{ color: C.text }}>
                    {row.score}
                  </td>
                  <td className="px-3 text-center font-mono text-sm tabular-nums" style={{ color: C.muted }}>
                    {row.solved > 0 ? formatContestTime(row.penaltySeconds) : "0:00"}
                  </td>
                  {standings.problems.map((problem) => {
                    const cell =
                      row.cells.find((c) => c.problemId === problem.id) ??
                      ({ problemId: problem.id, solved: false, points: 0, wrongAttempts: 0, pending: false } as FinaleStandingsCell);
                    const isFirst =
                      cell.solved &&
                      cell.solvedAtSeconds !== undefined &&
                      first.get(problem.id) === cell.solvedAtSeconds;
                    return (
                      <td
                        key={problem.id}
                        className="border-l p-0"
                        style={{ borderColor: C.border }}
                        aria-label={describeCell(problem, cell, isFirst)}
                      >
                        <ScoreCell cell={cell} first={isFirst} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t px-4 py-3 font-sans text-xs"
        style={{ borderColor: C.border, color: C.muted }}
      >
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-4 rounded-sm" style={{ background: C.greenFirst }} />
          First to solve
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-4 rounded-sm" style={{ background: C.greenFill }} />
          Accepted, with the time of the accept
        </span>
        <span className="flex items-center gap-2">
          <span className="font-mono font-semibold" style={{ color: C.red }}>
            {"−"}2
          </span>
          Wrong tries
        </span>
        <span className="ml-auto" style={{ color: C.faint }}>
          Ranked by score, then penalty: the contest time of the last accepted solve.
        </span>
      </div>
    </div>
  );
}
