"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderBoard";
import { useAuth } from "@/hooks/useAuth";
import LeaderboardToggle from "@/components/sections/leaderboard/LeaderboardToggle";
import LeaderboardTable, { LeaderboardRow } from "@/components/sections/leaderboard/LeaderboardTable";
import type { WeeklyLeaderboardResponse } from "@/lib/types/leaderboard";

export default function WeeklyLeaderboardPage() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    error,
    forbidden,
    unauthorized,
    selectedTab,
    setSelectedTab,
    showToggle,
  } = useLeaderboard({ kind: "weekly", page: 1, limit: 1000 });

  const response = data as WeeklyLeaderboardResponse | null;

  const rows: LeaderboardRow[] = useMemo(() => {
    if (!response) return [];

    return response.data.map((entry) => ({
      rank: entry.rank,
      id: entry.user_id,
      name: entry.name,
      primaryValue: entry.weekly_score,
      primaryLabel: "WEEKLY SCORE",
      secondaryValue: entry.problems_solved,
      secondaryLabel: "SOLVED",
    }));
  }, [response]);

  const [persistentUserRow, setPersistentUserRow] = useState<LeaderboardRow | undefined>(undefined);

  useEffect(() => {
    if (user?.id) {
      const found = rows.find((r) => String(r.id) === String(user.id));
      if (found) {
        setPersistentUserRow(found);
      } else if (!isLoading && !persistentUserRow) {
        setPersistentUserRow({
          id: user.id,
          name: user.name || "Anonymous",
          rank: 0,
          primaryValue: 0,
          primaryLabel: "WEEKLY SCORE",
          secondaryValue: 0,
          secondaryLabel: "SOLVED",
        });
      }
    }
  }, [rows, user?.id, persistentUserRow, user?.name, isLoading]);

  const totalCount = response?.total ?? rows.length;

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
        currentUserRow={persistentUserRow}
        totalCount={totalCount}
        controls={
          <LeaderboardToggle
            show={showToggle}
            selectedTab={selectedTab}
            onChange={(tab) => {
              setSelectedTab(tab);
            }}
          />
        }
      />
    </>
  );
}
