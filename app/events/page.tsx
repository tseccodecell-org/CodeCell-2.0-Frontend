"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Trophy,
  Zap,
  Brain,
  Swords,
  Crown,
  Sparkles,
} from "lucide-react";

/* ============================================================
   CHESS NOTATION TICKER — Gold themed
   ============================================================ */
const chessNotations = [
  "1. e4 e5 2. Nf3 Nc6",
  "♚ KING'S GAMBIT — TSEC HACKS",
  "♛ QUEEN'S REIGN — WEEKLY CHALLENGES",
  "♞ KNIGHT'S SPRINT — DIVE TO CODE",
  "♝ BISHOP'S DIAGONAL — BRAIN2WIN",
  "TSEC HACKS — FEB 21-23, 2026",
  "WEEKLY CHALLENGE #048 — ACTIVE",
  "Bxf7+ Kxf7 — CHECKMATE",
];

/* ============================================================
   EVENT DATA — Chess-piece mapped
   ============================================================ */
const events = [
  {
    id: "kings-gambit",
    piece: "♚",
    pieceAlt: "♔",
    title: "TSEC HACKS",
    codename: "THE KING'S GAMBIT",
    subtitle: "48-Hour Flagship Hackathon",
    desc: "The ultimate power move. TSEC's flagship 48-hour national hackathon where 500+ builders converge to construct web platforms, AI architectures, smart contracts, and tool systems from scratch. No pre-built boilerplate. No slides-only pitches. Pure engineering.",
    status: "REGISTRATION OPEN",
    statusColor: "#D4AF37",
    date: "FEB 21 — 23, 2026",
    participants: "500+",
    format: "TEAMS OF 2-4",
    href: "/tsec-hacks",
    notation: "1. e4 — King's Pawn Opening",
    tags: ["HACKATHON", "48-HOUR", "NATIONAL"],
  },
  {
    id: "grandmaster-arena",
    piece: "♛",
    pieceAlt: "♕",
    title: "WEEKLY CHALLENGES",
    codename: "THE GRANDMASTER ARENA",
    subtitle: "LeetCode-Style Competitive Platform",
    desc: "The queen controls the board. Our persistent competitive programming platform where coders solve algorithmic puzzles, participate in timed contests, climb ELO rankings, and earn streaks. Built-in code editor, real-time leaderboards, and editorial breakdowns.",
    status: "ACTIVE — CHALLENGE #048",
    statusColor: "#D4AF37",
    date: "EVERY WEEK",
    participants: "200+",
    format: "INDIVIDUAL",
    href: "/challenges",
    notation: "Qd1-d7 — Queen's Assault",
    tags: ["PLATFORM", "WEEKLY", "ELO-RATED"],
  },
  {
    id: "knights-sprint",
    piece: "♞",
    pieceAlt: "♘",
    title: "DIVE TO CODE",
    codename: "THE KNIGHT'S SPRINT",
    subtitle: "One-Day Speed Coding Championship",
    desc: "The knight moves fast and unpredictable. A high-intensity one-day coding sprint featuring speed rounds, debugging relays, and blind-code challenges. Three timed rounds. No IDEs. No auto-complete. Just raw logic and execution under pressure.",
    status: "UPCOMING",
    statusColor: "#C0C0C0",
    date: "MAR 15, 2026",
    participants: "150+",
    format: "INDIVIDUAL",
    href: "/dive-to-code",
    notation: "Nf3-g5 — Knight's Gambit",
    tags: ["SPEED-CODE", "ONE-DAY", "3 ROUNDS"],
  },
  {
    id: "bishops-diagonal",
    piece: "♝",
    pieceAlt: "♗",
    title: "BRAIN2WIN",
    codename: "THE BISHOP'S DIAGONAL",
    subtitle: "Logic & Lateral Thinking Championship",
    desc: "The bishop strikes diagonally. A mind-bending one-day competition blending aptitude, puzzles, pattern recognition, and algorithmic thinking. Four progressive rounds designed to test not just coding but computational thinking and creative problem solving.",
    status: "UPCOMING",
    statusColor: "#C0C0C0",
    date: "APR 05, 2026",
    participants: "120+",
    format: "PAIRS OF 2",
    href: "/brain2win",
    notation: "Bc1-g5 — Bishop Pin Sequence",
    tags: ["PUZZLE", "ONE-DAY", "4 ROUNDS"],
  },
];

/* ============================================================
   ANIMATED CHESS BOARD BACKGROUND
   ============================================================ */
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

/* ============================================================
   FLOATING CHESS PIECE COMPONENT
   ============================================================ */
function FloatingPiece({
  piece,
  delay,
  size = "text-8xl sm:text-9xl",
}: {
  piece: string;
  delay: number;
  size?: string;
}) {
  return (
    <motion.span
      className={`${size} font-serif select-none pointer-events-none`}
      style={{ color: "#D4AF37", opacity: 0.04 }}
      animate={{
        y: [0, -15, 0],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 7,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {piece}
    </motion.span>
  );
}

/* ============================================================
   PAGE COMPONENT
   ============================================================ */
export default function EventsPage() {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "ACTIVE" | "UPCOMING">("ALL");

  const filteredEvents = events.filter((e) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "ACTIVE") return e.status.includes("ACTIVE") || e.status.includes("OPEN");
    if (activeFilter === "UPCOMING") return e.status === "UPCOMING";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      <ChessboardBg />

      {/* Gold accent line at top */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      {/* ========================================================
          HERO SECTION — Cinematic Black & Gold
          ======================================================== */}
      <section className="relative px-6 py-20 md:px-12 lg:px-24 max-w-7xl mx-auto overflow-hidden min-h-[60vh] flex flex-col justify-center border-x border-[#2A2A2A]/20">
        {/* Cinematic Image Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A] z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] z-10" />
          <Image 
            src="/golden_queen_hero.png" 
            alt="Golden Queen" 
            fill
            className="object-cover opacity-30 mix-blend-screen scale-105"
            priority
          />
        </div>

        {/* Floating chess pieces background */}
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-8 opacity-30 z-0">
          <FloatingPiece piece="♚" delay={0} />
          <FloatingPiece piece="♛" delay={1.5} />
          <FloatingPiece piece="♞" delay={3} />
          <FloatingPiece piece="♝" delay={4.5} />
        </div>

        {/* Gold radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#D4AF37] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-[10px] text-[#D4AF37] tracking-[0.3em] block mb-3 uppercase">
              ♔ THE CHESSBOARD
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-bold uppercase tracking-tighter leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#D4AF37]">
                EVENT
              </span>
            </h1>
            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-bold uppercase tracking-tighter leading-none mt-1">
              <span
                style={{
                  WebkitTextStroke: "1.5px #D4AF37",
                  color: "transparent",
                }}
              >
                ARENA
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-[11px] text-[#8A8880] mt-6 tracking-wider max-w-xl"
          >
            // Every event is a chess piece on the CodeCell board. Each has its own
            opening strategy, time controls, and endgame conditions. Select your match.
          </motion.p>

          {/* Board coordinates decoration */}
          <div className="hidden md:flex absolute top-6 right-0 flex-col gap-3 font-mono text-[9px] text-[#2A2A2A] select-none">
            {["8", "7", "6", "5", "4", "3", "2", "1"].map((rank) => (
              <span key={rank} className="text-[#D4AF37]/20">{rank}</span>
            ))}
          </div>
        </div>

        {/* Gold Chess Notation Ticker */}
        <div className="mt-14 border-t border-b border-[#D4AF37]/15 py-2.5 overflow-hidden">
          <div className="flex animate-marquee-slow whitespace-nowrap gap-12 font-mono text-[10px] text-[#D4AF37]/40">
            {[...chessNotations, ...chessNotations].map((item, index) => (
              <span key={index} className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          FILTER TABS — Gold accent
          ======================================================== */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-10 select-none">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] text-[#D4AF37]/50 tracking-widest uppercase">
            FILTER_BY:
          </span>
          <div className="flex gap-2 font-mono text-[10px]">
            {(["ALL", "ACTIVE", "UPCOMING"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  px-4 py-1.5 border font-bold tracking-wider uppercase transition-all duration-200
                  ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] text-[#0A0A0A] border-[#D4AF37]"
                      : "bg-transparent text-[#8A8880] border-[#2A2A2A] hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                  }
                `}
              >
                [ {filter} ]
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          EVENT CARDS — Premium Black & Gold
          ======================================================== */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pb-24">
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link href={event.href}>
                  <div
                    className="group relative bg-[#0D0D0D] border border-[#1A1A1A] hover:border-[#D4AF37]/60 transition-all duration-500 overflow-hidden card-scanner cursor-pointer"
                    onMouseEnter={() => setHoveredEvent(event.id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    style={{
                      boxShadow:
                        hoveredEvent === event.id
                          ? "0 0 40px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.1)"
                          : "none",
                    }}
                  >
                    {/* Chess piece watermark */}
                    <div
                      className="absolute -right-6 -bottom-6 font-serif pointer-events-none select-none transition-all duration-700 group-hover:scale-110 group-hover:-translate-x-2 group-hover:-translate-y-2"
                      style={{
                        fontSize: "clamp(10rem, 20vw, 18rem)",
                        color: "#D4AF37",
                        opacity: hoveredEvent === event.id ? 0.06 : 0.02,
                      }}
                    >
                      {event.piece}
                    </div>

                    {/* Top gold accent glow */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="relative z-10 p-8 md:p-10">
                      {/* Top row: codename + status */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <span className="font-mono text-[9px] tracking-widest uppercase block mb-1 text-[#D4AF37]/70">
                            // {event.codename}
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F0EDE6] group-hover:text-[#F5E6A3] transition-colors">
                            {event.title}
                          </h2>
                          <span className="font-mono text-[11px] text-[#4A4A4A] mt-1 block">
                            {event.subtitle}
                          </span>
                        </div>

                        {/* Status badge */}
                        <div className="flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[9px] font-bold tracking-wider shrink-0 mt-1 border-[#D4AF37]/40 text-[#D4AF37]">
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#D4AF37]" />
                          {event.status.includes("ACTIVE") || event.status.includes("OPEN")
                            ? "LIVE"
                            : "UPCOMING"}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="font-sans text-xs text-[#8A8880] leading-relaxed mb-6 max-w-lg">
                        {event.desc}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[8px] font-bold tracking-widest px-2 py-0.5 border border-[#D4AF37]/15 text-[#D4AF37]/50 group-hover:border-[#D4AF37]/30 group-hover:text-[#D4AF37]/80 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-6 font-mono text-[10px] text-[#4A4A4A] mb-6">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={10} className="text-[#D4AF37]/60" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users size={10} className="text-[#D4AF37]/60" />
                          {event.participants} REGISTERED
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Swords size={10} className="text-[#D4AF37]/60" />
                          {event.format}
                        </span>
                      </div>

                      {/* Bottom bar */}
                      <div className="flex items-center justify-between pt-5 border-t border-[#D4AF37]/10">
                        <span className="font-mono text-[9px] text-[#3E3E3C]">
                          {event.notation}
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-widest transition-all group-hover:gap-3 text-[#D4AF37]">
                          ENTER MATCH <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ========================================================
          THE OPENING BOOK — MATCH SCHEDULE
          ======================================================== */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pb-24">
        <div className="relative mb-12">
          <span className="font-mono text-[11px] text-[#D4AF37] tracking-widest">
            [ OPENING BOOK ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight mt-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3]">
              MATCH SCHEDULE
            </span>
          </h2>
          <p className="font-mono text-[11px] text-[#4A4A4A] mt-3">
            // Upcoming fixtures in the CodeCell tournament calendar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, idx) => (
            <div
              key={event.id}
              className="relative border border-[#1A1A1A] bg-[#0D0D0D] p-6 group hover:border-[#D4AF37]/40 transition-all duration-300"
              style={{
                boxShadow: "0 0 0 0 rgba(212,175,55,0)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 30px rgba(212,175,55,0.06)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 0 0 rgba(212,175,55,0)")
              }
            >
              {/* Piece icon top-right */}
              <span
                className="absolute top-3 right-4 text-3xl font-serif select-none transition-transform duration-300 group-hover:scale-125 text-[#D4AF37] opacity-[0.12]"
              >
                {event.pieceAlt}
              </span>

              {/* Move number */}
              <span className="font-mono text-[9px] text-[#3E3E3C] block mb-3">
                MOVE {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Event codename */}
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider mb-1 text-[#D4AF37]">
                {event.codename}
              </h3>

              <h4 className="font-sans text-sm font-bold uppercase text-[#F0EDE6] tracking-tight mb-3 group-hover:text-[#F5E6A3] transition-colors">
                {event.title}
              </h4>

              {/* Date & Format */}
              <div className="space-y-2 font-mono text-[10px] text-[#4A4A4A]">
                <div className="flex items-center gap-2">
                  <Calendar size={10} className="text-[#D4AF37]/60" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={10} className="text-[#D4AF37]/60" />
                  {event.format}
                </div>
              </div>

              {/* Status pip */}
              <div className="mt-4 pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#3E3E3C]">
                  {event.status.includes("ACTIVE") || event.status.includes("OPEN")
                    ? "STATUS: LIVE"
                    : "STATUS: QUEUED"}
                </span>
                <span
                  className="w-2 h-2 rounded-full bg-[#D4AF37]"
                  style={{
                    boxShadow: "0 0 8px #D4AF37",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          PIECE MANIFEST — Know Your Pieces
          ======================================================== */}
      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pb-24">
        <div className="border border-[#D4AF37]/15 bg-[#0D0D0D] p-8 md:p-12 relative overflow-hidden">
          {/* Gold corner accent */}
          <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent" />
          <div className="absolute top-0 left-0 w-[1px] h-24 bg-gradient-to-b from-[#D4AF37] to-transparent" />
          <div className="absolute bottom-0 right-0 w-24 h-[1px] bg-gradient-to-l from-[#D4AF37] to-transparent" />
          <div className="absolute bottom-0 right-0 w-[1px] h-24 bg-gradient-to-t from-[#D4AF37] to-transparent" />

          <div className="mb-10">
            <span className="font-mono text-[11px] text-[#D4AF37] tracking-widest">
              [ PIECE MANIFEST ]
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mt-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3]">
                KNOW YOUR PIECES
              </span>
            </h2>
            <p className="font-mono text-[11px] text-[#4A4A4A] mt-2">
              // Every piece has a unique role on the board. Learn the movement patterns.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {events.map((event) => (
              <Link key={event.id} href={event.href}>
                <div className="text-center group cursor-pointer">
                  <div className="text-6xl sm:text-7xl font-serif mb-4 transition-transform duration-300 group-hover:scale-110 select-none text-[#D4AF37] opacity-[0.25] group-hover:opacity-[0.5]">
                    {event.piece}
                  </div>
                  <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase mb-1 text-[#D4AF37]">
                    {event.codename}
                  </h4>
                  <p className="font-sans text-[11px] text-[#4A4A4A] leading-relaxed group-hover:text-[#8A8880] transition-colors">
                    {event.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Board file labels */}
          <div className="flex justify-between mt-8 font-mono text-[9px] text-[#D4AF37]/15 select-none px-4">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((file) => (
              <span key={file}>{file}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom gold accent line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
    </div>
  );
}