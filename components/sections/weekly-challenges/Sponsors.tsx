"use client";

import { motion } from "framer-motion";
import { Sparkles, Award, ShieldCheck } from "lucide-react";

interface Sponsor {
  name: string;
  category: string;
  logo: string;
  description?: string;
  lightBg?: boolean;
}

const featuredSponsors: Sponsor[] = [
  {
    name: "Engaze",
    category: "Career Partner",
    logo: "/sponsors/engaze.png",
    description: "Your official career partner empowering students with placement preparation and tech roles.",
    lightBg: true,
  },
  {
    name: "VisionX",
    category: "Tech Sponsor",
    logo: "/sponsors/visionx.png",
    description: "Empowering Next-Gen AI & Visual Intelligence solutions for competitive developers.",
    lightBg: true,
  },
  {
    name: "Wolfram Alpha",
    category: "Computation & AI Partner",
    logo: "/sponsors/wolfram.png",
    description: "Computational intelligence & mathematical algorithms platform.",
    lightBg: true,
  },
  {
    name: "CodeCrafters",
    category: "Dev Platform Partner",
    logo: "/sponsors/codecrafters.png",
    description: "Practice building complex software systems from scratch with real-world feedback.",
    lightBg: true,
  },
];

const ecosystemSponsors: Sponsor[] = [
  { name: "Devfolio", category: "Hackathon Partner", logo: "/sponsors/devfolio.png", lightBg: true },
  { name: "Polygon", category: "Web3 Infrastructure", logo: "/sponsors/polygon.png", lightBg: true },
  { name: "ETHIndia", category: "Ecosystem Partner", logo: "/sponsors/ethindia.png", lightBg: true },
  { name: "GitHub", category: "Developer Tools", logo: "/sponsors/github.png", lightBg: true },
  { name: "Postman", category: "API Platform", logo: "/sponsors/postman.png", lightBg: true },
  { name: "Replit", category: "Cloud IDE", logo: "/sponsors/replit.png", lightBg: true },
  { name: "Appwrite", category: "Backend Platform", logo: "/sponsors/appwrite.png", lightBg: true },
  { name: "FOSS United", category: "Open Source", logo: "/sponsors/foss.png", lightBg: true },
  { name: "Orkes", category: "Workflow Orchestration", logo: "/sponsors/orkes.png", lightBg: true },
  { name: "Patil Kaki", category: "Snacks Partner", logo: "/sponsors/patilkaki.png", lightBg: true },
  { name: "Smaaash", category: "Entertainment Partner", logo: "/sponsors/smaaash.png", lightBg: true },
  { name: "JDoodle", category: "Online Compiler", logo: "/sponsors/jdoodle.png", lightBg: true },
  { name: "Crosscope", category: "HealthTech Partner", logo: "/sponsors/crosscope.png", lightBg: true },
  { name: "ScrollConnect", category: "Community Partner", logo: "/sponsors/scrollconnect.png", lightBg: true },
];

export function Sponsors() {
  return (
    <section className="relative py-20 bg-[#02040A] text-white overflow-hidden border-t border-[#eab308]/15 select-none">
      {/* ── Background Glow & Cyber Grid ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab30805_1px,transparent_1px),linear-gradient(to_bottom,#eab30805_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* ── Header ── */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eab308]/10 border border-[#eab308]/30 text-[#eab308] font-mono text-xs uppercase tracking-[0.25em] mb-4"
          >
            <Sparkles size={14} />
            <span>OUR SPONSORS & PARTNERS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-sans font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white"
          >
            POWERED BY INDUSTRY LEADERS
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-zinc-400 font-sans text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Proudly backed by top tech innovators, career platforms, and engineering organizations supporting TSEC CodeCell.
          </motion.p>
        </div>

        {/* ── Featured Main Sponsors ── */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8 border-b border-[#eab308]/20 pb-3">
            <Award className="text-[#eab308]" size={20} />
            <h3 className="font-mono font-extrabold text-sm uppercase tracking-[0.2em] text-[#eab308]">
              FEATURED TITLE & CAREER PARTNERS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSponsors.map((sponsor, idx) => (
              <motion.div
                key={sponsor.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-[#07090E]/90 border border-[#eab308]/30 rounded-2xl p-6 hover:border-[#eab308] hover:shadow-[0_0_35px_rgba(234,179,8,0.25)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Ambient Top Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#eab308] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Category Pill */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-3 py-1 rounded-md bg-[#eab308]/15 border border-[#eab308]/30 font-mono text-[10px] font-bold text-[#eab308] uppercase tracking-wider">
                      {sponsor.category}
                    </span>
                    <ShieldCheck size={16} className="text-[#eab308]/60 group-hover:text-[#eab308] transition-colors" />
                  </div>

                  {/* Logo Container with Clean Bright Card */}
                  <div className="h-28 w-full bg-white rounded-xl p-4 flex items-center justify-center mb-6 shadow-inner border border-white/20 group-hover:scale-[1.02] transition-transform duration-300">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-h-20 max-w-[90%] object-contain"
                    />
                  </div>

                  {/* Sponsor Name & Description */}
                  <h4 className="font-sans font-bold text-lg text-white mb-2 group-hover:text-[#eab308] transition-colors">
                    {sponsor.name}
                  </h4>
                  <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                    {sponsor.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Official Ecosystem & Community Partners Grid ── */}
        <div>
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-3">
            <Sparkles className="text-zinc-400" size={18} />
            <h3 className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-zinc-400">
              OFFICIAL ECOSYSTEM & SWAG SPONSORS
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {ecosystemSponsors.map((sponsor, idx) => (
              <motion.div
                key={sponsor.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="group bg-white rounded-xl p-3 flex flex-col items-center justify-center hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all duration-300 border border-white/20 hover:scale-105"
              >
                <div className="h-12 w-full flex items-center justify-center mb-1">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-10 max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="font-mono text-[9px] font-bold text-zinc-700 group-hover:text-black truncate w-full text-center transition-colors">
                  {sponsor.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
