"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    description: week.description || "Algorithmic problem-solving match with ELO rating evaluation.",
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
      {/* ── Section Title Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[#1E1E1E] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-mono text-[11px] text-[#D4AF37] tracking-[0.25em] uppercase font-bold">
              SEASON 01 MATCH SCHEDULE
            </span>
          </div>
          <h2 className="font-display text-xl md:text-2xl font-extrabold uppercase text-[#F0EDE6] tracking-tight">
            CONTEST ARENA CHAPTERS
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#7A7870] bg-[#0E0E0E] px-3.5 py-1.5 rounded-lg border border-[#1E1E1E]">
            {weeks.length} CONTEST MATCHES
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center font-mono">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-xs text-[#7A7870] tracking-widest animate-pulse uppercase">
            LOADING ARENA SCHEDULE...
          </span>
        </div>
      ) : weeks.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center font-mono rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A]">
          <Swords size={36} className="text-[#3A3830] mb-3" />
          <span className="text-xs text-[#7A7870] tracking-widest uppercase">
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
                className={`relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden group ${
                  isLive
                    ? "border-[#D4AF37] bg-gradient-to-b from-[#14120A] via-[#0E0D08] to-[#0A0A0A] shadow-[0_0_40px_rgba(212,175,55,0.2)] ring-1 ring-[#D4AF37]/50"
                    : isDone
                    ? "border-[#2A2820] bg-[#0A0A0A]/90 hover:border-[#D4AF37]/40"
                    : "border-[#1A1A1A] bg-[#080808]/70 opacity-70"
                }`}
              >
                {/* Live Top Glow Indicator */}
                {isLive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8860B] animate-pulse" />
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Top Bar: Glyph & Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-lg ${
                          isLive
                            ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                            : isDone
                            ? "border-[#3A3830] bg-[#121212] text-[#C0C0C0]"
                            : "border-[#1E1E1E] bg-[#0E0E0E] text-[#5A5850]"
                        }`}
                      >
                        {week.glyph}
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-[#5A5850] tracking-widest uppercase block">
                          CHAPTER 0{week.weekNumber}
                        </span>
                        <span className="font-mono text-[9px] text-[#D4AF37] uppercase tracking-wider">
                          {week.contestType} MATCH
                        </span>
                      </div>
                    </div>

                    {isLive && (
                      <span className="flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#D4AF37] text-[9px] font-mono font-bold px-2.5 py-1 rounded-full animate-pulse shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                        LIVE ARENA
                      </span>
                    )}

                    {isDone && (
                      <span className="flex items-center gap-1 bg-[#1E1E1E] text-[#8A8880] text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border border-[#2A2A2A]">
                        <Check size={11} className="text-[#4BE2C4]" />
                        COMPLETED
                      </span>
                    )}

                    {isLocked && (
                      <span className="flex items-center gap-1 bg-[#0E0E0E] text-[#5A5850] text-[9px] font-mono px-2.5 py-1 rounded-full border border-[#1E1E1E]">
                        <Lock size={11} />
                        LOCKED
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-lg font-bold uppercase text-[#F0EDE6] tracking-tight mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {week.title}
                  </h3>
                  <p className="font-sans text-xs text-[#7A7870] leading-relaxed mb-6 flex-1">
                    {week.description}
                  </p>

                  {/* Meta Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-6 font-mono text-[10px] bg-[#050505] p-3 rounded-xl border border-[#1A1A1A]">
                    <div>
                      <span className="text-[#5A5850] block uppercase">TIMEFRAME</span>
                      <span className="text-[#C0C0C0] font-semibold">{week.dateRange}</span>
                    </div>
                    <div>
                      <span className="text-[#5A5850] block uppercase">SCORING</span>
                      <span className="text-[#D4AF37] font-semibold">{week.scoringSystem} POINTS</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isLive && (
                    <button
                      onClick={() => router.push(`/events/weekly-challenges/week/${week.weekId}`)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8860B] text-[#0A0A0A] font-mono text-xs font-black tracking-widest uppercase hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group/btn"
                    >
                      <span>ENTER BATTLE GROUND</span>
                      <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )}

                  {isDone && (
                    <button
                      onClick={() => router.push(`/events/weekly-challenges/week/${week.weekId}`)}
                      className="w-full py-3 rounded-xl border border-[#2A2820] bg-[#121210] text-[#D4AF37] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/50 font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>VIEW MATCH ARCHIVE</span>
                      <ArrowRight size={14} />
                    </button>
                  )}

                  {isLocked && (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl border border-[#1E1E1E] bg-[#0A0A0A] text-[#5A5850] font-mono text-xs font-semibold tracking-wider uppercase cursor-not-allowed flex items-center justify-center gap-2"
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

      {/* ── Contest Rules & Guidelines Footer Card ── */}
      <div className="mt-14 rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A]/90 p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold uppercase text-[#F0EDE6] tracking-wide">
              CONTEST ARENA RULES & REWARDS
            </h4>
            <span className="font-mono text-[10px] text-[#5A5850] tracking-wider uppercase block">
              OFFICIAL TSEC CODECELL COMPETITION STANDARDS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans text-[#8A8880] mt-4">
          <div className="p-3.5 rounded-xl bg-[#050505] border border-[#181818]">
            <span className="font-mono text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block mb-1">
              📍 01. OFFLINE FINALE AT TSEC BANDRA
            </span>
            Top ranking qualifiers from the weekly matches advance to the Grand Offline Finale held live on-campus at TSEC Bandra!
          </div>
          <div className="p-3.5 rounded-xl bg-[#050505] border border-[#D4AF37]/30 bg-[#D4AF37]/5">
            <span className="font-mono text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block mb-1">
              💼 02. INTERNSHIPS & ₹20,000+ PRIZES
            </span>
            Top performers receive direct internship interview opportunities, discount coupons, swag, and cash pool rewards!
          </div>
          <div className="p-3.5 rounded-xl bg-[#050505] border border-[#181818]">
            <span className="font-mono text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block mb-1">
              🛡️ 03. ANTI-CHEAT SYSTEM
            </span>
            Code similarity algorithms check all accepted submissions. Plagiarism results in immediate disqualification.
          </div>
        </div>
      </div>
    </div>
  );
}