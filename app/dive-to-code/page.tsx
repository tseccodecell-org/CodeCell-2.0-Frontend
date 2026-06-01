"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Timer,
  Terminal,
  Trophy,
  Users,
  Zap,
  Code,
  Plus,
  Minus,
} from "lucide-react";

import Image from "next/image";

function ChessboardBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.025]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #D4AF37 25%, transparent 25%),
            linear-gradient(-45deg, #D4AF37 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #D4AF37 75%),
            linear-gradient(-45deg, transparent 75%, #D4AF37 75%)
          `,
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 0 30px, 30px -30px, -30px 0px",
        }}
      />
    </div>
  );
}

const faqs = [
  {
    q: "WHAT IS DIVE TO CODE (KNIGHT'S SPRINT)?",
    a: "It is a high-speed blind coding championship. You must solve algorithmic challenges as fast as possible, sometimes without compiling or seeing the output until submission.",
  },
  {
    q: "IS IT INDIVIDUAL OR TEAM-BASED?",
    a: "The Knight's Sprint is strictly an individual tournament. Solo strategy.",
  },
  {
    q: "WHAT LANGUAGES ARE ALLOWED?",
    a: "C, C++, Java, and Python are supported in our custom tournament compiler environment.",
  },
];

export default function DiveToCodePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden text-[#F0EDE6] selection:bg-[#D4AF37] selection:text-[#0A0A0A]">
      <ChessboardBg />
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 lg:px-24 max-w-7xl mx-auto overflow-hidden">
        {/* Giant cinematic background piece */}
        <div className="absolute right-0 top-0 w-full md:w-1/2 h-[120%] opacity-[0.15] select-none pointer-events-none">
          <Image 
            src="/chess_knight_bg.png" 
            alt="Knight Piece" 
            fill 
            className="object-cover md:object-contain object-right mix-blend-screen"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent z-10" />
        </div>

        <Link href="/events">
          <button className="flex items-center gap-2 text-xs font-mono text-[#8A8880] hover:text-[#D4AF37] transition-colors mb-12 relative z-10">
            <ArrowLeft size={14} />
            BACK TO THE ARENA
          </button>
        </Link>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <span className="font-mono text-[11px] text-[#D4AF37] tracking-[0.3em] block mb-4 uppercase">
              // SPEED SPRINT — THE KNIGHT'S SPRINT
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#D4AF37]">
                DIVE TO
              </span>
              <br />
              <span style={{ WebkitTextStroke: "1.5px #D4AF37", color: "transparent" }}>
                CODE
              </span>
            </h1>

            <p className="font-sans text-lg text-[#8A8880] max-w-2xl leading-relaxed mb-10">
              The knight moves fast and unpredictable. A high-intensity coding sprint featuring speed rounds, debugging relays, and blind-code challenges. Three timed rounds. No IDEs. No auto-complete. Just raw logic under pressure.
            </p>

            <div className="flex flex-wrap gap-4 font-mono text-xs">
              <button className="px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] font-bold tracking-widest uppercase hover:bg-[#F5E6A3] transition-colors flex items-center gap-2">
                <Timer size={16} />
                REGISTER NOW
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="border border-[#D4AF37]/20 bg-[#111111]/80 backdrop-blur-sm p-6 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-mono text-[9px] text-[#4A4A4A] block mb-1">FORMAT</span>
              <div className="flex items-center gap-3 text-[#F0EDE6] font-bold">
                <Users className="text-[#D4AF37]" size={20} />
                SOLO INDIVIDUAL
              </div>
            </div>
            <div className="border border-[#D4AF37]/20 bg-[#111111]/80 backdrop-blur-sm p-6 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-mono text-[9px] text-[#4A4A4A] block mb-1">ROUNDS</span>
              <div className="flex items-center gap-3 text-[#F0EDE6] font-bold">
                <Zap className="text-[#D4AF37]" size={20} />
                3 TIMED PHASES
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          TOURNAMENT STAGES
          ======================================================== */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto py-20 border-t border-[#D4AF37]/10 relative z-10">
        <div className="mb-12 text-center">
          <span className="font-mono text-[11px] text-[#D4AF37] tracking-widest block mb-2 uppercase">
            [ THE PHASES ]
          </span>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
            TOURNAMENT <span className="text-[#D4AF37]">STAGES</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Phase 1 */}
          <div className="border border-[#222222] bg-[#111111] p-8 relative overflow-hidden group hover:border-[#D4AF37]/40 transition-colors">
            <div className="text-[#D4AF37] font-serif text-5xl mb-6 opacity-20 group-hover:opacity-100 transition-opacity">01</div>
            <h3 className="font-sans text-xl font-bold uppercase tracking-tight mb-2 text-[#F0EDE6]">
              SYNTAX SPRINT
            </h3>
            <p className="font-sans text-sm text-[#8A8880] leading-relaxed mb-4">
              Rapid-fire algorithmic questions. You have exactly 45 minutes to solve 5 easy-medium level questions. Speed is your only advantage.
            </p>
            <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest uppercase block">
              // ELIMINATION ROUND
            </span>
          </div>

          {/* Phase 2 */}
          <div className="border border-[#222222] bg-[#111111] p-8 relative overflow-hidden group hover:border-[#D4AF37]/40 transition-colors">
            <div className="text-[#D4AF37] font-serif text-5xl mb-6 opacity-20 group-hover:opacity-100 transition-opacity">02</div>
            <h3 className="font-sans text-xl font-bold uppercase tracking-tight mb-2 text-[#F0EDE6]">
              BLIND FOLD
            </h3>
            <p className="font-sans text-sm text-[#8A8880] leading-relaxed mb-4">
              The monitor goes black. You must type the code without seeing it on the screen. Any syntax error is heavily penalized.
            </p>
            <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest uppercase block">
              // TOP 50 QUALIFIERS
            </span>
          </div>

          {/* Phase 3 */}
          <div className="border border-[#222222] bg-[#111111] p-8 relative overflow-hidden group hover:border-[#D4AF37]/40 transition-colors">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#D4AF37]/20 to-transparent" />
            <div className="text-[#D4AF37] font-serif text-5xl mb-6 opacity-20 group-hover:opacity-100 transition-opacity">03</div>
            <h3 className="font-sans text-xl font-bold uppercase tracking-tight mb-2 text-[#F0EDE6]">
              THE KNIGHT'S DUEL
            </h3>
            <p className="font-sans text-sm text-[#8A8880] leading-relaxed mb-4">
              Head-to-head 1v1 bracket elimination. The final 8 coders face off in real-time competitive programming duels on the main stage.
            </p>
            <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest uppercase block">
              // GRAND FINALE
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          TOURNAMENT INTEL (PRIZES & SCHEDULE)
          ======================================================== */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto py-20 border-t border-[#D4AF37]/10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* THE REWARD */}
          <div>
            <span className="font-mono text-[11px] text-[#D4AF37] tracking-widest block mb-2 uppercase">
              [ THE REWARD ]
            </span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-8">
              PRIZE <span className="text-[#D4AF37]">POOL</span>
            </h2>
            
            <div className="space-y-4">
              <div className="border border-[#D4AF37] bg-[#D4AF37]/5 p-6 flex items-center justify-between group hover:bg-[#D4AF37]/10 transition-colors">
                <div>
                  <h4 className="font-serif text-2xl text-[#D4AF37] tracking-widest mb-1">CHAMPION</h4>
                  <p className="font-mono text-xs text-[#8A8880] uppercase tracking-wider">Overall 1st Place</p>
                </div>
                <div className="text-3xl font-bold text-[#F0EDE6] tracking-tighter">₹30,000</div>
              </div>
              <div className="border border-[#222222] bg-[#111111] p-6 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
                <div>
                  <h4 className="font-serif text-xl text-[#C0C0C0] tracking-widest mb-1">RUNNER UP</h4>
                  <p className="font-mono text-xs text-[#8A8880] uppercase tracking-wider">Overall 2nd Place</p>
                </div>
                <div className="text-2xl font-bold text-[#F0EDE6] tracking-tighter">₹15,000</div>
              </div>
              <div className="border border-[#222222] bg-[#111111] p-6 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
                <div>
                  <h4 className="font-serif text-xl text-[#CD7F32] tracking-widest mb-1">2ND RUNNER UP</h4>
                  <p className="font-mono text-xs text-[#8A8880] uppercase tracking-wider">Overall 3rd Place</p>
                </div>
                <div className="text-2xl font-bold text-[#F0EDE6] tracking-tighter">₹7,500</div>
              </div>
              <div className="border border-[#222222] bg-[#0A0A0A] p-4 text-center">
                <p className="font-mono text-[10px] text-[#8A8880] tracking-widest uppercase">Plus Fast-Solver bonuses & Elite Operative streaks worth ₹5,000</p>
              </div>
            </div>
          </div>

          {/* THE TIMELINE */}
          <div>
            <span className="font-mono text-[11px] text-[#D4AF37] tracking-widest block mb-2 uppercase">
              [ THE GAUNTLET ]
            </span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-8">
              EVENT <span className="text-[#D4AF37]">SCHEDULE</span>
            </h2>

            <div className="relative border-l border-[#D4AF37]/20 ml-3 space-y-8 pb-4">
              <div className="relative pl-8">
                <div className="absolute w-3 h-3 bg-[#D4AF37] rounded-full -left-[6.5px] top-1 shadow-[0_0_10px_#D4AF37]" />
                <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest block mb-1">MAR 15, 09:00 AM</span>
                <h4 className="font-sans text-lg font-bold text-[#F0EDE6] tracking-tight mb-1 uppercase">Stage 1: Syntax Sprint</h4>
                <p className="font-sans text-xs text-[#8A8880] leading-relaxed">Timed competitive rounds. Solve 5 problems to secure placement.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute w-3 h-3 bg-[#111111] border border-[#D4AF37] rounded-full -left-[6.5px] top-1" />
                <span className="font-mono text-[10px] text-[#8A8880] tracking-widest block mb-1">MAR 15, 12:00 PM</span>
                <h4 className="font-sans text-lg font-bold text-[#F0EDE6] tracking-tight mb-1 uppercase">Stage 2: Blind Fold</h4>
                <p className="font-sans text-xs text-[#8A8880] leading-relaxed">Monitors blacked out. Type logic under memory constraints.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute w-3 h-3 bg-[#111111] border border-[#D4AF37] rounded-full -left-[6.5px] top-1" />
                <span className="font-mono text-[10px] text-[#8A8880] tracking-widest block mb-1">MAR 15, 03:00 PM</span>
                <h4 className="font-sans text-lg font-bold text-[#F0EDE6] tracking-tight mb-1 uppercase">Stage 3: Knight's Duel</h4>
                <p className="font-sans text-xs text-[#8A8880] leading-relaxed">Head-to-head live 1v1 bracket final matches on stage.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute w-3 h-3 bg-[#111111] border border-[#D4AF37] rounded-full -left-[6.5px] top-1" />
                <span className="font-mono text-[10px] text-[#8A8880] tracking-widest block mb-1">MAR 15, 06:00 PM</span>
                <h4 className="font-sans text-lg font-bold text-[#F0EDE6] tracking-tight mb-1 uppercase">Awards & Crowning</h4>
                <p className="font-sans text-xs text-[#8A8880] leading-relaxed">Crowning the Knight Champion and distributing prizes.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 md:px-12 lg:px-24 max-w-4xl mx-auto py-20 border-t border-[#D4AF37]/10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
            RULES OF <span className="text-[#D4AF37]">ENGAGEMENT</span>
          </h2>
        </div>

        <div className="flex flex-col border-t border-b border-[#D4AF37]/20 divide-y divide-[#D4AF37]/10">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-4 select-none">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between py-4 text-left hover:text-[#D4AF37] transition-colors"
                >
                  <span className="font-sans text-sm font-bold uppercase tracking-tight text-[#F0EDE6] group-hover:text-[#D4AF37]">
                    {faq.q}
                  </span>
                  <span className="font-mono text-xs ml-4 text-[#D4AF37]">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-sm text-[#8A8880] leading-relaxed pt-2 pb-6">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
