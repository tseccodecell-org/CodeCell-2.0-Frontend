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
  const { user, isTsecStudent, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const showToggle = isTsecStudent;

  const [hasInitTab, setHasInitTab] = useState(false);
  const [selectedTab, setSelectedTab] = useState<LeaderboardTab>("GLOBAL");
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !hasInitTab) {
      setSelectedTab(isTsecStudent ? "TSEC" : "GLOBAL");
      setHasInitTab(true);
    }
  }, [isAuthLoading, isTsecStudent, hasInitTab]);
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
    if (hasInitTab) {
      fetchLeaderboard();
    }
  }, [fetchLeaderboard, refetchToken, hasInitTab]);

  const [userManuallySelectedTab, setUserManuallySelectedTab] = useState(false);

  // FIX ISSUE 6: Stabilize tab switching logic.
  // We track if the user manually clicked a tab so we don't automatically
  // snap them back during background auth updates or re-renders.
  useEffect(() => {
    if (!userManuallySelectedTab) {
      if (showToggle && selectedTab === "GLOBAL") {
        setSelectedTab("TSEC");
      } else if (!showToggle && selectedTab === "TSEC") {
        setSelectedTab("GLOBAL");
      }
    }
  }, [showToggle, selectedTab, userManuallySelectedTab]);

  const handleTabChange = useCallback((tab: LeaderboardTab) => {
    setUserManuallySelectedTab(true);
    setSelectedTab(tab);
  }, []);

  return {
    data,
    isLoading,
    error,
    forbidden,
    unauthorized,
    selectedTab,
    setSelectedTab: handleTabChange,
    showToggle,
    refetch: () => setRefetchToken((t) => t + 1),
  };
}