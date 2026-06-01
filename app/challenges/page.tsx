"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Terminal, ArrowRight, CheckCircle2, Clock, Trophy, Target, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const allProblems = [
  { id: "01", title: "Two Sum", difficulty: "Easy", acceptance: "42.5%", status: "solved", topics: ["Array", "Hash Table"] },
  { id: "02", title: "Add Two Numbers", difficulty: "Medium", acceptance: "38.2%", status: "attempted", topics: ["Linked List", "Math"] },
  { id: "03", title: "Longest Substring Without Repeating", difficulty: "Medium", acceptance: "33.1%", status: "todo", topics: ["Hash Table", "String", "Sliding Window"] },
  { id: "04", title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: "25.4%", status: "todo", topics: ["Array", "Binary Search", "Divide and Conquer"] },
  { id: "05", title: "Longest Palindromic Substring", difficulty: "Medium", acceptance: "31.8%", status: "solved", topics: ["String", "Dynamic Programming"] },
  { id: "10", title: "Regular Expression Matching", difficulty: "Hard", acceptance: "28.3%", status: "todo", topics: ["String", "Dynamic Programming", "Recursion"] },
  { id: "11", title: "Container With Most Water", difficulty: "Medium", acceptance: "53.2%", status: "solved", topics: ["Array", "Two Pointers"] },
  { id: "15", title: "3Sum", difficulty: "Medium", acceptance: "30.5%", status: "todo", topics: ["Array", "Two Pointers", "Sorting"] },
  { id: "20", title: "Valid Parentheses", difficulty: "Easy", acceptance: "40.2%", status: "solved", topics: ["String", "Stack"] },
  { id: "23", title: "Merge k Sorted Lists", difficulty: "Hard", acceptance: "46.1%", status: "attempted", topics: ["Linked List", "Divide and Conquer", "Heap"] },
];

const difficulties = ["All", "Easy", "Medium", "Hard"];
const commonTopics = ["Array", "String", "Hash Table", "Dynamic Programming", "Math", "Sorting"];

export default function ChallengesPage() {
  const [activeDiff, setActiveDiff] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("All");

  const filteredProblems = allProblems.filter((p) => {
    const matchesDiff = activeDiff === "All" || p.difficulty === activeDiff;
    const matchesTopic = activeTopic === "All" || p.topics.includes(activeTopic);
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesTopic && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col">
      
      {/* PREMIUM 8-QUEEN HERO SECTION */}
      <div className="mb-12 border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden relative select-none">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Atmospheric Image/Graphic representation */}
          <div className="relative h-64 lg:h-auto border-b lg:border-b-0 lg:border-r border-[#2A2A2A] bg-[#050505] flex items-center justify-center overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <Image 
              src="/golden_queen_hero.png" 
              alt="Golden Queen" 
              fill
              className="object-cover opacity-60 mix-blend-screen"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="font-mono text-[9px] text-[#D4AF37] tracking-[0.3em] uppercase block mb-1">
                ✦ NOW UNVEILING ✦
              </span>
              <h3 className="font-serif text-2xl text-[#F0EDE6] tracking-widest">
                CHAPTER III
              </h3>
            </div>
          </div>

          {/* Right: Challenge Details */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-20">
            <span className="font-mono text-[10px] text-[#D4AF37] tracking-[0.3em] uppercase block mb-6">
              WEEK 03
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#F0EDE6] tracking-[0.1em] leading-[1.1] mb-4">
              THE<br />
              DIAGONAL<br />
              THREAT
            </h1>
            <p className="font-serif italic text-sm text-[#D4AF37] mb-8">
              Greedy · Two-Pointers
            </p>
            <p className="font-sans text-sm text-[#8A8880] leading-relaxed max-w-md mb-10">
              The diagonals tighten. A third queen has stepped onto the board, claiming a line of fire that bisects the kingdom. Solve this week's trial and her position becomes etched into the eternal record.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 border border-[#2A2A2A] mb-8">
              <div className="p-5 border-r border-b border-[#2A2A2A]">
                <span className="font-mono text-[9px] text-[#8A8880] tracking-[0.2em] uppercase block mb-2">QUEENS PLACED</span>
                <span className="font-mono text-lg text-[#F0EDE6] tracking-widest">03 / 08</span>
              </div>
              <div className="p-5 border-b border-[#2A2A2A]">
                <span className="font-mono text-[9px] text-[#8A8880] tracking-[0.2em] uppercase block mb-2">TIME REMAINING</span>
                <span className="font-mono text-lg text-[#D4AF37] tracking-widest">04d · 22h</span>
              </div>
              <div className="p-5 border-r border-[#2A2A2A]">
                <span className="font-mono text-[9px] text-[#8A8880] tracking-[0.2em] uppercase block mb-2">OPERATIVES</span>
                <span className="font-mono text-lg text-[#F0EDE6] tracking-widest">14,832</span>
              </div>
              <div className="p-5">
                <span className="font-mono text-[9px] text-[#8A8880] tracking-[0.2em] uppercase block mb-2">DIFFICULTY</span>
                <span className="font-serif text-sm text-[#D4AF37] tracking-widest uppercase">MEDIUM · HARD</span>
              </div>
            </div>

            <Link href="/challenges/contest">
              <button className="w-full sm:w-auto border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 transition-colors px-8 py-4 font-mono text-[10px] text-[#D4AF37] tracking-[0.2em] uppercase flex items-center justify-center gap-4">
                ACCEPT THIS WEEK'S TRIAL <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 8-WEEK TIMELINE */}
      <div className="mb-16 border-t border-b border-[#2A2A2A] py-12 select-none">
        <div className="text-center mb-10">
          <h2 className="font-sans text-xl md:text-2xl text-[#F0EDE6] tracking-widest uppercase mb-2">
            8 WEEKS. 8 QUEENS. INFINITE PATHS.
          </h2>
          <p className="font-serif italic text-[#8A8880]">
            The 8-Queen Challenge. Your board. Your moves. Your story.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          {[
            { wk: 1, title: "THE EMPTY BOARD", desc: "Your journey begins. An empty board awaits your first move." },
            { wk: 2, title: "THE FIRST MOVE", desc: "You place your first queen. The path unfolds.", icon: "♙" },
            { wk: 3, title: "BUILDING HARMONY", desc: "You place more queens. Patterns emerge.", active: true },
            { wk: 4, title: "THE SABOTAGE", desc: "A black pawn appears where you least expect.", alert: true },
            { wk: 5, title: "NEW TWIST", desc: "Another obstacle appears. Your strategy is tested." },
            { wk: 6, title: "NARROW PATHS", desc: "Fewer safe squares. Greater consequences." },
            { wk: 7, title: "THE FINAL STRETCH", desc: "One last queen. One last decision." },
            { wk: 8, title: "VICTORY OR LESSON", desc: "Place the 8th queen. Claim your legend.", final: true },
          ].map((week) => (
            <div 
              key={week.wk} 
              className={`p-8 min-h-[240px] flex flex-col justify-between border relative overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/50 ${
                week.active ? "bg-[#D4AF37]/15 border-[#D4AF37]/60" : 
                week.alert ? "bg-[#FF4D00]/15 border-[#FF4D00]/40" : 
                "bg-[#111111]/80 border-[#2A2A2A]"
              } group`}
            >
              <Image 
                src={`/wk${week.wk}.png`} 
                alt={week.title} 
                fill
                className={`object-cover transition-all duration-700 ease-out opacity-35 group-hover:opacity-90 group-hover:scale-105 filter group-hover:grayscale-0 group-hover:brightness-100 group-hover:hue-rotate-0 group-hover:contrast-100 ${
                  week.active ? "grayscale-0 brightness-[1.1] contrast-[1.05]" : 
                  week.alert ? "hue-rotate-[240deg] grayscale-[30%] brightness-[0.9]" : 
                  "grayscale brightness-[0.4]"
                }`}
              />
              {/* Premium dark gradient overlay to ensure absolute text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/95 via-[#0A0A0A]/60 to-[#0A0A0A]/95 z-[2] transition-all duration-500 group-hover:from-black/70 group-hover:via-black/35 group-hover:to-black/85" />
              
              <div className="relative z-10 flex flex-col justify-between h-full w-full" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95)" }}>
                <div>
                  <span className={`font-mono text-[9px] tracking-[0.2em] uppercase block mb-1 ${
                    week.active ? "text-[#D4AF37] font-semibold" : "text-[#8A8880]"
                  }`}>
                    WEEK {week.wk}
                  </span>
                  <h4 className={`font-serif text-sm tracking-widest mb-3 transition-colors duration-300 ${
                    week.alert ? "text-[#FF4D00]" : "text-[#F0EDE6] group-hover:text-[#D4AF37]"
                  }`}>
                    {week.title}
                  </h4>
                </div>
                <p className="font-sans text-xs text-[#8A8880] group-hover:text-[#B5B3AA] leading-relaxed transition-colors duration-300">
                  {week.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Filters */}
        <div className="lg:col-span-1 flex flex-col gap-8 select-none">
          {/* Search */}
          <div>
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider mb-2 block">Search Archives</span>
            <div className="relative">
              <input
                type="text"
                placeholder="Search trial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 pl-10 text-xs text-[#F0EDE6] focus:outline-none focus:border-[#D4AF37] transition-colors font-mono shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
              />
              <Search size={14} className="absolute left-3.5 top-3.5 text-[#8A8880]" />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider mb-2 block">Threat Level</span>
            <div className="flex flex-col gap-2 font-mono text-xs">
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDiff(d)}
                  className={`text-left px-4 py-2.5 border transition-all duration-300 ${
                    activeDiff === d 
                      ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                      : "bg-[#0A0A0A] border-[#2A2A2A] text-[#8A8880] hover:text-[#F0EDE6] hover:border-[#D4AF37]/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rotate-45 ${activeDiff === d ? "bg-[#D4AF37]" : "bg-[#2A2A2A]"}`} />
                    {d}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Topics Filter */}
          <div>
            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider mb-2 block">Tactics</span>
            <div className="flex flex-wrap gap-2 font-mono text-[10px]">
              <button
                onClick={() => setActiveTopic("All")}
                className={`px-3 py-1.5 transition-all duration-300 ${activeTopic === "All" ? "bg-[#D4AF37] text-[#0A0A0A] shadow-[0_0_10px_rgba(212,175,55,0.3)]" : "bg-[#0A0A0A] text-[#8A8880] hover:text-[#D4AF37] border border-[#2A2A2A] hover:border-[#D4AF37]/50"}`}
              >
                All Tactics
              </button>
              {commonTopics.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTopic(t)}
                  className={`px-3 py-1.5 transition-all duration-300 ${activeTopic === t ? "bg-[#D4AF37] text-[#0A0A0A] shadow-[0_0_10px_rgba(212,175,55,0.3)]" : "bg-[#0A0A0A] text-[#8A8880] hover:text-[#D4AF37] border border-[#2A2A2A] hover:border-[#D4AF37]/50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Problem List */}
        <div className="lg:col-span-3">
          {/* Header & Leaderboard */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 border-b border-[#2A2A2A] pb-4 gap-4">
            <div>
              <h2 className="font-serif text-2xl text-[#F0EDE6] tracking-widest uppercase">The Trials</h2>
              <p className="font-mono text-xs text-[#8A8880] tracking-widest mt-1">SELECT YOUR NEXT MOVE ON THE BOARD</p>
            </div>
            <Link href="/leaderboard">
              <button className="border border-[#D4AF37] bg-[#D4AF37]/5 hover:bg-[#D4AF37] hover:text-[#0A0A0A] text-[#D4AF37] transition-all duration-300 px-6 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 group shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                <Trophy size={14} className="group-hover:animate-bounce" /> 
                View Leaderboard
              </button>
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {filteredProblems.map((p) => {
                let diffColor = "text-[#8A8880]"; // Easy
                let diffBg = "bg-[#8A8880]/10 border-[#8A8880]/20";
                
                if (p.difficulty === "Medium") {
                  diffColor = "text-[#D4AF37]"; // Gold
                  diffBg = "bg-[#D4AF37]/10 border-[#D4AF37]/20";
                }
                if (p.difficulty === "Hard") {
                  diffColor = "text-[#FF3333]"; // Red
                  diffBg = "bg-[#FF3333]/10 border-[#FF3333]/20";
                }

                let pieceIcon = "";
                let pieceColor = "";
                let pieceTitle = "";

                if (p.status === "solved") {
                  pieceIcon = "♚"; // King for Checkmate / Solved
                  pieceColor = "text-[#D4AF37]"; 
                  pieceTitle = "Solved";
                } else if (p.difficulty === "Easy") {
                  pieceIcon = p.status === "attempted" ? "♟" : "♙";
                  pieceColor = p.status === "attempted" ? "text-[#8A8880]" : "text-[#8A8880]/50";
                  pieceTitle = p.status === "attempted" ? "Attempted" : "To Do";
                } else if (p.difficulty === "Medium") {
                  pieceIcon = p.status === "attempted" ? "♞" : "♘"; // Knight
                  pieceColor = p.status === "attempted" ? "text-[#D4AF37]" : "text-[#D4AF37]/50";
                  pieceTitle = p.status === "attempted" ? "Attempted" : "To Do";
                } else if (p.difficulty === "Hard") {
                  pieceIcon = p.status === "attempted" ? "♛" : "♕"; // Queen
                  pieceColor = p.status === "attempted" ? "text-[#FF3333]" : "text-[#FF3333]/50";
                  pieceTitle = p.status === "attempted" ? "Attempted" : "To Do";
                }

                const isSolved = p.status === "solved";

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={p.id}
                  >
                    <Link href={`/challenges/${p.id}`} className="block">
                      <div className={`border bg-[#0A0A0A] hover:bg-[#111111] transition-all duration-300 p-4 sm:p-5 flex items-center gap-4 group relative overflow-hidden ${isSolved ? 'border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.05)]' : 'border-[#2A2A2A] hover:border-[#D4AF37]/50'}`}>
                        
                        {/* Solved Watermark */}
                        {isSolved && (
                          <div className="absolute right-32 top-1/2 -translate-y-1/2 font-mono text-4xl sm:text-6xl font-bold text-[#D4AF37] opacity-[0.03] select-none pointer-events-none tracking-widest rotate-[-5deg]">
                            CHECKMATE
                          </div>
                        )}

                        {/* Hover Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/5 to-[#D4AF37]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none z-0" />
                        
                        {/* Status Chess Icon */}
                        <div className={`w-10 flex justify-center text-3xl z-10 ${isSolved ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : ''}`}>
                          <span className={`${pieceColor} leading-none`} title={pieceTitle}>{pieceIcon}</span>
                        </div>

                        {/* Title & Topics */}
                        <div className="flex-1 min-w-0 z-10">
                          <h3 className={`font-serif text-lg transition-colors truncate ${isSolved ? 'text-[#D4AF37] opacity-90' : 'text-[#F0EDE6] group-hover:text-[#D4AF37]'}`}>
                            <span className="text-[#8A8880] mr-2 text-sm">{p.id}.</span>
                            {p.title}
                          </h3>
                          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
                            {p.topics.map(t => (
                              <span key={t} className={`whitespace-nowrap font-mono text-[9px] border px-2 py-0.5 uppercase tracking-wider transition-colors ${isSolved ? 'text-[#D4AF37]/60 border-[#D4AF37]/20 bg-[#D4AF37]/5' : 'text-[#8A8880] border-[#2A2A2A] bg-[#050505] group-hover:border-[#D4AF37]/30'}`}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Difficulty & Acceptance */}
                        <div className="flex flex-col items-end gap-2 shrink-0 z-10">
                          <div className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 border ${diffBg} ${diffColor} ${isSolved ? 'opacity-70' : ''}`}>
                            {p.difficulty}
                          </div>
                          <div className={`font-mono text-[10px] hidden sm:block ${isSolved ? 'text-[#D4AF37]/50' : 'text-[#4A4A4A]'}`}>
                            SUCCESS RATE: <span className={isSolved ? 'text-[#D4AF37]/70' : 'text-[#8A8880]'}>{p.acceptance}</span>
                          </div>
                        </div>
                        
                        {/* Arrow */}
                        <div className={`hidden md:flex transition-colors ml-2 z-10 ${isSolved ? 'text-[#D4AF37]/50' : 'text-[#2A2A2A] group-hover:text-[#D4AF37]'}`}>
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredProblems.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-center font-mono select-none border border-[#2A2A2A] bg-[#0A0A0A]">
                <Shield className="text-[#2A2A2A] mb-4" size={48} />
                <span className="text-sm text-[#D4AF37] tracking-widest mb-2">NO TRIALS FOUND</span>
                <span className="text-xs text-[#8A8880]">ADJUST YOUR TACTICS AND SEARCH AGAIN.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}