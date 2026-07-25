"use client";

import Link from "next/link";
import { CalendarDays, Trophy, ArrowRight } from "lucide-react";

export default function LeaderboardButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link href="/events/weekly-challenges/leaderboard/weekly" className="group">
        <div className="flex items-center gap-3 rounded-full border border-[#3a3320] bg-[#0d0f14] px-4 py-2.5 hover:border-[#D9A404] transition-colors">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1a1710] text-[#D9A404]">
            <CalendarDays size={14} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-mono text-[11px] font-bold tracking-[0.08em] text-[#F4F1EA]">
              WEEKLY LEADERBOARD
            </span>
            <span className="font-mono text-[9px] text-[#8B93A7]">
              this week&apos;s rankings
            </span>
          </span>
          <ArrowRight
            size={14}
            className="text-[#5A5850] group-hover:text-[#D9A404] group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </Link>

      <Link href="/events/weekly-challenges/leaderboard/season" className="group">
        <div
          className="flex items-center gap-3 rounded-full px-4 py-2.5 border border-transparent"
          style={{
            background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)",
            boxShadow: "0 0 18px rgba(217,167,4,0.25)",
          }}
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#06070B]/20 text-[#06070B]">
            <Trophy size={14} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-mono text-[11px] font-bold tracking-[0.08em] text-[#06070B]">
              SEASON LEADERBOARD
            </span>
            <span className="font-mono text-[9px] text-[#06070B]/70">
              cumulative standings
            </span>
          </span>
          <ArrowRight
            size={14}
            className="text-[#06070B]/60 group-hover:translate-x-0.5 transition-transform"
          />
        </div>
      </Link>
    </div>
  );
}