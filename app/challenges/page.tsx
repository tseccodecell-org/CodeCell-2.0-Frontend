"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const allChallenges = [
  { id: "01", name: "Knight's Tour Pathfinding", category: "Knight", piece: "♞", difficulty: "Medium", status: "OPEN", acceptedRate: "42%", timeLimit: "2.0s", cell: "B3", elo: "+30 ELO", desc: "Find the shortest sequence of moves for a knight to visit every square on an NxN board." },
  { id: "02", name: "N-Queens Checkmate Solver", category: "Queen", piece: "♛", difficulty: "Hard", status: "OPEN", acceptedRate: "18%", timeLimit: "1.5s", cell: "D8", elo: "+50 ELO", desc: "Place N non-attacking queens on an NxN chessboard." },
  { id: "03", name: "En Passant Capture Checker", category: "Pawn", piece: "♟", difficulty: "Easy", status: "OPEN", acceptedRate: "84%", timeLimit: "1.0s", cell: "A4", elo: "+15 ELO", desc: "Determine if a given pawn move follows the legal rules of en passant." },
  { id: "04", name: "Castling Status Auditor", category: "Rook", piece: "♜", difficulty: "Medium", status: "OPEN", acceptedRate: "35%", timeLimit: "2.0s", cell: "H1", elo: "+25 ELO", desc: "Verify if castling is valid given historical movements of King and Rook." },
  { id: "05", name: "Pawn Structure Defense", category: "Pawn", piece: "♟", difficulty: "Hard", status: "OPEN", acceptedRate: "12%", timeLimit: "2.5s", cell: "F7", elo: "+45 ELO", desc: "Calculate minimal defense moves against advancing opponent pawn storm." },
  { id: "06", name: "Bishop Diagonal Control", category: "Bishop", piece: "♝", difficulty: "Medium", status: "CLOSED", acceptedRate: "55%", timeLimit: "1.0s", cell: "C5", elo: "+30 ELO", desc: "Determine maximum placement of non-attacking bishops on a board." },
  { id: "07", name: "Fischer's Endgame Matrix", category: "Bishop", piece: "♝", difficulty: "Hard", status: "CLOSED", acceptedRate: "9%", timeLimit: "3.0s", cell: "G2", elo: "+60 ELO", desc: "Match Bobby Fischer's historic bishop-pawn endgame configuration." },
  { id: "08", name: "Rook File Mobility Radar", category: "Rook", piece: "♜", difficulty: "Easy", status: "CLOSED", acceptedRate: "91%", timeLimit: "0.5s", cell: "E4", elo: "+15 ELO", desc: "Calculate mobility count of a Rook on a partially blocked board." },
];

const categories = ["ALL", "PAWN", "KNIGHT", "BISHOP", "ROOK", "QUEEN"];

export default function ChallengesPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChallenges = allChallenges.filter((c) => {
    const matchesCategory = activeCategory === "ALL" || c.category.toUpperCase() === activeCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-transparent px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 border-b border-[#2A2A2A] pb-8 select-none">
        <span className="font-mono text-xs text-[#E8FF00] tracking-[0.2em]">01 — GRANDMASTER ARENA</span>
        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tight text-[#F0EDE6] mt-2">
          CHESS CHALLENGES
        </h1>
        <p className="font-mono text-xs text-[#4A4A4A] mt-3 tracking-wider">
          // Solve chess algorithms to raise your ELO rating and climb the leaderboards.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-10 font-mono select-none">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-4 py-2 text-xs font-bold tracking-wider transition-all duration-200 border
                ${
                  activeCategory === cat
                    ? "bg-[#E8FF00] text-[#0D0D0D] border-[#E8FF00]"
                    : "bg-transparent text-[#F0EDE6] border-[#2A2A2A] hover:border-[#4BE2C4]"
                }
              `}
            >
              [ {cat} ]
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search chess files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full
              bg-[#141414]
              border
              border-[#2A2A2A]
              px-4
              py-2.5
              pl-10
              text-xs
              text-[#F0EDE6]
              focus:outline-none
              focus:border-[#4BE2C4]
              font-mono
            "
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-[#4A4A4A]" />
        </div>
      </div>

      {/* Directory Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredChallenges.map((c) => {
            const isOpened = c.status === "OPEN";
            const hoverBorderClass = isOpened
              ? "hover:border-[#E8FF00] hover:shadow-[0_8px_32px_rgba(232,255,0,0.04)]"
              : "hover:border-[#4BE2C4] hover:shadow-[0_8px_32px_rgba(75,226,196,0.04)]";
            const hoverTitleClass = isOpened
              ? "group-hover:text-[#E8FF00]"
              : "group-hover:text-[#4BE2C4]";
            const scannerClass = isOpened ? "card-scanner" : "card-scanner-cyan";

            return (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`
                  bg-[#141414]
                  border
                  border-[#2A2A2A]
                  p-6
                  flex
                  flex-col
                  justify-between
                  h-[260px]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  group
                  relative
                  overflow-hidden
                  ${hoverBorderClass}
                  ${scannerClass}
                `}
              >
                {/* Chess piece backdrop watermark */}
                <div className="absolute right-4 bottom-12 text-8xl text-white opacity-[0.03] font-serif pointer-events-none group-hover:scale-110 transition-transform duration-300 select-none">
                  {c.piece}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] tracking-wider text-[#4A4A4A] border border-[#2A2A2A] px-2 py-0.5">
                      [{c.status}]
                    </span>
                    <span className="font-mono text-[9px] text-[#FF4D00] font-bold">
                      [SQUARE_{c.cell}]
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold uppercase tracking-tight text-[#F0EDE6] transition-colors mt-2 ${hoverTitleClass}`}>
                    {c.name}
                  </h3>

                  <p className="font-sans text-[11px] text-[#4A4A4A] mt-2.5 leading-relaxed line-clamp-2">
                    {c.desc}
                  </p>
                </div>

                <div>
                  {/* Technical stats */}
                  <div className="flex gap-4 font-mono text-[9px] text-[#4A4A4A] mb-3">
                    <span>LIMIT: {c.timeLimit}</span>
                    <span>RATIO: {c.acceptedRate}</span>
                    <span className="text-[#4BE2C4] font-bold">{c.elo}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#1A1A1A] pt-4 z-10 relative">
                    <span className="font-mono text-[10px] text-[#4A4A4A]">{c.category.toUpperCase()}_{c.id}.cpp</span>
                    {c.status === "OPEN" ? (
                      <Link href={`/challenges/solve-${c.id}`} className="flex items-center gap-1 text-[11px] font-mono font-bold tracking-widest text-[#E8FF00] hover:text-[#4BE2C4] transition-colors">
                        COMPILE & SOLVE <ArrowRight size={12} />
                      </Link>
                    ) : (
                      <span className="font-mono text-[10px] text-[#4A4A4A] uppercase">ARCHIVED</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredChallenges.length === 0 && (
          <div className="col-span-full border border-dashed border-[#2A2A2A] py-16 flex flex-col items-center justify-center text-center font-mono">
            <Terminal className="text-[#FF4D00] mb-4" size={32} />
            <span className="text-xs text-[#4A4A4A]">NO MATCHING CHESS CONFIGS LOCATED IN ARENA.</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}