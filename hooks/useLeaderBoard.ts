// hooks/useLeaderboard.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LeaderboardKind,
  LeaderboardTab,
  SeasonLeaderboardResponse,
  WeeklyLeaderboardResponse,
} from "@/lib/types/leaderboard";
import { getLeaderboard, ApiError } from "@/lib/api-client";

interface UseLeaderboardOptions {
  kind: LeaderboardKind;
  page?: number;
  limit?: number;
  weekId?: string; // weekly only, omit for active week
}

type LeaderboardResponse = WeeklyLeaderboardResponse | SeasonLeaderboardResponse;

export function useLeaderboard({
  kind,
  page = 1,
  limit = 25,
  weekId,
}: UseLeaderboardOptions) {
  const { user, isTsecStudent, isAuthenticated } = useAuth();
  const showToggle = isTsecStudent;

  // Default to TSEC tab if they are a TSEC student, else GLOBAL
  const [selectedTab, setSelectedTab] = useState<LeaderboardTab>(showToggle ? "TSEC" : "GLOBAL");
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [refetchToken, setRefetchToken] = useState(0);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setForbidden(false);
    setUnauthorized(false);

    try {
      const json = await getLeaderboard(kind, user?.role, selectedTab, {
        page,
        limit,
        weekId,
      });
      setData(json);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setForbidden(true);
          setData(null);
          return;
        }
        if (err.status === 401) {
          setUnauthorized(true);
          setData(null);
          return;
        }
      }

      setData(null);
      setError(err instanceof Error ? err.message : "Failed to load real-time leaderboard data");
    } finally {
      setIsLoading(false);
    }
  }, [kind, user?.role, selectedTab, page, limit, weekId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard, refetchToken]);

  useEffect(() => {
    if (showToggle && selectedTab === "GLOBAL") {
      // When their TSEC profile loads, instantly move them to the TSEC tab!
      setSelectedTab("TSEC");
    } else if (!showToggle && selectedTab === "TSEC") {
      // If they log out or lose TSEC status, move them back to GLOBAL
      setSelectedTab("GLOBAL");
    }
  }, [showToggle]);

  return {
    data,
    isLoading,
    error,
    forbidden,
    unauthorized,
    selectedTab,
    setSelectedTab,
    showToggle,
    refetch: () => setRefetchToken((t) => t + 1),
  };
}