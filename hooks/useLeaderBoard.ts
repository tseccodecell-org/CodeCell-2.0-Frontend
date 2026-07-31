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
  limit = 20,
  weekId,
}: UseLeaderboardOptions) {
  const { user, isTsecStudent, isAuthenticated } = useAuth();

  const [selectedTab, setSelectedTab] = useState<LeaderboardTab>("GLOBAL");
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [refetchToken, setRefetchToken] = useState(0);

  const showToggle = isTsecStudent;

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
          // If TSEC segment was 403 forbidden, automatically fallback to GLOBAL
          if (selectedTab === "TSEC") {
            setSelectedTab("GLOBAL");
            return;
          }
        }
        if (err.status === 401 && !isAuthenticated) {
          setUnauthorized(true);
          setData(null);
          return;
        }
      }

      // Final fallback: try fetching GLOBAL tab directly if TSEC tab failed
      if (selectedTab === "TSEC") {
        setSelectedTab("GLOBAL");
        return;
      }

      setData(null);
      setError(err instanceof Error ? err.message : "Failed to load real-time leaderboard data");
    } finally {
      setIsLoading(false);
    }
  }, [kind, user?.role, selectedTab, page, limit, weekId, isAuthenticated]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard, refetchToken]);

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
    unauthorized,
    selectedTab,
    setSelectedTab,
    showToggle,
    refetch: () => setRefetchToken((t) => t + 1),
  };
}