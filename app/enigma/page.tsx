"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Key, Terminal, ArrowRight, HelpCircle } from "lucide-react";
import { ReactLenis } from "lenis/react";

export default function EnigmaPage() {
  const [inputCode, setInputCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [hintOpen, setHintOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Cryptic puzzle answer: "ROOK_LIFT" or "ROOK"
    const cleaned = inputCode.trim().toUpperCase();
    if (cleaned === "ROOK_LIFT" || cleaned === "ROOK" || cleaned === "CASTLE") {
      setStatus("success");
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-[#F0EDE6] font-sans antialiased relative overflow-hidden flex flex-col justify-between">
      
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%,rgba(0,0,0,1))]" style={{ backgroundSize: "100% 4px" }} />

      {/* Cyber ambient glow */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#D4AF37]/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#D4AF37]/5 to-transparent blur-[100px]" />
      </div>

      <ReactLenis root options={{ lerp: 0.08 }}>
        <div className="max-w-4xl mx-auto px-6 py-20 relative z-20 flex-1 flex flex-col justify-center">
          
          {/* Header Back Button */}
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#D4AF37]/70 hover:text-[#D4AF37] mb-12 uppercase border border-[#D4AF37]/20 bg-[#0A0A0A]/60 px-4 py-2 hover:border-[#D4AF37]/50 transition-colors w-fit"
          >
            ← BACK TO BOARD
          </Link>

          {/* Cryptic terminal bento */}
          <div className="border border-[#D4AF37]/20 bg-[#0D0D0D]/90 backdrop-blur-md p-8 md:p-12 relative overflow-hidden rounded-sm shadow-2xl">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/40" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/40" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/40" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/40" />

            {/* Giant Watermark Rook */}
            <div className="absolute bottom-0 right-0 pointer-events-none select-none font-serif text-[280px] text-[#D4AF37]/5 opacity-10 translate-x-12 translate-y-12">
              ♜
            </div>

            <div className="space-y-6 max-w-2xl relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase">
                  SYSTEM STATUS: ENCRYPTED
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tight text-[#F0EDE6] leading-none">
                ENIGMA
              </h1>

              <h2 className="font-mono text-xs text-[#D4AF37] uppercase tracking-widest">
                // THE ROOK'S SHIELDED DECRYPTION PORTAL
              </h2>

              <p className="text-[#8A8880] text-sm leading-relaxed font-sans">
                A cryptic, online multi-stage cryptography hunt testing lateral thinking, riddle cracking, and security architecture audits. 
                Every answer is a coordinate. Every coordinate reveals a sector of the board. 
                Keep your head steady — the sequence is protected by rook lifts and castling lines.
              </p>

              {/* Decipher mini-interactive prompt */}
              <div className="border border-[#2A2A2A] bg-[#0A0A0A] p-6 rounded-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
                  <Terminal size={14} /> DECRYPT SHIELD KEY TO INITIATE:
                </div>

                <div className="p-4 bg-[#070707] border border-[#1C1C1C] font-mono text-[11px] text-[#8A8880] space-y-1 rounded-sm">
                  <div>[LORE_LOG #481] : "The rook lifts along the file before shifting side-wards."</div>
                  <div>[CRYPTIC_CLUE] : "What is the two-word notation for a vertical rook shift?"</div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    placeholder="ENTER KEYWORD (e.g. ROOK_LIFT)..." 
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#D4AF37] focus:outline-none px-4 py-3 font-mono text-xs text-[#F0EDE6] uppercase tracking-widest"
                  />
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] text-zinc-950 font-mono text-[11px] font-bold tracking-widest uppercase px-6 py-3 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                  >
                    SUBMIT
                  </button>
                </form>

                {/* Status indicator */}
                {status === "success" && (
                  <div className="font-mono text-xs text-emerald-500 font-bold uppercase tracking-wider">
                    ✓ ACCESS KEY VALIDATED: REDIRECTING INITIATES TO THE LOBBY IN 2026.
                  </div>
                )}
                {status === "error" && (
                  <div className="font-mono text-xs text-red-500 font-bold uppercase tracking-wider animate-shake">
                    ✗ INVALID DECRYPTION KEY. READ THE LORE CAREFULLY.
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={() => setHintOpen(!hintOpen)}
                    className="font-mono text-[9px] text-[#8A8880] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 uppercase"
                  >
                    <HelpCircle size={12} /> NEED A HINT?
                  </button>
                  
                  <span className="font-mono text-[9px] text-[#4A4A4A]">
                    ATTEMPTS: MULTIPLE
                  </span>
                </div>

                {hintOpen && (
                  <div className="p-3 border border-[#D4AF37]/10 bg-[#D4AF37]/5 font-mono text-[10px] text-[#D4AF37]/80 rounded-sm">
                    Clue: Check the notation inside the WEEKLY CHALLENGES card inside the tournament board. 
                    It lists: "Ra1-a4 — Rook Lift Sequence". Write it in uppercase with an underscore: "ROOK_LIFT".
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ReactLenis>
    </div>
  );
}
