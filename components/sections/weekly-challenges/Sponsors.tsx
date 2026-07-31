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
    <section className="relative py-16 bg-[#02040A] text-white overflow-hidden border-t border-white/10 select-none">
      {/* Soft Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.06),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-white"
          >
            OUR SPONSORS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-zinc-400 font-sans text-sm sm:text-base max-w-lg mx-auto"
          >
            Big thanks to our sponsors for supporting TSEC CodeCell Weekly Challenges.
          </motion.p>
        </div>

        {/* Sponsor Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sponsors.map((sponsor, idx) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group relative bg-[#07090E] border border-white/10 rounded-2xl p-6 hover:border-[#eab308]/60 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all duration-300 flex flex-col items-center justify-center text-center"
            >
              {/* Clean White Card for Crisp Logo Visibility */}
              <div className="h-24 w-full bg-white rounded-xl p-4 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-h-16 max-w-[85%] object-contain"
                />
              </div>

              <span className="font-sans font-bold text-sm text-zinc-300 group-hover:text-white transition-colors">
                {sponsor.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
