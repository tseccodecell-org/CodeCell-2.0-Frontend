"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Trophy, Zap, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/sections/weekly-challenges/Hero";
import { Overview } from "@/components/sections/weekly-challenges/Overview";
import { Prizes } from "@/components/sections/weekly-challenges/Prizes";
import { FAQ } from "@/components/sections/weekly-challenges/FAQ";
import { FinalCTA } from "@/components/sections/weekly-challenges/FinalCTA";
import { Sponsors } from "@/components/sections/weekly-challenges/Sponsors";

import { useAuth } from "@/hooks/useAuth";

export default function WeeklyChallengesPage() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { isAuthenticated, isProfileComplete } = useAuth();

  return (
    <main className="flex min-h-screen flex-col bg-[#02040A] text-white selection:bg-[#eab308]/30 selection:text-[#eab308] relative">
      {/* Landing Page Content */}
      {/* <LoginCard /> */}
      <Hero onRegisterClick={() => setShowRegisterModal(true)} />

      <Prizes />
      <Sponsors />
      <Overview />
      <FAQ />

      {/* Bottom CTA with Trigger */}
      <div className="relative pb-12 sm:pb-16 flex justify-center px-4">
        {isAuthenticated && isProfileComplete ? (
          <Link
            href="/events/weekly-challenges/timeline"
            className="px-6 sm:px-10 py-3.5 sm:py-4 rounded-full border border-[#D4AF37] bg-black text-[#D4AF37] hover:bg-[#D4AF37]/15 font-mono font-black text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.25em] transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 cursor-pointer text-center"
          >
            [ GO TO TIMELINE → ]
          </Link>
        ) : isAuthenticated && !isProfileComplete ? (
          <Link
            href="/register"
            className="px-6 sm:px-10 py-3.5 sm:py-4 rounded-full border border-[#eab308]/60 bg-[#eab308]/15 text-[#eab308] hover:bg-[#eab308] hover:text-black font-mono font-black text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.25em] transition-all duration-300 shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.7)] transform active:scale-95 cursor-pointer text-center"
          >
            [ FILL DETAILS (STEP 2) → ]
          </Link>
        ) : (
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-6 sm:px-10 py-3.5 sm:py-4 rounded-full border border-[#eab308]/60 bg-[#eab308]/15 text-[#eab308] hover:bg-[#eab308] hover:text-black font-mono font-black text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.25em] transition-all duration-300 shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.7)] transform active:scale-95 cursor-pointer text-center"
          >
            [ REGISTER NOW ]
          </button>
        )}
      </div>

      <FinalCTA />

      {/* Floating Glowing CTA Button (Sticky Bottom Right) — hidden on small mobile to avoid overlap */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 hidden sm:block">
        {isAuthenticated && isProfileComplete ? (
          <Link
            href="/events/weekly-challenges/timeline"
            className="relative flex items-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 rounded-full bg-gradient-to-r from-[#eab308] via-[#f59e0b] to-[#eab308] text-black font-mono font-black text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:shadow-[0_0_45px_rgba(234,179,8,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-[#eab308]/50 animate-pulse"
          >
            <span>Go to Timeline</span>
            <ArrowRight size={14} />
          </Link>
        ) : isAuthenticated && !isProfileComplete ? (
          <Link
            href="/register"
            className="relative flex items-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 rounded-full bg-gradient-to-r from-[#eab308] via-[#f59e0b] to-[#eab308] text-black font-mono font-black text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:shadow-[0_0_45px_rgba(234,179,8,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-[#eab308]/50 animate-pulse"
          >
            <span>Fill Details (Step 2)</span>
            <ArrowRight size={14} />
          </Link>
        ) : (
          <button
            onClick={() => setShowRegisterModal(true)}
            className="relative flex items-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 rounded-full bg-gradient-to-r from-[#eab308] via-[#f59e0b] to-[#eab308] text-black font-mono font-black text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:shadow-[0_0_45px_rgba(234,179,8,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-[#eab308]/50 animate-pulse"
          >
            <span>Register Now</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Registration Dialog Modal */}
      <AnimatePresence>
        {showRegisterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-[#070707] border border-[#eab308]/40 rounded-3xl p-8 shadow-[0_0_80px_rgba(234,179,8,0.2)] relative overflow-hidden text-white"
            >
              {/* Background Accent Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#eab308]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowRegisterModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#eab308]/10 border border-[#eab308]/30 flex items-center justify-center text-[#eab308]">
                  <Trophy size={24} />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#eab308] tracking-[0.25em] uppercase block">
                    TSEC CODECELL 2026
                  </span>
                  <h2 className="font-sans font-extrabold text-xl md:text-2xl uppercase tracking-tight text-white">
                    Weekly Challenges
                  </h2>
                </div>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                Enter the weekly arena, solve algorithmic problems, gain global XP, and qualify for the offline finale at TSEC!
              </p>

              {/* Highlights */}
              <div className="space-y-3 mb-8 bg-[#0D0D0D] border border-white/10 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Zap size={16} className="text-[#eab308] shrink-0" />
                  <span>6 Weeks of curated competitive coding matches</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <ShieldCheck size={16} className="text-[#eab308] shrink-0" />
                  <span>Exclusive certificates, prizes & internship perks</span>
                </div>
              </div>

              {/* Proceed to Registration Action */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/register"
                  onClick={() => setShowRegisterModal(false)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#eab308] to-[#f59e0b] text-black font-mono font-extrabold text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Proceed to Registration</span>
                  <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="w-full py-2 text-zinc-400 hover:text-white font-mono text-xs tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

