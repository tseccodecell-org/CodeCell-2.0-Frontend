"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Trophy, Terminal, Award } from "lucide-react";
import { motion } from "framer-motion";

const topThree = [
  {
    rank: 2,
    name: "Rohan Chawla",
    points: "2,740 pts",
    accuracy: "98%",
    solved: "148 solved",
    height: "h-[180px] sm:h-[220px]",
    borderColor: "border-[#4BE2C4]",
    badgeColor: "bg-[#4BE2C4] text-[#0D0D0D]",
    textColor: "text-[#4BE2C4]",
    accentColor: "#4BE2C4",
  },
  {
    rank: 1,
    name: "Ayush Mehrotra",
    points: "2,850 pts",
    accuracy: "100%",
    solved: "151 solved",
    height: "h-[220px] sm:h-[270px]",
    borderColor: "border-[#E8FF00]",
    badgeColor: "bg-[#E8FF00] text-[#0D0D0D]",
    textColor: "text-[#E8FF00]",
    accentColor: "#E8FF00",
    crown: true,
  },
  {
    rank: 3,
    name: "Sneha Kulkarni",
    points: "2,610 pts",
    accuracy: "95%",
    solved: "142 solved",
    height: "h-[150px] sm:h-[180px]",
    borderColor: "border-[#A8D8FF]",
    badgeColor: "bg-[#A8D8FF] text-[#0D0D0D]",
    textColor: "text-[#A8D8FF]",
    accentColor: "#A8D8FF",
  },
];

const allRankings = [
  { rank: 4, name: "Kabir Mehta", points: 2550, solved: 139, accuracy: "93%", status: "ONLINE" },
  { rank: 5, name: "Divya Shah", points: 2495, solved: 135, accuracy: "91%", status: "ONLINE" },
  { rank: 6, name: "Pranav Iyer", points: 2380, solved: 128, accuracy: "89%", status: "OFFLINE" },
  { rank: 7, name: "Ananya Sharma", points: 2310, solved: 125, accuracy: "88%", status: "ONLINE" },
  { rank: 8, name: "Vikram Malhotra", points: 2250, solved: 121, accuracy: "85%", status: "OFFLINE" },
  { rank: 9, name: "Riya Sen", points: 2180, solved: 118, accuracy: "84%", status: "ONLINE" },
  { rank: 10, name: "Aditya Roy", points: 2100, solved: 114, accuracy: "81%", status: "ONLINE" },
  { rank: 11, name: "Meera Nair", points: 2020, solved: 109, accuracy: "79%", status: "OFFLINE" },
  { rank: 12, name: "Siddharth Jain", points: 1950, solved: 105, accuracy: "78%", status: "ONLINE" },
];

interface HologramTrophyProps {
  color: string;
  hasCrown?: boolean;
}

function HologramTrophy({ color, hasCrown }: HologramTrophyProps) {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center [perspective:800px] mb-4 select-none">
      <motion.div
        className="w-full h-full"
        animate={{ rotateY: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          {/* Inner vertical core axis */}
          <line x1="50" y1="10" x2="50" y2="85" stroke={color} strokeWidth="1" strokeDasharray="2,2" className="opacity-40" />
          
          {hasCrown ? (
            // Holographic Crown
            <polygon 
              points="20,70 20,40 35,55 50,30 65,55 80,40 80,70" 
              stroke={color} 
              strokeWidth="1.5" 
              className="opacity-90"
            />
          ) : (
            // Holographic Polyhedron Trophy
            <polygon 
              points="50,15 80,35 80,65 50,85 20,65 20,35" 
              stroke={color} 
              strokeWidth="1.5" 
              className="opacity-90"
            />
          )}
          {/* Cross lines to simulate 3D wiring */}
          <line x1="20" y1="35" x2="80" y2="65" stroke={color} strokeWidth="0.8" className="opacity-30" />
          <line x1="80" y1="35" x2="20" y2="65" stroke={color} strokeWidth="0.8" className="opacity-30" />
          <line x1="20" y1="35" x2="80" y2="35" stroke={color} strokeWidth="0.8" className="opacity-30" />
          <line x1="20" y1="65" x2="80" y2="65" stroke={color} strokeWidth="0.8" className="opacity-30" />

          {/* Inner core energy bubble */}
          <circle cx="50" cy="52" r="6" fill={color} className="animate-pulse opacity-40" />
        </svg>
      </motion.div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");

  const filteredRankings = allRankings.filter((coder) =>
    coder.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 border-b border-[#2A2A2A] pb-8 select-none">
        <span className="font-mono text-xs text-[#E8FF00] tracking-[0.2em]">03 — SCOREBOARD</span>
        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tight text-[#F0EDE6] mt-2">
          LEADERBOARD
        </h1>
        <p className="font-mono text-xs text-[#4A4A4A] mt-3 tracking-wider">
          // Official rankings of TSEC CodeCell competitive coders. Solves and logs computed in near real-time.
        </p>
      </div>

      {/* Podium Grid for Top 3 */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-8 mb-20 mt-12">
        {/* Render Rohan (2nd) first on desktop/tablet, then Ayush (1st), then Sneha (3rd) */}
        
        {/* 2nd Place */}
        <div className="w-full md:w-1/3 order-2 md:order-1 flex flex-col items-center relative">
          <HologramTrophy color={topThree[0].accentColor} />
          
          <div className={`w-full ${topThree[0].height} border border-[#222222] border-t-4 ${topThree[0].borderColor} bg-[#111111]/80 backdrop-blur-sm p-6 flex flex-col justify-between text-center shadow-lg relative overflow-hidden`}>
            {/* CRT scanline simulation */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-4"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, rgba(240, 237, 230, 0.08), rgba(240, 237, 230, 0.08) 1px, transparent 1px, transparent 3px)"
              }}
            />
            
            <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold px-3 py-0.5 rounded-none ${topThree[0].badgeColor}`}>
              RANK 02
            </div>
            <div className="mt-4">
              <h3 className="font-display text-lg font-bold uppercase text-[#F0EDE6]">
                {topThree[0].name}
              </h3>
              <p className="font-mono text-xs text-[#8A8880] mt-1">{topThree[0].solved}</p>
            </div>
            <div>
              <span className={`font-mono text-xl font-extrabold ${topThree[0].textColor}`}>{topThree[0].points}</span>
              <p className="font-mono text-[9px] text-[#4A4A4A] uppercase mt-1">ACCURACY: {topThree[0].accuracy}</p>
            </div>
          </div>
          {/* Glowing Base Rings */}
          <div 
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-transparent border border-dashed rounded-full pointer-events-none animate-[ping_4s_infinite] opacity-40" 
            style={{ borderColor: topThree[0].accentColor, boxShadow: `0 0 12px ${topThree[0].accentColor}` }} 
          />
        </div>

        {/* 1st Place */}
        <div className="w-full md:w-1/3 order-1 md:order-2 flex flex-col items-center relative z-10">
          <HologramTrophy color={topThree[1].accentColor} hasCrown />
          
          <div className={`w-full ${topThree[1].height} border border-[#2A2A2A] border-t-4 ${topThree[1].borderColor} bg-[#141414]/90 backdrop-blur-sm p-6 flex flex-col justify-between text-center shadow-2xl relative overflow-hidden`}>
            {/* CRT scanline simulation */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-4"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, rgba(240, 237, 230, 0.08), rgba(240, 237, 230, 0.08) 1px, transparent 1px, transparent 3px)"
              }}
            />
            
            <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold px-3 py-0.5 rounded-none ${topThree[1].badgeColor}`}>
              CHAMPION 01
            </div>
            <div className="mt-4">
              <h3 className={`font-display text-xl font-bold uppercase ${topThree[1].textColor}`}>
                {topThree[1].name}
              </h3>
              <p className="font-mono text-xs text-[#8A8880] mt-1">{topThree[1].solved}</p>
            </div>
            <div>
              <span className={`font-mono text-2xl font-extrabold ${topThree[1].textColor}`}>{topThree[1].points}</span>
              <p className="font-mono text-[9px] text-[#4A4A4A] uppercase mt-1">ACCURACY: {topThree[1].accuracy}</p>
            </div>
          </div>
          {/* Glowing Base Rings */}
          <div 
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-transparent border border-dashed rounded-full pointer-events-none animate-[ping_3.5s_infinite] opacity-60" 
            style={{ borderColor: topThree[1].accentColor, boxShadow: `0 0 16px ${topThree[1].accentColor}` }} 
          />
        </div>

        {/* 3rd Place */}
        <div className="w-full md:w-1/3 order-3 md:order-3 flex flex-col items-center relative">
          <HologramTrophy color={topThree[2].accentColor} />
          
          <div className={`w-full ${topThree[2].height} border border-[#222222] border-t-4 ${topThree[2].borderColor} bg-[#111111]/80 backdrop-blur-sm p-6 flex flex-col justify-between text-center shadow-lg relative overflow-hidden`}>
            {/* CRT scanline simulation */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-4"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, rgba(240, 237, 230, 0.08), rgba(240, 237, 230, 0.08) 1px, transparent 1px, transparent 3px)"
              }}
            />
            
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold px-3 py-0.5 rounded-none bg-[#2E2E2E] text-[#F0EDE6]">
              RANK 03
            </div>
            <div className="mt-4">
              <h3 className="font-display text-lg font-bold uppercase text-[#F0EDE6]">
                {topThree[2].name}
              </h3>
              <p className="font-mono text-xs text-[#8A8880] mt-1">{topThree[2].solved}</p>
            </div>
            <div>
              <span className="font-mono text-lg font-extrabold text-[#F0EDE6]">{topThree[2].points}</span>
              <p className="font-mono text-[9px] text-[#4A4A4A] uppercase mt-1">ACCURACY: {topThree[2].accuracy}</p>
            </div>
          </div>
          {/* Glowing Base Rings */}
          <div 
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-transparent border border-dashed rounded-full pointer-events-none animate-[ping_4.5s_infinite] opacity-30" 
            style={{ borderColor: topThree[2].accentColor, boxShadow: `0 0 10px ${topThree[2].accentColor}` }} 
          />
        </div>
      </div>

      {/* Complete Rankings List */}
      <div className="border border-[#2A2A2A] bg-[#111111] p-6 sm:p-8 font-mono shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A2A2A] pb-6 mb-6 gap-4 select-none">
          <span className="text-[11px] text-[#4A4A4A] uppercase tracking-wider">// ROOT_DIRECTORY_CODER_DUMP</span>
          {/* Search bar inside terminal box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search contestant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                bg-[#0D0D0D]
                border
                border-[#2A2A2A]
                px-4
                py-2
                pl-9
                text-xs
                text-[#F0EDE6]
                focus:outline-none
                focus:border-[#4BE2C4]
              "
            />
            <Search size={12} className="absolute left-3 top-3 text-[#4A4A4A]" />
          </div>
        </div>

        {/* Leaderboard list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#4A4A4A] text-[10px] tracking-wider uppercase select-none">
                <th className="py-3 pr-4 pl-4">Rank</th>
                <th className="py-3 px-4">Contestant</th>
                <th className="py-3 px-4 text-center">Solved</th>
                <th className="py-3 px-4 text-right">Accuracy</th>
                <th className="py-3 pl-4 text-right pr-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredRankings.map((coder) => (
                <tr
                  key={coder.rank}
                  className="
                    group/row
                    border-b
                    border-[#1A1A1A]
                    hover:bg-[#161616]
                    transition-all
                    duration-200
                  "
                >
                  <td className="py-3 pr-4 pl-4 font-bold text-[#4A4A4A] relative transition-all group-hover/row:pl-6 group-hover/row:text-[#E8FF00]">
                    <span className="absolute left-1 opacity-0 group-hover/row:opacity-100 transition-all text-[#E8FF00]">&gt;</span>
                    {coder.rank.toString().padStart(2, "0")}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#F0EDE6] transition-all group-hover/row:text-[#4BE2C4]">
                    {coder.name}
                  </td>
                  <td className="py-3 px-4 text-center text-[#4BE2C4]">{coder.solved}</td>
                  <td className="py-3 px-4 text-right text-[#8A8880]">{coder.accuracy}</td>
                  <td className="py-3 pl-4 text-right text-[#E8FF00] font-bold pr-4">{coder.points} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRankings.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center font-mono select-none">
            <Terminal className="text-[#FF4D00] mb-3" size={24} />
            <span className="text-xs text-[#4A4A4A]">NO CONTESTANT MATCHES DUMP INDEX.</span>
          </div>
        )}
      </div>
    </div>
  );
}