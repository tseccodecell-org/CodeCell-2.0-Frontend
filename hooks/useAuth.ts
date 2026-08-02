"use client";

import { useCallback, useEffect, useState } from "react";
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

let sharedProfile: UserProfile | null = null;
let sharedLoading = true;
let sharedError: string | null = null;
let hasStarted = false;
let inFlight: Promise<void> | null = null;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function loadProfile(): Promise<void> {
  if (inFlight) return inFlight;

  sharedLoading = true;
  notify();

  inFlight = (async () => {
    try {
      const data = await getProfile();
      sharedProfile = data;
      setCachedProfile(data);
      if (!data) clearStoredSession();
      sharedError = null;
    } catch (err) {
      sharedProfile = null;
      clearStoredSession();
      sharedError = err instanceof Error ? err.message : "Could not load your profile.";
    } finally {
      sharedLoading = false;
      inFlight = null;
      notify();
    }
  })();

  return inFlight;
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

export function useAuth(): UseAuthResult {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const rerender = () => setVersion((v) => v + 1);
    listeners.add(rerender);

    if (!hasStarted) {
      hasStarted = true;
      clearLegacyTokenCookie();
      // long lived tokens from the old auth still sit in some browsers, and a
      // stale one is a second identity. nothing reads them any more, but they
      // are actively deleted so they stop existing at all
      localStorage.removeItem(TOKEN_CACHE_KEY);
      localStorage.removeItem("codecell_token");
      sharedProfile = getCachedProfile();
      loadProfile();
    }

    return () => {
      listeners.delete(rerender);
    };
  }, []);

  const refresh = useCallback(() => {
    loadProfile();
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    sharedProfile = null;
    notify();

    if (typeof window !== "undefined") {
      window.location.href = LOGOUT_URL;
    }
  }, []);

  const profile = sharedProfile;

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

  return {
    user,
    profile,
    isLoading: sharedLoading,
    isAuthenticated: profile !== null,
    isRegistered: registered,
    isProfileComplete: registered,
    isBanned: profile?.is_banned === true,
    banReason: profile?.ban_reason ?? "",
    warningCount: profile?.warning_count ?? 0,
    latestWarning: warnings.length > 0 ? warnings[0] : null,
    error: sharedError,
    isTsecStudent: profile?.is_tsec_user === true,
    refresh,
    logout,
  };
}
