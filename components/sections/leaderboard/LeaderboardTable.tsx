// components/LeaderboardTable.tsx
"use client";

import { useState, useRef } from "react";
import {
  Search,
  Crown,
  Shield,
  Trophy,
  Medal,
  Loader2,
  LogIn,
  X,
  Users,
  Flame,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LOGIN_URL } from "@/lib/api-client";

/* ── Pixel font for the "Hall of Champions" header block ── */
const PIXEL_FONT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
.font-pixel {
  font-family: 'Press Start 2P', monospace;
}
@keyframes fadeInRow {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.row-fade-in {
  animation: fadeInRow 0.3s ease-out forwards;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(10, 10, 10, 0.5);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.5);
}
`;

export interface LeaderboardRow {
  rank: number;
  id: string | number;
  name: string;
  /** e.g. weekly_score or final_rating — shown as the big right-aligned number */
  primaryValue: number;
  primaryLabel: string;
  /** e.g. problems_solved or season_xp — shown as a secondary column */
  secondaryValue: number;
  secondaryLabel: string;
}

interface LeaderboardTableProps {
  title: string;
  eyebrow: string;
  description: string;
  rows: LeaderboardRow[];
  isLoading: boolean;
  error: string | null;
  forbidden: boolean;
  unauthorized: boolean;
  /** The specific row for the logged-in user, persisted across tabs */
  currentUserRow?: LeaderboardRow;
  /** Real total from backend (may be larger than rows.length) */
  totalCount?: number;
  /** rendered next to the title, e.g. the TSEC/Other toggle */
  controls?: React.ReactNode;
}

/* ── Trophy + medal styling for podium ── */
const podiumConfig = [
  {
    // 1st — Gold Champion
    trophy: "/trophy-gold.png",
    crown: "/crown-pixel.png",
    border: "border-[#D4AF37]",
    glow: "shadow-[0_0_50px_rgba(212,175,55,0.3)]",
    bg: "from-[#D4AF37]/20 via-[#D4AF37]/8 to-transparent",
    text: "text-[#D4AF37]",
    trophyGlow: "drop-shadow-[0_0_25px_rgba(212,175,55,0.55)]",
    trophySize: "w-20 h-20 md:w-28 md:h-28",
    crownSize: "w-9 h-9 md:w-12 md:h-12",
    barHeight: "h-32 md:h-44",
    label: "CHAMPION",
    ring: "ring-4 ring-[#D4AF37]/30",
  },
  {
    // 2nd — Silver Runner-Up
    trophy: "/trophy-silver.png",
    crown: null,
    border: "border-[#C0C0C0]",
    glow: "shadow-[0_0_35px_rgba(192,192,192,0.2)]",
    bg: "from-[#C0C0C0]/15 via-[#C0C0C0]/5 to-transparent",
    text: "text-[#E0E0E0]",
    trophyGlow: "drop-shadow-[0_0_18px_rgba(192,192,192,0.35)]",
    trophySize: "w-16 h-16 md:w-20 md:h-20",
    crownSize: "",
    barHeight: "h-24 md:h-32",
    label: "RUNNER-UP",
    ring: "ring-2 ring-[#C0C0C0]/20",
  },
  {
    // 3rd — Bronze 3rd Place
    trophy: "/trophy-bronze.png",
    crown: null,
    border: "border-[#CD7F32]",
    glow: "shadow-[0_0_35px_rgba(205,127,50,0.2)]",
    bg: "from-[#CD7F32]/15 via-[#CD7F32]/5 to-transparent",
    text: "text-[#CD7F32]",
    trophyGlow: "drop-shadow-[0_0_18px_rgba(205,127,50,0.35)]",
    trophySize: "w-16 h-16 md:w-20 md:h-20",
    crownSize: "",
    barHeight: "h-20 md:h-28",
    label: "3RD PLACE",
    ring: "ring-2 ring-[#CD7F32]/20",
  },
];

function PodiumCard({
  row,
  config,
  index,
}: {
  row: LeaderboardRow;
  config: (typeof podiumConfig)[0];
  index: number;
}) {
  const displayOrder = index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3";
  const elevation = index === 0 ? "-mt-6 md:-mt-10" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className={`flex flex-col items-center ${displayOrder} ${elevation}`}
    >
      {/* Crown — floats above the gold trophy only */}
      {config.crown && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.12 + 0.05, type: "spring" }}
          className="mb-1 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
        >
          <img
            src={config.crown}
            alt="Champion crown"
            draggable={false}
            className={`${config.crownSize} object-contain select-none pointer-events-none`}
            style={{ imageRendering: "pixelated" }}
          />
        </motion.div>
      )}

      {/* Trophy — floating pixel-art icon, no circular frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, delay: index * 0.12 + 0.15, type: "spring" }}
        className={`relative mb-2 ${config.trophyGlow}`}
      >
        <img
          src={config.trophy}
          alt={`${config.label} trophy`}
          draggable={false}
          className={`${config.trophySize} object-contain select-none pointer-events-none`}
          style={{ imageRendering: "pixelated" }}
        />
      </motion.div>

      {/* Rank */}
      <span className={`font-mono text-xs font-bold ${config.text} tracking-widest mb-1`}>
        #{row.rank}
      </span>

      {/* Name */}
      <span className="font-sans text-sm font-bold text-[#F0EDE6] text-center mb-0.5 max-w-[110px] truncate">
        {row.name}
      </span>
      <span className="font-mono text-[9px] text-[#5A5850] tracking-widest uppercase mb-3">
        {config.label}
      </span>

      {/* Score pillar */}
      <div
        className={`w-full ${config.barHeight} rounded-t-2xl border ${config.border} bg-gradient-to-t ${config.bg} backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl`}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        <span className={`font-mono text-2xl md:text-3xl font-black ${config.text} relative z-10 tracking-tight`}>
          {row.primaryValue.toLocaleString()}
        </span>
        <span className="font-mono text-[8px] text-[#6A6860] tracking-widest mt-1 uppercase relative z-10">
          {row.primaryLabel}
        </span>
        {row.secondaryValue > 0 && (
          <span className="font-mono text-[9px] text-[#8A8880] mt-1.5 relative z-10 bg-[#0A0A0A]/60 px-2 py-0.5 rounded-full border border-white/5">
            {row.secondaryValue} {row.secondaryLabel.toLowerCase()}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ── Your Rank Card (LeetCode-style) ── */
function YourRankCard({ row }: { row: LeaderboardRow }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className="mb-8 select-none"
    >
      <div className="relative rounded-xl border border-[#D4AF37]/40 bg-gradient-to-r from-[#D4AF37]/10 via-[#0A0A0A] to-[#D4AF37]/10 backdrop-blur-md p-4 md:p-5 shadow-[0_0_30px_rgba(212,175,55,0.12)] overflow-hidden">
        {/* Subtle shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent animate-pulse pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          {/* Left: Icon + Label */}
          <div className="flex items-center gap-3.5">
           
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#D4AF37] tracking-[0.25em] uppercase font-bold">
                YOUR RANKING
              </span>
              <span className="font-sans text-sm md:text-base font-bold text-[#F0EDE6] truncate max-w-[180px] md:max-w-none">
                {row.name}
              </span>
            </div>
          </div>

          {/* Right: Rank + Stats */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Score */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-mono text-[9px] text-[#5A5850] tracking-wider uppercase">
                {row.primaryLabel}
              </span>
              <span className="font-mono text-base md:text-lg font-extrabold text-[#F0EDE6]">
                {row.primaryValue.toLocaleString()}
              </span>
            </div>

            {/* Secondary stat */}
            {row.secondaryValue > 0 && (
              <div className="hidden md:flex flex-col items-end">
                <span className="font-mono text-[9px] text-[#5A5850] tracking-wider uppercase">
                  {row.secondaryLabel}
                </span>
                <span className="font-mono text-sm font-bold text-[#8A8880]">
                  {row.secondaryValue.toLocaleString()}
                </span>
              </div>
            )}

            {/* Rank badge */}
            <div className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 min-w-[56px]">
              <span className="font-mono text-[8px] text-[#D4AF37] tracking-widest uppercase">
                RANK
              </span>
              <span className="font-mono text-lg md:text-xl font-black text-[#D4AF37]">
                #{row.rank}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LeaderboardTable({
  title,
  eyebrow,
  description,
  rows,
  isLoading,
  error,
  forbidden,
  unauthorized,
  currentUserRow,
  totalCount,
  controls,
}: LeaderboardTableProps) {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(25);
  const prevVisibleRef = useRef(25);

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  const top3 = rows.slice(0, 3);
  const showPodium = search.length === 0 && top3.length === 3;

  // When searching, show all filtered results. Otherwise, progressive reveal.
  const isSearching = search.length > 0;
  const tableRows = isSearching ? filteredRows : rows.slice(0, visibleCount);
  const canShowMore = !isSearching && visibleCount < rows.length;
  const remaining = rows.length - visibleCount;

  const displayTotal = totalCount ?? rows.length;
  const highestScore = rows.length > 0 ? Math.max(...rows.map((r) => r.primaryValue)) : 0;
  const topContestant = rows[0]?.name || "N/A";

  return (
    <div className="min-h-screen bg-[#070707] text-[#F0EDE6] relative overflow-hidden">
      <style>{PIXEL_FONT_STYLE}</style>
      {/* ── Cyberpunk Ambient Glow ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.12),transparent)] pointer-events-none z-0" />
      <div className="absolute top-96 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(212,175,55,0.04),transparent)] pointer-events-none z-0" />

      <div className="relative z-10 px-4 sm:px-6 py-10 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12 flex flex-col items-center text-center gap-3 border-b border-[#1A1A1A] pb-10 select-none"
        >
          {/* Eyebrow — pixel stars + label */}
          <div className="flex items-center gap-3">
            <span className="font-pixel text-[10px] text-[#D4AF37]">★</span>
            <span className="font-pixel text-[10px] text-[#D4AF37] tracking-[0.3em] uppercase">
              {eyebrow}
            </span>
            <span className="font-pixel text-[10px] text-[#D4AF37]">★</span>
          </div>

          {/* Title — blocky pixel font, accent word in gold */}
          <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl leading-relaxed tracking-tight text-[#F0EDE6]">
            {title.split(" ").map((word, i, arr) => (
              <span
                key={i}
                className={i === arr.length - 1 ? "text-[#D4AF37]" : "text-[#F0EDE6]"}
              >
                {word}
                {i < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          <p className="font-sans text-sm text-[#7A7870] mt-1 max-w-xl leading-relaxed">
            {description}
          </p>

          {controls && <div className="shrink-0 mt-3">{controls}</div>}
        </motion.div>

        {/* ── Top Overview Stats Bar ── */}
        {!unauthorized && !forbidden && !error && rows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 select-none"
          >
            {/* Stat 1: Total Contestants */}
            <div className="rounded-xl border border-[#1E1E1E] bg-[#0A0A0A]/80 backdrop-blur-md p-4 flex items-center gap-4 border-l-2 border-l-[#D4AF37]/60">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <Users size={20} />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#5A5850] uppercase tracking-wider block">
                  ACTIVE CONTESTANTS
                </span>
                <span className="font-mono text-xl font-bold text-[#F0EDE6]">
                  {displayTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stat 2: Top Leader */}
            <div className="rounded-xl border border-[#1E1E1E] bg-[#0A0A0A]/80 backdrop-blur-md p-4 flex items-center gap-4 border-l-2 border-l-[#D4AF37]">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
                <Crown size={20} />
              </div>
              <div className="truncate">
                <span className="font-mono text-[10px] text-[#5A5850] uppercase tracking-wider block">
                  RANK 1 LEADER
                </span>
                <span className="font-sans text-base font-bold text-[#D4AF37] truncate block">
                  {topContestant}
                </span>
              </div>
            </div>

            {/* Stat 3: Highest Score */}
            <div className="rounded-xl border border-[#1E1E1E] bg-[#0A0A0A]/80 backdrop-blur-md p-4 flex items-center gap-4 border-l-2 border-l-[#D4AF37]/60">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <Flame size={20} />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#5A5850] uppercase tracking-wider block">
                  PEAK SCORE
                </span>
                <span className="font-mono text-xl font-bold text-[#F0EDE6]">
                  {highestScore.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── States: unauthorized / forbidden / error / loading ── */}
        <AnimatePresence mode="wait">
          {unauthorized && (
            <motion.div
              key="unauthorized"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="py-20 flex flex-col items-center justify-center text-center select-none rounded-2xl border border-[#1E1E1E] bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A] relative overflow-hidden px-6 shadow-2xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center max-w-md w-full">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/40 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                  <Trophy size={34} className="text-[#D4AF37]" />
                </div>

                <h2 className="font-display text-xl md:text-2xl font-bold text-[#F0EDE6] mb-2 tracking-wide uppercase">
                  Authentication Required
                </h2>
                <p className="font-sans text-sm text-[#7A7870] mb-8 leading-relaxed">
                  Sign in to view live leaderboard rankings and competitor standings.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center mb-4">
                  <button
                    onClick={() => (window.location.href = LOGIN_URL)}
                    className="group w-full max-w-xs flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8860B] text-[#0A0A0A] font-mono text-xs font-extrabold tracking-wider hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <LogIn size={16} />
                    SIGN IN WITH GOOGLE
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {!unauthorized && forbidden && (
            <motion.div
              key="forbidden"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="py-20 flex flex-col items-center justify-center text-center select-none rounded-2xl border border-[#1E1E1E] bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A] relative overflow-hidden px-6 shadow-2xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center max-w-md w-full">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/40 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                  <Shield size={34} className="text-[#D4AF37]" />
                </div>

                <h2 className="font-display text-xl md:text-2xl font-bold text-[#F0EDE6] mb-2 tracking-wide uppercase">
                  TSEC Students Only
                </h2>
                <p className="font-sans text-sm text-[#7A7870] leading-relaxed">
                  The TSEC leaderboard is limited to verified TSEC students. Switch to the global
                  leaderboard to see full standings.
                </p>
              </div>
            </motion.div>
          )}

          {!unauthorized && !forbidden && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-24 flex flex-col items-center justify-center text-center font-mono select-none rounded-xl border border-[#FF4D00]/20 bg-[#0A0A0A]"
            >
              <div className="w-16 h-16 rounded-full bg-[#FF4D00]/10 flex items-center justify-center mb-5">
                <Shield className="text-[#FF4D00]" size={28} />
              </div>
              <span className="text-xs text-[#8A8880] tracking-wider">
                UNABLE TO LOAD RANKINGS
              </span>
              <span className="text-[10px] text-[#5A5850] mt-2 max-w-sm">
                {error === "No active week found and no week_id provided" ? "No active week" : error}
              </span>
            </motion.div>
          )}

          {!unauthorized && !forbidden && !error && isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 flex flex-col items-center justify-center text-center font-mono select-none rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A]"
            >
              <Loader2 size={32} className="text-[#D4AF37] animate-spin mb-4" />
              <span className="text-xs text-[#7A7870] tracking-[0.2em] animate-pulse">
                FETCHING REAL-TIME RANKINGS...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Podium — Top 3 ── */}
        <AnimatePresence>
          {showPodium && !unauthorized && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="mb-12 md:mb-16 mt-10"
            >
              <div className="grid grid-cols-3 gap-3 md:gap-8 items-end max-w-2xl mx-auto px-2">
                {top3.map((row, i) => (
                  <PodiumCard
                    key={row.id}
                    row={row}
                    config={podiumConfig[i]}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Your Rank Card (LeetCode-style) ── */}
        {!unauthorized && !forbidden && !error && !isLoading && currentUserRow && (
          <YourRankCard row={currentUserRow} />
        )}

        {/* ── Search Bar & Filter Summary ── */}
        {!unauthorized && !forbidden && !error && !isLoading && rows.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 select-none"
          >
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search contestant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl px-4 py-2.5 pl-10 pr-9 text-xs text-[#F0EDE6] placeholder:text-[#4A4840] focus:outline-none focus:border-[#D4AF37]/60 focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] font-mono transition-all duration-200"
              />
              <Search size={14} className="absolute left-3.5 top-3 text-[#5A5850]" />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-3 text-[#5A5850] hover:text-[#F0EDE6] transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-[#5A5850] tracking-wider uppercase bg-[#0A0A0A] px-3 py-1.5 rounded-lg border border-[#1E1E1E]">
                {isSearching
                  ? `${filteredRows.length} MATCHING`
                  : `SHOWING ${Math.min(visibleCount, rows.length)} OF ${displayTotal.toLocaleString()} RANKED`}
              </span>
            </div>
          </motion.div>
        )}

        {/* ── Rankings Table ── */}
        {!unauthorized && !forbidden && !error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A]/90 backdrop-blur-md overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="overflow-x-auto overflow-y-auto max-h-[550px] custom-scrollbar">
              <table className="w-full text-left font-sans text-sm relative">
                <thead className="sticky top-0 z-20">
                  <tr className="border-b border-[#1A1A1A] bg-[#050505]/95 backdrop-blur-sm select-none">
                    <th className="py-4 pl-6 pr-3 font-mono text-[10px] font-semibold text-[#5A5850] tracking-[0.2em] uppercase w-20">
                      RANK
                    </th>
                    <th className="py-4 px-4 font-mono text-[10px] font-semibold text-[#5A5850] tracking-[0.2em] uppercase">
                      CONTESTANT
                    </th>
                    <th className="py-4 px-4 font-mono text-[10px] font-semibold text-[#5A5850] tracking-[0.2em] uppercase text-right">
                      {rows[0]?.primaryLabel ?? "SCORE"}
                    </th>
                    <th className="py-4 px-4 pr-6 font-mono text-[10px] font-semibold text-[#5A5850] tracking-[0.2em] uppercase text-right hidden sm:table-cell">
                      {rows[0]?.secondaryLabel ?? "DETAIL"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => {
                    const isTop3 = row.rank <= 3;
                    const isCurrentUser = currentUserRow && String(row.id) === String(currentUserRow.id);
                    const rankColors: Record<number, string> = {
                      1: "text-[#D4AF37]",
                      2: "text-[#C0C0C0]",
                      3: "text-[#CD7F32]",
                    };
                    const avatarBg: Record<number, string> = {
                      1: "from-[#D4AF37]/25 to-[#D4AF37]/5 border-[#D4AF37]/40 text-[#D4AF37]",
                      2: "from-[#C0C0C0]/20 to-[#C0C0C0]/5 border-[#C0C0C0]/40 text-[#C0C0C0]",
                      3: "from-[#CD7F32]/20 to-[#CD7F32]/5 border-[#CD7F32]/40 text-[#CD7F32]",
                    };

                    const rankColor = rankColors[row.rank] ?? "text-[#6A6860]";
                    const avatarStyle =
                      avatarBg[row.rank] ?? "from-[#181818] to-[#101010] border-[#222222] text-[#A0A0A0]";

                    // Only animate rows that are newly revealed
                    const isNewRow = i >= prevVisibleRef.current;

                    return (
                      <tr
                        key={row.id}
                        className={`border-b border-[#121212] transition-colors duration-200 group cursor-default ${
                          isNewRow ? "row-fade-in" : ""
                        } ${
                          isCurrentUser
                            ? "bg-[#D4AF37]/[0.07] hover:bg-[#D4AF37]/[0.12] border-l-2 border-l-[#D4AF37]/60"
                            : isTop3
                            ? "hover:bg-[#111111]"
                            : "hover:bg-[#0E0E0E]"
                        }`}
                        style={isNewRow ? { animationDelay: `${(i - prevVisibleRef.current) * 0.04}s` } : undefined}
                      >
                        {/* Rank Column */}
                        <td className="py-4 pl-6 pr-3 font-mono text-xs font-bold">
                          <div className="flex items-center gap-2">
                            {row.rank === 1 && <Crown size={14} className="text-[#D4AF37] animate-pulse" />}
                            {row.rank === 2 && <Medal size={13} className="text-[#C0C0C0]" />}
                            {row.rank === 3 && <Medal size={13} className="text-[#CD7F32]" />}
                            <span className={rankColor}>#{row.rank}</span>
                          </div>
                        </td>

                        {/* Contestant Column */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarStyle} border flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-md`}
                            >
                              {row.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className={`font-sans text-sm font-semibold transition-colors duration-200 ${
                                isCurrentUser
                                  ? "text-[#D4AF37]"
                                  : "text-[#F0EDE6] group-hover:text-[#D4AF37]"
                              }`}>
                                {row.name}
                                {isCurrentUser && (
                                  <span className="ml-2 text-[9px] font-mono text-[#D4AF37]/70 tracking-wider">
                                    (YOU)
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Primary Value */}
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`font-mono text-sm font-extrabold tracking-tight ${
                              isTop3 ? rankColor : "text-[#F0EDE6]"
                            }`}
                          >
                            {row.primaryValue.toLocaleString()}
                          </span>
                        </td>

                        {/* Secondary Value */}
                        <td className="py-4 px-4 pr-6 text-right hidden sm:table-cell">
                          <span className="font-mono text-xs text-[#5A5850] group-hover:text-[#8A8880] transition-colors">
                            {row.secondaryValue.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty state */}
            {tableRows.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-center font-mono select-none">
                <Trophy className="text-[#1E1E1E] mb-4" size={36} />
                <span className="text-xs text-[#5A5850] tracking-widest uppercase">
                  {search ? "NO MATCHING CONTESTANTS" : "NO RANKINGS AVAILABLE"}
                </span>
              </div>
            )}

            {/* Show More Button */}
            {canShowMore && (
              <div className="flex items-center justify-center px-6 py-5 border-t border-[#1A1A1A] bg-[#050505]/60">
                <button
                  onClick={() => {
                    prevVisibleRef.current = visibleCount;
                    setVisibleCount((prev) => prev + 25);
                  }}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.08] hover:bg-[#D4AF37]/[0.15] text-[#D4AF37] font-mono text-[11px] font-bold tracking-widest hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ChevronDown size={14} />
                  SHOW MORE
                  <span className="text-[#D4AF37]/60 ml-1">
                    ({Math.min(remaining, 25)} MORE)
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}