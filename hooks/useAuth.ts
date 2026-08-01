"use client";

import { useCallback, useEffect, useState } from "react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { getProfile, LOGOUT_URL } from "@/lib/api-client";
import type { ProfileWarning, UserProfile } from "@/lib/api-client";
import { AuthUser, UserRole } from "@/lib/types/leaderboard";

const PROFILE_CACHE_KEY = "codecell_user_profile";
const TOKEN_CACHE_KEY = "jwt_token";

function getCachedProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

function setCachedProfile(profile: UserProfile | null) {
  if (typeof window === "undefined") return;
  try {
    if (profile) {
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(PROFILE_CACHE_KEY);
    }
  } catch {
    return;
  }
}

function clearStoredSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_CACHE_KEY);
  localStorage.removeItem(TOKEN_CACHE_KEY);
  localStorage.removeItem("codecell_token");
}

interface UseAuthResult {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isRegistered: boolean;
  isProfileComplete: boolean;
  isBanned: boolean;
  banReason: string;
  warningCount: number;
  latestWarning: ProfileWarning | null;
  error: string | null;
  isTsecStudent: boolean;
  refresh: () => void;
  logout: () => void;
  setAuthToken: (token: string) => void;
}

export function useAuth(): UseAuthResult {
  const [profile, setProfile] = useState<UserProfile | null>(getCachedProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const logout = useCallback(() => {
    clearStoredSession();
    setProfile(null);

    nextAuthSignOut({ redirect: false }).finally(() => {
      if (typeof window !== "undefined") {
        window.location.href = LOGOUT_URL;
      }
    });
  }, []);

  const setAuthToken = useCallback(
    (token: string) => {
      if (typeof window !== "undefined") {
        const cleanToken = token.trim().replace(/^Bearer\s+/i, "");
        localStorage.setItem(TOKEN_CACHE_KEY, cleanToken);
        refresh();
      }
    },
    [refresh]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token") || params.get("jwt") || params.get("jwt_token");
    if (tokenParam) {
      localStorage.setItem(TOKEN_CACHE_KEY, tokenParam);
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("jwt");
      url.searchParams.delete("jwt_token");
      window.history.replaceState({}, "", url.toString());
      refresh();
    }
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      setIsLoading(true);
      try {
        const data = await getProfile();
        if (cancelled) return;
        setProfile(data);
        setCachedProfile(data);
        if (!data) clearStoredSession();
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setProfile(null);
        clearStoredSession();
        setError(err instanceof Error ? err.message : "Could not load your profile.");
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
        name: profile.name || profile.username,
        role: profile.is_tsec_user ? UserRole.TSEC : UserRole.OTHER,
      }
    : null;

  const warnings = profile?.warnings ?? [];

  const registered = profile
    ? profile.is_registered !== false ||
      Boolean(profile.college_name && profile.year)
    : false;

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: profile !== null,
    isRegistered: registered,
    isProfileComplete: registered,
    isBanned: profile?.is_banned === true,
    banReason: profile?.ban_reason ?? "",
    warningCount: profile?.warning_count ?? 0,
    latestWarning: warnings.length > 0 ? warnings[0] : null,
    error,
    isTsecStudent: profile?.is_tsec_user === true,
    refresh,
    logout,
    setAuthToken,
  };
}
