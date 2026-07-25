"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  { q: "What are Weekly Challenges?", a: "Weekly Challenges is a 6-week competitive programming league hosted by TSEC CodeCell, starting August 2, 2026. Every Sunday at 4:00 PM, a new problem is released with a 30-plus-hour window for participants to solve, earn XP, and climb the leaderboard. The top 20 performers advance to an offline 3-hour finale at TSEC, Bandra, where all qualifiers become eligible for internship opportunities with hiring partners." },
  { q: "How long is the competition?", a: "The competition consists of a 6-week online league where one problem is released every week, followed by a 3-hour offline finale for the top 20 participants. In total, the online phase spans 6 weeks, culminating in the 3-hour onsite contest at TSEC, Bandra." },
  { q: "Can beginners participate?", a: "Yes, students of all skill levels are welcome to participate. The event is designed to foster learning, and detailed editorials are published after every submission window so beginners can learn from each solution." },
  { q: "How is ranking calculated?", a: "In Round 1, rankings are determined by a dynamic XP system where participants earn XP based on their submission performance, consistency across all six weeks, and relative rank on the leaderboard. Every weekly problem contributes to your overall score, and the live leaderboard updates periodically throughout the league.For the final rankings and overall champions, everything is decided by your performance during the 3-hour onsite coding contest in Round 2." },
  { q: "When are solutions released?", a: "Solutions and editorials are released immediately after the weekly submission window closes every Monday at 11:59 PM. Once published, participants can continue submitting solutions for learning and practice, though post-window submissions will not count toward XP or leaderboard rankings." },
  { q: "Can I discuss solutions?", a: "To ensure fair play, discussing, sharing, or copying solutions during an active submission window (Sunday 4:00 PM to Monday 11:59 PM) is strictly prohibited and can result in disqualification. Once the window closes and editorials are published, open discussion and learning with the community are highly encouraged!" },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 bg-[#02040A] overflow-hidden border-b border-[#eab308]/20">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          backgroundPosition: 'center center'
        }}
      />

      <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-gold font-mono text-sm tracking-widest uppercase">
            // FAQ
          </span>
          <div className="h-[1px] w-24 md:w-64 bg-gradient-to-r from-gold/30 to-transparent" />
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden bg-[#070707] transition-all duration-300 border ${isOpen ? 'border-[#eab308]/30 shadow-[0_4px_20px_rgba(234,179,8,0.05)]' : 'border-[#1A1A1A] hover:border-[#eab308]/20'}`}
              >
                {/* Active Left Accent Line */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#eab308] transition-transform duration-300 origin-top" 
                  style={{ transform: isOpen ? 'scaleY(1)' : 'scaleY(0)' }}
                />

                <button 
                  className="w-full px-6 md:px-8 py-6 text-left flex justify-between items-center group"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <span className={`text-[18px] md:text-[20px] text-[#eab308] drop-shadow-sm transition-transform duration-300 ${isOpen ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {"♟\uFE0E"}
                    </span>
                    <span className={`font-mono text-[14px] md:text-[16px] tracking-wide transition-colors duration-300 ${isOpen ? 'text-white' : 'text-[#8A8A8A] group-hover:text-white'}`}>
                      {faq.q}
                    </span>
                  </div>
                  <span className={`text-2xl font-mono shrink-0 ml-4 font-light transition-transform duration-500 flex items-center justify-center ${isOpen ? 'rotate-45 text-[#eab308]' : 'text-[#444] group-hover:text-[#eab308]'}`}>
                    +
                  </span>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 md:px-8 pb-8 pt-2 md:pl-[4.5rem] pl-[3.5rem] text-[#A0A0A0] text-[13px] md:text-[15px] leading-relaxed border-t border-[#1A1A1A] bg-[#050505]">
                        <div className="pt-6 flex gap-4">
                          <span className="text-[#eab308] font-mono text-xs opacity-70 shrink-0 mt-1">
                            // A:
                          </span>
                          <span className="font-mono">
                            {faq.a}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
