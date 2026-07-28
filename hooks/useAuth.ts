"use client";

import { useCallback, useEffect, useState } from "react";
import { getProfile, ApiError } from "@/lib/api-client";
import type { UserProfile } from "@/lib/api-client";
import { AuthUser, UserRole } from "@/lib/types/leaderboard";

interface UseAuthResult {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isTsecStudent: boolean;
  refresh: () => void;
}

export function useAuth(): UseAuthResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      setIsLoading(true);
      try {
        const data = await getProfile();
        if (cancelled) return;
        setProfile(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setProfile(null);
        if (err instanceof ApiError && err.status === 401) {
          setError(null);
        } else {
          setError(err instanceof Error ? err.message : "Failed to load session");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const user: AuthUser | null = profile
    ? {
        id: profile.id,
        name: profile.username,
        role: profile.is_tsec_user ? UserRole.TSEC : UserRole.OTHER,
      }
    : null;

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!profile,
    error,
    isTsecStudent: !isLoading && user?.role === UserRole.TSEC,
    refresh,
  };
}
