"use client";

import { motion } from "framer-motion";

interface Sponsor {
  name: string;
  logo: string;
}

const sponsors: Sponsor[] = [
  {
    name: "Engaze",
    logo: "/sponsors/engaze.png",
  },
  {
    name: "VisionX",
    logo: "/sponsors/visionx.png",
  },
  {
    name: "Wolfram Alpha",
    logo: "/sponsors/wolfram.png",
  },
  {
    name: "CodeCrafters",
    logo: "/sponsors/codecrafters.png",
  },
];

export function Sponsors() {
  return (
    <section className="relative py-20 bg-[#02040A] text-white overflow-hidden border-t border-[#eab308]/20 select-none">
      {/* ── Ambient Gold Glow & Subtle Grid Pattern ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(234,179,8,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab30808_1px,transparent_1px),linear-gradient(to_bottom,#eab30808_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none opacity-40" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* ── Header ── */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-[#eab308]/10 border border-[#eab308]/30 text-[#eab308] font-mono text-xs uppercase tracking-[0.25em] mb-4"
          >
            [ OFFICIAL SPONSORS ]
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-sans font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight bg-gradient-to-r from-white via-[#f59e0b] to-[#eab308] bg-clip-text text-transparent"
          >
            OUR SPONSORS
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-zinc-400 font-sans text-sm sm:text-base max-w-lg mx-auto"
          >
            Big thanks to our sponsors for supporting TSEC CodeCell Weekly Challenges.
          </motion.p>
        </div>

        {/* ── Sponsor Cards Grid (Gold Cyberpunk Theme) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsors.map((sponsor, idx) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group relative bg-[#07090E]/90 border border-[#eab308]/30 rounded-2xl p-6 hover:border-[#eab308] hover:shadow-[0_0_35px_rgba(234,179,8,0.3)] transition-all duration-300 flex flex-col items-center justify-center text-center"
            >
              {/* Top Gold Bar Highlight on Hover */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#eab308] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_12px_#eab308]" />

              {/* White Contrast Logo Card inside Gold Cyber Container */}
              <div className="h-28 w-full bg-white rounded-xl p-4 flex items-center justify-center mb-5 border-2 border-[#eab308]/20 group-hover:border-[#eab308] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.25)] transition-all duration-300">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-h-20 max-w-[90%] object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Sponsor Name in Gold / White */}
              <span className="font-mono text-sm font-black tracking-wider uppercase text-zinc-200 group-hover:text-[#eab308] transition-colors">
                {sponsor.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
