"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});


function useTypewriter(text: string, speed: number, start: boolean, startDelay: number = 0): string {
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (!start) return;
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setOutput(text.slice(0, i));
        if (i >= text.length && interval) {
          clearInterval(interval);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [start]);

  return output;
}

const TERMINAL_SCRIPT =
  "$ whoami\n> tsec_codecell\n$ cat mission.log\n> ship code. build guild.\n$ status --guild\n> 500+ builders \u00b7 est. 2023\n$ _";

function TerminalPanel({ start }: { start: boolean }) {
  const typed = useTypewriter(TERMINAL_SCRIPT, 16, start, 900);
  const lines = typed.split("\n");

  return (
    <div className="relative rounded-lg border border-[#222222] bg-[#0F0F10] shadow-[0_0_50px_rgba(75,226,196,0.07)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1C1C1C] bg-[#131313]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#4BE2C4]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#E8FF00]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#B388FF]" />
        <span className="ml-2 font-mono text-[10px] text-[#5c5a52] tracking-wider">guild.sh</span>
      </div>
      <div className="px-4 py-5 sm:px-5 sm:py-6 font-mono text-[11px] sm:text-xs leading-relaxed min-h-[172px] sm:min-h-[192px]">
        {lines.map((line, idx) => {
          const isCommand = line.startsWith("$");
          const isOutput = line.startsWith(">");
          const isLast = idx === lines.length - 1;
          return (
            <div key={idx} className={isCommand ? "text-[#F0EDE6]" : isOutput ? "text-[#4BE2C4]" : "text-[#8A8880]"}>
              {line}
              {isLast && (
                <span
                  aria-hidden
                  className="inline-block w-[6px] h-[12px] ml-0.5 bg-[#4BE2C4] align-middle animate-[hero-blink_1.1s_steps(1)_infinite]"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AboutHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const headline = useTypewriter("WHO WE ARE", 70, mounted, 450);

  return (
    <section className="relative min-h-[calc(100svh-72px)] flex items-center overflow-hidden border-b border-[#1A1A1A] bg-[#0A0A0B] py-16 md:py-0">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#4BE2C4 1px, transparent 1px), linear-gradient(90deg, #4BE2C4 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 20% 40%, rgba(75,226,196,0.10), transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 10 }}
              transition={{ duration: 0.6 }}
              className={`${orbitron.className} inline-flex items-center gap-2 text-[12px] md:text-[13px] tracking-[0.35em] text-[#4BE2C4] uppercase mb-6`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF00] shadow-[0_0_6px_#E8FF00] animate-pulse" />
              Dive Into CodeCell
            </motion.div>

            <h1
              className={`${orbitron.className} font-bold uppercase whitespace-nowrap text-[#F0EDE6] leading-[0.95] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-7xl 2xl:text-7xl min-h-[1.05em]`}
            >
              <span className="bg-gradient-to-r from-[#4BE2C4] to-[#E8FF00] bg-clip-text text-transparent">
                {headline}
              </span>
              <span
                aria-hidden
                className="inline-block w-[3px] md:w-1 ml-1 bg-[#4BE2C4] align-middle animate-[hero-blink_1.1s_steps(1)_infinite]"
                style={{ height: "0.62em" }}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 10 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className={`${orbitron.className} mt-6 text-xs md:text-base font-medium text-[#8A8880] leading-relaxed max-w-md mx-auto lg:mx-0`}
            >
              The engineering guild behind TSEC&apos;s sandboxes, hackathons, and the code that ships.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: mounted ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
              className="h-px w-20 md:w-24 mt-9 bg-gradient-to-r from-[#4BE2C4] to-transparent mx-auto lg:mx-0"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 16 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full max-w-sm mx-auto lg:mx-0"
          >
            <TerminalPanel start={mounted} />
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#mission"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-7 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#8A8880] hover:text-[#4BE2C4] transition-colors"
        aria-label="Scroll to mission"
      >
        <span className={`${orbitron.className} text-[9px] tracking-[0.3em] uppercase`}>Scroll</span>
        <ArrowDown size={16} className="animate-bounce [animation-duration:2s]" />
      </motion.a>

      <style jsx>{`
        @keyframes hero-blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}