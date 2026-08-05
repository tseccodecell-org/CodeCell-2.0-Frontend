"use client";

import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { useAuth } from "@/hooks/useAuth";
import LoginCard from "../login/LoginCard";

const playfair = Playfair_Display({ subsets: ["latin"] });

interface HeroProps {
  onRegisterClick?: () => void;
}

export function Hero({ onRegisterClick }: HeroProps) {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#02040A] border-b border-[#eab308]/20 py-20 md:py-0">
      {/* Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          backgroundPosition: 'center center'
        }}
      />

      {/* Floating Background Code Elements */}
      <motion.div
        animate={{ y: [0, -15, 0], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[8%] text-[#eab308] font-mono text-xs md:text-sm pointer-events-none -rotate-6 select-none hidden md:block z-0"
      >
        <pre>{`const evaluatePosition = (board) => {
  return calculateAdvantage(board);
};`}</pre>
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.03, 0.1, 0.03] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[25%] right-[8%] text-cyan-400 font-mono text-xs md:text-sm pointer-events-none rotate-3 select-none hidden md:block z-0"
      >
        <pre>{`interface Move {
  piece: string;
  target: [number, number];
  isCapture: boolean;
}`}</pre>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0], opacity: [0.02, 0.08, 0.02] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[65%] left-[12%] text-white font-mono text-[10px] md:text-xs pointer-events-none -rotate-12 select-none hidden lg:block z-0"
      >
        <pre>{`while (left <= right) {
  let mid = Math.floor((left+right)/2);
  if (arr[mid] === target) return mid;
}`}</pre>
      </motion.div>

      {/* Inner Hero Card */}
      <div className="relative z-10 w-[95%] max-w-7xl mx-auto bg-[#070707] border border-[#1A1A1A] py-12 sm:py-16 md:py-24 flex flex-col items-center justify-center text-center px-4 overflow-hidden">

        {/* Subtle Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Top Header Text with lines */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center gap-4 mb-6"
        >
          <div className="h-[1px] w-12 md:w-32 bg-gradient-to-r from-transparent to-[#4a3e1c]" />
          <span className="text-[#8B7344] text-[10px] md:text-xs tracking-[0.3em] font-mono uppercase">
            TSEC CODECELL • 2026
          </span>
          <div className="h-[1px] w-12 md:w-32 bg-gradient-to-l from-transparent to-[#4a3e1c]" />
        </motion.div>

        {/* Chess Pieces */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative flex items-center gap-4 md:gap-6 mb-8 text-[#5E4E2A] text-xl md:text-2xl"
        >
          {['♜', '♞', '♝'].map((piece, i) => (
            <span key={`left-${i}`} className="drop-shadow-lg opacity-60 hover:opacity-100 transition-opacity">
              {piece}
            </span>
          ))}
          <span className="text-gold scale-125 mx-1 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            ♛
          </span>
          <span className="text-gold scale-125 mx-1 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            ♚
          </span>
          {['♝', '♞', '♜'].map((piece, i) => (
            <span key={`right-${i}`} className="drop-shadow-lg opacity-60 hover:opacity-100 transition-opacity">
              {piece}
            </span>
          ))}
        </motion.div>

        {/* Massive Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`relative ${playfair.className} text-3xl sm:text-4xl md:text-6xl lg:text-[6rem] font-black leading-none tracking-wide flex flex-col items-center`}
        >
          <div className="text-[#F3F3F3] drop-shadow-2xl">WEEKLY</div>
          <div className="text-gold drop-shadow-[0_0_40px_rgba(212,175,55,0.15)] -mt-1 md:-mt-3 lg:-mt-5">CHALLENGES</div>
        </motion.h1>

        {/* Code Snippet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-10 bg-[#0A0D08]/80 border border-[#2A2A2A] shadow-2xl rounded px-6 py-3 font-mono text-[13px] md:text-[15px] backdrop-blur-sm flex items-center"
        >
          <span className="text-[#4ADE80]">function</span>
          <span className="text-white ml-2">masterDSA</span>
          <span className="text-[#A39A80] ml-2">(6_weeks)</span>
          <span className="inline-block w-2 h-4 ml-3 bg-[#4ADE80] animate-pulse" />
        </motion.div>

        {/* CTA Register / Go to Timeline Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          {!isAuthenticated && (
            <button
              onClick={onRegisterClick}
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#eab308] via-[#f59e0b] to-[#eab308] text-black font-mono font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] shadow-[0_0_35px_rgba(234,179,8,0.5)] hover:shadow-[0_0_50px_rgba(234,179,8,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 group"
            >
              <span>REGISTER NOW</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          )}

          <LoginCard />
        </motion.div>

        {/* Bottom Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative mt-8 sm:mt-10 md:mt-14 text-[#B0B0B0] text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-mono flex flex-col justify-center items-center gap-y-2 sm:gap-y-3 md:gap-y-4 pb-4 md:pb-0 font-medium px-2 sm:px-4 w-full"
        >
          {/* Top Line — stacks into two rows on mobile */}
          <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 md:gap-x-5 gap-y-1.5 sm:gap-y-2 text-center">
            <span>6 WEEKS</span>
            <span className="text-[#eab308]/60">•</span>
            <span>1 CHALLENGE / WEEK</span>
            <span className="text-[#eab308]/60">•</span>
            <span>30 HR WINDOW</span>
            <span className="text-[#eab308]/60 hidden sm:inline">•</span>
            <span>TOP 20 FINALISTS</span>
            <span className="text-[#eab308]/60">•</span>
            <span>OFFLINE FINALE @ TSEC</span>
          </div>

          {/* Middle Line
          <div className="flex flex-wrap justify-center items-center gap-x-4 md:gap-x-6 gap-y-2 text-center">
            <span>3-HOUR ONSITE CONTEST</span>
            <span className="text-[#eab308]/60">•</span>
            <span>INTERNSHIP OPPORTUNITIES</span>
          </div> */}

          {/* Bottom Line Tagline */}
          <div className="flex flex-wrap justify-center items-center gap-x-3 md:gap-x-6 gap-y-2 mt-2 md:mt-3 text-center">
            <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] font-bold text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em]">
              CODE <span className="text-[#eab308] mx-1.5 sm:mx-2 md:mx-4">/</span> COMPETE <span className="text-[#eab308] mx-1.5 sm:mx-2 md:mx-4">/</span> CONQUER
            </span>
          </div>
        </motion.div>

        {/* Bottom Glowing Gradient Border */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#eab308]/30 to-transparent opacity-80" />
      </div>
    </section>
  );
}
