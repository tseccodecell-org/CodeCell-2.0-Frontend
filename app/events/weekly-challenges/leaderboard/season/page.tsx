// app/leaderboard/season/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderBoard";
import { useAuth } from "@/hooks/useAuth";
import LeaderboardToggle from "@/components/sections/leaderboard/LeaderboardToggle";
import LeaderboardTable, { LeaderboardRow } from "@/components/sections/leaderboard/LeaderboardTable";
import { SeasonLeaderboardResponse } from "@/lib/types/leaderboard";

export default function SeasonLeaderboardPage() {
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
  } = useLeaderboard({ kind: "season", page: 1, limit: 1000 });

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
      primaryValue: entry.final_rating ?? entry.rating ?? entry.season_xp ?? 0,
      primaryLabel: "FINAL RATING",
      secondaryValue: entry.season_xp ?? entry.xp ?? 0,
      secondaryLabel: "SEASON XP",
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
          primaryLabel: "SEASON XP",
          secondaryValue: 0,
          secondaryLabel: "RATING",
        });
      }
    }
  }, [rows, user?.id, persistentUserRow, user?.name, isLoading]);

  const totalCount = response?.total ?? response?.data?.total ?? rows.length;

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
        title="Season Leaderboard"
        eyebrow="// GRANDMASTER_ARENA.SEASON_STANDINGS"
        description="Cumulative standing across the full season, based on season XP and final ELO rating."
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