"use client";

import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

const IconCash = () => (
  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full text-white/90">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
    <div className="absolute bottom-[-2px] right-[-2px] bg-[#070707] rounded-full p-0.5">
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" className="w-5 h-5 md:w-6 md:h-6">
        <circle cx="12" cy="12" r="6" />
        <path d="M12 9v6" />
        <path d="M10 10.5h4" />
        <path d="M10 13.5h4" />
      </svg>
    </div>
  </div>
);

const IconCertificate = () => (
  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full text-white/90">
      <rect x="3" y="4" width="14" height="16" rx="2" />
      <line x1="7" y1="8" x2="13" y2="8" />
      <line x1="7" y1="12" x2="13" y2="12" />
      <line x1="7" y1="16" x2="10" y2="16" />
    </svg>
    <div className="absolute bottom-0 right-0 md:bottom-1 md:right-1 bg-[#070707] rounded-full p-0.5">
      <svg viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" className="w-5 h-5 md:w-6 md:h-6">
        <circle cx="12" cy="10" r="4" />
        <path d="M10 14l-2 4 4-1 4 1-2-4" />
      </svg>
    </div>
  </div>
);

const IconBriefcase = () => (
  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full text-white/90">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-1">
      <div className="w-4 h-2.5 border-2 border-[#eab308] rounded-[2px]" />
    </div>
  </div>
);

const IconCard = () => (
  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full text-white/90">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 14h.01" />
      <path d="M10 14h2" />
      {/* Crown/M shape accent for realism */}
      <path d="M4 6l2 2 2-2" className="stroke-white/30" />
    </svg>
    <div className="absolute bottom-[-2px] right-[-2px] bg-[#070707] rounded-full p-0.5">
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" className="w-5 h-5 md:w-6 md:h-6">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </div>
  </div>
);

const PRIZES = [
  { rank: "20K", title: "PRIZE POOL", color: "#eab308", desc: "Direct cash rewards distributed to the top winners.", Icon: IconCash },
  { rank: "PAID", title: "EXCLUSIVE INTERNSHIPS", color: "#eab308", desc: "Fast-track internship opportunities for the Top 20 performers.", Icon: IconBriefcase },
  { rank: "REWARDS", title: "CERTIFICATES FOR TOP PARTICIPANTS", color: "#eab308", desc: "Official Certificates of Excellence to boost your resume and LinkedIn profile.", Icon: IconCertificate },
  { rank: "1LAKH+", title: "WORTH PREMIUM SUBSCRIPTIONS", color: "#eab308", desc: "Free access to top-tier developer tools, platforms, and learning resources.", Icon: IconCard },
];

export function Prizes() {
  return (
    <section className="relative py-16 sm:py-24 bg-[#050505] overflow-hidden border-b border-[#eab308]/20">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          backgroundPosition: 'center center'
        }}
      />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#eab308]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <span className="text-[#eab308] font-mono text-xs md:text-sm tracking-widest uppercase font-bold drop-shadow-md">
            // PERKS_OF_WINNING_AND_PRIZES
          </span>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl leading-tight text-white ${playfair.className} drop-shadow-lg`}>
            Prizes & Perks for the <br className="hidden md:block" />Ultimate Tacticians.
          </h2>
        </motion.div>

        {/* Prizes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {PRIZES.map((prize, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative overflow-hidden bg-[#070707] border border-[#1A1A1A] p-6 md:p-10 flex flex-col sm:flex-row items-start text-left group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl gap-6 md:gap-8"
            >
              {/* Colored Top Accent Line */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2"
                style={{ backgroundColor: prize.color }}
              />
              
              <div className="mt-1 sm:mt-2">
                <prize.Icon />
              </div>
              
              <div className="flex flex-col flex-1">
                {prize.rank ? (
                  <div 
                    className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 font-mono tracking-tighter break-words"
                    style={{ color: prize.color }}
                  >
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity text-white/50">&gt;</span>
                    {prize.rank}
                    <span className="animate-pulse opacity-80 group-hover:opacity-100 transition-opacity text-white/50">_</span>
                  </div>
                ) : null}
                <h3 className={`text-sm md:text-base font-bold mb-3 text-white font-mono uppercase tracking-[0.1em] ${!prize.rank ? 'mt-1 sm:mt-2 md:mt-4 text-lg md:text-xl' : ''}`}>
                  {prize.title}
                </h3>
                <p className="text-[#8A8A8A] text-xs md:text-sm leading-relaxed md:leading-loose">
                  {prize.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

