"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LeaderboardButtons from "@/components/sections/leaderboard/LeaderboardButtons";
import WeeklyTimeline from "@/components/sections/weekly-challenges/WeeklyTimeline";
import { Users, Trophy, Briefcase, Download } from "lucide-react";

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
      <div className="min-h-screen bg-[#06070B] flex items-center justify-center font-mono text-xs text-[#D9A404] animate-pulse">
        VERIFYING ACCREDITATION STATUS...
      </div>
    );
  }

  if (!isAuthenticated || !isProfileComplete) {
    return (
      <div className="min-h-screen bg-[#06070B] flex items-center justify-center font-mono text-xs text-[#D9A404] animate-pulse">
        REDIRECTING TO REGISTRATION STEP 2...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070B] text-[#F4F1EA] relative overflow-hidden">
      <span
        aria-hidden
        className="hidden lg:block absolute -right-10 top-24 text-[420px] leading-none text-[#D9A404] select-none pointer-events-none"
        style={{ opacity: 0.05 }}
      >
        ♚
      </span>

      {/* Main Content Area */}
      <div className="relative z-10 px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col">
        {/* Header Section with Title & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 border-b border-[#1a1c24] pb-8 select-none">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D9A404] animate-pulse" />
              <span className="font-mono text-[11px] text-[#D9A404] tracking-[0.25em] uppercase font-bold">
                TSEC CODECELL / CONTEST ARENA 2026
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#F4F1EA]">
              WEEKLY <span className="text-[#D9A404]">CHALLENGES</span>
            </h1>
            <p className="font-sans text-sm text-[#8B93A7] mt-3 max-w-xl leading-relaxed">
              500+ registered competitors across 6 algorithmic combat chapters. Solve curated problems, earn points, get exclusive internship opportunities, and qualify for the offline grand finale.
            </p>
          </div>

          {/* Action Buttons Header */}
          <div className="shrink-0">
            <LeaderboardButtons />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 select-none">
          <div className="border border-[#1a1c24] border-t-2 border-t-[#D9A404]/40 bg-[#0b0d13] p-5 flex items-center gap-4">
            <div className="w-11 h-11 border border-[#D9A404]/30 flex items-center justify-center text-[#D9A404] shrink-0">
              <Users size={22} />
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#5A5850] uppercase tracking-wider block">
                COMPETITORS
              </span>
              <span className="font-mono text-lg font-bold text-[#F4F1EA]">
                500+ ENROLLED
              </span>
            </div>
          </div>

          <div className="border border-[#1a1c24] border-t-2 border-t-[#D9A404]/40 bg-[#0b0d13] p-5 flex items-center gap-4">
            <div className="w-11 h-11 border border-[#D9A404]/30 flex items-center justify-center text-[#D9A404] shrink-0">
              <Trophy size={22} />
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#5A5850] uppercase tracking-wider block">
                PRIZE POOL
              </span>
              <span className="font-mono text-lg font-bold text-[#D9A404]">
                ₹20,000+ & COUPONS
              </span>
            </div>
          </div>

          <div
            className="border border-[#D9A404]/40 border-t-2 border-t-[#D9A404] bg-[#0b0d13] p-5 flex items-center gap-4"
            style={{ boxShadow: "0 0 18px rgba(217,167,4,0.12)" }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-[#06070B] font-extrabold shrink-0"
              style={{ background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)" }}
            >
              <Briefcase size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A404] animate-pulse" />
                <span className="font-mono text-[9px] text-[#D9A404] font-extrabold uppercase tracking-widest">
                  FEATURED PERK
                </span>
              </div>
              <span className="font-mono text-base md:text-lg font-black text-[#F4F1EA] tracking-tight block">
                INTERNSHIP ROLES
              </span>
            </div>
          </div>
        </div>

        <WeeklyTimeline />
      </div>

      {/* Fixed Floating Install Runtime Button at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="/download"
          className="relative flex items-center gap-2.5 px-5 py-3.5 rounded-full text-xs font-mono font-black uppercase tracking-wider text-[#06070B] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(217,167,4,0.6)] hover:shadow-[0_0_45px_rgba(217,167,4,0.9)] ring-2 ring-[#F5C451]/50 animate-pulse"
          style={{
            background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)",
          }}
        >
          <Download size={16} />
          <span>Install CodeCell Runtime</span>
        </a>
      </div>
    </div>
  );
};

export default Page;
