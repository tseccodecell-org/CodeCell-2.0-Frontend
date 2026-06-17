"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HomeSections from "@/components/sections/HomeSections";

// Scrolling Ticker Data
const tickerItems = [
  "TSEC HACKS 2026 REGISTRATIONS OPEN",
  "WEEKLY CHALLENGE #48 LIVE",
  "LEADERBOARD UPDATED: @aryan_s LEADS",
  "SYSTEM DESIGN BOOTCAMP: REPLAY AVAILABLE",
  "500+ STUDENTS ENROLLED IN THE GUILD",
];

// Flawless hexagonal cut-corner CTA button
const HexagonalButton = ({ href }: { href: string }) => (
  <a href="/login" className="relative group block w-fit">
    <div
      className="relative bg-transparent p-[1.5px] drop-shadow-[0_0_15px_rgba(75,226,196,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_25px_rgba(232,255,0,0.5)]"
      style={{
        clipPath: "polygon(16px 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0% 50%)"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#4BE2C4] via-[#00B4D8] to-[#E8FF00] opacity-80 group-hover:opacity-100 transition-opacity" />
      <div
        className="relative flex items-center justify-center bg-[#0D0D0D] px-12 py-3.5 font-mono text-sm font-black tracking-[0.18em] text-[#4BE2C4] transition-all duration-300 group-hover:text-[#0D0D0D] group-hover:bg-gradient-to-r group-hover:from-[#4BE2C4] group-hover:to-[#E8FF00] uppercase"
        style={{
          clipPath: "polygon(15.5px 0%, calc(100% - 15.5px) 0%, 100% 50%, calc(100% - 15.5px) 100%, 15.5px 100%, 0% 50%)",
          paddingLeft: "calc(3rem + 0.18em)"
        }}
      >
        LOGIN
      </div>
    </div>
  </a>
);

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden bg-transparent">

      {/* ========================================================
          1. HERO SECTION â€” Anti-Gravity 3D Floating Design
          ======================================================== */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center overflow-hidden" style={{ background: '#080c08' }}>

        {/* ========== BACKGROUND LAYER ========== */}
        {/* Scattered code characters */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none font-mono" style={{ color: 'rgba(0, 255, 100, 0.035)' }}>
          {[
            { t: '#include', x: '5%', y: '8%', s: 11 }, { t: 'void', x: '88%', y: '12%', s: 13 },
            { t: '{', x: '3%', y: '22%', s: 12 }, { t: 'int', x: '74%', y: '31%', s: 10 },
            { t: 'class', x: '45%', y: '9%', s: 11 }, { t: 'public', x: '32%', y: '19%', s: 13 },
            { t: '[ ]', x: '15%', y: '28%', s: 10 }, { t: 'return', x: '85%', y: '40%', s: 12 },
            { t: ';', x: '5%', y: '49%', s: 13 }, { t: '=', x: '91%', y: '62%', s: 11 },
            { t: '>', x: '18%', y: '71%', s: 10 }, { t: '<', x: '42%', y: '80%', s: 12 },
            { t: '/', x: '79%', y: '89%', s: 13 }, { t: '*', x: '12%', y: '93%', s: 11 },
            { t: '( )', x: '48%', y: '37%', s: 10 }, { t: '}', x: '31%', y: '58%', s: 12 },
            { t: '#', x: '68%', y: '77%', s: 13 }, { t: 'include', x: '54%', y: '66%', s: 11 },
            { t: 'void', x: '24%', y: '85%', s: 10 }, { t: 'int', x: '23%', y: '45%', s: 12 },
            { t: 'return', x: '77%', y: '53%', s: 13 }, { t: 'class', x: '71%', y: '3%', s: 11 },
            { t: 'public', x: '60%', y: '15%', s: 10 }, { t: '[ ]', x: '95%', y: '82%', s: 12 },
            { t: ';', x: '93%', y: '25%', s: 10 }, { t: '=', x: '5%', y: '73%', s: 13 },
            { t: '<', x: '6%', y: '35%', s: 12 }, { t: '/', x: '81%', y: '67%', s: 11 },
            { t: '*', x: '96%', y: '47%', s: 13 }, { t: '( )', x: '11%', y: '59%', s: 10 },
            { t: '}', x: '33%', y: '91%', s: 12 }, { t: '#', x: '84%', y: '79%', s: 11 },
            { t: 'include', x: '41%', y: '51%', s: 13 }, { t: 'void', x: '67%', y: '61%', s: 10 },
            { t: 'int', x: '38%', y: '75%', s: 12 }, { t: 'return', x: '10%', y: '87%', s: 11 },
          ].map((c, i) => (
            <span key={i} className="absolute" style={{ left: c.x, top: c.y, fontSize: `${c.s}px` }}>{c.t}</span>
          ))}
        </div>

        {/* Background hexagon outlines */}
        <svg className="absolute pointer-events-none z-[1]" style={{ top: '10%', left: '5%', width: 250, height: 250 }} viewBox="0 0 100 100"><polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="rgba(0,229,180,0.06)" strokeWidth="1.5" /></svg>
        <svg className="absolute pointer-events-none z-[1]" style={{ top: '55%', left: '65%', width: 450, height: 450 }} viewBox="0 0 100 100"><polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="rgba(0,229,180,0.06)" strokeWidth="1" /></svg>
        <svg className="absolute pointer-events-none z-[1]" style={{ top: '25%', left: '45%', width: 350, height: 350 }} viewBox="0 0 100 100"><polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="rgba(0,229,180,0.06)" strokeWidth="1.2" /></svg>

        {/* Vignette overlay */}
        <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, #080c08 100%)' }} />

        {/* ========== CENTRAL TITLE BLOCK ========== */}
        <div className="relative z-10 text-center select-none" style={{ lineHeight: 0.9 }}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
            <div className="title-tsec-ref" data-text="TSEC" style={{
              fontFamily: "'Orbitron', 'Arial Black', 'Impact', sans-serif",
              fontSize: 'clamp(80px, 12vw, 140px)',
              fontStyle: 'italic',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 0.85
            }}>TSEC</div>
            <div className="title-codecell-ref" data-text="CODECELL" style={{
              fontFamily: "'Orbitron', 'Arial Black', 'Impact', sans-serif",
              fontSize: 'clamp(70px, 11vw, 128px)',
              fontStyle: 'italic',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 0.85
            }}>CODECELL</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-col items-center gap-4 mt-12 md:mt-16">
            <HexagonalButton href="/login" />
            <div className="font-mono select-none text-center" style={{ fontSize: 11, color: '#4a7a4a', letterSpacing: 2, paddingLeft: 2 }}>
              TSEC HACKS <span style={{ animation: 'pulse-loading 1.2s ease-in-out infinite' }}>LOADING...</span>
            </div>
          </motion.div>
        </div>

        {/* ========== FLOATING 3D ELEMENTS ========== */}

        {/* ELEMENT 1 â€” 3D KEYBOARD */}
        <div className="absolute hidden lg:block z-[5]" style={{ left: '3%', bottom: '18%', width: 280, height: 160, background: '#0d1a0d', border: '1px solid rgba(0,229,180,0.25)', borderRadius: 8, padding: 12, boxShadow: '20px 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,229,180,0.08)', animation: 'float-keyboard 6s ease-in-out infinite alternate' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4, width: '100%', height: '100%' }}>
            {Array.from({ length: 40 }).map((_, i) => {
              const isGlow = [4, 19, 20, 36].includes(i);
              const isLight = [0, 13, 27, 34].includes(i);
              return <div key={i} style={{ background: isGlow ? 'rgba(0,229,180,0.12)' : isLight ? '#1a2e1a' : '#111f11', border: `1px solid ${isGlow ? '#00e5b4' : isLight ? 'rgba(200,240,0,0.3)' : 'rgba(0,229,180,0.15)'}`, borderRadius: 3, boxShadow: isGlow ? '0 0 6px rgba(0,229,180,0.4)' : 'none' }} />;
            })}
          </div>
        </div>

        {/* ELEMENT 2 â€” 3D CODE EDITOR CARD */}
        <div className="absolute hidden lg:block z-[5]" style={{ left: '2%', top: '18%', width: 240, height: 170, background: '#0d1a0d', border: '1px solid rgba(0,229,180,0.2)', borderRadius: 6, overflow: 'hidden', boxShadow: '-15px 25px 50px rgba(0,0,0,0.7), 0 0 20px rgba(0,229,180,0.06)', animation: 'float-code 5s ease-in-out 0.8s infinite alternate' }}>
          <div style={{ height: 28, background: '#111f11', borderBottom: '1px solid rgba(0,229,180,0.1)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            <span className="font-mono" style={{ fontSize: 11, color: '#4a7a4a', marginLeft: 4 }}>main.cpp</span>
          </div>
          <div className="font-mono" style={{ padding: 10, fontSize: 10, lineHeight: 1.6 }}>
            <div><span style={{ color: '#00e5b4' }}>#include</span> <span style={{ color: '#e8f5e8' }}>&lt;CC_Engine&gt;</span></div>
            <div><span style={{ color: '#00e5b4' }}>int</span> <span style={{ color: '#e8f5e8' }}>NPT_STATE =</span> <span style={{ color: '#7dff7d' }}>0x48</span><span style={{ color: '#e8f5e8' }}>;</span></div>
            <div><span style={{ color: '#00e5b4' }}>void</span> <span style={{ color: '#e8f5e8' }}>{"execute_trials() {"}</span></div>
            <div>&nbsp;&nbsp;<span style={{ color: '#00e5b4' }}>if</span> <span style={{ color: '#e8f5e8' }}>(security ==</span> <span style={{ color: '#c8f000' }}>LOCKED</span><span style={{ color: '#e8f5e8' }}>)</span></div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#ff6b6b' }}>breach_mainframe()</span><span style={{ color: '#e8f5e8' }}>;</span></div>
            <div><span style={{ color: '#e8f5e8' }}>{"}"}</span></div>
          </div>
        </div>

        {/* ELEMENT 3 â€” HEXAGONAL BADGES */}
        <div className="absolute hidden lg:block z-[5]" style={{ top: '12%', right: '28%', width: 90, height: 90, filter: 'drop-shadow(0 0 12px rgba(0,229,180,0.4))', animation: 'float-badge1 7s ease-in-out 1.6s infinite alternate' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100"><polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#0d1a0d" stroke="#00e5b4" strokeWidth="3" /><text x="50" y="44" fontFamily="monospace" fontSize="12" fill="#c8f000" fontWeight="bold" textAnchor="middle">TSEC</text><text x="50" y="62" fontFamily="monospace" fontSize="9" fill="#00e5b4" fontWeight="bold" textAnchor="middle">CodeCell</text></svg>
        </div>
        <div className="absolute hidden lg:block z-[5]" style={{ bottom: '28%', right: '8%', width: 70, height: 70, filter: 'drop-shadow(0 0 8px rgba(200,240,0,0.3))', animation: 'float-badge2 5.5s ease-in-out 2.1s infinite alternate' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100"><polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#0d1a0d" stroke="#00e5b4" strokeWidth="3" /><text x="50" y="44" fontFamily="monospace" fontSize="12" fill="#c8f000" fontWeight="bold" textAnchor="middle">TSEC</text><text x="50" y="62" fontFamily="monospace" fontSize="9" fill="#00e5b4" fontWeight="bold" textAnchor="middle">CodeCell</text></svg>
        </div>

        {/* ELEMENT 4 â€” TECH TOOL ICON TILES */}
        <div className="absolute hidden lg:flex flex-col items-center justify-center gap-1 z-[5]" style={{ top: '14%', right: '6%', width: 64, height: 64, background: '#0d1a0d', border: '1px solid rgba(0,229,180,0.2)', borderRadius: 14, boxShadow: '10px 15px 30px rgba(0,0,0,0.5), 0 0 15px rgba(200,240,0,0.1)', animation: 'float-tile-a 6s ease-in-out 0.4s infinite alternate' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 6 2.5 6 5.5V7H12V8.5H6.5C4.5 8.5 3 10 3 12C3 14 4.5 15.5 6.5 15.5H8V14C8 11.8 9.8 10 12 10H18V8.5C18 5.5 17.52 2 12 2Z" fill="#c8f000" /><path d="M12 22C17.52 22 18 21.5 18 18.5V17H12V15.5H17.5C19.5 15.5 21 14 21 12C21 10 19.5 8.5 17.5 8.5H16V10C16 12.2 14.2 14 12 14H6V15.5C6 18.5 6.48 22 12 22Z" fill="#00e5b4" /><circle cx="9" cy="5" r="1" fill="#080c08" /><circle cx="15" cy="19" r="1" fill="#080c08" /></svg>
          <span className="font-mono" style={{ fontSize: 8, color: '#4a7a4a', fontWeight: 700 }}>Python</span>
        </div>
        <div className="absolute hidden lg:flex flex-col items-center justify-center gap-1 z-[5]" style={{ top: '28%', right: '3%', width: 64, height: 64, background: '#0d1a0d', border: '1px solid rgba(0,229,180,0.2)', borderRadius: 14, boxShadow: '8px 12px 25px rgba(0,0,0,0.5), 0 0 12px rgba(0,229,180,0.12)', animation: 'float-tile-b 4.5s ease-in-out 1.2s infinite alternate' }}>
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none"><rect x="2" y="2" width="4" height="3" fill="#00e5b4" opacity={0.8} /><rect x="7" y="2" width="4" height="3" fill="#00e5b4" opacity={0.8} /><rect x="12" y="2" width="4" height="3" fill="#00e5b4" opacity={0.8} /><rect x="7" y="6" width="4" height="3" fill="#00e5b4" /><rect x="12" y="6" width="4" height="3" fill="#00e5b4" /><rect x="17" y="6" width="4" height="3" fill="#00e5b4" /><rect x="12" y="10" width="4" height="3" fill="#00e5b4" /><path d="M1 14C3 13 5 13 7 14C11 16 16 16 19 14C21 13 22 11 23 10C24 9 26 9 27 10C28 11 27 13 26 14C24 16 21 18 18 18C13 18 7 18 2 17C1 16.5 0.5 15 1 14Z" fill="#00e5b4" /></svg>
          <span className="font-mono" style={{ fontSize: 8, color: '#4a7a4a', fontWeight: 700 }}>Docker</span>
        </div>
        <div className="absolute hidden lg:flex flex-col items-center justify-center gap-1 z-[5]" style={{ top: '8%', right: '16%', width: 64, height: 64, background: '#0d1a0d', border: '1px solid rgba(0,229,180,0.2)', borderRadius: 14, boxShadow: '6px 10px 20px rgba(0,0,0,0.5)', animation: 'float-tile-c 7s ease-in-out 2.8s infinite alternate' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2"><circle cx="18" cy="6" r="3" fill="#0d1a0d" /><circle cx="6" cy="18" r="3" fill="#0d1a0d" /><circle cx="6" cy="6" r="3" fill="#0d1a0d" /><path d="M6 9v6M18 9C18 13 6 11 6 15" strokeLinecap="round" /></svg>
          <span className="font-mono" style={{ fontSize: 8, color: '#4a7a4a', fontWeight: 700 }}>Git</span>
        </div>
        <div className="absolute hidden lg:flex flex-col items-center justify-center gap-1 z-[5]" style={{ top: '38%', right: '18%', width: 72, height: 72, background: '#0d1a0d', border: '1px solid rgba(0,229,180,0.2)', borderRadius: 14, boxShadow: '12px 18px 35px rgba(0,0,0,0.6), 0 0 20px rgba(255,154,60,0.1)', animation: 'float-tile-d 5.2s ease-in-out 0.6s infinite alternate' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="6" fill="#ff9a3c" /><ellipse cx="16" cy="16" rx="14" ry="4" stroke="#ff9a3c" strokeWidth="1.5" transform="rotate(-30 16 16)" /><circle cx="6" cy="11" r="2.5" fill="#ff9a3c" /><circle cx="26" cy="21" r="2.5" fill="#ff9a3c" /></svg>
          <span className="font-mono" style={{ fontSize: 8, color: '#4a7a4a', fontWeight: 700 }}>Jupyter</span>
        </div>

        {/* ELEMENT 5 â€” 3D SERVER RACK */}
        <div className="absolute hidden lg:flex flex-col gap-1.5 z-[5]" style={{ right: '0.5%', top: '45%', width: 130, padding: 8, background: '#0d1a0d', border: '1px solid rgba(0,229,180,0.2)', borderRadius: 6, boxShadow: '-20px 20px 40px rgba(0,0,0,0.7), 0 0 25px rgba(57,255,20,0.06)', animation: 'float-server 8s ease-in-out 1.8s infinite alternate' }}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="flex items-center gap-1.5 font-mono" style={{ height: 22, background: '#111f11', border: '1px solid rgba(0,229,180,0.1)', borderRadius: 3, padding: '0 8px' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: n % 2 === 1 ? '#39ff14' : '#1a2e1a', boxShadow: n % 2 === 1 ? '0 0 6px #39ff14' : 'none' }} />
              <span style={{ fontSize: 8, color: '#4a7a4a', fontWeight: 700 }}>SRV-0{n}</span>
            </div>
          ))}
        </div>

        {/* ELEMENT 6 â€” STATS MATRIX CARD */}
        <div className="absolute hidden lg:block z-[5]" style={{ right: '5%', top: '10%', width: 160, padding: 10, background: '#0d1a0d', border: '1px solid rgba(0,229,180,0.2)', borderRadius: 4, boxShadow: '10px 15px 30px rgba(0,0,0,0.6)', animation: 'float-stats 4.8s ease-in-out 1.4s infinite alternate' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px 6px' }}>
            {['109.2', '409.1', '002.3', '761.5', '008.2', '991.0', '325.9', '654.4', '110.7'].map((v, i) => (
              <div key={i} className="font-mono text-center" style={{ fontSize: 13, color: [0, 4, 8].includes(i) ? '#c8f000' : '#e8f5e8', fontWeight: [0, 4, 8].includes(i) ? 700 : 400 }}>{v}</div>
            ))}
          </div>
        </div>

        {/* ELEMENT 7 â€” NEURAL NETWORK NODE GRAPH */}
        <div className="absolute hidden lg:block z-[5]" style={{ right: '2%', bottom: '8%', width: 180, height: 140, filter: 'drop-shadow(0 0 15px rgba(0,229,180,0.2))', animation: 'float-nn 6.5s ease-in-out 2.2s infinite alternate' }}>
          <svg width="100%" height="100%" viewBox="0 0 180 140" fill="none">
            {[30, 70, 110].map(iy => [20, 53, 87, 120].map(hy => <line key={`i${iy}-h${hy}`} x1="30" y1={iy} x2="90" y2={hy} stroke="rgba(0,229,180,0.25)" strokeWidth="1" />)).flat()}
            {[20, 53, 87, 120].map(hy => [45, 95].map(oy => <line key={`h${hy}-o${oy}`} x1="90" y1={hy} x2="150" y2={oy} stroke="rgba(0,229,180,0.25)" strokeWidth="1" />)).flat()}
            <line x1="30" y1="70" x2="90" y2="53" stroke="#c8f000" strokeWidth="1.5"><animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" /></line>
            <line x1="30" y1="70" x2="90" y2="87" stroke="#c8f000" strokeWidth="1.5"><animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" /></line>
            <line x1="90" y1="53" x2="150" y2="95" stroke="#c8f000" strokeWidth="1.5"><animate attributeName="opacity" values="0.2;1;0.2" dur="1.5s" repeatCount="indefinite" /></line>
            {[30, 70, 110].map(y => <circle key={`i${y}`} cx="30" cy={y} r="7" fill="#0d1a0d" stroke="#00e5b4" strokeWidth="1.5" />)}
            {[20, 53, 87, 120].map(y => <circle key={`h${y}`} cx="90" cy={y} r="7" fill="#0d1a0d" stroke="#00e5b4" strokeWidth="1.5" />)}
            {[45, 95].map(y => <circle key={`o${y}`} cx="150" cy={y} r="7" fill="#0d1a0d" stroke="#00e5b4" strokeWidth="1.5" />)}
          </svg>
        </div>

        {/* ELEMENT 8 â€” CODECELL LABEL CHIPS */}
        {[
          { top: '22%', left: '42%', anim: 'float-chip1 5s ease-in-out 0.3s infinite alternate' },
          { bottom: '32%', left: '36%', anim: 'float-chip2 6.2s ease-in-out 1.1s infinite alternate' },
          { top: '48%', right: '22%', anim: 'float-chip3 5.8s ease-in-out 2s infinite alternate' },
        ].map((pos, i) => (
          <div key={`chip-${i}`} className="absolute hidden lg:flex items-center gap-1.5 font-mono z-[5]" style={{ ...pos, background: 'rgba(0,229,180,0.06)', border: '1px solid rgba(0,229,180,0.25)', borderRadius: 3, padding: '4px 10px', fontSize: 11, color: '#00e5b4', letterSpacing: 1, animation: pos.anim }}>
            <span style={{ fontSize: 8 }}>â—‰</span>CODECELL
          </div>
        ))}

        {/* SYSTEM STATUS BARS */}
        <div className="absolute hidden xl:flex flex-col gap-[5px] z-10" style={{ left: '1.5%', top: '38%', transform: 'perspective(400px) rotateY(8deg)' }}>
          {[
            { label: '00:15:A2:3B:5C', dot: '#39ff14' }, { label: 'SYS_STATUS: 100', dot: '#c8f000' },
            { label: 'VAL_A: 0x7FFA', dot: '#39ff14' }, { label: 'LATENCY: 12MS', dot: '#c8f000' },
            { label: 'MEM_USE: 41.2%', dot: '#39ff14' }, { label: 'NODE_ID: 1098', dot: '#c8f000' },
          ].map((s, i) => (
            <div key={i} className="flex justify-between items-center font-mono" style={{ width: 190, background: '#0d1a0d', border: '1px solid rgba(0,229,180,0.15)', borderRadius: 2, padding: '4px 10px', fontSize: 11, color: '#4a7a4a' }}>
              <span>{s.label}</span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, boxShadow: `0 0 4px ${s.dot}` }} />
            </div>
          ))}
        </div>

        {/* ========== BOTTOM TICKER BAR ========== */}
        <div className="border-t border-b border-[#222222]/60 py-2.5 overflow-hidden bg-[#080808]/95 backdrop-blur-sm w-full absolute bottom-0 left-0 z-20 flex items-center">
          <div className="relative w-full overflow-hidden flex items-center">
            <div className="flex animate-marquee-slow whitespace-nowrap gap-12 font-mono text-label-tag text-[#8A8880]">
              {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
                <span key={index} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF00] shadow-[0_0_8px_#E8FF00]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HomeSections />
    </div>
  );
}
