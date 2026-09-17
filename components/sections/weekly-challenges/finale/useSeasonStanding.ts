"use client";

import { useMemo } from "react";
import { useLeaderboard } from "@/hooks/useLeaderBoard";
import { useAuth } from "@/hooks/useAuth";
import type { SeasonLeaderboardResponse } from "@/lib/types/leaderboard";
import { QUALIFYING_SEATS } from "./finale-config";

export interface Standing {
  rank: number | null;
  xp: number;
  gap: number | null;
}

// Only the viewer's own position is ever shown. The rest of the board is read
// purely to find the cutoff, so we can say how far off they are.
export function findStanding(
  entries: SeasonLeaderboardResponse["data"],
  youId: string | null
): Standing | null {
  if (!youId) return null;
  const mine = entries.find((e) => String(e.user_id) === youId);
  const cutoff = entries[QUALIFYING_SEATS - 1];

  if (!mine) return { rank: null, xp: 0, gap: cutoff ? roundXp(cutoff.season_xp) : null };
  if (mine.rank <= QUALIFYING_SEATS) return { rank: mine.rank, xp: mine.season_xp, gap: 0 };

  return {
    rank: mine.rank,
    xp: mine.season_xp,
    gap: cutoff ? roundXp(Math.max(0, cutoff.season_xp - mine.season_xp)) : null,
  };
}

function roundXp(value: number): number {
  return Math.round(value);
}

export function holdsSeat(standing: Standing | null): boolean {
  return standing !== null && standing.rank !== null && standing.rank <= QUALIFYING_SEATS;
}

export interface SeasonStanding {
  standing: Standing | null;
  qualified: boolean;
  sealed: boolean;
  pending: boolean;
  error: string | null;
}

// One read of the season board, shared by the standing strip and the apply
// button, so the two can never disagree about whether the viewer is in.
export function useSeasonStanding(): SeasonStanding {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data, isLoading, error, forbidden, unauthorized } = useLeaderboard({
    kind: "season",
    page: 1,
    limit: 1000,
  });

  const response = data as SeasonLeaderboardResponse | null;
  const entries = useMemo(() => response?.data ?? [], [response]);
  const youId = user?.id != null ? String(user.id) : null;

  const standing = useMemo(() => findStanding(entries, youId), [entries, youId]);

  // Auth settles after the first paint. Until it does the page waits rather
  // than declaring itself sealed, so a signed-in viewer never sees the locked
  // copy flash before their own position lands.
  const pending = isAuthLoading || isLoading;
  const sealed = !pending && (unauthorized || forbidden || !isAuthenticated);

  return { standing, qualified: holdsSeat(standing), sealed, pending, error };
}
