// app/leaderboard/weekly/page.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderBoard";
import LeaderboardToggle from "@/components/sections/leaderboard/LeaderboardToggle";
import LeaderboardTable, { LeaderboardRow } from "@/components/sections/leaderboard/LeaderboardTable";
import { WeeklyLeaderboardResponse } from "@/lib/types/leaderboard";

export default function WeeklyLeaderboardPage() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    error,
    forbidden,
    unauthorized,
    selectedTab,
    setSelectedTab,
    showToggle,
  } = useLeaderboard({ kind: "weekly", page, limit: 25 });

  const response = data as any;

  const rows: LeaderboardRow[] = useMemo(() => {
    if (!response) return [];

    let list: any[] = [];
    if (Array.isArray(response)) {
      list = response;
    } else if (Array.isArray(response.data)) {
      list = response.data;
    } else if (Array.isArray(response?.data?.data)) {
      list = response.data.data;
    }

    return list.map((entry: any, index: number) => ({
      rank: entry.rank ?? index + 1,
      id: entry.user_id ?? entry.id ?? entry.username ?? index,
      name: entry.name ?? entry.username ?? "Anonymous",
      primaryValue: entry.weekly_score ?? entry.score ?? 0,
      primaryLabel: "WEEKLY SCORE",
      secondaryValue: entry.problems_solved ?? entry.solved ?? 0,
      secondaryLabel: "SOLVED",
    }));
  }, [response]);

  const hasNext = Boolean(response?.has_next ?? response?.data?.has_next ?? false);

  return (
    <>
      <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pt-12">
        <Link href="/events/weekly-challenges/timeline">
          <button className="flex items-center gap-2 text-xs font-mono text-[#8A8880] hover:text-[#D4AF37] transition-colors mb-2">
            <ChevronLeft size={14} />
            BACK
          </button>
        </Link>
      </div>

      <LeaderboardTable
        title="Weekly Leaderboard"
        eyebrow="// GRANDMASTER_ARENA.WEEKLY_TRIAL"
        description="Rankings update after each match based on difficulty, execution speed, and tactical accuracy this week."
        rows={rows}
        isLoading={isLoading}
        error={error}
        forbidden={forbidden}
        unauthorized={unauthorized}
        page={page}
        hasNext={hasNext}
        onPageChange={setPage}
        controls={
          <LeaderboardToggle
            show={showToggle}
            selectedTab={selectedTab}
            onChange={(tab) => {
              setSelectedTab(tab);
              setPage(1);
            }}
          />
        }
      />
    </>
  );
}