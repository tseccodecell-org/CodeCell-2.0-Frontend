"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Terminal,
  Shield,
  Award,
  Calendar,
  Code,
  Users,
  Trophy,
  Timer,
  Crown,
  Plus,
  Minus,
} from "lucide-react";

/* ============================================================
   ANIMATED CHESS BOARD BACKGROUND
   ============================================================ */
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
    q: "IS IT A 24-HOUR HACKATHON?",
    a: "Yes, it is a non-stop 24-hour physical hackathon. Bring your chargers, sleeping bags, and coffee.",
  },
  {
    q: "WHAT ARE THE TRACKS?",
    a: "Tracks will be revealed 24 hours prior to the event. Prepare for Web3, AI, Fintech, and Open Innovation.",
  },
  {
    q: "CAN I PARTICIPATE SOLO?",
    a: "TSEC Hacks strictly requires teams of 3 to 4 members. Collaboration is key.",
  },
];

export default function TSECHacksPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden text-[#F0EDE6] selection:bg-[#D4AF37] selection:text-[#0A0A0A]">
      <ChessboardBg />

      {/* Gold accent line at top */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <section className="relative px-6 py-20 md:py-32 lg:px-24 max-w-7xl mx-auto overflow-hidden">
        {/* Giant cinematic background piece */}
        <div className="absolute right-0 top-0 w-full md:w-1/2 h-[120%] opacity-20 select-none pointer-events-none">
          <Image 
            src="/chess_king_bg.png" 
            alt="King Piece" 
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
              // FLAGSHIP TOURNAMENT — THE KING'S GAMBIT
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#D4AF37]">
                TSEC
              </span>
              <br />
              <span style={{ WebkitTextStroke: "1.5px #D4AF37", color: "transparent" }}>
                HACKS
              </span>
              <span className="text-[#D4AF37]"> '26</span>
            </h1>

            <p className="font-sans text-lg text-[#8A8880] max-w-2xl leading-relaxed mb-10">
              The ultimate power move. A relentless 48-hour national hackathon where over 500 elite builders converge to construct web platforms, AI architectures, and smart contracts from scratch. Checkmate the competition.
            </p>

            <div className="flex flex-wrap gap-4 font-mono text-xs">
              <button className="px-8 py-4 bg-[#D4AF37] text-[#0A0A0A] font-bold tracking-widest uppercase hover:bg-[#F5E6A3] transition-colors flex items-center gap-2">
                <Crown size={16} />
                ENTER TOURNAMENT
              </button>
              <button className="px-8 py-4 bg-transparent border border-[#D4AF37]/30 text-[#D4AF37] font-bold tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all flex items-center gap-2">
                <Shield size={16} />
                VIEW RULEBOOK
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="border border-[#D4AF37]/20 bg-[#111111]/80 backdrop-blur-sm p-6 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-mono text-[9px] text-[#4A4A4A] block mb-1">DATE / TIME</span>
              <div className="flex items-center gap-3 text-[#F0EDE6] font-bold">
                <Calendar className="text-[#D4AF37]" size={20} />
                FEB 21 — 23, 2026
              </div>
            </div>

            <div className="border border-[#D4AF37]/20 bg-[#111111]/80 backdrop-blur-sm p-6 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-mono text-[9px] text-[#4A4A4A] block mb-1">PRIZE POOL</span>
              <div className="flex items-center gap-3 text-[#F0EDE6] font-bold">
                <Trophy className="text-[#D4AF37]" size={20} />
                ₹1,50,000 INR
              </div>
            </div>

            <div className="border border-[#D4AF37]/20 bg-[#111111]/80 backdrop-blur-sm p-6 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-mono text-[9px] text-[#4A4A4A] block mb-1">CAPACITY</span>
              <div className="flex items-center gap-3 text-[#F0EDE6] font-bold">
                <Users className="text-[#D4AF37]" size={20} />
                500+ HACKERS
              </div>
            </div>
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
                <div className="text-3xl font-bold text-[#F0EDE6] tracking-tighter">₹75,000</div>
              </div>
              <div className="border border-[#222222] bg-[#111111] p-6 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
                <div>
                  <h4 className="font-serif text-xl text-[#C0C0C0] tracking-widest mb-1">RUNNER UP</h4>
                  <p className="font-mono text-xs text-[#8A8880] uppercase tracking-wider">Overall 2nd Place</p>
                </div>
                <div className="text-2xl font-bold text-[#F0EDE6] tracking-tighter">₹40,000</div>
              </div>
              <div className="border border-[#222222] bg-[#111111] p-6 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
                <div>
                  <h4 className="font-serif text-xl text-[#CD7F32] tracking-widest mb-1">2ND RUNNER UP</h4>
                  <p className="font-mono text-xs text-[#8A8880] uppercase tracking-wider">Overall 3rd Place</p>
                </div>
                <div className="text-2xl font-bold text-[#F0EDE6] tracking-tighter">₹20,000</div>
              </div>
              <div className="border border-[#222222] bg-[#0A0A0A] p-4 text-center">
                <p className="font-mono text-[10px] text-[#8A8880] tracking-widest uppercase">Plus Track Prizes & Polygon API Bounties worth ₹15,000</p>
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
                <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest block mb-1">FEB 21, 09:00 AM</span>
                <h4 className="font-sans text-lg font-bold text-[#F0EDE6] tracking-tight mb-1 uppercase">Opening Ceremony</h4>
                <p className="font-sans text-xs text-[#8A8880] leading-relaxed">Tracks revealed. APIs unlocked. The countdown begins.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute w-3 h-3 bg-[#111111] border border-[#D4AF37] rounded-full -left-[6.5px] top-1" />
                <span className="font-mono text-[10px] text-[#8A8880] tracking-widest block mb-1">FEB 22, 12:00 PM</span>
                <h4 className="font-sans text-lg font-bold text-[#F0EDE6] tracking-tight mb-1 uppercase">Round 1 Mentoring</h4>
                <p className="font-sans text-xs text-[#8A8880] leading-relaxed">Code audits and structural feedback from industry veterans.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute w-3 h-3 bg-[#111111] border border-[#D4AF37] rounded-full -left-[6.5px] top-1" />
                <span className="font-mono text-[10px] text-[#8A8880] tracking-widest block mb-1">FEB 23, 09:00 AM</span>
                <h4 className="font-sans text-lg font-bold text-[#F0EDE6] tracking-tight mb-1 uppercase">Hacking Concludes</h4>
                <p className="font-sans text-xs text-[#8A8880] leading-relaxed">GitHub commits locked. Server deployments must be live.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute w-3 h-3 bg-[#111111] border border-[#D4AF37] rounded-full -left-[6.5px] top-1" />
                <span className="font-mono text-[10px] text-[#8A8880] tracking-widest block mb-1">FEB 23, 04:00 PM</span>
                <h4 className="font-sans text-lg font-bold text-[#F0EDE6] tracking-tight mb-1 uppercase">Final Pitches & Awards</h4>
                <p className="font-sans text-xs text-[#8A8880] leading-relaxed">Top 10 teams pitch to the judges. The King is crowned.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          FAQ SECTION
          ======================================================== */}
      <section className="px-6 md:px-12 lg:px-24 max-w-4xl mx-auto py-20 border-t border-[#D4AF37]/10">
        <div className="mb-12 text-center">
          <span className="font-mono text-[11px] text-[#D4AF37] tracking-widest block mb-2">
            [ RULEBOOK ]
          </span>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
            FREQUENTLY ASKED <span className="text-[#D4AF37]">QUESTIONS</span>
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