"use client";

import { LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LOGIN_URL, LOGOUT_URL } from "@/lib/api-client";

export default function AuthStatus({ accent = "#4BE2C4" }: { accent?: string }) {
  const { profile, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <span className="block h-8 w-24 animate-pulse rounded-full bg-white/5" />;
  }

  if (!isAuthenticated || !profile) {
    return (
      <button
        onClick={() => (window.location.href = LOGIN_URL)}
        className="rounded-full border px-5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
        style={{ borderColor: accent, color: accent }}
      >
        Login
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wide"
        style={{ borderColor: `${accent}55`, color: accent, background: `${accent}12` }}
        title={profile.email}
      >
        <User size={13} />
        {profile.username}
        {profile.is_tsec_user && (
          <span className="rounded-sm bg-white/10 px-1 text-[9px] uppercase tracking-wider">
            TSEC
          </span>
        )}
      </span>

      <button
        onClick={() => (window.location.href = LOGOUT_URL)}
        title="Log out"
        className="rounded-full border border-white/10 p-2 text-[#8A8880] transition-colors hover:border-[#E2574C]/40 hover:text-[#E2574C] cursor-pointer"
      >
        <LogOut size={13} />
      </button>
    </div>
  );
}
