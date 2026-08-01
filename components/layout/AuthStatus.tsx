"use client";

import Link from "next/link";
import { LogOut, User, Trophy } from "lucide-react";
import { signIn } from "next-auth/react";
import { LOGIN_URL } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";

export default function AuthStatus({ accent = "#4BE2C4" }: { accent?: string }) {
  const { profile, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return <span className="block h-8 w-24 animate-pulse rounded-full bg-white/5" />;
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => signIn("google", { callbackUrl: "/register" }).catch(() => (window.location.href = LOGIN_URL))}
        className="rounded-full border px-5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer hover:bg-white/5"
        style={{ borderColor: accent, color: accent }}
      >
        Login
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/events/weekly-challenges/leaderboard/weekly"
        className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-wide transition-all hover:scale-[1.02] cursor-pointer"
        style={{ borderColor: `${accent}65`, color: accent, background: `${accent}15` }}
        title="View Leaderboard"
      >
        <User size={13} />
        <span>{profile?.username || "Contestant"}</span>
        {profile?.is_tsec_user && (
          <span className="rounded-sm bg-white/10 px-1 text-[9px] uppercase tracking-wider">
            TSEC
          </span>
        )}
        <Trophy size={12} className="ml-1 opacity-75" />
      </Link>

      <button
        onClick={() => logout()}
        title="Log out"
        className="rounded-full border border-white/10 p-2 text-[#8A8880] transition-colors hover:border-[#E2574C]/40 hover:text-[#E2574C] cursor-pointer"
      >
        <LogOut size={13} />
      </button>
    </div>
  );
}
