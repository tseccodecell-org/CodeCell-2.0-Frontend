"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

// import { PublicLayout } from "@/components/leaderboard/PublicLayout";
import { Podium } from "@/components/leaderboard/Podium";
import { leaderboard } from "@/components/leaderboard/mock-data";

type SortKey = "rank" | "score" | "solved" | "penalty";

export default function LeaderboardPage() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const data = q
      ? rest.filter(
          (c) =>
            c.username.toLowerCase().includes(q) ||
            c.handle.toLowerCase().includes(q)
        )
      : rest;

    return [...data].sort((a, b) => {
      if (sortKey === "rank") return a.rank - b.rank;
      if (sortKey === "score") return b.score - a.score;
      if (sortKey === "solved") return b.solved - a.solved;

      return a.penalty - b.penalty;
    });
  }, [query, sortKey, rest]);

  return (
    // <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="font-pixel text-[10px] text-[#F0CD85]">
            ★ LEADERBOARD ★
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Hall of{" "}
            <span className="text-gradient-[#F0CD85]">Champions</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Live rankings from CodeCell Weekly #41. Updated in real time.
          </p>
        </div>

        {/* Podium */}
        <div className="mt-14">
          <Podium top3={top3} />
        </div>

        {/* Controls */}
        <div className="mt-16 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative max-w-xs flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search coders..."
              className="w-full rounded-md border border-border bg-[#1A1D23] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#7BE0B8] focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1 rounded-md border border-border bg-[#1A1D23] p-1">
            {(
              ["rank", "score", "solved", "penalty"] as SortKey[]
            ).map((k) => (
              <button
                key={k}
                onClick={() => setSortKey(k)}
                className={`rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  sortKey === k
                    ? "bg-[#7BE0B8] text-[#7BE0B8]-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-[#1A1D23]/60 backdrop-blur">
          {/* Table Header */}
          <div className="grid grid-cols-[60px_1fr_90px_90px_90px_90px] items-center gap-2 border-b border-border bg-background/40 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:grid-cols-[80px_1fr_120px_100px_100px_120px] sm:px-6">
            <span>Rank</span>
            <span>Coder</span>
            <span className="text-right">Score</span>
            <span className="text-right">Solved</span>
            <span className="text-right">Penalty</span>
            <span className="hidden text-right sm:inline">
              Submissions
            </span>
          </div>

          {/* Rows */}
          <AnimatePresence initial={false}>
            {filtered.map((c, i) => (
              <motion.div
                layout
                key={c.handle}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: i * 0.02,
                  duration: 0.2,
                }}
                className="grid grid-cols-[60px_1fr_90px_90px_90px_90px] items-center gap-2 border-b border-border/60 px-4 py-3 transition-colors hover:bg-secondary/40 sm:grid-cols-[80px_1fr_120px_100px_100px_120px] sm:px-6"
              >
                {/* Rank */}
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                    {c.rank}
                  </span>

                  {c.delta !== 0 && (
                    <span
                      className={`font-mono text-[10px] ${
                        c.delta > 0
                          ? "text-[#7BE0B8]"
                          : "text-destructive"
                      }`}
                    >
                      {c.delta > 0 ? "▲" : "▼"}
                      {Math.abs(c.delta)}
                    </span>
                  )}
                </div>

                {/* User */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {c.username}
                  </p>

                  <p className="truncate font-mono text-xs text-muted-foreground">
                    @{c.handle}
                  </p>
                </div>

                {/* Score */}
                <span className="text-right font-mono text-sm font-semibold tabular-nums text-foreground">
                  {c.score}
                </span>

                {/* Solved */}
                <span className="text-right font-mono text-sm tabular-nums text-[#7BE0B8]">
                  {c.solved}
                </span>

                {/* Penalty */}
                <span className="text-right font-mono text-sm tabular-nums text-muted-foreground">
                  {c.penalty}
                </span>

                {/* Submissions */}
                <span className="hidden text-right font-mono text-sm tabular-nums text-muted-foreground sm:inline">
                  {c.submissions}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No coders match "{query}".
            </div>
          )}
        </div>

        <div className='mb-20'></div>
      </section>
  );
}