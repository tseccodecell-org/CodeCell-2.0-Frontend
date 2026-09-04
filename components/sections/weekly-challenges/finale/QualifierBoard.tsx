"use client";

import { motion, useReducedMotion } from "framer-motion";
import { QUALIFYING_SEATS } from "./finale-config";
import type { SeasonStanding } from "./useSeasonStanding";

const GOLD = "#D9A404";
const BRONZE = "#4A3E1C";

function displayName(full: string) {
  const trimmed = full.trim();
  return trimmed.length > 0 ? trimmed : "Unnamed";
}

export default function QualifierBoard({ state }: { state: SeasonStanding }) {
  const reduceMotion = useReducedMotion();
  const { seats, standing, qualified, sealed, pending, error } = state;

  return (
    <section aria-labelledby="board-heading">
      <div className="mb-6">
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#8B93A7]">
          The seats
        </p>
        <h2 id="board-heading" className="font-mono text-lg text-[#F4F1EA] mt-2">
          {QUALIFYING_SEATS} places on the season board
        </h2>
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
        ) : standing === null ? null : qualified ? (
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
