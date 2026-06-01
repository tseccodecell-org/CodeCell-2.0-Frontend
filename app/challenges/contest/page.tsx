"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Trophy, Clock, Target, Calendar, ChevronRight, ChevronLeft, Shield } from "lucide-react";

const pastContests = [
  { id: 47, date: "May 24, 2026", participants: 142, topWinner: "@ayush_m" },
  { id: 46, date: "May 17, 2026", participants: 156, topWinner: "@sneha_k" },
  { id: 45, date: "May 10, 2026", participants: 138, topWinner: "@rohan_c" },
  { id: 44, date: "May 03, 2026", participants: 125, topWinner: "@ayush_m" },
];

export default function ContestLobbyPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col select-none">
      
      {/* Navigation */}
      <div className="mb-8">
        <Link href="/challenges">
          <button className="flex items-center gap-2 text-xs font-mono text-[#8A8880] hover:text-[#F0EDE6] transition-colors">
            <ChevronLeft size={14} />
            BACK TO CHALLENGES
          </button>
        </Link>
      </div>

      <div className="mb-12 border-b border-[#2A2A2A] pb-8">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-[#F0EDE6]">
          CONTEST ARENA
        </h1>
        <p className="font-sans text-sm text-[#8A8880] mt-3 max-w-xl leading-relaxed">
          Put your algorithms to the test in our weekly timed contests. Solve up to 4 problems of varying difficulty in 90 minutes. 
        </p>
      </div>

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Active Contest (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-8 md:p-12 relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors duration-300">
            {/* Cybernetic Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/10 to-transparent pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 font-mono text-[10px] text-[#D4AF37] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              UPCOMING TRIAL
            </div>

            <h2 className="text-3xl md:text-5xl font-bold uppercase text-[#F0EDE6] mb-4">
              WEEKLY TRIAL #48
            </h2>
            
            <p className="font-sans text-sm text-[#8A8880] mb-8 max-w-md">
              4 algorithmic problems. 90 minutes. Plagiarism checks enabled. ELO ratings will be updated upon contest completion.
            </p>

            <div className="grid grid-cols-4 gap-4 mb-10">
              <div className="flex flex-col bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-center">
                <span className="font-mono text-3xl font-bold text-[#F0EDE6]">{timeLeft.days}</span>
                <span className="font-mono text-[9px] text-[#4A4A4A] uppercase mt-1">Days</span>
              </div>
              <div className="flex flex-col bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-center">
                <span className="font-mono text-3xl font-bold text-[#F0EDE6]">{timeLeft.hours}</span>
                <span className="font-mono text-[9px] text-[#4A4A4A] uppercase mt-1">Hours</span>
              </div>
              <div className="flex flex-col bg-[#0D0D0D] border border-[#2A2A2A] p-4 text-center">
                <span className="font-mono text-3xl font-bold text-[#F0EDE6]">{timeLeft.minutes}</span>
                <span className="font-mono text-[9px] text-[#4A4A4A] uppercase mt-1">Mins</span>
              </div>
              <div className="flex flex-col bg-[#111111] border border-[#2A2A2A] p-4 text-center">
                <span className="font-mono text-3xl font-bold text-[#D4AF37]">{timeLeft.seconds}</span>
                <span className="font-mono text-[9px] text-[#4A4A4A] uppercase mt-1">Secs</span>
              </div>
            </div>

            <Link href="/challenges/contest/48">
              <button className="w-full btn-sweep border border-[#D4AF37] py-4 font-mono text-sm font-bold tracking-widest text-[#D4AF37] hover:text-[#0A0A0A] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]">
                <Target size={18} />
                ENTER THE ARENA
              </button>
            </Link>
          </div>
        </div>

        {/* Right: Rules & Past Contests (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Rules Panel */}
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-6 font-mono">
            <h3 className="text-xs text-[#F0EDE6] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield size={14} className="text-[#D4AF37]" />
              TRIAL RULES
            </h3>
            <ul className="text-[11px] text-[#8A8880] space-y-3 leading-relaxed list-disc list-inside marker:text-[#D4AF37]">
              <li>Penalty of 5 minutes for every wrong submission.</li>
              <li>Plagiarism will result in an immediate permanent ban.</li>
              <li>Solutions are hidden until the contest concludes.</li>
              <li>Only your last submission before the timer ends is scored.</li>
            </ul>
          </div>

          {/* Past Contests */}
          <div>
            <h3 className="text-xs text-[#F0EDE6] uppercase tracking-widest mb-4 font-mono">
              PAST TRIALS
            </h3>
            <div className="flex flex-col gap-3">
              {pastContests.map((c) => (
                <Link key={c.id} href={`/challenges/contest/${c.id}`}>
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-4 flex items-center justify-between hover:border-[#D4AF37]/50 hover:bg-[#111111] transition-all duration-300 group cursor-pointer">
                    <div>
                      <h4 className="font-bold text-sm text-[#F0EDE6] group-hover:text-[#D4AF37] transition-colors">
                        Weekly Trial #{c.id}
                      </h4>
                      <div className="flex gap-4 mt-2 font-mono text-[10px] text-[#8A8880]">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {c.date}</span>
                        <span className="flex items-center gap-1"><Trophy size={10} className="text-[#D4AF37]" /> {c.topWinner}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#4A4A4A] group-hover:text-[#D4AF37]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
