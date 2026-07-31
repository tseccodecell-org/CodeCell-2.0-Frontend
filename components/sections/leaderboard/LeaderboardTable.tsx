// components/LeaderboardTable.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Crown,
  Shield,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Medal,
  Loader2,
  LogIn,
  Users,
  Flame,
  Zap,
  Sparkles,
  X,
  TrendingUp,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LOGIN_URL } from "@/lib/api-client";

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
  page: number;
  hasNext: boolean;
  onPageChange: (page: number) => void;
  /** rendered next to the title, e.g. the TSEC/Other toggle */
  controls?: React.ReactNode;
}

/* ── Helper to format numeric scores & XP up to 2 decimal places ── */
function formatNumber(val: number): string {
  if (typeof val !== "number" || isNaN(val)) return "0";
  return val.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
const podiumConfig = [
  {
    // 1st — Gold Champion
    border: "border-[#FFD700]/50",
    glow: "shadow-[0_0_50px_rgba(255,215,0,0.22)]",
    glowBg: "bg-[#FFD700]/20",
    bg: "bg-gradient-to-b from-[#1C180B]/95 via-[#0F0D06]/95 to-[#0A0A0C]/95",
    accentGradient: "from-[#FFD700] via-[#F3C623] to-[#B8860B]",
    text: "text-[#FFD700]",
    avatarBorder: "border-[#FFD700]",
    avatarGlow: "bg-[#FFD700]/40",
    avatarBg: "from-[#FFD700]/25 via-[#D4AF37]/10 to-transparent",
    badge: "bg-gradient-to-r from-[#FFD700] via-[#F3C623] to-[#B8860B]",
    labelBg: "bg-[#FFD700]/10",
    labelBorder: "border-[#FFD700]/30",
    barHeight: "h-36 md:h-44",
    barGradient: "from-[#FFD700]/20 to-transparent",
    avatarSize: "w-20 h-20 md:w-24 md:h-24",
    label: "CHAMPION",
    icon: <Crown size={16} className="text-[#0A0A0A]" />,
  },
  {
    // 2nd — Silver Runner-Up
    border: "border-slate-300/40",
    glow: "shadow-[0_0_40px_rgba(226,232,240,0.15)]",
    glowBg: "bg-slate-300/15",
    bg: "bg-gradient-to-b from-[#16181D]/95 via-[#0E1015]/95 to-[#0A0A0C]/95",
    accentGradient: "from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8]",
    text: "text-[#E2E8F0]",
    avatarBorder: "border-[#E2E8F0]",
    avatarGlow: "bg-[#E2E8F0]/30",
    avatarBg: "from-[#E2E8F0]/20 via-[#94A3B8]/10 to-transparent",
    badge: "bg-gradient-to-r from-[#FFFFFF] via-[#CBD5E1] to-[#64748B]",
    labelBg: "bg-slate-200/10",
    labelBorder: "border-slate-300/30",
    barHeight: "h-28 md:h-36",
    barGradient: "from-[#E2E8F0]/15 to-transparent",
    avatarSize: "w-16 h-16 md:w-20 md:h-20",
    label: "RUNNER-UP",
    icon: <Medal size={15} className="text-[#0A0A0A]" />,
  },
  {
    // 3rd — Bronze 3rd Place
    border: "border-amber-700/40",
    glow: "shadow-[0_0_40px_rgba(217,119,6,0.15)]",
    glowBg: "bg-amber-600/15",
    bg: "bg-gradient-to-b from-[#1C130B]/95 via-[#120C07]/95 to-[#0A0A0C]/95",
    accentGradient: "from-[#F59E0B] via-[#D97706] to-[#78350F]",
    text: "text-[#F59E0B]",
    avatarBorder: "border-[#F59E0B]",
    avatarGlow: "bg-[#F59E0B]/30",
    avatarBg: "from-[#F59E0B]/20 via-[#D97706]/10 to-transparent",
    badge: "bg-gradient-to-r from-[#FBBF24] via-[#D97706] to-[#92400E]",
    labelBg: "bg-amber-500/10",
    labelBorder: "border-amber-600/30",
    barHeight: "h-24 md:h-32",
    barGradient: "from-[#F59E0B]/15 to-transparent",
    avatarSize: "w-16 h-16 md:w-20 md:h-20",
    label: "3RD PLACE",
    icon: <Medal size={15} className="text-[#0A0A0A]" />,
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
  const elevation = index === 0 ? "-mt-4 md:-mt-8" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col items-center ${displayOrder} ${elevation} group relative z-10 w-full transform-gpu`}
    >
      {/* Glow backdrop spotlight */}
      <div
        className={`absolute -inset-2 rounded-3xl ${config.glowBg} opacity-30 blur-lg group-hover:opacity-70 transition-opacity duration-300 pointer-events-none`}
      />

      {/* Main Pedestal Container */}
      <div
        className={`w-full rounded-2xl md:rounded-3xl border ${config.border} ${config.bg} ${config.glow} p-4 md:p-5 flex flex-col items-center relative overflow-hidden transition-transform duration-200 group-hover:-translate-y-1.5 transform-gpu`}
      >
        {/* Top Accent Shimmer Line */}
        <div
          className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${config.accentGradient}`}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        {/* Avatar Container */}
        <div className="relative mb-3 group/avatar">
          {/* Avatar Ring Glow */}
          <div
            className={`absolute -inset-1.5 rounded-full ${config.avatarGlow} blur-sm opacity-70 group-hover/avatar:opacity-100 transition-opacity`}
          />

          <div
            className={`relative ${config.avatarSize} rounded-full border-2 ${config.avatarBorder} flex items-center justify-center bg-gradient-to-br ${config.avatarBg} shadow-xl transition-transform duration-200 group-hover/avatar:scale-105 transform-gpu`}
          >
            <span className={`font-display text-2xl md:text-3xl font-black ${config.text}`}>
              {row.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Rank Badge overlay */}
          <div
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${config.badge} px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg border border-white/20 shrink-0`}
          >
            {config.icon}
            <span className="font-mono text-[10px] font-black text-[#0A0A0A] tracking-wider">
              #{row.rank}
            </span>
          </div>
        </div>

        {/* Name & Title */}
        <div className="text-center w-full mt-2 mb-3">
          <h3
            className={`font-display text-base md:text-lg font-extrabold ${config.text} truncate max-w-full tracking-tight px-1`}
          >
            {row.name}
          </h3>
          <span
            className={`inline-block font-mono text-[9px] md:text-[10px] tracking-[0.2em] font-semibold px-2.5 py-0.5 rounded-full border ${config.labelBorder} ${config.labelBg} ${config.text} uppercase mt-1`}
          >
            {config.label}
          </span>
        </div>

        {/* Score & Solved Metric Block */}
        <div
          className={`w-full ${config.barHeight} rounded-xl md:rounded-2xl border border-white/10 bg-black/60 flex flex-col items-center justify-center p-3 relative overflow-hidden group/pedestal`}
        >
          {/* Subtle micro grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Ambient center fill */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${config.barGradient} opacity-30 group-hover/pedestal:opacity-60 transition-opacity`}
          />

          <span
            className={`font-mono text-3xl md:text-4xl font-black ${config.text} tracking-tight relative z-10 drop-shadow-md`}
          >
            {formatNumber(row.primaryValue)}
          </span>
          <span className="font-mono text-[9px] md:text-[10px] text-[#A0A090] tracking-widest uppercase mt-0.5 relative z-10 font-medium">
            {row.primaryLabel}
          </span>

          {row.secondaryValue > 0 && (
            <div className="mt-2.5 relative z-10 flex items-center gap-1.5 bg-white/[0.08] border border-white/10 px-3 py-1 rounded-full">
              <Zap size={11} className={config.text} />
              <span className="font-mono text-[10px] font-semibold text-[#E0E0D0]">
                {formatNumber(row.secondaryValue)} {row.secondaryLabel.toLowerCase()}
              </span>
            </div>
          )}
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
  page,
  hasNext,
  onPageChange,
  controls,
}: LeaderboardTableProps) {
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(term));
  }, [rows, search]);

  const top3 = useMemo(() => rows.slice(0, 3), [rows]);
  const showPodium = search.length === 0 && page === 1 && top3.length === 3;
  const tableRows = search.length > 0 ? filteredRows : rows;

  const highestScore = useMemo(() => (rows.length > 0 ? Math.max(...rows.map((r) => r.primaryValue)) : 0), [rows]);
  const topContestant = useMemo(() => rows[0]?.name || "N/A", [rows]);

  return (
    <div className="min-h-screen bg-[#050507] text-[#F0EDE6] relative overflow-hidden">
      {/* ── 10x Futuristic Atmosphere & Spotlights ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,215,0,0.14),transparent)] pointer-events-none z-0" />
      <div className="absolute top-80 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_400px_at_90%_20%,rgba(245,158,11,0.05),transparent)] pointer-events-none z-0" />
      <div className="absolute top-96 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle_300px_at_10%_30%,rgba(6,182,212,0.04),transparent)] pointer-events-none z-0" />

      {/* Grid overlay mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0 opacity-60" />

      <div className="relative z-10 px-4 sm:px-6 py-10 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col">
        {/* ── Header Section ── */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 select-none"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />
              <span className="font-mono text-[11px] text-[#FFD700] tracking-[0.25em] uppercase font-bold">
                {eyebrow}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#F0EDE6] font-display flex items-center gap-3">
              {title}
            </h1>
            <p className="font-sans text-sm text-[#9A9890] mt-3 max-w-xl leading-relaxed">
              {description}
            </p>
          </div>
          {controls && <div className="shrink-0">{controls}</div>}
        </motion.div>

        {/* ── 10x Top Overview Glass Cards ── */}
        {!unauthorized && !forbidden && !error && rows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 select-none transform-gpu"
          >
            {/* Stat 1: Total Contestants (Cyan Theme) */}
            <div className="rounded-2xl border border-cyan-500/20 bg-[#0C0C0E]/90 p-4 md:p-5 flex items-center gap-4 shadow-[0_0_30px_rgba(6,182,212,0.05)] hover:border-cyan-500/40 transition-colors duration-200 group transform-gpu">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                <Users size={22} />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="font-mono text-[10px] text-cyan-400/90 font-bold uppercase tracking-wider block">
                    ACTIVE CONTESTANTS
                  </span>
                </div>
                <span className="font-mono text-2xl font-black text-[#F0EDE6]">
                  {rows.length}
                </span>
              </div>
            </div>

            {/* Stat 2: Top Leader (Gold Champion Theme) */}
            <div className="rounded-2xl border border-[#FFD700]/30 bg-[#0C0C0E]/90 p-4 md:p-5 flex items-center gap-4 shadow-[0_0_35px_rgba(255,215,0,0.08)] hover:border-[#FFD700]/50 transition-colors duration-200 group transform-gpu">
              <div className="w-12 h-12 rounded-xl bg-[#FFD700]/15 border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                <Crown size={22} />
              </div>
              <div className="truncate">
                <span className="font-mono text-[10px] text-[#FFD700]/90 font-bold uppercase tracking-wider block mb-1">
                  RANK 1 LEADER
                </span>
                <span className="font-sans text-base font-extrabold text-[#FFD700] truncate block drop-shadow-sm">
                  {topContestant}
                </span>
              </div>
            </div>

            {/* Stat 3: Peak Score (Fiery Flame Theme) */}
            <div className="rounded-2xl border border-amber-500/20 bg-[#0C0C0E]/90 p-4 md:p-5 flex items-center gap-4 shadow-[0_0_30px_rgba(245,158,11,0.05)] hover:border-amber-500/40 transition-colors duration-200 group transform-gpu">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                <Flame size={22} />
              </div>
              <div className="truncate">
                <span className="font-mono text-[10px] text-amber-400/90 font-bold uppercase tracking-wider block mb-1">
                  PEAK SCORE
                </span>
                <span className="font-mono text-2xl font-black text-[#F0EDE6]">
                  {formatNumber(highestScore)}
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
              transition={{ duration: 0.3 }}
              className="py-20 flex flex-col items-center justify-center text-center select-none rounded-3xl border border-white/10 bg-gradient-to-b from-[#0F0F12] to-[#07070A] relative overflow-hidden px-6 shadow-2xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center max-w-md w-full">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700]/25 to-[#FFD700]/5 border border-[#FFD700]/40 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
                  <Trophy size={34} className="text-[#FFD700]" />
                </div>

                <h2 className="font-display text-xl md:text-2xl font-bold text-[#F0EDE6] mb-2 tracking-wide uppercase">
                  Authentication Required
                </h2>
                <p className="font-sans text-sm text-[#8A8880] mb-8 leading-relaxed">
                  Sign in to view live leaderboard rankings and competitor standings.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center mb-4">
                  <button
                    onClick={() => (window.location.href = LOGIN_URL)}
                    className="group w-full max-w-xs flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F3C623] to-[#B8860B] text-[#0A0A0A] font-mono text-xs font-extrabold tracking-wider hover:shadow-[0_0_35px_rgba(255,215,0,0.4)] transition-all duration-200 cursor-pointer transform-gpu hover:scale-[1.02]"
                  >
                    <LogIn size={16} />
                    SIGN IN WITH GOOGLE
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {!unauthorized && !forbidden && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-24 flex flex-col items-center justify-center text-center font-mono select-none rounded-2xl border border-[#FF4D00]/30 bg-[#0C0C0E]"
            >
              <div className="w-16 h-16 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/20 flex items-center justify-center mb-5">
                <Shield className="text-[#FF4D00]" size={28} />
              </div>
              <span className="text-xs text-[#8A8880] tracking-wider font-bold">
                UNABLE TO LOAD RANKINGS
              </span>
              <span className="text-[10px] text-[#6A6860] mt-2 max-w-sm">
                {error}
              </span>
            </motion.div>
          )}

          {!unauthorized && !forbidden && !error && isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 flex flex-col items-center justify-center text-center font-mono select-none rounded-3xl border border-white/10 bg-[#0C0C0E]"
            >
              <Loader2 size={36} className="text-[#FFD700] animate-spin mb-4" />
              <span className="text-xs text-[#9A9890] tracking-[0.25em] font-bold">
                FETCHING REAL-TIME RANKINGS...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 10x Modern Podium (Top 3) ── */}
        <AnimatePresence>
          {showPodium && !unauthorized && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="mb-14 md:mb-20 select-none transform-gpu"
            >
              <div className="grid grid-cols-3 gap-3 md:gap-8 items-end max-w-3xl mx-auto px-1">
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

        {/* ── Search Bar & Status Tags ── */}
        {!unauthorized && !forbidden && !error && !isLoading && rows.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 select-none"
          >
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search contestant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0C0C0E] border border-white/10 rounded-xl px-4 py-2.5 pl-10 pr-10 text-xs text-[#F0EDE6] placeholder:text-[#5A5850] focus:outline-none focus:border-[#FFD700]/60 focus:shadow-[0_0_20px_rgba(255,215,0,0.1)] font-mono transition-colors duration-150"
              />
              <Search size={15} className="absolute left-3.5 top-3 text-[#6A6860]" />
              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-3 text-[#6A6860] hover:text-[#F0EDE6] transition-colors"
                >
                  <X size={15} />
                </button>
              ) : (
                <span className="absolute right-3.5 top-2.5 font-mono text-[9px] text-[#4A4840] border border-white/5 px-1.5 py-0.5 rounded">
                  /
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-[#8A8880] tracking-wider uppercase bg-[#0C0C0E] px-3.5 py-1.5 rounded-xl border border-white/10 shadow-sm flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#FFD700]" />
                {search ? `${filteredRows.length} MATCHING` : `${rows.length} RANKED`}
              </span>
            </div>
          </motion.div>
        )}

        {/* ── 10x Rankings Table ── */}
        {!unauthorized && !forbidden && !error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-white/10 bg-[#0C0C0E] overflow-hidden shadow-2xl transform-gpu"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-[#050507] select-none">
                    <th className="py-4 pl-6 pr-3 font-mono text-[10px] font-bold text-[#7A7870] tracking-[0.2em] uppercase w-24">
                      RANK
                    </th>
                    <th className="py-4 px-4 font-mono text-[10px] font-bold text-[#7A7870] tracking-[0.2em] uppercase">
                      CONTESTANT
                    </th>
                    <th className="py-4 px-4 font-mono text-[10px] font-bold text-[#7A7870] tracking-[0.2em] uppercase text-right">
                      {rows[0]?.primaryLabel ?? "SCORE"}
                    </th>
                    <th className="py-4 px-4 pr-6 font-mono text-[10px] font-bold text-[#7A7870] tracking-[0.2em] uppercase text-right hidden sm:table-cell">
                      {rows[0]?.secondaryLabel ?? "DETAIL"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {tableRows.map((row) => {
                    const isRank1 = row.rank === 1;
                    const isRank2 = row.rank === 2;
                    const isRank3 = row.rank === 3;
                    const isTop3 = isRank1 || isRank2 || isRank3;

                    // Custom background & accent for top 3 rows
                    const rowClass = isRank1
                      ? "bg-gradient-to-r from-[#FFD700]/12 via-[#FFD700]/4 to-transparent border-l-4 border-l-[#FFD700]"
                      : isRank2
                      ? "bg-gradient-to-r from-[#E2E8F0]/10 via-[#E2E8F0]/3 to-transparent border-l-4 border-l-[#E2E8F0]"
                      : isRank3
                      ? "bg-gradient-to-r from-[#F59E0B]/10 via-[#F59E0B]/3 to-transparent border-l-4 border-l-[#F59E0B]"
                      : "";

                    const rankColors: Record<number, string> = {
                      1: "text-[#FFD700]",
                      2: "text-[#E2E8F0]",
                      3: "text-[#F59E0B]",
                    };

                    const avatarStyles: Record<number, string> = {
                      1: "from-[#FFD700]/30 to-[#FFD700]/10 border-[#FFD700]/60 text-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.2)]",
                      2: "from-[#E2E8F0]/25 to-[#E2E8F0]/5 border-[#E2E8F0]/50 text-[#E2E8F0]",
                      3: "from-[#F59E0B]/25 to-[#F59E0B]/5 border-[#F59E0B]/50 text-[#F59E0B]",
                    };

                    const rankColor = rankColors[row.rank] ?? "text-[#8A8880]";
                    const avatarStyle =
                      avatarStyles[row.rank] ??
                      "from-white/[0.08] to-white/[0.02] border-white/10 text-[#C0C0B0]";

                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors duration-150 group cursor-default ${rowClass} ${
                          isTop3 ? "hover:bg-white/[0.06]" : "hover:bg-white/[0.03]"
                        }`}
                      >
                        {/* Rank Column */}
                        <td className="py-4 pl-6 pr-3 font-mono text-xs font-bold">
                          <div className="flex items-center gap-2">
                            {isRank1 && <Crown size={15} className="text-[#FFD700] shrink-0" />}
                            {isRank2 && <Medal size={14} className="text-[#E2E8F0] shrink-0" />}
                            {isRank3 && <Medal size={14} className="text-[#F59E0B] shrink-0" />}
                            <span className={`${rankColor} ${isTop3 ? "font-extrabold" : ""}`}>
                              #{row.rank}
                            </span>
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
                              <span className="font-sans text-sm font-bold text-[#F0EDE6] group-hover:text-[#FFD700] transition-colors duration-150">
                                {row.name}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Primary Value Column */}
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`font-mono text-sm font-black tracking-tight ${
                              isTop3 ? rankColor : "text-[#F0EDE6]"
                            }`}
                          >
                            {formatNumber(row.primaryValue)}
                          </span>
                        </td>

                        {/* Secondary Value Column */}
                        <td className="py-4 px-4 pr-6 text-right hidden sm:table-cell">
                          <span className="font-mono text-xs text-[#7A7870] group-hover:text-[#A0A090] transition-colors bg-white/[0.04] border border-white/5 px-2.5 py-1 rounded-lg">
                            {formatNumber(row.secondaryValue)}
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
                <Trophy className="text-[#2A2820] mb-4" size={40} />
                <span className="text-xs text-[#6A6860] tracking-widest uppercase font-bold">
                  {search ? "NO MATCHING CONTESTANTS" : "NO RANKINGS AVAILABLE"}
                </span>
              </div>
            )}

            {/* Pagination Controls */}
            {search.length === 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#050507]/80 font-mono text-[10px] text-[#7A7870] tracking-wider select-none">
                <button
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 disabled:opacity-20 hover:text-[#FFD700] transition-colors px-3.5 py-1.5 rounded-lg hover:bg-[#FFD700]/10 disabled:hover:bg-transparent disabled:hover:text-[#7A7870] cursor-pointer"
                >
                  <ChevronLeft size={14} /> PREV
                </button>
                <span className="text-[#8A8880]">
                  PAGE <span className="text-[#FFD700] font-bold">{page}</span>
                </span>
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={!hasNext}
                  className="flex items-center gap-1.5 disabled:opacity-20 hover:text-[#FFD700] transition-colors px-3.5 py-1.5 rounded-lg hover:bg-[#FFD700]/10 disabled:hover:bg-transparent disabled:hover:text-[#7A7870] cursor-pointer"
                >
                  NEXT <ChevronRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}