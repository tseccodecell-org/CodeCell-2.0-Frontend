"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLeaderboard } from "@/hooks/useLeaderBoard";
import { useAuth } from "@/hooks/useAuth";
import type { SeasonLeaderboardResponse } from "@/lib/types/leaderboard";
import { QUALIFYING_SEATS } from "./finale-config";

const GOLD = "#D9A404";
const BRONZE = "#4A3E1C";

interface Seat {
  rank: number;
  name: string | null;
  xp: number | null;
  isYou: boolean;
}

// The board only ever shows the seats. Everything below the cut is read purely
// to work out how far off the viewer is.
export function buildSeats(
  entries: SeasonLeaderboardResponse["data"],
  youId: string | null
): Seat[] {
  return Array.from({ length: QUALIFYING_SEATS }, (_, i) => {
    const entry = entries[i];
    if (!entry) return { rank: i + 1, name: null, xp: null, isYou: false };
    return {
      rank: entry.rank,
      name: entry.name,
      xp: entry.season_xp,
      isYou: youId !== null && String(entry.user_id) === youId,
    };
  });
}

export interface Standing {
  rank: number | null;
  xp: number;
  gap: number | null;
}

export function findStanding(
  entries: SeasonLeaderboardResponse["data"],
  youId: string | null
): Standing | null {
  if (!youId) return null;
  const mine = entries.find((e) => String(e.user_id) === youId);
  const cutoff = entries[QUALIFYING_SEATS - 1];

  if (!mine) return { rank: null, xp: 0, gap: cutoff ? cutoff.season_xp : null };
  if (mine.rank <= QUALIFYING_SEATS) return { rank: mine.rank, xp: mine.season_xp, gap: 0 };

  return {
    rank: mine.rank,
    xp: mine.season_xp,
    gap: cutoff ? Math.max(0, cutoff.season_xp - mine.season_xp) : null,
  };
}

function displayName(full: string) {
  const trimmed = full.trim();
  return trimmed.length > 0 ? trimmed : "Unnamed";
}

export default function QualifierBoard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const reduceMotion = useReducedMotion();

  const {
    data,
    isLoading,
    error,
    forbidden,
    unauthorized,
    selectedTab,
    setSelectedTab,
    showToggle,
  } = useLeaderboard({ kind: "season", page: 1, limit: 1000 });

  const response = data as SeasonLeaderboardResponse | null;
  const entries = useMemo(() => response?.data ?? [], [response]);
  const youId = user?.id != null ? String(user.id) : null;

  const seats = useMemo(() => buildSeats(entries, youId), [entries, youId]);
  const standing = useMemo(() => findStanding(entries, youId), [entries, youId]);

  // Auth settles after the first paint. Until it does the board waits rather
  // than declaring itself sealed, so a signed-in viewer never sees the seats
  // flash locked before their own name lands.
  const pending = isAuthLoading || isLoading;
  const sealed = !pending && (unauthorized || forbidden || !isAuthenticated);
  const boardName = selectedTab === "TSEC" ? "TSEC board" : "global board";

  return (
    <section aria-labelledby="board-heading">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#8B93A7]">
            The seats
          </p>
          <h2 id="board-heading" className="font-mono text-lg text-[#F4F1EA] mt-2">
            {QUALIFYING_SEATS} places on the {boardName}
          </h2>
        </div>

        {showToggle && (
          <div
            className="flex items-center border border-[#1a1c24]"
            role="group"
            aria-label="Choose a board"
          >
            {(["TSEC", "GLOBAL"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                aria-pressed={selectedTab === tab}
                className={`px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404] ${
                  selectedTab === tab
                    ? "bg-[#D9A404] text-[#05070C]"
                    : "text-[#8B93A7] hover:text-[#F4F1EA]"
                }`}
              >
                {tab === "TSEC" ? "TSEC" : "Global"}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && !sealed && (
        <p className="border border-[#4A3E1C] bg-[#0B0E15] px-5 py-4 font-mono text-xs text-[#8B93A7] mb-6">
          The standings did not load. Reload the page to try again.
        </p>
      )}

      <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[#14161e] border border-[#14161e]">
        {seats.map((seat, i) => {
          const revealed = !sealed && !pending && seat.name !== null;
          const leading = seat.rank <= 3;

          return (
            <motion.li
              key={seat.rank}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: reduceMotion ? 0 : i * 0.025 }}
              className={`relative min-h-[104px] p-4 flex flex-col justify-between ${
                seat.isYou ? "bg-[#171203]" : "bg-[#0B0E15]"
              }`}
            >
              {seat.isYou && (
                <span
                  aria-hidden
                  className="absolute inset-0 border-2 pointer-events-none"
                  style={{ borderColor: GOLD }}
                />
              )}

              <div className="flex items-start justify-between">
                <span
                  className="font-mono text-sm tabular-nums"
                  style={{ color: revealed ? GOLD : BRONZE }}
                >
                  {String(seat.rank).padStart(2, "0")}
                </span>
                {revealed && leading && (
                  <span aria-hidden className="text-lg leading-none" style={{ color: BRONZE }}>
                    &#9819;
                  </span>
                )}
              </div>

              <div>
                {revealed ? (
                  <>
                    <p className="font-sans text-sm text-[#F4F1EA] leading-snug break-words">
                      {displayName(seat.name as string)}
                    </p>
                    <p className="font-mono text-[10px] text-[#8B93A7] mt-1 tabular-nums">
                      {seat.xp} XP
                      {seat.isYou && <span style={{ color: GOLD }}> · you</span>}
                    </p>
                  </>
                ) : (
                  <p
                    className="font-mono text-[10px] tracking-[0.18em] uppercase"
                    style={{ color: BRONZE }}
                  >
                    {pending ? "Reading" : sealed ? "Sealed" : error ? "No data" : "Open"}
                  </p>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-5 min-h-[20px]">
        {sealed ? (
          <p className="font-sans text-sm text-[#8B93A7]">
            Sign in to see who holds the seats and where you stand.
          </p>
        ) : standing === null ? null : standing.rank !== null &&
          standing.rank <= QUALIFYING_SEATS ? (
          <p className="font-sans text-sm text-[#F4F1EA]">
            You hold seat{" "}
            <span className="font-mono" style={{ color: GOLD }}>
              {String(standing.rank).padStart(2, "0")}
            </span>
            . Keep it through week 6 and you are in the room.
          </p>
        ) : (
          <p className="font-sans text-sm text-[#8B93A7]">
            {standing.rank !== null ? (
              <>
                You are at rank <span className="font-mono text-[#F4F1EA]">{standing.rank}</span>
                {standing.gap !== null && standing.gap > 0 && (
                  <>
                    , <span className="font-mono text-[#F4F1EA]">{standing.gap} XP</span> off seat{" "}
                    {QUALIFYING_SEATS}
                  </>
                )}
                .
              </>
            ) : (
              <>You have not scored on this board yet.</>
            )}{" "}
            The season is still running.
          </p>
        )}
      </div>
    </section>
  );
}
