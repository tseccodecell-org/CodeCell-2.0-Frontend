"use client";

import { useCallback, useEffect, useState, createContext, useContext, ReactNode } from "react";
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

function clearLegacyTokenCookie() {
  if (typeof window === "undefined") return;
  if (!document.cookie.includes("jwt_token=")) return;
  document.cookie = "jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function clearStoredSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_CACHE_KEY);
  localStorage.removeItem(TOKEN_CACHE_KEY);
  localStorage.removeItem("codecell_token");
  clearLegacyTokenCookie();
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
}

// FIX ISSUE 1: Removed module-level singletons (sharedProfile, sharedLoading, etc.)
// Replaced with React Context to encapsulate auth state within the component tree and avoid race conditions.
const AuthContext = createContext<UseAuthResult | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => getCachedProfile());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProfile();
      setProfile(data);
      setCachedProfile(data);
      if (!data) clearStoredSession();
      setError(null);
    } catch (err) {
      setProfile(null);
      clearStoredSession();
      setError(err instanceof Error ? err.message : "Could not load your profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    clearLegacyTokenCookie();
    localStorage.removeItem(TOKEN_CACHE_KEY);
    localStorage.removeItem("codecell_token");
    loadProfile();
  }, [loadProfile]);

  const refresh = useCallback(() => {
    loadProfile();
  }, [loadProfile]);

  const logout = useCallback(() => {
    clearStoredSession();
    setProfile(null);

    if (typeof window !== "undefined") {
      window.location.href = LOGOUT_URL;
    }
  }, []);

  const user: AuthUser | null = profile
    ? {
        id: profile.id,
        name: profile.name || profile.username,
        role: profile.is_tsec_user ? UserRole.TSEC : UserRole.OTHER,
      }
    : null;

  const warnings = profile?.warnings ?? [];
  const registered = profile
    ? profile.is_registered !== false || Boolean(profile.college_name && profile.year)
    : false;

  const value: UseAuthResult = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): UseAuthResult {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
