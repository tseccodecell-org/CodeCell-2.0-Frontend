"use client";

import Link from "next/link";
import { CalendarDays, Trophy } from "lucide-react";

export default function LeaderboardButtons() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/events/weekly-challenges/leaderboard/weekly">
        <button className="flex items-center gap-1.5 font-mono text-[15px] tracking-[0.1em] text-[#8A8880] border border-[#2A2A2A] hover:border-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors px-3 py-2">
          <CalendarDays size={12} />
          WEEKLY
        </button>
      </Link>
      <Link href="/events/weekly-challenges/leaderboard/season">
        <button className="flex items-center gap-1.5 font-mono text-[15px] tracking-[0.1em] text-[#8A8880] border border-[#2A2A2A] hover:border-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors px-3 py-2">
          <Trophy size={12} />
          SEASON
        </button>
      </Link>
    </div>
  );
}