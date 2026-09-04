"use client";

import { useMemo } from "react";
import { useLeaderboard } from "@/hooks/useLeaderBoard";
import { useAuth } from "@/hooks/useAuth";
import type { SeasonLeaderboardResponse } from "@/lib/types/leaderboard";
import { QUALIFYING_SEATS } from "./finale-config";

export interface Seat {
  rank: number;
  name: string | null;
  xp: number | null;
  isYou: boolean;
}

export interface Standing {
  rank: number | null;
  xp: number;
  gap: number | null;
}

// The board only ever shows the seats. Everything below the cut is read purely
// to work out how far off the viewer is.
export function buildSeats(
  entries: SeasonLeaderboardResponse["data"],
  youId: string | null
): Seat[] {
  return Array.from({ length: QUALIFYING_SEATS }, (_, i) => {
    const entry = entries[i];
    if (!entry) return { rank: i + 1, name: null, xp: null, isYou: false };
    return {
      rank: entry.rank,
      name: entry.name,
      xp: entry.season_xp,
      isYou: youId !== null && String(entry.user_id) === youId,
    };
  });
}

export function findStanding(
  entries: SeasonLeaderboardResponse["data"],
  youId: string | null
): Standing | null {
  if (!youId) return null;
  const mine = entries.find((e) => String(e.user_id) === youId);
  const cutoff = entries[QUALIFYING_SEATS - 1];

  if (!mine) return { rank: null, xp: 0, gap: cutoff ? cutoff.season_xp : null };
  if (mine.rank <= QUALIFYING_SEATS) return { rank: mine.rank, xp: mine.season_xp, gap: 0 };

  return {
    rank: mine.rank,
    xp: mine.season_xp,
    gap: cutoff ? Math.max(0, cutoff.season_xp - mine.season_xp) : null,
  };
}

export function holdsSeat(standing: Standing | null): boolean {
  return standing !== null && standing.rank !== null && standing.rank <= QUALIFYING_SEATS;
}

export interface SeasonStanding {
  seats: Seat[];
  standing: Standing | null;
  qualified: boolean;
  sealed: boolean;
  pending: boolean;
  error: string | null;
}

// One read of the season board, shared by everything on the finale page, so the
// seats and the apply button can never disagree about who is in.
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

  const seats = useMemo(() => buildSeats(entries, youId), [entries, youId]);
  const standing = useMemo(() => findStanding(entries, youId), [entries, youId]);

  // Auth settles after the first paint. Until it does the page waits rather
  // than declaring itself sealed, so a signed-in viewer never sees the seats
  // flash locked before their own name lands.
  const pending = isAuthLoading || isLoading;
  const sealed = !pending && (unauthorized || forbidden || !isAuthenticated);

  return { seats, standing, qualified: holdsSeat(standing), sealed, pending, error };
}
