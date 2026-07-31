"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import HomeSections from "@/components/sections/HomeSections";

export default function Home() {
  const { isAuthenticated } = useAuth();
  // Rich density of 70 glowing star dots across the background canvas
  const glowingStars = [
    { x: '4%',  y: '8%',  s: 2.2, color: '#4BE2C4', opacity: 0.8, dur: 3.1, delay: 0 },
    { x: '12%', y: '16%', s: 1.5, color: '#E8FF00', opacity: 0.9, dur: 4.2, delay: 0.8 },
    { x: '19%', y: '6%',  s: 2.8, color: '#FFFFFF', opacity: 0.7, dur: 2.9, delay: 1.5 },
    { x: '25%', y: '22%', s: 1.8, color: '#4BE2C4', opacity: 0.85, dur: 3.7, delay: 0.3 },
    { x: '33%', y: '10%', s: 2.5, color: '#E8FF00', opacity: 0.95, dur: 4.5, delay: 1.1 },
    { x: '41%', y: '18%', s: 1.2, color: '#FFFFFF', opacity: 0.75, dur: 3.3, delay: 0.6 },
    { x: '49%', y: '7%',  s: 3.0, color: '#4BE2C4', opacity: 0.8, dur: 2.8, delay: 1.9 },
    { x: '57%', y: '14%', s: 1.6, color: '#E8FF00', opacity: 0.9, dur: 4.0, delay: 0.2 },
    { x: '64%', y: '5%',  s: 2.2, color: '#FFFFFF', opacity: 0.85, dur: 3.5, delay: 1.4 },
    { x: '72%', y: '20%', s: 2.8, color: '#4BE2C4', opacity: 0.7, dur: 3.0, delay: 0.9 },
    { x: '81%', y: '11%', s: 1.5, color: '#E8FF00', opacity: 0.95, dur: 4.3, delay: 1.7 },
    { x: '89%', y: '17%', s: 2.5, color: '#FFFFFF', opacity: 0.8, dur: 2.7, delay: 0.4 },
    { x: '96%', y: '9%',  s: 1.8, color: '#4BE2C4', opacity: 0.75, dur: 3.9, delay: 1.2 },

    { x: '6%',  y: '32%', s: 1.8, color: '#E8FF00', opacity: 0.85, dur: 3.4, delay: 1.0 },
    { x: '14%', y: '40%', s: 2.6, color: '#FFFFFF', opacity: 0.7, dur: 4.1, delay: 0.5 },
    { x: '22%', y: '30%', s: 1.5, color: '#4BE2C4', opacity: 0.9, dur: 2.6, delay: 1.6 },
    { x: '30%', y: '38%', s: 3.0, color: '#E8FF00', opacity: 0.8, dur: 3.8, delay: 0.1 },
    { x: '37%', y: '28%', s: 2.0, color: '#FFFFFF', opacity: 0.85, dur: 4.4, delay: 1.3 },
    { x: '62%', y: '33%', s: 2.4, color: '#4BE2C4', opacity: 0.75, dur: 3.2, delay: 0.7 },
    { x: '70%', y: '29%', s: 1.6, color: '#E8FF00', opacity: 0.9, dur: 3.6, delay: 1.8 },
    { x: '78%', y: '37%', s: 2.8, color: '#FFFFFF', opacity: 0.8, dur: 2.9, delay: 0.3 },
    { x: '86%', y: '31%', s: 1.4, color: '#4BE2C4', opacity: 0.85, dur: 4.0, delay: 1.1 },
    { x: '94%', y: '42%', s: 2.2, color: '#E8FF00', opacity: 0.9, dur: 3.3, delay: 0.8 },

    { x: '3%',  y: '56%', s: 2.5, color: '#4BE2C4', opacity: 0.8, dur: 3.7, delay: 0.2 },
    { x: '11%', y: '64%', s: 1.6, color: '#E8FF00', opacity: 0.9, dur: 4.2, delay: 1.4 },
    { x: '18%', y: '50%', s: 2.0, color: '#FFFFFF', opacity: 0.75, dur: 3.0, delay: 0.9 },
    { x: '26%', y: '60%', s: 2.8, color: '#4BE2C4', opacity: 0.85, dur: 3.5, delay: 1.7 },
    { x: '34%', y: '52%', s: 1.4, color: '#E8FF00', opacity: 0.95, dur: 2.8, delay: 0.4 },
    { x: '66%', y: '55%', s: 3.0, color: '#FFFFFF', opacity: 0.8, dur: 4.1, delay: 1.0 },
    { x: '74%', y: '47%', s: 1.8, color: '#4BE2C4', opacity: 0.75, dur: 3.4, delay: 0.6 },
    { x: '82%', y: '61%', s: 2.5, color: '#E8FF00', opacity: 0.9, dur: 2.7, delay: 1.3 },
    { x: '90%', y: '53%', s: 1.5, color: '#FFFFFF', opacity: 0.8, dur: 3.9, delay: 0.1 },
    { x: '97%', y: '65%', s: 2.2, color: '#4BE2C4', opacity: 0.85, dur: 4.3, delay: 1.5 },

    { x: '5%',  y: '78%', s: 1.6, color: '#E8FF00', opacity: 0.9, dur: 3.2, delay: 0.8 },
    { x: '13%', y: '86%', s: 2.8, color: '#FFFFFF', opacity: 0.75, dur: 4.0, delay: 0.3 },
    { x: '21%', y: '74%', s: 2.0, color: '#4BE2C4', opacity: 0.85, dur: 2.9, delay: 1.6 },
    { x: '29%', y: '88%', s: 1.4, color: '#E8FF00', opacity: 0.95, dur: 3.6, delay: 1.1 },
    { x: '38%', y: '76%', s: 2.5, color: '#FFFFFF', opacity: 0.8, dur: 4.4, delay: 0.5 },
    { x: '46%', y: '89%', s: 1.8, color: '#4BE2C4', opacity: 0.75, dur: 3.1, delay: 1.7 },
    { x: '54%', y: '77%', s: 2.2, color: '#E8FF00', opacity: 0.9, dur: 3.8, delay: 0.2 },
    { x: '62%', y: '87%', s: 3.0, color: '#FFFFFF', opacity: 0.8, dur: 2.8, delay: 1.2 },
    { x: '71%', y: '75%', s: 1.5, color: '#4BE2C4', opacity: 0.85, dur: 4.2, delay: 0.7 },
    { x: '79%', y: '88%', s: 2.6, color: '#E8FF00', opacity: 0.95, dur: 3.3, delay: 1.9 },
    { x: '87%', y: '79%', s: 1.8, color: '#FFFFFF', opacity: 0.75, dur: 3.7, delay: 0.4 },
    { x: '95%', y: '85%', s: 2.4, color: '#4BE2C4', opacity: 0.8, dur: 2.9, delay: 1.0 },

    { x: '16%', y: '95%', s: 2.0, color: '#4BE2C4', opacity: 0.85, dur: 3.5, delay: 0.6 },
    { x: '42%', y: '96%', s: 1.5, color: '#E8FF00', opacity: 0.9, dur: 4.1, delay: 1.3 },
    { x: '68%', y: '94%', s: 2.5, color: '#FFFFFF', opacity: 0.8, dur: 3.0, delay: 0.1 },
    { x: '84%', y: '96%', s: 1.8, color: '#4BE2C4', opacity: 0.75, dur: 3.8, delay: 1.5 },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#050907] text-[#F0EDE6]">

      {/* ========================================================
          1. HERO SECTION — CodeCell Glowing Starfield Backdrop
          ======================================================== */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 py-20 overflow-hidden bg-[#050907]">

        {/* ========== SOFT AMBIENT RADIAL LIGHTING ========== */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0 pointer-events-none select-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 38%, rgba(75, 226, 196, 0.15) 0%, rgba(232, 255, 0, 0.08) 32%, rgba(5, 9, 7, 0.8) 70%, #050907 100%)'
          }}
        />

        {/* Dynamic Animated Glow Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#4BE2C4]/10 pointer-events-none animate-[ping_10s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#E8FF00]/5 pointer-events-none" />

        {/* ========== RICH DENSITY OF GLOWING TWINKLING STARS ========== */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute inset-0 z-[1] pointer-events-none select-none overflow-hidden"
        >
          {glowingStars.map((s, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: s.x,
                top: s.y,
                width: `${s.s}px`,
                height: `${s.s}px`,
                backgroundColor: s.color,
              }}
              animate={{
                opacity: [s.opacity * 0.25, s.opacity, s.opacity * 0.25],
                scale: [0.8, 1.4, 0.8],
                boxShadow: [
                  `0 0 4px ${s.color}`,
                  `0 0 14px 3px ${s.color}`,
                  `0 0 4px ${s.color}`,
                ],
              }}
              transition={{
                duration: s.dur,
                repeat: Infinity,
                delay: s.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Delicate Tech Grid Overlay */}
        <div 
          className="absolute inset-0 z-[1] pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #4BE2C4 1px, transparent 1px), linear-gradient(to bottom, #4BE2C4 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* ========== MAIN HERO CONTENT CONTAINER ========== */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto w-full">

          {/* ----- CLEAN FLOATING LOGO WITH SOFT NATURAL AMBIENT LIGHT ----- */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-6 group cursor-pointer flex items-center justify-center"
          >
            {/* Soft, delicate backlight glow */}
            <div className="absolute w-40 h-40 rounded-full bg-[#4BE2C4]/20 blur-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Floating Logo */}
            <Image
              src="/logo.png"
              alt="CodeCell Logo"
              width={120}
              height={120}
              className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain drop-shadow-[0_0_20px_rgba(75,226,196,0.5)] group-hover:drop-shadow-[0_0_35px_rgba(75,226,196,0.85)] transition-all duration-500 group-hover:scale-[1.05]"
              priority
            />
          </motion.div>

          {/* ----- MAIN TITLE (SUBTLE ELEGANT 2 LINES: TSEC / CODECELL) ----- */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center"
          >
            <h1 className="font-orbitron flex flex-col items-center leading-[0.92] uppercase select-none">
              {/* TSEC in Refined Muted Yellow */}
              <motion.span 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-widest text-[#F3F5B8] drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] hover:tracking-[0.18em] transition-all duration-500"
              >
                TSEC
              </motion.span>
              {/* CODECELL in Refined Teal-Green */}
              <motion.span 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#E8FF00] via-[#4BE2C4] to-[#20C997] drop-shadow-[0_4px_30px_rgba(75,226,196,0.3)] mt-1 sm:mt-2 hover:brightness-110 transition-all duration-500"
              >
                CODECELL
              </motion.span>
            </h1>

            {/* Delicate Accent Divider Line with Glowing Dot */}
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center w-36 sm:w-56 md:w-72 my-7" 
            >
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#4BE2C4]/60 to-transparent" />
              <div className="absolute w-2 h-2 rounded-full bg-[#E8FF00] shadow-[0_0_10px_#E8FF00]" />
            </motion.div>

            {/* Tagline */}
            <motion.p 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-xs sm:text-sm font-mono text-[#A0B2AA] tracking-[0.25em] uppercase flex items-center gap-3"
            >
              <span>Build</span>
              <span className="text-[#E8FF00]">•</span>
              <span>Innovate</span>
              <span className="text-[#4BE2C4]">•</span>
              <span>Lead</span>
            </motion.p>
          </motion.div>

          {/* ----- SUBTLE, HUMAN-DESIGNED FIERY ORANGE BUTTON ----- */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.82, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 sm:mt-12 flex justify-center items-center w-full"
          >
            <Link
              href={isAuthenticated ? "/events/weekly-challenges/timeline" : "/events/weekly-challenges"}
              className="relative group inline-flex items-center justify-center font-mono text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-all duration-300"
            >
              {/* Organic, subtle burnt orange shadow */}
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF5500]/30 to-[#E8FF00]/20 blur-lg group-hover:blur-xl group-hover:from-[#FF5500]/50 group-hover:to-[#E8FF00]/40 transition-all duration-300"
              />

              {/* Sleek, human-crafted pill button */}
              <div className="relative z-10 flex items-center justify-center px-7 sm:px-9 py-3.5 rounded-full bg-[#0E0604] border border-[#FF5500]/60 group-hover:border-[#FF7700] text-white transition-all duration-300 shadow-[0_4px_25px_rgba(255,85,0,0.25)] group-hover:shadow-[0_4px_35px_rgba(255,85,0,0.5)] group-hover:scale-[1.02]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] mr-3 animate-pulse shadow-[0_0_8px_#FF5500]" />
                <span className="text-[#F0EDE6] group-hover:text-white font-extrabold transition-colors">
                  {isAuthenticated ? "GO TO TIMELINE" : "REGISTRATIONS FOR WEEKLY CHALLENGES LIVE NOW"}
                </span>
                <span className="text-[#FF7700] ml-2 group-hover:translate-x-1.5 transition-transform duration-300 font-bold">→</span>
              </div>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ========================================================
          2. REST OF HOME SECTIONS
          ======================================================== */}
      <HomeSections />
    </div>
  );
}
