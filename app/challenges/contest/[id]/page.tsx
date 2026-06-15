"use client";

import React from "react"; // Imported React to use React.use()
import Link from "next/link";
import { ChevronLeft, Trophy, Clock, Target, Calendar } from "lucide-react";
import { motion } from "framer-motion";

// Update the type signature to reflect that params is a Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PastContestPage({ params }: PageProps) {
  // Safely unwrap the params Promise inside the Client Component
  const resolvedParams = React.use(params);
  const contestId = resolvedParams.id;

  const contestProblems = [
    { id: "A", title: "Pawn's Advance", difficulty: "Easy", acceptance: "62.1%", status: "solved", topics: ["Math", "Simulation"] },
    { id: "B", title: "Knight's Tour", difficulty: "Medium", acceptance: "45.8%", status: "solved", topics: ["Graph", "DFS"] },
    { id: "C", title: "Bishop's Path", difficulty: "Medium", acceptance: "28.4%", status: "attempted", topics: ["Dynamic Programming", "Grid"] },
    { id: "D", title: "Queen's Reign", difficulty: "Hard", acceptance: "12.7%", status: "todo", topics: ["Backtracking", "Bit Manipulation"] },
  ];

  const contestRankings = [
    { rank: 1, name: "Ayush Mehrotra", points: 400, time: "38:12", handle: "@ayush_m" },
    { rank: 2, name: "Sneha Kulkarni", points: 400, time: "42:05", handle: "@sneha_k" },
    { rank: 3, name: "Rohan Chawla", points: 400, time: "51:33", handle: "@rohan_c" },
    { rank: 4, name: "Kabir Mehta", points: 300, time: "45:21", handle: "@kabir_m" },
    { rank: 5, name: "Divya Shah", points: 300, time: "48:10", handle: "@divya_s" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col">
      {/* Navigation */}
      <div className="mb-8">
        <Link href="/challenges/contest">
          <button className="flex items-center gap-2 text-xs font-mono text-[#8A8880] hover:text-[#D4AF37] transition-colors">
            <ChevronLeft size={14} />
            RETURN TO ARENA
          </button>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-12 border-b border-[#2A2A2A] pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="font-mono text-[10px] text-[#D4AF37] tracking-[0.2em] block mb-2">
            // PAST_TRIAL.ARCHIVE
          </span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#F0EDE6] drop-shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            WEEKLY TRIAL #{contestId}
          </h1>
          <div className="flex items-center gap-6 mt-4 font-mono text-xs text-[#8A8880]">
            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#D4AF37]" /> May 2026</span>
            <span className="flex items-center gap-1.5"><Trophy size={12} className="text-[#D4AF37]" /> @ayush_m</span>
          </div>
        </div>
        <div className="px-6 py-3 border border-[#D4AF37]/30 bg-[#D4AF37]/5 font-mono text-xs text-[#D4AF37]">
          STATUS: <span className="font-bold">CONCLUDED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Problems (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h2 className="font-serif text-xl text-[#F0EDE6] tracking-widest uppercase mb-2">Trial Problems</h2>

          <div className="flex flex-col gap-3">
            {contestProblems.map((p) => {
              let diffColor = "text-[#8A8880]";
              let diffBg = "bg-[#8A8880]/10 border-[#8A8880]/20";

              if (p.difficulty === "Medium") {
                diffColor = "text-[#D4AF37]";
                diffBg = "bg-[#D4AF37]/10 border-[#D4AF37]/20";
              }
              if (p.difficulty === "Hard") {
                diffColor = "text-[#FF3333]";
                diffBg = "bg-[#FF3333]/10 border-[#FF3333]/20";
              }

              let pieceIcon = "";
              let pieceColor = "";
              let pieceTitle = "";

              if (p.status === "solved") {
                pieceIcon = "♚";
                pieceColor = "text-[#D4AF37]";
                pieceTitle = "Solved";
              } else if (p.difficulty === "Easy") {
                pieceIcon = p.status === "attempted" ? "♟" : "♙";
                pieceColor = p.status === "attempted" ? "text-[#8A8880]" : "text-[#8A8880]/50";
                pieceTitle = p.status === "attempted" ? "Attempted" : "To Do";
              } else if (p.difficulty === "Medium") {
                pieceIcon = p.status === "attempted" ? "♞" : "♘";
                pieceColor = p.status === "attempted" ? "text-[#D4AF37]" : "text-[#D4AF37]/50";
                pieceTitle = p.status === "attempted" ? "Attempted" : "To Do";
              } else if (p.difficulty === "Hard") {
                pieceIcon = p.status === "attempted" ? "♛" : "♕";
                pieceColor = p.status === "attempted" ? "text-[#FF3333]" : "text-[#FF3333]/50";
                pieceTitle = p.status === "attempted" ? "Attempted" : "To Do";
              }

              const isSolved = p.status === "solved";

              return (
                <Link key={p.id} href={`/challenges/contest-${contestId}-${p.id}`} className="block">
                  <div className={`border bg-[#0A0A0A] hover:bg-[#111111] transition-all duration-300 p-4 flex items-center gap-4 group relative overflow-hidden ${isSolved ? 'border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.05)]' : 'border-[#2A2A2A] hover:border-[#D4AF37]/50'}`}>

                    {isSolved && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 font-mono text-3xl font-bold text-[#D4AF37] opacity-[0.03] select-none pointer-events-none tracking-widest rotate-[-5deg]">
                        CHECKMATE
                      </div>
                    )}

                    <div className={`w-8 flex justify-center text-2xl z-10 ${isSolved ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : ''}`}>
                      <span className={`${pieceColor} leading-none`} title={pieceTitle}>{pieceIcon}</span>
                    </div>

                    <div className="flex-1 min-w-0 z-10">
                      <h3 className={`font-serif text-base transition-colors truncate ${isSolved ? 'text-[#D4AF37] opacity-90' : 'text-[#F0EDE6] group-hover:text-[#D4AF37]'}`}>
                        <span className="text-[#8A8880] mr-2 text-sm">{p.id}.</span>
                        {p.title}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0 z-10">
                      <div className={`font-mono text-[9px] uppercase tracking-widest px-2 py-1 border ${diffBg} ${diffColor} ${isSolved ? 'opacity-70' : ''}`}>
                        {p.difficulty}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Leaderboard (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h2 className="font-serif text-xl text-[#F0EDE6] tracking-widest uppercase mb-2">Final Standings</h2>

          <div className="border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden">
            <table className="w-full text-left font-sans text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A] bg-[#111111] text-[#8A8880] text-[10px] font-mono tracking-wider uppercase select-none">
                  <th className="py-3 pl-4 pr-2 font-normal w-12">#</th>
                  <th className="py-3 px-2 font-normal">Operative</th>
                  <th className="py-3 px-2 font-normal text-right">Score</th>
                  <th className="py-3 pr-4 pl-2 font-normal text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {contestRankings.map((coder) => {
                  let rankColor = "text-[#8A8880]";
                  if (coder.rank === 1) rankColor = "text-[#D4AF37]";
                  else if (coder.rank === 2) rankColor = "text-[#C0C0C0]";
                  else if (coder.rank === 3) rankColor = "text-[#CD7F32]";

                  return (
                    <tr key={coder.rank} className="border-b border-[#1A1A1A] hover:bg-[#111111] transition-colors">
                      <td className={`py-3 pl-4 pr-2 font-mono text-xs font-bold ${rankColor}`}>
                        {coder.rank}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-col">
                          <span className={`font-semibold text-xs ${coder.rank <= 3 ? rankColor : 'text-[#F0EDE6]'}`}>
                            {coder.name}
                          </span>
                          <span className="font-mono text-[9px] text-[#4A4A4A]">{coder.handle}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="font-mono text-xs font-bold text-[#F0EDE6]">{coder.points}</span>
                      </td>
                      <td className="py-3 pr-4 pl-2 text-right">
                        <span className="font-mono text-[10px] text-[#8A8880]">{coder.time}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button className="w-full border border-[#2A2A2A] bg-[#0A0A0A] hover:bg-[#111111] hover:border-[#D4AF37]/50 text-[#8A8880] hover:text-[#D4AF37] transition-all duration-300 py-3 font-mono text-[10px] tracking-widest uppercase">
            VIEW FULL RANKINGS
          </button>
        </div>
      </div>
    </div>
  );
}
