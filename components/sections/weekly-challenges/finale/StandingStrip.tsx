"use client";

import Link from "next/link";
import { QUALIFYING_SEATS } from "./finale-config";
import type { SeasonStanding } from "./useSeasonStanding";

const GOLD = "#D9A404";
const BRONZE = "#4A3E1C";

function Cell({
  label,
  children,
  accent = false,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="bg-[#0B0E15] p-5">
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8B93A7]">{label}</p>
      <p
        className="font-mono text-xl mt-3 tabular-nums"
        style={{ color: accent ? GOLD : "#F4F1EA" }}
      >
        {children}
      </p>
    </div>
  );
}

export default function StandingStrip({ state }: { state: SeasonStanding }) {
  const { standing, qualified, sealed, pending, error } = state;

  if (pending) {
    return (
      <div className="border border-[#14161e] bg-[#0B0E15] p-5">
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: BRONZE }}>
          Checking where you stand
        </p>
      </div>
    );
  }

  if (sealed) {
    return (
      <div className="border border-[#14161e] bg-[#0B0E15] p-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-sans text-sm text-[#8B93A7]">
          The season&apos;s top {QUALIFYING_SEATS} take the {QUALIFYING_SEATS} seats on campus.{" "}
          <Link
            href="/register"
            className="text-[#D9A404] underline underline-offset-4 hover:text-[#F5C451] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
          >
            Sign in
          </Link>{" "}
          to see where you land.
        </p>
      </div>
    );
  }

  if (error || standing === null) {
    return (
      <div className="border border-[#14161e] bg-[#0B0E15] p-6">
        <p className="font-sans text-sm text-[#8B93A7]">
          Your standing did not load. Reload the page to try again.
        </p>
      </div>
    );
  }

  return (
    <div
      className="border"
      style={{ borderColor: qualified ? GOLD : "#14161e" }}
      aria-live="polite"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#14161e]">
        <Cell label="Your rank" accent={qualified}>
          {standing.rank === null ? "Unranked" : `#${standing.rank}`}
        </Cell>

        <Cell label="Season rating" accent={qualified}>
          {`${standing.xp} XP`}
        </Cell>

        <Cell label="Season">{"Running"}</Cell>
      </div>

      <p className="bg-[#0B0E15] border-t border-[#14161e] px-5 py-4 font-sans text-sm text-[#8B93A7] leading-relaxed">
        {qualified ? (
          <>
            You are inside the cut. Hold it through week 6 and both the finale seat and the
            internship track are yours.
          </>
        ) : standing.rank === null ? (
          <>
            Solve a problem to get on the season board. The top {QUALIFYING_SEATS} take the finale
            seats and the internship track.
          </>
        ) : (
          <>
            The top {QUALIFYING_SEATS} take the finale seats and the internship track. Nothing is
            settled until week 6 closes.
          </>
        )}
      </p>
    </div>
  );
}
