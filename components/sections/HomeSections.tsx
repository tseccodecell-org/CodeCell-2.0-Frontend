"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Terminal,
  Award,
  Laptop,
  Sparkles,
  Trophy,
  Gift,
  ChevronLeft,
  ChevronRight,
  X,
  Sticker,
  Users,
  Calendar,
} from "lucide-react";
import {
  SectionHeader,
  SectionWrap,
  GlassCard,
  HexButton,
  AnimatedNumber,
  PremiumFaq,
  BentoMotion,
  type FaqItem,
} from "./SectionKit";

const SpotlightText = ({ text }: { text: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <h2
      className="text-h1-scale font-bold uppercase mb-6 relative inline-block cursor-default"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
    >
      <span className="text-[#F0EDE6]">{text}</span>
      <span
        className="absolute inset-0 bg-gradient-to-r from-[#E8FF00] via-[#4BE2C4] to-[#E8FF00] bg-[length:200%_auto] bg-clip-text text-transparent pointer-events-none transition-opacity duration-300"
        style={{
          opacity,
          WebkitMaskImage: `radial-gradient(100px circle at ${position.x}px ${position.y}px, black 0%, transparent 100%)`,
          maskImage: `radial-gradient(100px circle at ${position.x}px ${position.y}px, black 0%, transparent 100%)`,
        }}
      >
        {text}
      </span>
    </h2>
  );
};

const sponsorLogos = [
  { src: "/sponsors/appwrite.png", alt: "Appwrite", scale: 1.6 },
  { src: "/sponsors/crosscope.png", alt: "Crosscope", scale: 2.6 },
  { src: "/sponsors/devfolio.png", alt: "Devfolio", scale: 1.5 },
  { src: "/sponsors/ethindia.png", alt: "ETHIndia", scale: 1.5 },
  { src: "/sponsors/foss.png", alt: "FOSS United", scale: 1.5 },
  { src: "/sponsors/github.png", alt: "GitHub", scale: 1.5 },
  { src: "/sponsors/hindustan.png", alt: "Hindustan" },
  { src: "/sponsors/jdoodle.png", alt: "JDoodle" },
  { src: "/sponsors/orkes.png", alt: "Orkes" },
  { src: "/sponsors/patilkaki.png", alt: "Patilkaki" },
  { src: "/sponsors/polygon.png", alt: "Polygon", scale: 1.6 },
  { src: "/sponsors/postman.png", alt: "Postman" },
  { src: "/sponsors/replit.png", alt: "Replit" },
  { src: "/sponsors/scrollconnect.png", alt: "ScrollConnect", scale: 2.1 },
  { src: "/sponsors/smaaash.png", alt: "Smaaash", scale: 2.2 },
  { src: "/sponsors/visionx.png", alt: "VisionX" },
  { src: "/sponsors/wolfram-language-text-logo.png", alt: "Wolfram Language", scale: 1.6 },
];

const swagPerks = [
  { label: "Workshop Access", icon: Laptop },
  { label: "Guild Stickers", icon: Sticker },
  { label: "Leaderboard XP", icon: Trophy },
  { label: "Event Goodies", icon: Gift },
  { label: "Mentorship", icon: Sparkles },
  { label: "Hackathon Swag", icon: Award },
];

const stats = [
  { value: 38, label: "Students", sub: "Committee Members", icon: Users },
  { value: 10, suffix: "+", label: "Events Hosted", sub: "Core Workshops", icon: Calendar },
  { value: 20, suffix: "+", label: "Sessions Held", sub: "Hackathons & Seminars", icon: Terminal },
  { value: 6000, suffix: "+", label: "Registrations", sub: "Total Submissions", icon: Trophy },
];

const ideFiles = [
  {
    id: "core",
    name: "about_us.tsx",
    icon: Terminal,
    content: `// TSEC CodeCell - Community & Mission
// -----------------------------------
// For Beginners: Our committee helps you start your tech journey.
// We are a community of passionate developers, designers, and problem solvers working together to build impactful experiences.
//
// For Advanced Devs: We practice algorithmic coding, scale web apps, and compete in national hackathons.

import { Community } from '@tsec/codecell';

export const AboutCodeCell = () => {
  return (
    <Mission>
      Bridging the gap between classroom learning 
      and real-world software engineering.
    </Mission>
  );
};`,
    accent: "#E8FF00",
    colorClass: "text-[#E8FF00]",
    sequence: [],
    output: (
      <div className="space-y-5 text-sm leading-relaxed text-[#A0AFA7] font-sans">
        <div>
          <span className="font-mono text-[10px] text-[#4BE2C4] tracking-[0.2em] uppercase block mb-1">
            TSEC CODECELL // OUR MISSION
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            Our Mission & Community
          </h2>
        </div>
        <p className="text-gray-300 text-xs md:text-sm">
          TSEC CodeCell is a student-led committee at Thadomal Shahani Engineering College. We bridge the gap between classroom theory and real-world software development.
        </p>
        <div className="border-l-2 border-[#4BE2C4]/50 pl-4 py-1 space-y-1">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">What We Do</h3>
          <p className="text-xs text-gray-300">
            Whether you are writing your first line of code or building complex web apps, CodeCell is your collaborative hub to learn, build, and grow together.
          </p>
        </div>
        <div className="border-l-2 border-[#E8FF00]/50 pl-4 py-1 space-y-1">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">Events & Hackathons</h3>
          <p className="text-xs text-gray-300">
            We host Mumbai&apos;s premier 24-hour national hackathons, weekly competitive coding arenas, and hands-on workshops.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "hacks",
    name: "tsec_hacks.config",
    icon: Award,
    content: `event: TSEC Hacks 2026
type: National Hackathon
duration: 24 Hours
participants: 500+
description: >
  Our flagship 24-hour hackathon.
  Beginners get direct mentorship while experienced teams
  compete for cash prizes and swag.`,
    accent: "#FF4D00",
    colorClass: "text-[#FF4D00]",
    sequence: [],
    output: (
      <div className="space-y-5 text-sm leading-relaxed text-[#A0AFA7] font-sans">
        <div>
          <span className="font-mono text-[10px] text-[#FF5500] tracking-[0.2em] uppercase block mb-1">
            FLAGSHIP HACKATHON // 2026
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            TSEC Hacks 2026
          </h2>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
            Live Registration
          </span>
          <span className="text-gray-400">500+ Participants</span>
        </div>
        <p className="text-gray-300 text-xs">
          TSEC Hacks is a 24-hour national developer assembly. First-time hackers get mentorship to build their initial prototype, while experienced devs push production-grade systems for grand prize pools.
        </p>
      </div>
    )
  },
  {
    id: "workshops",
    name: "workshops.ts",
    icon: Laptop,
    content: `// CodeCell Workshops & Masterclasses
// -----------------------------------
// Hands-on interactive sessions led by senior student mentors.

export const WorkshopTracks = [
  "Level 1: Git, GitHub & Web Basics",
  "Level 2: React, Next.js & Fullstack APIs",
  "Level 3: DSA & Competitive Programming"
];`,
    accent: "#4BE2C4",
    colorClass: "text-[#4BE2C4]",
    sequence: [],
    output: (
      <div className="space-y-5 text-sm leading-relaxed text-[#A0AFA7] font-sans">
        <div>
          <span className="font-mono text-[10px] text-[#4BE2C4] tracking-[0.2em] uppercase block mb-1">
            WORKSHOPS & SESSIONS
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            Hands-on Masterclasses
          </h2>
        </div>
        <p className="text-gray-300 text-xs">
          Interactive workshops covering Git/GitHub version control, Web Development, Data Structures, and Algorithmic Problem Solving.
        </p>
      </div>
    )
  },
  {
    id: "onboarding",
    name: "get_started.js",
    icon: Sparkles,
    content: `// How to get started with CodeCell
// --------------------------------
// 1. Join our active WhatsApp & Discord groups
// 2. Participate in weekly coding challenges
// 3. Attend workshops and hackathons

const getStarted = async () => {
  await joinCommunity();
  await buildProjects();
  console.log("Welcome to TSEC CodeCell!");
};`,
    accent: "#E8FF00",
    colorClass: "text-[#E8FF00]",
    sequence: [],
    output: (
      <div className="space-y-5 text-sm leading-relaxed text-[#A0AFA7] font-sans">
        <div>
          <span className="font-mono text-[10px] text-[#E8FF00] tracking-[0.2em] uppercase block mb-1">
            GET STARTED WITH CODECELL
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            Join the Community
          </h2>
        </div>
        <p className="text-gray-300 text-xs">
          Connect with fellow students, participate in weekly coding challenges, and collaborate on exciting projects.
        </p>
      </div>
    )
  }
];

function RunCodeOverlay({ file, onClose }: { file: typeof ideFiles[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#090D0A]/95 backdrop-blur-md z-30 flex flex-col p-6 md:p-8 font-sans overflow-y-auto"
    >
      <div className="flex justify-between items-center pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#4BE2C4] font-bold uppercase tracking-wider">
            {file.name}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white bg-white/5 p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1">
        {file.output}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold rounded-full transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}

function InteractiveIde() {
  const [openFiles, setOpenFiles] = useState<string[]>(["core", "hacks"]);
  const [activeFileId, setActiveFileId] = useState<string | null>("core");
  const [displayedContent, setDisplayedContent] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const activeFile = ideFiles.find((f) => f.id === activeFileId);

  useEffect(() => {
    if (!activeFile) {
      setDisplayedContent("");
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedContent(activeFile.content.substring(0, i));
      i++;
      if (i > activeFile.content.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [activeFileId, activeFile]);

  const handleCloseFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter(fId => fId !== id);
    setOpenFiles(newOpenFiles);
    if (activeFileId === id) {
      setActiveFileId(newOpenFiles.length > 0 ? newOpenFiles[0] : null);
    }
  };

  const handleOpenFile = (id: string) => {
    if (!openFiles.includes(id)) {
      setOpenFiles([...openFiles, id]);
    }
    setActiveFileId(id);
  };

  return (
    <div className="w-full flex flex-col md:flex-row border border-[#222] rounded-xl overflow-hidden bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.8)] mt-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#050505] border-b md:border-b-0 md:border-r border-[#222] flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-[#222] flex items-center gap-2 bg-[#080808]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs font-mono text-[#888] ml-2 uppercase tracking-wider">Explorer</span>
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          <div className="text-[10px] text-[#555] font-mono mb-2 px-2 uppercase tracking-widest mt-2">TSEC_CodeCell</div>
          {ideFiles.map((file) => {
            const Icon = file.icon;
            const isActive = activeFileId === file.id;
            return (
              <button
                key={file.id}
                onClick={() => handleOpenFile(file.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-mono transition-all ${isActive ? "bg-[#222] text-[#fff]" : "text-[#888] hover:bg-[#111] hover:text-[#ccc]"
                  }`}
              >
                <Icon size={14} className={isActive ? file.colorClass : "text-[#666]"} />
                <span className={openFiles.includes(file.id) ? "text-[#fff]" : ""}>{file.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Tabs */}
        <div className="flex bg-[#0a0a0a] border-b border-[#222] justify-between">
          <div className="flex overflow-x-auto hide-scrollbar">
            {openFiles.map((fileId) => {
              const file = ideFiles.find(f => f.id === fileId);
              if (!file) return null;
              const isActive = activeFileId === file.id;
              const Icon = file.icon;
              return (
                <button
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-r border-[#222] font-mono text-xs whitespace-nowrap transition-colors shrink-0 ${isActive ? "bg-[#111] text-[#fff] border-t-2" : "text-[#666] hover:bg-[#111] border-t-2 border-t-transparent"
                    }`}
                  style={{ borderTopColor: isActive ? file.accent : "transparent" }}
                >
                  <Icon size={12} className={isActive ? file.colorClass : ""} />
                  {file.name}
                  <span className="ml-2 text-[#666] hover:text-[#fff] hover:bg-[#333] rounded-sm p-0.5 transition-colors" onClick={(e) => handleCloseFile(e, file.id)}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </span>
                </button>
              );
            })}
          </div>
          {activeFile && (
            <button
              onClick={() => setIsRunning(true)}
              className="flex items-center gap-2 px-4 py-3 font-mono text-xs bg-[#4BE2C4]/20 text-[#4BE2C4] hover:bg-[#4BE2C4]/30 transition-all duration-300 border-l border-[#222] shrink-0 group animate-pulse shadow-[0_0_15px_rgba(75,226,196,0.6)] ring-1 ring-[#4BE2C4]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M8 5v14l11-7z" /></svg>
              <span className="hidden sm:inline font-bold tracking-widest text-[#E8FF00]">RUN CODE</span>
            </button>
          )}
        </div>

        {/* Code Area */}
        <div className="flex-1 p-4 md:p-6 bg-[#0d0d0d] relative overflow-hidden group min-h-[300px] md:min-h-[400px] flex">
          {activeFile ? (
            <>
              {/* Line Numbers */}
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col items-end py-4 md:py-6 pr-3 text-[#333] font-mono text-sm select-none">
                {Array.from({ length: 15 }).map((_, i) => (
                  <span key={i} className="leading-[1.6]">{i + 1}</span>
                ))}
              </div>

              {/* Code Content */}
              <pre className="pl-12 font-mono text-sm leading-[1.6] text-[#e5e5e5] whitespace-pre-wrap outline-none break-all sm:break-normal w-full" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
                <code
                  dangerouslySetInnerHTML={{
                    __html: displayedContent
                      .replace(/\/\/ (.*)/g, '<span style="color:#5c6370;font-style:italic">//$1</span>')
                      .replace(/#include (.*)/g, '<span style="color:#c678dd">#include <span style="color:#98c379">$1</span></span>')
                      .replace(/import (.*) from (.*);/g, '<span style="color:#c678dd">import</span> <span style="color:#e5c07b">$1</span> <span style="color:#c678dd">from</span> <span style="color:#98c379">$2</span>;')
                      .replace(/export const (.*) =/g, '<span style="color:#c678dd">export const</span> <span style="color:#61afef">$1</span> <span style="color:#56b6c2">=</span>')
                      .replace(/void (.*)\(/g, '<span style="color:#c678dd">void</span> <span style="color:#61afef">$1</span>(')
                      .replace(/return \(/g, '<span style="color:#c678dd">return</span> (')
                      .replace(/echo "(.*)"/g, '<span style="color:#56b6c2">echo</span> <span style="color:#98c379">"$1"</span>')
                      .replace(/deploy_workshops/g, '<span style="color:#61afef">deploy_workshops</span>')
                      .replace(/"(.*)":/g, '<span style="color:#e06c75">"$1"</span>:')
                      .replace(/name:/g, '<span style="color:#e06c75">name:</span>')
                      .replace(/type:/g, '<span style="color:#e06c75">type:</span>')
                      .replace(/duration:/g, '<span style="color:#e06c75">duration:</span>')
                      .replace(/description:/g, '<span style="color:#e06c75">description:</span>')
                      .replace(/status:/g, '<span style="color:#e06c75">status:</span>')
                      .replace(/#!/g, '<span style="color:#5c6370;font-style:italic">#!</span>')
                      + (displayedContent.length < activeFile.content.length ? '<span class="inline-block w-2 h-4 bg-[#fff] animate-pulse align-middle ml-1"></span>' : '')
                  }}
                />
              </pre>

              {/* Status Bar inside editor */}
              <div className="absolute bottom-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
                <div className="px-3 py-1 bg-[#1a1a1a] border border-[#333] rounded font-mono text-[10px] text-[#888] flex items-center gap-2">
                  UTF-8
                </div>
                <div className="px-3 py-1 bg-[#1a1a1a] border border-[#333] rounded font-mono text-[10px] text-[#888] flex items-center gap-2 uppercase">
                  {activeFile.name.split('.').pop()}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#555] font-mono text-sm">
              <div className="flex flex-col items-center justify-center gap-4 text-[#333] w-full mt-20">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="tracking-widest uppercase mt-4 text-[#444]">Select a file to continue</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isRunning && activeFile && <RunCodeOverlay file={activeFile} onClose={() => setIsRunning(false)} />}
      </AnimatePresence>
    </div>
  );
}

const tsecHacksImages = [
  "/Tsec_hacks/IMG_0262.webp",
  "/Tsec_hacks/IMG_0353.webp",
  "/Tsec_hacks/IMG_0375.webp",
  "/Tsec_hacks/IMG_0453.webp",
  "/Tsec_hacks/IMG_0503.webp",
  "/Tsec_hacks/IMG_0519.webp",
  "/Tsec_hacks/IMG_0525.webp",
  "/Tsec_hacks/IMG_0612.webp",
  "/Tsec_hacks/IMG_0615.webp",
  "/Tsec_hacks/IMG_0621.webp",
  "/Tsec_hacks/IMG_0632.webp",
  "/Tsec_hacks/IMG_0645.webp",
  "/Tsec_hacks/IMG_5793.webp",
  "/Tsec_hacks/IMG_7415.webp",
];

export default function HomeSections() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const archiveScrollRef = useRef<HTMLDivElement>(null);

  const scrollArchive = (direction: 'left' | 'right') => {
    if (archiveScrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      archiveScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!isGalleryOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setGalleryIndex((prev) => (prev + 1) % tsecHacksImages.length);
      } else if (e.key === "ArrowLeft") {
        setGalleryIndex((prev) => (prev - 1 + tsecHacksImages.length) % tsecHacksImages.length);
      } else if (e.key === "Escape") {
        setIsGalleryOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen]);

  const SPEED = 48; // Pixels per second
  const PERK_ITEM_WIDTH = 228;
  const SPONSOR_ITEM_WIDTH = 180;

  const perksRepeats = 4;
  const sponsorsRepeats = 4;

  const perkDuration = (swagPerks.length * perksRepeats * PERK_ITEM_WIDTH) / (2 * SPEED);
  const sponsorDuration = (sponsorLogos.length * sponsorsRepeats * SPONSOR_ITEM_WIDTH) / (2 * SPEED);

  return (
    <div className="bg-[#0D0D0D]">
      {/* METRICS BENTO — Enhanced & Clean */}
      <SectionWrap>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <BentoMotion key={stat.label} delay={idx * 0.06}>
                <div
                  className="relative p-6 md:p-7 h-full rounded-2xl bg-[#090E0B] border border-white/10 hover:border-[#4BE2C4]/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group overflow-hidden flex flex-col justify-between"
                >
                  {/* Soft Background Accent Glow on Hover */}
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-[#4BE2C4]/5 blur-2xl group-hover:bg-[#4BE2C4]/15 transition-all duration-500 pointer-events-none" />

                  {/* Header Row: Subtitle & Icon */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-[10px] md:text-xs text-[#8A9B93] uppercase tracking-wider font-semibold">
                      {stat.sub}
                    </span>
                    <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-[#4BE2C4]/70 group-hover:text-[#E8FF00] group-hover:border-[#E8FF00]/30 transition-all duration-300">
                      <Icon size={16} />
                    </div>
                  </div>

                  {/* Big Number Display */}
                  <div className="my-1">
                    <p className="font-orbitron text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#E8FF00] via-[#4BE2C4] to-[#4BE2C4]">
                      <AnimatedNumber value={stat.value} />
                      {stat.suffix}
                    </p>
                  </div>

                  {/* Footer Label */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <p className="font-mono text-[11px] md:text-xs text-[#A0AFA7] tracking-[0.18em] uppercase font-medium">
                      {stat.label}
                    </p>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4BE2C4]/40 group-hover:bg-[#E8FF00] transition-colors" />
                  </div>
                </div>
              </BentoMotion>
            );
          })}
        </div>
      </SectionWrap>

      {/* INTERACTIVE IDE: WHAT IS CODECELL */}
      <SectionWrap id="what-is-codecell">
        <SectionHeader
          index="01 — WHAT IS CODECELL"
          title="Build. Compete. Ship."
        />
        <BentoMotion>
          <InteractiveIde />
        </BentoMotion>
      </SectionWrap>

      {/* EVENT ARCHIVES CAROUSEL WITH ALL IMAGES & SCROLL ARROWS */}
      <SectionWrap>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionHeader
            index="02 — PAST EVENTS"
            title="Event Archives"
          />
          
          {/* Navigation Scroll Arrows */}
          <div className="flex items-center gap-3 mb-14">
            <button
              onClick={() => scrollArchive('left')}
              className="w-12 h-12 rounded-xl bg-[#090E0B] border border-white/10 hover:border-[#4BE2C4] text-white hover:text-[#4BE2C4] flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => scrollArchive('right')}
              className="w-12 h-12 rounded-xl bg-[#090E0B] border border-white/10 hover:border-[#4BE2C4] text-white hover:text-[#4BE2C4] flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Horizontal Card Scroll Container */}
        <div
          ref={archiveScrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth py-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tsecHacksImages.map((imgSrc, idx) => (
            <div
              key={idx}
              onClick={() => {
                setIsGalleryOpen(true);
                setGalleryIndex(idx);
              }}
              className="relative group min-w-[280px] sm:min-w-[340px] h-[360px] sm:h-[420px] rounded-2xl overflow-hidden bg-[#090E0B] border border-white/10 hover:border-[#4BE2C4]/70 transition-all duration-500 flex flex-col justify-end cursor-pointer shrink-0 shadow-xl"
            >
              {/* Card Image */}
              <Image
                src={imgSrc}
                alt={`TSEC Hacks Archive Photo ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050907] via-[#050907]/40 to-transparent" />

              {/* Content Badge & Info */}
              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs px-3 py-1 bg-[#050907]/80 backdrop-blur border border-[#4BE2C4]/40 text-[#4BE2C4] uppercase tracking-widest rounded-md">
                    TSEC HACKS 2026
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-[#FF5500] uppercase tracking-widest block mb-1">
                    CLICK TO EXPAND
                  </span>
                  <h3 className="font-orbitron font-bold text-white text-lg sm:text-xl uppercase group-hover:text-[#E8FF00] transition-colors">
                    HACKATHON MOMENT
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrap>

      {/* PERKS: PODIUM + MARQUEE */}
      <SectionWrap>
        <SectionHeader
          index="03 — PERKS & PARTNERS"
          title="Our Sponsors & Swag"
        />

        <GlassCard hover={false} className="py-4 overflow-hidden">
          <div className="premium-marquee flex items-center h-16 md:h-20" style={{ animationDuration: `${sponsorDuration}s` }}>
            {[...sponsorLogos, ...sponsorLogos, ...sponsorLogos, ...sponsorLogos].map((logo, idx) => (
              <div key={idx} className="shrink-0 flex items-center justify-center px-3 md:px-5 min-w-[110px] md:min-w-[150px]">
                <div className="p-1.5 md:p-2 rounded-lg bg-[#050505]/60 border border-[#222] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105">
                  <Image
                    src={`${logo.src}?v=2`}
                    alt={logo.alt}
                    width={140}
                    height={50}
                    className="w-20 md:w-32 h-auto max-h-8 md:max-h-10 object-contain transition-transform duration-300"
                    style={{ transform: logo.scale ? `scale(${logo.scale})` : "none" }}
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </SectionWrap>

      {/* FULLSCREEN LIGHTBOX GALLERY MODAL */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8"
          >
            {/* Header Controls */}
            <div className="flex justify-between items-center text-white z-10">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8FF00] animate-pulse" />
                <span className="font-mono text-xs tracking-widest text-[#4BE2C4] uppercase">
                  TSEC HACKS ARCHIVE GALLERY
                </span>
                <span className="font-mono text-xs text-[#888]">
                  ({galleryIndex + 1} / {tsecHacksImages.length})
                </span>
              </div>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-2.5 rounded-full bg-[#111] border border-[#333] text-white hover:bg-[#E8FF00] hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Image View */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={galleryIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full max-w-5xl max-h-[75vh] group/image"
                >
                  <Image
                    src={tsecHacksImages[galleryIndex]}
                    alt={`Gallery Image ${galleryIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                  {/* Floating Overlay Cross Icon directly on Image */}
                  <button
                    onClick={() => setIsGalleryOpen(false)}
                    className="absolute top-3 right-3 z-30 p-3 rounded-full bg-black/80 border border-white/30 text-white hover:bg-[#E8FF00] hover:text-black transition-all shadow-2xl cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Close image popup"
                  >
                    <X size={22} />
                  </button>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Nav Overlay */}
              <button
                onClick={() =>
                  setGalleryIndex(
                    (prev) => (prev - 1 + tsecHacksImages.length) % tsecHacksImages.length
                  )
                }
                className="absolute left-2 md:left-8 p-3.5 rounded-full bg-[#111]/80 border border-[#333] text-white hover:bg-[#4BE2C4] hover:text-black transition-colors shadow-2xl"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={() =>
                  setGalleryIndex((prev) => (prev + 1) % tsecHacksImages.length)
                }
                className="absolute right-2 md:left-auto md:right-8 p-3.5 rounded-full bg-[#111]/80 border border-[#333] text-white hover:bg-[#4BE2C4] hover:text-black transition-colors shadow-2xl"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnail Navigation Bar */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 px-4 bg-[#0a0a0a] border border-[#222] rounded-xl max-w-4xl mx-auto">
              {tsecHacksImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === galleryIndex
                    ? "border-[#E8FF00] scale-105 shadow-[0_0_10px_rgba(232,255,0,0.5)]"
                    : "border-transparent opacity-40 hover:opacity-100"
                    }`}
                >
                  <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
