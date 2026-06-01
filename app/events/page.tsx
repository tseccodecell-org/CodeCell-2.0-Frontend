"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Terminal, Activity, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const options = [
  { 
    label: "TSEC HACKS", 
    value: "/tsec-hacks", 
    desc: "Our flagship 48-hour national level hackathon sprint." 
  },
  { 
    label: "WEEKLY CHALLENGES", 
    value: "/challenges", 
    desc: "Solve programming puzzles, practice coding, and climb the scoreboard." 
  },
];

export default function EventsPortalPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<typeof options[0] | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSelect = (option: typeof options[0]) => {
    setSelectedOption(option);
    setIsOpen(false);
    setIsRedirecting(true);
    
    // Simulate connection delay for premium feel
    setTimeout(() => {
      router.push(option.value);
    }, 1500);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12 md:py-24 max-w-7xl mx-auto select-none">
      <div className="relative w-full max-w-md bg-[#141414] border border-[#2A2A2A] p-8 md:p-10 card-scanner">
        {/* Cyberpunk corner decorations */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#E8FF00]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#E8FF00]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#E8FF00]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#E8FF00]" />

        {/* Header */}
        <div className="mb-8 border-b border-[#2A2A2A] pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={14} className="text-[#E8FF00] animate-pulse" />
            <span className="font-mono text-[10px] text-[#E8FF00] tracking-[0.2em]">02 — JOURNAL / ROUTER</span>
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-[#F0EDE6]">
            EVENT PORTAL
          </h1>
          <p className="font-mono text-[10px] text-[#4A4A4A] mt-2 leading-relaxed">
            // Select a sub-system pathway below to initialize secure connection.
          </p>
        </div>

        {/* Dropdown Container */}
        <div className="relative mb-8">
          <span className="block font-mono text-[9px] text-[#4A4A4A] mb-2 uppercase tracking-wider">
            [ REQUESTED_ROUTE ]
          </span>
          <button
            onClick={() => !isRedirecting && setIsOpen(!isOpen)}
            disabled={isRedirecting}
            className={`
              w-full
              flex
              items-center
              justify-between
              bg-[#0D0D0D]
              border
              px-4
              py-3.5
              font-mono
              text-xs
              font-bold
              tracking-wider
              transition-all
              duration-300
              ${isRedirecting ? "border-[#1A1A1A] text-[#222222] cursor-not-allowed" : "border-[#2A2A2A] text-[#F0EDE6] hover:border-[#4BE2C4] cursor-pointer"}
            `}
          >
            <span>{selectedOption ? `[ ${selectedOption.label} ]` : "[ SELECT PORTAL DESTINATION ]"}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#0D0D0D] border border-[#2A2A2A] z-[500] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.9)] divide-y divide-[#1A1A1A]"
              >
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt)}
                    className="
                      w-full
                      text-left
                      p-4
                      transition-colors
                      duration-200
                      hover:bg-[#141414]
                      group
                      cursor-pointer
                    "
                  >
                    <div className="font-mono text-xs font-bold text-[#F0EDE6] group-hover:text-[#E8FF00] flex items-center justify-between">
                      <span>[ {opt.label} ]</span>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#E8FF00]" />
                    </div>
                    <p className="font-sans text-[11px] text-[#4A4A4A] mt-1.5 leading-relaxed group-hover:text-[#666666]">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status System */}
        <div className="border-t border-[#1D1D1D] pt-6 font-mono text-[10px] text-[#4A4A4A]">
          <AnimatePresence mode="wait">
            {isRedirecting ? (
              <motion.div
                key="redirecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-[#4BE2C4]">
                  <span className="flex items-center gap-1.5">
                    <Activity size={10} className="animate-pulse" />
                    STATUS: LINKING SYSTEM...
                  </span>
                  <span>78%</span>
                </div>
                <div className="h-[2px] bg-[#1A1A1A] w-full overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 1.3, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-[#4BE2C4] to-[#E8FF00] w-full"
                  />
                </div>
                <p className="text-[9px] text-[#4A4A4A] animate-pulse">
                  &gt; Initializing connection handshake with {selectedOption?.value}...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between"
              >
                <span>STATUS: IDLE // AWAITING ROUTE</span>
                <span className="h-1.5 w-1.5 bg-[#4A4A4A] rounded-full animate-ping" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}