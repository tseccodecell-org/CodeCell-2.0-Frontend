"use client";

import { useRouter } from "next/navigation";
import { Lock, Check } from "lucide-react";

type WeekStatus = "completed" | "live" | "locked";

interface Week {
  weekId: number;
  title: string;
  glyph: string;
  dateRange: string;
  status: WeekStatus;
}

// ---- TEMP: hardcoded weeks. Replace with the fetch below ----
const WEEKS: Week[] = [
  { weekId: 1, title: "Opening Moves",     glyph: "♟", dateRange: "JUL 06 – JUL 12", status: "completed" },
  { weekId: 2, title: "The Fork",          glyph: "♞", dateRange: "JUL 13 – JUL 19", status: "completed" },
  { weekId: 3, title: "Diagonal Assault",  glyph: "♝", dateRange: "JUL 20 – JUL 26", status: "live" },
  { weekId: 4, title: "Open File",         glyph: "♜", dateRange: "JUL 27 – AUG 02", status: "locked" },
  { weekId: 5, title: "Full Force",        glyph: "♛", dateRange: "AUG 03 – AUG 09", status: "locked" },
  { weekId: 6, title: "Endgame",           glyph: "♚", dateRange: "AUG 10 – AUG 16", status: "locked" },
];

// ---- Real fetch (swap in once endpoint is live) ----
// import axios from "axios";
//
// async function getAllWeeks(): Promise<Week[]> {
//   const { data } = await axios.get("/api/all_weeks");
//   return data.weeks;
// }
//
// In the parent page:
// const [weeks, setWeeks] = useState<Week[]>([]);
// useEffect(() => { getAllWeeks().then(setWeeks).catch(console.error); }, []);
// <WeeklyTimeline weeks={weeks} />

export default function WeeklyTimeline({ weeks = WEEKS }: { weeks?: Week[] }) {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-6">
        <span className="font-mono text-[10px] text-[#D9A404] tracking-[0.2em]">
          SEASON_01 // RANK_TIMELINE
        </span>
        <span className="font-mono text-[10px] text-[#5A5850] hidden sm:block">
          6 WEEKS · 1 BOARD
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {weeks.map((week) => {
          const isLive = week.status === "live";
          const isLocked = week.status === "locked";
          const isDone = week.status === "completed";

          return (
            <button
              key={week.weekId}
              disabled={isLocked}
              onClick={() => {
                if (!isLocked) router.push(`/events/weekly-challenges/week/${week.weekId}`);
              }}
              className={[
                "relative text-left border-t px-6 py-6 flex flex-col gap-4 bg-[#0b0d13]",
                "transition-colors duration-300",
                isLive ? "border-t-[#D9A404]" : isDone ? "border-t-[#4a4530]" : "border-t-[#22262f]",
                isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-[#101219]",
                isLive ? "chess-live-card" : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <span
                  className={[
                    "flex items-center justify-center w-9 h-9 rounded border",
                    isLive ? "border-[#D9A404]/60 text-[#D9A404]" : "border-[#22262f] text-[#5A5850]",
                  ].join(" ")}
                >
                  <span className="text-lg leading-none" aria-hidden>
                    {week.glyph}
                  </span>
                </span>

                <span className="font-mono text-[9px] text-[#5A5850] tracking-widest pt-1">
                  WK.0{week.weekId}
                </span>
              </div>

              <div>
                <p className="font-mono text-2xl font-bold tracking-tight">
                  <span className="text-[#D9A404]">&gt;</span>
                  <span className={isLocked ? "text-[#5A5850]" : "text-[#F4F1EA]"}>
                    {week.title.toUpperCase()}
                  </span>
                  <span className="text-[#D9A404] chess-cursor">_</span>
                </p>
                <p className="font-mono text-[10px] text-[#8B93A7] mt-2">{week.dateRange}</p>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] pt-3 mt-auto border-t border-[#1a1c24]">
                <span className="pt-3 flex items-center gap-1.5">
                  {isLive && (
                    <>
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#D9A404] chess-ping" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D9A404]" />
                      </span>
                      <span className="text-[#D9A404]">LIVE NOW</span>
                    </>
                  )}
                  {isDone && (
                    <span className="flex items-center gap-1.5 text-[#8B93A7]">
                      <Check size={10} /> CLEARED
                    </span>
                  )}
                  {isLocked && (
                    <span className="flex items-center gap-1.5 text-[#5A5850]">
                      <Lock size={10} /> OPENS {week.dateRange.split("–")[0].trim()}
                    </span>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .chess-live-card {
          animation: chess-check-glow 2.2s ease-in-out infinite;
        }
        @keyframes chess-check-glow {
          0%,
          100% {
            box-shadow: inset 0 1px 0 0 rgba(217, 164, 4, 0.4), 0 0 0 rgba(217, 164, 4, 0);
          }
          50% {
            box-shadow: inset 0 1px 0 0 rgba(217, 164, 4, 0.9), 0 8px 24px -8px rgba(217, 164, 4, 0.35);
          }
        }
        .chess-ping {
          animation: chess-ping-anim 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes chess-ping-anim {
          75%,
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .chess-cursor {
          animation: chess-blink 1.1s steps(1) infinite;
        }
        @keyframes chess-blink {
          50% {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .chess-live-card,
          .chess-ping,
          .chess-cursor {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}