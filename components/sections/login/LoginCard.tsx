"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { LOGIN_URL } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";

export default function LoginCard() {
  const { isAuthenticated, isProfileComplete, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-black/50 border-2 border-[#f59e0b]/30 text-[#f59e0b]/50 font-mono font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] animate-pulse text-center">
        LOADING...
      </div>
    );
  }

  if (isAuthenticated && isProfileComplete) {
    return (
      <Link
        href="/events/weekly-challenges/timeline"
        className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-black border-2 border-[#D4AF37] text-[#D4AF37] font-mono font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] hover:bg-[#D4AF37]/15 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 group"
      >
        <span>GO TO TIMELINE</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    );
  }

  if (isAuthenticated && !isProfileComplete) {
    return (
      <Link
        href="/register"
        className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-black border-2 border-[#f59e0b] text-[#f59e0b] font-mono font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] hover:bg-[#f59e0b]/15 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 group"
      >
        <span>FILL DETAILS (STEP 2)</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    );
  }

  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/register" }).catch(() => (window.location.href = LOGIN_URL))}
      className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-black border-2 border-[#f59e0b] text-[#f59e0b] font-mono font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] hover:bg-[#f59e0b]/10 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 group"
    >
      <span>LOGIN</span>
      <span className="group-hover:translate-x-1 transition-transform">→</span>
    </button>
  );
}