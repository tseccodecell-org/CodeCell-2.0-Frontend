// components/LeaderboardToggle.tsx
"use client";

import { LeaderboardTab } from "@/lib/types/leaderboard/leaderboard"

interface LeaderboardToggleProps {
  show: boolean;
  selectedTab: LeaderboardTab;
  onChange: (tab: LeaderboardTab) => void;
}

/**
 * TSEC / Other segmented control.
 * Renders nothing when `show` is false — Other students never see this,
 * and it stays hidden for TSEC users until their role has been confirmed.
 */
export default function LeaderboardToggle({
  show,
  selectedTab,
  onChange,
}: LeaderboardToggleProps) {
  if (!show) return null;

  return (
    <div className="relative flex bg-[#0A0A0A] p-1 rounded border border-[#2A2A2A] font-mono text-xs select-none">
      {/* Sliding Highlight Background */}
      <div 
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#D4AF37] transition-all duration-300 ease-in-out shadow-[0_0_10px_rgba(212,175,55,0.2)] ${
          selectedTab === "TSEC" ? "left-1" : "left-[calc(50%+2px)]"
        }`}
      />

      <button
        onClick={() => onChange("TSEC")}
        aria-pressed={selectedTab === "TSEC"}
        className={`relative z-10 flex-1 px-6 py-2 font-bold tracking-widest transition-colors ${
          selectedTab === "TSEC" ? "text-[#0A0A0A]" : "text-[#8A8880] hover:text-[#D4AF37]"
        }`}
      >
        TSEC
      </button>

      <button
        onClick={() => onChange("GLOBAL")}
        aria-pressed={selectedTab === "GLOBAL"}
        className={`relative z-10 flex-1 px-6 py-2 font-bold tracking-widest transition-colors ${
          selectedTab === "GLOBAL" ? "text-[#0A0A0A]" : "text-[#8A8880] hover:text-[#D4AF37]"
        }`}
      >
        GLOBAL
      </button>
    </div>
  );
}