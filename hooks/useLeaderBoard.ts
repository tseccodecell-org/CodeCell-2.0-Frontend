// hooks/useLeaderboard.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LeaderboardKind,
  LeaderboardTab,
  SeasonLeaderboardResponse,
  UserRole,
  WeeklyLeaderboardResponse,
} from "@/lib/types/leaderboard";
import { getLeaderboard, ApiError } from "@/lib/api-client";

interface UseLeaderboardOptions {
  kind: LeaderboardKind;
  page?: number;
  limit?: number;
  weekId?: string; // weekly only, omit for the currently active week
}

type LeaderboardResponse = WeeklyLeaderboardResponse | SeasonLeaderboardResponse;

interface UseLeaderboardResult {
  data: LeaderboardResponse | null;
  isLoading: boolean;
  error: string | null;
  /** true if the backend rejected a /tsec_student/* request with 403 */
  forbidden: boolean;
  /** "TSEC" | "GLOBAL" — currently selected leaderboard segment */
  selectedTab: LeaderboardTab;
  setSelectedTab: (tab: LeaderboardTab) => void;
  /** only true for authenticated TSEC users — controls toggle visibility */
  showToggle: boolean;
  refetch: () => void;
}

function buildEndpoint(
  kind: LeaderboardKind,
  role: UserRole | undefined,
  selectedTab: LeaderboardTab
) {
  const useTsecEndpoint = role === UserRole.TSEC && selectedTab === "TSEC";
  const audience = useTsecEndpoint ? "tsec_student" : "global";
  return `/${audience}/${kind}_leaderboard`;
}

/**
 * Fetches weekly or season leaderboard data.
 *
 * Defaults `selectedTab` to "GLOBAL" — every user sees the Global leaderboard
 * first. The TSEC toggle (and the tsec_student/* endpoint) only becomes
 * reachable once `showToggle` is true, i.e. once we've confirmed the user
 * is an authenticated TSEC student.
 */
export function useLeaderboard({
  kind,
  page = 1,
  limit = 20,
  weekId,
}: UseLeaderboardOptions): UseLeaderboardResult {
  const { user, isTsecStudent } = useAuth();

  const [selectedTab, setSelectedTab] = useState<LeaderboardTab>("GLOBAL");
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [refetchToken, setRefetchToken] = useState(0);

  const showToggle = isTsecStudent;
const fetchLeaderboard = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  setForbidden(false);

  try {
    const json = await getLeaderboard(kind, user?.role, selectedTab, {
      page,
      limit,
      weekId,
    });
    setData(json);
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      setForbidden(true);
      setData(null);
      return;
    }
    setError(err instanceof Error ? err.message : "Failed to load leaderboard");
    setData(null);
  } finally {
    setIsLoading(false);
  }
}, [kind, user?.role, selectedTab, page, limit, weekId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard, refetchToken]);

  // Non-TSEC users can never end up pointed at the TSEC tab, even if state
  // somehow got set that way (e.g. role resolves after an optimistic toggle).
  useEffect(() => {
    if (!showToggle && selectedTab === "TSEC") {
      setSelectedTab("GLOBAL");
    }
  }, [showToggle, selectedTab]);

  return {
    data,
    isLoading,
    error,
    forbidden,
    selectedTab,
    setSelectedTab,
    showToggle,
    refetch: () => setRefetchToken((t) => t + 1),
  };
}