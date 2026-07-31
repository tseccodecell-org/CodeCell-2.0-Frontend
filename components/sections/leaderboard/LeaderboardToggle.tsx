// components/LeaderboardToggle.tsx
"use client";

import { LeaderboardTab } from "@/lib/types/leaderboard";

interface LeaderboardToggleProps {
  show: boolean;
  selectedTab: LeaderboardTab;
  onChange: (tab: LeaderboardTab) => void;
}

/**
 * TSEC / Global segmented control.
 * Renders nothing when `show` is false.
 */
export default function LeaderboardToggle({
  show,
  selectedTab,
  onChange,
}: LeaderboardToggleProps) {
  if (!show) return null;

  return (
    <div className="relative flex bg-[#0A0A0A] p-1.5 rounded-xl border border-[#1E1E1E] font-mono text-xs select-none shadow-lg">
      {/* Sliding Gold Highlight Background */}
      <div
        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-lg transition-all duration-300 ease-in-out shadow-[0_0_15px_rgba(212,175,55,0.3)] ${
          selectedTab === "TSEC" ? "left-1.5" : "left-[calc(50%+3px)]"
        }`}
      />

      <button
        onClick={() => onChange("TSEC")}
        aria-pressed={selectedTab === "TSEC"}
        className={`relative z-10 flex-1 px-6 py-2 font-bold tracking-widest transition-colors duration-200 cursor-pointer ${
          selectedTab === "TSEC" ? "text-[#0A0A0A]" : "text-[#7A7870] hover:text-[#D4AF37]"
        }`}
      >
        TSEC
      </button>

      <button
        onClick={() => onChange("GLOBAL")}
        aria-pressed={selectedTab === "GLOBAL"}
        className={`relative z-10 flex-1 px-6 py-2 font-bold tracking-widest transition-colors duration-200 cursor-pointer ${
          selectedTab === "GLOBAL" ? "text-[#0A0A0A]" : "text-[#7A7870] hover:text-[#D4AF37]"
        }`}
      >
        GLOBAL
      </button>
    </div>
  );
}