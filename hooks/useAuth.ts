"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { getProfile } from "@/lib/api-client";
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

/** Check if JWT token exists in cookies or localStorage */
function hasAuthToken(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const token = localStorage.getItem(TOKEN_CACHE_KEY) || localStorage.getItem("codecell_token");
    if (token) return true;
    if (document.cookie.includes("jwt_token=")) return true;
    return false;
  } catch {
    return false;
  }
}

interface UseAuthResult {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
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
      localStorage.removeItem("codecell_is_registered");
      document.cookie = "jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    setProfile(null);
    nextAuthSignOut({ redirect: false });
  }, []);

  const setAuthToken = useCallback(
    (token: string) => {
      if (typeof window !== "undefined") {
        const cleanToken = token.trim().replace(/^Bearer\s+/i, "");
        localStorage.setItem(TOKEN_CACHE_KEY, cleanToken);
        localStorage.setItem("codecell_token", cleanToken);
        document.cookie = `jwt_token=${cleanToken}; path=/; max-age=31536000;`;
        refresh();
      }
    },
    [refresh]
  );

  // Parse URL parameters for ?token=... or ?jwt_token=... on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token") || params.get("jwt") || params.get("jwt_token") || params.get("access_token");
    if (tokenParam) {
      const cleanToken = tokenParam.trim().replace(/^Bearer\s+/i, "");
      localStorage.setItem(TOKEN_CACHE_KEY, cleanToken);
      localStorage.setItem("codecell_token", cleanToken);
      document.cookie = `jwt_token=${cleanToken}; path=/; max-age=31536000;`;
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("jwt");
      url.searchParams.delete("jwt_token");
      url.searchParams.delete("access_token");
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

  const tokenPresent = hasAuthToken();

  // NextAuth fallback profile if NextAuth session exists or token exists
  const fallbackUser: UserProfile | null = (session?.user || tokenPresent)
    ? {
        id: 1,
        username: session?.user?.name || session?.user?.email?.split("@")[0] || "Contestant",
        email: session?.user?.email || "",
        rating: 1400,
        total_problems_solved: 0,
        college_name: "",
        year: "",
        is_tsec_user: session?.user?.email?.endsWith("@tsec.edu") || session?.user?.email?.includes("tsec") || false,
      }
    : null;

  const activeProfile = profile || fallbackUser;

  // Check if Step 2 registration has been completed for this specific user
  let isProfileComplete = false;
  if (typeof window !== "undefined") {
    const email = activeProfile?.email || session?.user?.email;
    if (email) {
      const hasRegFlag = localStorage.getItem(`codecell_is_registered_${email}`) === "true";
      const hasRegDetails = Boolean(localStorage.getItem(`codecell_registered_${email}`));
      const isProfileRegistered = Boolean(profile?.is_registered);
      
      isProfileComplete = hasRegFlag || hasRegDetails || isProfileRegistered;
    }
  }

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
    isAuthenticated: Boolean(activeProfile),
    isProfileComplete,
    error,
    isTsecStudent: !isSessionLoading && user?.role === UserRole.TSEC,
    refresh,
    logout,
    setAuthToken,
  };
}
