"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LeaderboardButtons from "@/components/sections/leaderboard/LeaderboardButtons";
import WeeklyTimeline from "@/components/sections/weekly-challenges/WeeklyTimeline";
import { Users, Trophy, Briefcase } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const { isAuthenticated, isProfileComplete, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isProfileComplete)) {
      router.push("/register");
    }
  }, [isLoading, isAuthenticated, isProfileComplete, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06070B] flex items-center justify-center font-mono text-xs text-[#D4AF37] animate-pulse">
        VERIFYING ACCREDITATION STATUS...
      </div>
    );
  }

  if (!isAuthenticated || !isProfileComplete) {
    return (
      <div className="min-h-screen bg-[#06070B] flex items-center justify-center font-mono text-xs text-[#D4AF37] animate-pulse">
        REDIRECTING TO REGISTRATION STEP 2...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070B] text-[#F0EDE6] relative overflow-hidden">
      {/* Ambient Cyberpunk Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.12),transparent)] pointer-events-none z-0" />

      <div className="relative z-10 px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col">
        {/* Arena Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 border-b border-[#1E1E1E] pb-8 select-none">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="font-mono text-[11px] text-[#D4AF37] tracking-[0.25em] uppercase font-bold">
                TSEC CODECELL • CONTEST ARENA 2026
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight text-[#F0EDE6] uppercase">
              WEEKLY <span className="text-[#D4AF37]">CHALLENGES</span>
            </h1>
            <p className="font-sans text-sm text-[#7A7870] mt-3 max-w-xl leading-relaxed">
              500+ registered competitors across 6 algorithmic combat chapters. Solve curated problems, earn points, get exclusive internship opportunities, and qualify for the offline grand finale.
            </p>
          </div>

          <div className="shrink-0">
            <LeaderboardButtons />
          </div>
        </div>

        {/* Live Arena Overview Stats Bar (3 Highlight Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 select-none">
          {/* Stat 1: 500+ Coders */}
          <div className="rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A]/90 backdrop-blur-md p-5 flex items-center gap-4 border-l-2 border-l-[#D4AF37]">
            <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Users size={22} />
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#5A5850] uppercase tracking-wider block">
                COMPETITORS
              </span>
              <span className="font-mono text-lg font-bold text-[#F0EDE6]">
                500+ ENROLLED
              </span>
            </div>
          </div>

          {/* Stat 2: ₹20,000+ & Coupons */}
          <div className="rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A]/90 backdrop-blur-md p-5 flex items-center gap-4 border-l-2 border-l-[#D4AF37]">
            <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Trophy size={22} />
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#5A5850] uppercase tracking-wider block">
                PRIZE POOL
              </span>
              <span className="font-mono text-lg font-bold text-[#D4AF37]">
                ₹20,000+ & COUPONS
              </span>
            </div>
          </div>

          {/* Stat 3: HIGHLIGHT INTERNSHIP OPPORTUNITIES */}
          <div className="rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-r from-[#181408] via-[#120F06] to-[#0A0A0A] backdrop-blur-md p-5 flex items-center gap-4 border-l-4 border-l-[#FFD700] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center text-[#0A0A0A] font-extrabold shrink-0 shadow-md">
              <Briefcase size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
                <span className="font-mono text-[9px] text-[#FFD700] font-extrabold uppercase tracking-widest">
                  FEATURED PERK
                </span>
              </div>
              <span className="font-mono text-base md:text-lg font-black text-[#F0EDE6] tracking-tight block">
                INTERNSHIP ROLES
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Chapters Grid */}
        <WeeklyTimeline />
      </div>
    </div>
  );
};

export default Page;