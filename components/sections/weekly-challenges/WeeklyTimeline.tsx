"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Check,
  Zap,
  Swords,
  Trophy,
  Users,
  Clock,
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getWeeks, type Week as BackendWeek } from "@/lib/api-client";

type WeekStatus = "completed" | "live" | "locked";

interface Week {
  weekId: string;
  weekNumber: number;
  title: string;
  description?: string;
  glyph: string;
  dateRange: string;
  status: WeekStatus;
  contestType: string;
  scoringSystem: string;
}

const GLYPHS = ["♟", "♞", "♝", "♜", "♛", "♚"];

function formatDateRange(startsAt: string, endsAt: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
  const start = new Date(startsAt).toLocaleDateString("en-US", opts).toUpperCase();
  const end = new Date(endsAt).toLocaleDateString("en-US", opts).toUpperCase();
  return `${start} – ${end}`;
}

function deriveStatus(week: BackendWeek): WeekStatus {
  if (week.is_active) return "live";
  if (new Date(week.ends_at).getTime() < Date.now()) return "completed";
  return "locked";
}

function mapWeek(week: BackendWeek, index: number): Week {
  return {
    weekId: week.id,
    weekNumber: week.week_number,
    title: week.chapter_name || `Chapter 0${week.week_number}`,
    description: week.description || "",
    glyph: GLYPHS[index % GLYPHS.length],
    dateRange: formatDateRange(week.starts_at, week.ends_at),
    status: deriveStatus(week),
    contestType: week.contest_type || "OPEN",
    scoringSystem: week.scoring_system || "FULL",
  };
}

export default function WeeklyTimeline() {
  const router = useRouter();
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getWeeks()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => a.week_number - b.week_number);
          setWeeks(sorted.map(mapWeek));
        }
      })
      .catch((err) => {
        console.error("WeeklyTimeline: failed to fetch weeks:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[#1a1c24] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#D9A404] animate-pulse" />
            <span className="font-mono text-[11px] text-[#D9A404] tracking-[0.25em] uppercase font-bold">
              SEASON 01 MATCH SCHEDULE
            </span>
          </div>
          <h2 className="font-serif text-xl md:text-2xl font-bold uppercase text-[#F4F1EA] tracking-tight">
            CONTEST ARENA CHAPTERS
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#8B93A7] bg-[#0b0d13] px-3.5 py-1.5 border border-[#1a1c24]">
            {weeks.length} CONTEST MATCHES
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center font-mono">
          <div className="w-8 h-8 border-2 border-[#D9A404] border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-xs text-[#8B93A7] tracking-widest animate-pulse uppercase">
            LOADING ARENA SCHEDULE...
          </span>
        </div>
      ) : weeks.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center font-mono border border-[#1a1c24] bg-[#0b0d13]">
          <Swords size={36} className="text-[#5A5850] mb-3" />
          <span className="text-xs text-[#8B93A7] tracking-widest uppercase">
            NO CONTEST MATCHES PUBLISHED YET
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeks.map((week, index) => {
            const isLive = week.status === "live";
            const isLocked = week.status === "locked";
            const isDone = week.status === "completed";

            return (
              <motion.div
                key={week.weekId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`relative flex flex-col border transition-colors duration-300 overflow-hidden group ${
                  isLive
                    ? "border-[#D9A404]/50 bg-[#0b0d13]"
                    : isDone
                    ? "border-[#1a1c24] bg-[#0b0d13] hover:border-[#D9A404]/40"
                    : "border-[#1a1c24] bg-[#06070B]/70 opacity-70"
                }`}
              >
                {isLive && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D9A404]" />
                )}

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 border flex items-center justify-center font-mono text-lg ${
                          isLive
                            ? "border-[#D9A404] bg-[#D9A404]/10 text-[#D9A404]"
                            : isDone
                            ? "border-[#1a1c24] bg-[#0b0d13] text-[#8B93A7]"
                            : "border-[#1a1c24] bg-[#0b0d13] text-[#5A5850]"
                        }`}
                      >
                        {week.glyph}
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-[#5A5850] tracking-widest uppercase block">
                          CHAPTER 0{week.weekNumber}
                        </span>
                        <span className="font-mono text-[9px] text-[#D9A404] uppercase tracking-wider">
                          {week.contestType} MATCH
                        </span>
                      </div>
                    </div>

                    {isLive && (
                      <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] text-[#D9A404] border border-[#D9A404]/40 px-2 py-0.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-[#D9A404] animate-ping" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D9A404]" />
                        </span>
                        LIVE ARENA
                      </span>
                    )}

                    {isDone && (
                      <span className="flex items-center gap-1 font-mono text-[9px] tracking-[0.15em] text-[#8B93A7] border border-[#1a1c24] px-2 py-0.5">
                        <Check size={11} className="text-[#6FCF97]" />
                        COMPLETED
                      </span>
                    )}

                    {isLocked && (
                      <span className="flex items-center gap-1 font-mono text-[9px] tracking-[0.15em] text-[#5A5850] border border-[#1a1c24] px-2 py-0.5">
                        <Lock size={11} />
                        LOCKED
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#F4F1EA] tracking-tight mb-2 group-hover:text-[#D9A404] transition-colors">
                    {week.title}
                  </h3>
                  {week.description ? (
                    <p className="font-sans text-xs text-[#8B93A7] leading-relaxed mb-6 flex-1">
                      {week.description}
                    </p>
                  ) : (
                    <div className="mb-6 flex-1" />
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-6 font-mono text-[10px] bg-[#0b0d13] p-3 border border-[#1a1c24]">
                    <div>
                      <span className="text-[#5A5850] block uppercase">TIMEFRAME</span>
                      <span className="text-[#F4F1EA] font-semibold">{week.dateRange}</span>
                    </div>
                    <div>
                      <span className="text-[#5A5850] block uppercase">SCORING</span>
                      <span className="text-[#D9A404] font-semibold">{week.scoringSystem} POINTS</span>
                    </div>
                  </div>

                  {isLive && (
                    <button
                      onClick={() => router.push(`/events/weekly-challenges/week/${week.weekId}`)}
                      className="w-full py-3 rounded-full text-[#06070B] font-mono text-xs font-black tracking-[0.08em] uppercase cursor-pointer flex items-center justify-center gap-2 group/btn"
                      style={{
                        background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)",
                        boxShadow: "0 0 18px rgba(217,167,4,0.25)",
                      }}
                    >
                      <span>ENTER BATTLE GROUND</span>
                      <ArrowRight size={15} className="text-[#06070B]/60 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )}

                  {isDone && (
                    <button
                      onClick={() => router.push(`/events/weekly-challenges/week/${week.weekId}`)}
                      className="w-full py-3 rounded-full border border-[#3a3320] bg-[#0d0f14] text-[#D9A404] hover:border-[#D9A404] font-mono text-xs font-bold tracking-[0.08em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>VIEW MATCH ARCHIVE</span>
                      <ArrowRight size={14} />
                    </button>
                  )}

                  {isLocked && (
                    <button
                      disabled
                      className="w-full py-3 rounded-full border border-[#1a1c24] bg-[#0d0f14] text-[#5A5850] font-mono text-xs font-semibold tracking-[0.08em] uppercase cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock size={13} />
                      <span>UNLOCKS SOON</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-14 border border-[#1a1c24] bg-[#0b0d13] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 border border-[#D9A404]/30 bg-[#D9A404]/5 flex items-center justify-center text-[#D9A404]">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold uppercase text-[#F4F1EA] tracking-wide">
              CONTEST ARENA RULES & REWARDS
            </h4>
            <span className="font-mono text-[10px] text-[#5A5850] tracking-wider uppercase block">
              OFFICIAL TSEC CODECELL COMPETITION STANDARDS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans text-[#8B93A7] mt-4">
          <div className="p-3.5 bg-[#0b0d13] border border-[#1a1c24]">
            <span className="font-mono text-[10px] text-[#D9A404] font-bold uppercase tracking-wider block mb-1">
              01. OFFLINE FINALE AT TSEC BANDRA
            </span>
            Top ranking qualifiers from the weekly matches advance to the Grand Offline Finale held live on-campus at TSEC Bandra!
          </div>
          <div className="p-3.5 bg-[#D9A404]/5 border border-[#D9A404]/30">
            <span className="font-mono text-[10px] text-[#D9A404] font-bold uppercase tracking-wider block mb-1">
              02. INTERNSHIPS & ₹20,000+ PRIZES
            </span>
            Top performers receive direct internship interview opportunities, discount coupons, swag, and cash pool rewards!
          </div>
          <div className="p-3.5 bg-[#0b0d13] border border-[#1a1c24]">
            <span className="font-mono text-[10px] text-[#D9A404] font-bold uppercase tracking-wider block mb-1">
              03. NO PLAGIARISM, NO AI GENERATED CODE
            </span>
            Solutions must be your own. AI tools and copied code are both off
            limits while a week is live.{" "}
            <Link href="/codeofconduct" className="text-[#D9A404] hover:underline">
              Read the full rules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
