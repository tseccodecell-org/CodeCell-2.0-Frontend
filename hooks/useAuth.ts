"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { getProfile, ApiError } from "@/lib/api-client";
import type { UserProfile } from "@/lib/api-client";
import { AuthUser, UserRole } from "@/lib/types/leaderboard";

const PROFILE_CACHE_KEY = "codecell_user_profile";
const TOKEN_CACHE_KEY = "jwt_token";

/** Read cached profile from localStorage */
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

/** Write profile to localStorage */
function setCachedProfile(profile: UserProfile | null) {
  if (typeof window === "undefined") return;
  try {
    if (profile) {
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(PROFILE_CACHE_KEY);
    }
  } catch {
    // localStorage may be full or disabled — silently ignore
  }
}

interface UseAuthResult {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isTsecStudent: boolean;
  refresh: () => void;
  logout: () => void;
  setAuthToken: (token: string) => void;
}

export function useAuth(): UseAuthResult {
  const { data: session, status: sessionStatus } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(getCachedProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const logout = useCallback(() => {
    setCachedProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_CACHE_KEY);
      localStorage.removeItem("codecell_token");
    }
    setProfile(null);
    nextAuthSignOut({ redirect: false });
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

  // Parse URL parameters for ?token=... or ?jwt_token=... on mount
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
        if (data) setCachedProfile(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  // NextAuth fallback profile if NextAuth session exists
  const nextAuthUser: UserProfile | null = session?.user
    ? {
        id: 1,
        username: session.user.name || session.user.email?.split("@")[0] || "User",
        email: session.user.email || "",
        rating: 1400,
        total_problems_solved: 0,
        college_name: session.user.email?.endsWith("@tsec.edu") || session.user.email?.includes("tsec")
          ? "Thadomal Shahani Engineering College"
          : "TSEC",
        year: "BE",
        is_tsec_user: true,
      }
    : null;

  const activeProfile = profile || nextAuthUser;

  const user: AuthUser | null = activeProfile
    ? {
        id: activeProfile.id,
        name: activeProfile.username,
        role: activeProfile.is_tsec_user ? UserRole.TSEC : UserRole.OTHER,
      }
    : null;

  const isSessionLoading = isLoading && sessionStatus === "loading";

  return {
    user,
    profile: activeProfile,
    isLoading: isSessionLoading,
    isAuthenticated: !!activeProfile,
    error,
    isTsecStudent: !isSessionLoading && user?.role === UserRole.TSEC,
    refresh,
    logout,
    setAuthToken,
  };
}
