"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Terminal,
  Award,
  Laptop,
  Sparkles,
  Trophy,
  Gift,
  Sticker,
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


const pastEvents = [
  {
    title: "TSEC Hacks 2026",
    type: "HACKATHON",
    date: "FEB 21 - 23, 2026",
    desc: "Our flagship 48-hour national hackathon bringing together over 500+ builders to create systems, compilers, and web apps.",
    image: "/tsec_hacks_neon.png",
    stat: "500+ Registered",
  },
  {
    title: "React Native DevSprint",
    type: "WORKSHOP",
    date: "OCT 12, 2025",
    desc: "A fast-paced developer sprint teaching mobile architectures, native modules, and styling systems.",
    image: "/burnt_circuit_board.png",
    stat: "120+ Attendance",
  },
  {
    title: "Git & GitHub BootCamp",
    type: "WORKSHOP",
    date: "DEC 19, 2025",
    desc: "Deep diving into advanced git internals, cherry-picking, workflows, and production pull requests.",
    image: "/algorithms_vector_plot.png",
    stat: "80+ Systems Connected",
  },
  {
    title: "CodeQuest Coding Contest",
    type: "CONTEST",
    date: "NOV 05, 2025",
    desc: "Speed-running algorithmic, dynamic programming, and binary search tree problems in under 3 hours.",
    image: "/sketchbook_binary_tree.png",
    stat: "150+ Submissions",
  },
];
const sponsorLogos = [
  { src: "/sponsors/appwrite.png", alt: "Appwrite", scale: 1.6 },
  { src: "/sponsors/crosscope.png", alt: "Crosscope", scale: 2.6 },
  { src: "/sponsors/devfolio.png", alt: "Devfolio", scale: 1.5 },
  { src: "/sponsors/ethindia.png", alt: "ETHIndia", scale: 1.5 },
  { src: "/sponsors/foss.png", alt: "FOSS United", scale: 1.5 },
  { src: "/sponsors/github.png", alt: "GitHub", scale: 1.5 },
  { src: "/sponsors/hindustan.png", alt: "Hindustan", scale: 1.6 },
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
  { value: 500, suffix: "+", label: "Students Enrolled", sub: "Active guild members", podium: "metric-podium-1" },
  { value: 50, suffix: "+", label: "Weekly Challenges", sub: "Problems shipped", podium: "metric-podium-2" },
  { value: 20, suffix: "+", label: "Events Hosted", sub: "Hackathons & workshops", podium: "" },
  { value: 1000, suffix: "+", label: "Submissions", sub: "Compiler runs logged", podium: "" },
];



const ideFiles = [
  {
    id: "core",
    name: "core_nucleus.tsx",
    icon: Terminal,
    content: `// TSEC CodeCell - Core System
// ---------------------------
// For Beginners: We are a community that helps you start your tech journey.
// We teach you how to write your first lines of code and build projects.
//
// For Advanced Devs: We are a guild of systems engineers.
// We scale web apps, build compilers, and compete globally.

import { Community } from '@tsec/core';

export const CoreNucleus = () => {
  return (
    <Mission>
      Bridging the gap between academia and 
      modern software architecture.
      No matter your skill level, there is a place for you here.
    </Mission>
  );
};`,
    accent: "#E8FF00",
    colorClass: "text-[#E8FF00]",
    sequence: [
      "Initializing Core Engine v2.0...",
      "Allocating resources for Beginners...",
      "SUCCESS: Mentorship modules loaded.",
      "Compiling Advanced Algorithms...",
      "Optimizing system architecture...",
      "SUCCESS: Production environments ready.",
      "Connecting to global leaderboard...",
      "Bypassing mainframe security...",
      "ACCESS GRANTED.",
      "Welcome to TSEC CodeCell."
    ],
    output: (
      <>
        <h2 className="text-[#E8FF00] text-xl md:text-2xl font-bold mb-6">== CORE DIRECTORY ACCESS ==</h2>
        <p className="mb-6 text-base text-[#888]">
          TSEC CodeCell is not just another committee. We are a guild of builders, hackers, and systems engineers at Thadomal Shahani Engineering College. Our mission is to bridge the gap between academia and modern software architecture.
        </p>
        <div className="mb-6 border-l-2 border-[#4BE2C4] pl-4">
          <strong className="text-[#4BE2C4] text-base block mb-1">&gt;&gt; WHAT WE DO:</strong>
          Whether you are writing your very first line of code or deploying complex microservices, CodeCell is your sandbox. We learn logic building, compete in weekly coding challenges, explore new technologies, and build projects together.
        </div>
        <div className="mb-8 border-l-2 border-[#FF4D00] pl-4">
          <strong className="text-[#FF4D00] text-base block mb-1">&gt;&gt; THE VIBE:</strong>
          We host Thadomal's biggest 48-hour national hackathons, intense coding sandboxes, and exclusive masterclasses. It is all about building cool things, breaking them, and learning how they work under the hood.
        </div>
      </>
    )
  },
  {
    id: "competitive",
    name: "sandbox.cpp",
    icon: Terminal,
    content: `// Competitive Programming Sandbox
// -------------------------------
// Beginners: Learn logic building, loops, and basic arrays.
// Advanced: Master Dynamic Programming, Graph Theory, and Segment Trees.

#include <bits/stdc++.h>
using namespace std;

void crack_algorithm() {
    // We host weekly challenges for all levels.
    // Start small, climb the global leaderboard,
    // and prepare for top-tier tech interviews.
    
    execute_optimization_pass();
}`,
    accent: "#4BE2C4",
    colorClass: "text-[#4BE2C4]",
    sequence: [
      "Compiling sandbox.cpp with g++ -O3...",
      "Running test cases...",
      "Test Case 1: Passed (0.012s)",
      "Test Case 2: Passed (0.015s)",
      "Test Case 3: Passed (0.040s)",
      "SUCCESS: All tests passed.",
      "Analyzing complexity...",
      "Time: O(N log N) | Space: O(N)",
      "ACCESS GRANTED."
    ],
    output: (
      <>
        <h2 className="text-[#4BE2C4] text-xl md:text-2xl font-bold mb-6">== COMPETITIVE SANDBOX RESULTS ==</h2>
        <div className="mb-6 text-[#888] font-mono">
          Execution Time: <span className="text-[#e5e5e5]">0.067s</span><br />
          Memory Used: <span className="text-[#e5e5e5]">12.4 MB</span>
        </div>
        <div className="mb-6 border-l-2 border-[#4BE2C4] pl-4">
          <strong className="text-[#4BE2C4] text-base block mb-1">&gt;&gt; ALGORITHM ANALYSIS:</strong>
          Your implementation of the segment tree approach was optimal.
        </div>
        <div className="mb-8 border-l-2 border-[#E8FF00] pl-4">
          <strong className="text-[#E8FF00] text-base block mb-1">&gt;&gt; NEXT STEPS:</strong>
          Join our weekly competitive programming contests on Codeforces. Mentors are available in the Discord #cp-discussion channel.
        </div>
      </>
    )
  },
  {
    id: "hacks",
    name: "tsec_hacks.yml",
    icon: Award,
    content: `name: TSEC Hacks 2026
type: flagship_hackathon
duration: 48_hours
participants: 500+
description: >
  Our annual developer assembly.
  
  Beginners: Experience your first hackathon in a supportive
  environment with mentors guiding you.
  
  Advanced: 48 hours of intense coding, scaling systems,
  and competing for massive prize pools.
status: 'READY'`,
    accent: "#FF4D00",
    colorClass: "text-[#FF4D00]",
    sequence: [
      "Parsing YAML configuration...",
      "Validating hackathon parameters...",
      "Allocating 48 hours of compute...",
      "Connecting 500+ participants...",
      "Initializing prize pools...",
      "Setting up sponsor booths...",
      "SUCCESS: Event deployed.",
      "ACCESS GRANTED."
    ],
    output: (
      <>
        <h2 className="text-[#FF4D00] text-xl md:text-2xl font-bold mb-6">== TSEC HACKS 2026 STATUS ==</h2>
        <div className="mb-6 text-[#888] font-mono">
          Status: <span className="text-[#27c93f]">DEPLOYED & ACTIVE</span><br />
          Registrations: <span className="text-[#e5e5e5]">500+ Builders</span>
        </div>
        <div className="mb-6 border-l-2 border-[#4BE2C4] pl-4">
          <strong className="text-[#4BE2C4] text-base block mb-1">&gt;&gt; EVENT OVERVIEW:</strong>
          TSEC Hacks is a massive 48-hour caffeine-fueled hackathon. It doesn't matter if you are a first-timer building a simple website or a seasoned pro training AI models—this is where you team up, pitch wild ideas, and code them into reality.
        </div>
        <div className="mb-8 border-l-2 border-[#E8FF00] pl-4">
          <strong className="text-[#E8FF00] text-base block mb-1">&gt;&gt; WHAT TO EXPECT:</strong>
          Mentors to help you out when you get stuck, free food to keep you going, and massive prize pools for the most innovative hacks. Just bring your laptop and your imagination.
        </div>
      </>
    )
  },
  {
    id: "workshops",
    name: "bootcamps.sh",
    icon: Laptop,
    content: `#!/bin/bash
# CodeCell Masterclasses
# ----------------------
# Hands-on workshops led by senior devs.

echo "Level 1: Git, GitHub, and HTML/CSS Basics"
echo "Level 2: React, Node.js, and APIs"
echo "Level 3: Docker virtualization & Web Scaling"

# From writing 'Hello World' to deploying microservices.
deploy_workshops --mode=inclusive`,
    accent: "#4BE2C4",
    colorClass: "text-[#4BE2C4]",
    sequence: [
      "Executing bootcamps.sh...",
      "Pulling latest Docker images...",
      "Setting up Node.js environments...",
      "Provisioning AWS instances...",
      "SUCCESS: Masterclass environments ready.",
      "Broadcasting live streams...",
      "ACCESS GRANTED."
    ],
    output: (
      <>
        <h2 className="text-[#4BE2C4] text-xl md:text-2xl font-bold mb-6">== MASTERCLASS DEPLOYMENT ==</h2>
        <p className="mb-6 text-base text-[#888]">
          All learning environments have been successfully provisioned.
        </p>
        <div className="mb-8 border-l-2 border-[#4BE2C4] pl-4">
          <strong className="text-[#4BE2C4] text-base block mb-1">&gt;&gt; THE CURRICULUM:</strong>
          Our masterclasses cover everything you need to build real-world applications. We start with the basics like Git, GitHub, and HTML/CSS so everyone is on the same page, then quickly dive into React, Node.js, and scaling apps with Docker.
        </div>
        <div className="mb-8 border-l-2 border-[#FF4D00] pl-4">
          <strong className="text-[#FF4D00] text-base block mb-1">&gt;&gt; INSTRUCTIONS:</strong>
          Follow the senior developers' live streams. Interactive Q&A is enabled.
        </div>
      </>
    )
  },
  {
    id: "dive_to_code",
    name: "dive_to_code.js",
    icon: Sparkles,
    content: `// Dive to Code Event
// ------------------
// A comprehensive coding challenge designed for students to plunge into the depths of programming.
// Test your logical thinking and problem-solving skills against the best minds.

function initiateDive() {
  console.log("Preparing deployment environment...");
  console.log("Loading problem sets...");
  console.log("Connecting participants...");
  
  return {
    status: "READY",
    message: "Welcome to Dive to Code. Let the coding begin!"
  };
}`,
    accent: "#E8FF00",
    colorClass: "text-[#E8FF00]",
    sequence: [
      "Initializing Dive to Code engine...",
      "Connecting to participant pool...",
      "Loading algorithmic challenges...",
      "Validating test cases...",
      "SUCCESS: Environment ready.",
      "ACCESS GRANTED."
    ],
    output: (
      <>
        <h2 className="text-[#E8FF00] text-xl md:text-2xl font-bold mb-6">== DIVE TO CODE ACTIVE ==</h2>
        <div className="mb-6 text-[#888] font-mono">
          Status: <span className="text-[#27c93f]">ONLINE</span><br />
          Participants: <span className="text-[#e5e5e5]">200+ Enrolled</span>
        </div>
        <div className="mb-6 border-l-2 border-[#4BE2C4] pl-4">
          <strong className="text-[#4BE2C4] text-base block mb-1">&gt;&gt; EVENT DETAILS:</strong>
          Dive to Code is an immersive coding competition tailored for logic building and algorithmic thinking. Participants face increasingly difficult problems that test their mettle.
        </div>
        <div className="mb-8 border-l-2 border-[#FF4D00] pl-4">
          <strong className="text-[#FF4D00] text-base block mb-1">&gt;&gt; MISSION:</strong>
          Solve all the challenges within the time limit. May the best coder win.
        </div>
      </>
    )
  },
  {
    id: "brain_2_win",
    name: "brain2win.py",
    icon: Trophy,
    content: `# Brain 2 Win Competition
# -----------------------
# A fast-paced coding relay where speed and accuracy are paramount.
# Teams battle it out to solve problems in real-time.

def start_competition():
    print("Initializing Brain 2 Win servers...")
    print("Allocating problem queues...")
    print("Ready for team submissions!")

    while True:
        process_submissions()`,
    accent: "#00B4D8",
    colorClass: "text-[#00B4D8]",
    sequence: [
      "Booting Brain 2 Win sequence...",
      "Generating problem queue...",
      "Activating real-time leaderboard...",
      "SUCCESS: Servers operational.",
      "ACCESS GRANTED."
    ],
    output: (
      <>
        <h2 className="text-[#00B4D8] text-xl md:text-2xl font-bold mb-6">== BRAIN 2 WIN DASHBOARD ==</h2>
        <div className="mb-6 text-[#888] font-mono">
          System: <span className="text-[#27c93f]">STABLE</span><br />
          Mode: <span className="text-[#e5e5e5]">High-Speed Relay</span>
        </div>
        <div className="mb-6 border-l-2 border-[#E8FF00] pl-4">
          <strong className="text-[#E8FF00] text-base block mb-1">&gt;&gt; COMPETITION OVERVIEW:</strong>
          Brain 2 Win is a high-octane coding contest focusing on speed and accuracy. Teams must quickly decipher and solve problems before the clock runs out.
        </div>
        <div className="mb-8 border-l-2 border-[#FF4D00] pl-4">
          <strong className="text-[#FF4D00] text-base block mb-1">&gt;&gt; CURRENT LEADER:</strong>
          Team Alpha is currently dominating the leaderboard. Will your team rise to the challenge?
        </div>
      </>
    )
  }
];

function RunCodeOverlay({ file, onClose }: { file: typeof ideFiles[0], onClose: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(false);
  const isComplete = logs.length >= file.sequence.length;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < file.sequence.length) {
        setLogs(prev => [...prev, file.sequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowOutput(true), 800);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [file, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/95 backdrop-blur-md p-4"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 px-4 py-2 text-[#888] hover:text-[#fff] font-mono text-sm transition-colors"
      >
        [ X ] CANCEL
      </button>

      {!showOutput ? (
        <div className="w-full max-w-4xl p-8 font-mono text-sm md:text-base text-[#4BE2C4] drop-shadow-[0_0_10px_rgba(75,226,196,0.5)] flex flex-col items-start min-h-[400px]">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-2 ${log?.includes("SUCCESS") || log?.includes("GRANTED") || log?.includes("Welcome") ? "text-[#E8FF00]" : ""}`}
            >
              <span className="opacity-50 mr-4">{`[${(index * 0.4).toFixed(3)}s]`}</span>
              {log}
            </motion.div>
          ))}

          {!isComplete && (
            <div className="mt-4 animate-pulse">_</div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-3xl bg-[#0d0d0d] border border-[#333] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Mac-style Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-[#222]">
            <div className="flex gap-2">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center group transition-colors">
                <svg className="w-2 h-2 opacity-0 group-hover:opacity-100 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="font-mono text-xs text-[#888] tracking-widest uppercase">output.log</span>
            <button
              onClick={onClose}
              className="text-[#888] hover:text-[#fff] font-mono text-xs flex items-center gap-2 bg-[#222] hover:bg-[#333] px-3 py-1 rounded transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Output Content */}
          <div className="p-6 md:p-10 font-mono text-sm leading-relaxed text-[#e5e5e5] max-h-[70vh] overflow-y-auto hide-scrollbar relative">
            {file.output}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function InteractiveIde() {
  const [isRunning, setIsRunning] = useState(false);
  const [openFiles, setOpenFiles] = useState<string[]>(ideFiles.map(f => f.id));
  const [activeFileId, setActiveFileId] = useState<string | null>("core");

  const activeFile = activeFileId ? ideFiles.find((f) => f.id === activeFileId) || null : null;
  const [displayedContent, setDisplayedContent] = useState("");

  useEffect(() => {
    setDisplayedContent("");
    if (!activeFile) return;
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


export default function HomeSections() {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

  const SPEED = 48; // Pixels per second
  const PERK_ITEM_WIDTH = 228;
  const SPONSOR_ITEM_WIDTH = 280;

  const perksRepeats = 4;
  const sponsorsRepeats = 4;

  const perkDuration = (swagPerks.length * perksRepeats * PERK_ITEM_WIDTH) / (2 * SPEED);
  const sponsorDuration = (sponsorLogos.length * sponsorsRepeats * SPONSOR_ITEM_WIDTH) / (2 * SPEED);

  return (
    <div className="bg-[#0D0D0D]">
      {/* METRICS BENTO */}
      <SectionWrap>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, idx) => (
            <BentoMotion key={stat.label} delay={idx * 0.06}>
              <GlassCard
                className={`p-6 md:p-8 h-full glass-card-glow ${stat.podium}`}
              >
                <span className="text-label-tag text-[#8A8880] block mb-3">{stat.sub}</span>
                <p
                  className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${idx === 0 ? "text-[#E8FF00] neon-text-lime" : idx === 1 ? "text-[#4BE2C4] neon-text-cyan" : "text-[#F0EDE6]"
                    }`}
                >
                  <AnimatedNumber value={stat.value} />
                  {stat.suffix}
                </p>
                <p className="font-mono text-[10px] text-[#8A8880] mt-4 tracking-[0.2em] uppercase">
                  {stat.label}
                </p>
              </GlassCard>
            </BentoMotion>
          ))}
        </div>
      </SectionWrap>

      {/* INTERACTIVE IDE: WHAT IS CODECELL */}
      <SectionWrap id="what-is-codecell">
        <SectionHeader
          index="01 — WHAT IS CODECELL"
          title="Build. Compete. Ship."
          subtitle="// exploring the architecture of our technical guild"
        />
        <BentoMotion>
          <InteractiveIde />
        </BentoMotion>
      </SectionWrap>

      {/* EVENT TIMELINE */}
      <SectionWrap>
        <SectionHeader
          index="02 — PAST EVENTS"
          title="Event Archives"
          subtitle="// look back at hackathons and workshops"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-16 max-w-6xl mx-auto">
          {pastEvents.map((evt, idx) => {
            let cardClasses = "";
            if (idx === 0) cardClasses = "md:col-span-2 md:row-span-2 h-[400px] md:h-[520px]";
            else if (idx === 1) cardClasses = "md:col-span-1 md:row-span-1 h-[250px] md:h-[248px]";
            else if (idx === 2) cardClasses = "md:col-span-1 md:row-span-1 h-[250px] md:h-[248px]";
            else if (idx === 3) cardClasses = "md:col-span-3 md:row-span-1 h-[250px] md:h-[280px]";

            return (
              <BentoMotion key={evt.title} delay={idx * 0.1} className={cardClasses}>
                <GlassCard className="w-full h-full p-0 overflow-hidden group border border-[#222] hover:border-[#4BE2C4]/50 transition-all duration-500 relative flex flex-col justify-end bg-[#050505]">
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full">
                    <Image src={evt.image} alt={evt.title} fill className="object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 mix-blend-screen" />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/20 transition-all duration-500 group-hover:via-[#050505]/60" />

                  {/* Content */}
                  <div className="relative z-10 p-6 md:p-8 w-full flex flex-col h-full">
                    <div className="flex justify-between items-start mb-auto">
                      <span className="font-mono text-[10px] px-2 py-1 bg-[#111]/80 backdrop-blur border border-[#333] text-[#4BE2C4] uppercase tracking-widest rounded-sm group-hover:border-[#4BE2C4]/50 transition-colors shadow-[0_0_10px_rgba(75,226,196,0)] group-hover:shadow-[0_0_10px_rgba(75,226,196,0.2)]">
                        {evt.type}
                      </span>
                      <span className="font-mono text-[10px] text-[#888] bg-[#000]/50 px-2 py-1 rounded border border-transparent group-hover:border-[#333] transition-colors">{evt.date}</span>
                    </div>

                    <div className="mt-auto">
                      <h3 className={`font-display font-bold text-[#e5e5e5] uppercase tracking-wide group-hover:text-[#E8FF00] transition-colors ${idx === 0 ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
                        {evt.title}
                      </h3>

                      {/* Collapsible/Animated Description & Stats */}
                      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                        <div className="overflow-hidden">
                          <p className="text-sm text-[#aaa] font-sans leading-relaxed max-w-xl mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {evt.desc}
                          </p>
                          <div className="mt-4 flex items-center justify-between border-t border-[#333] pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                            <span className="font-mono text-xs text-[#4BE2C4] flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF00] animate-pulse" />
                              {evt.stat}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-[#111] border border-[#333] flex items-center justify-center group-hover:bg-[#E8FF00] group-hover:text-black transition-colors">
                              <ArrowRight size={14} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scanner Line Effect */}
                  <div className="absolute left-0 right-0 h-[2px] bg-transparent group-hover:bg-[#4BE2C4]/70 group-hover:shadow-[0_0_15px_#4BE2C4] top-0 -translate-y-full group-hover:translate-y-[600px] transition-all duration-[1.5s] ease-in-out z-20 pointer-events-none" />
                </GlassCard>
              </BentoMotion>
            )
          })}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#8A8880] hover:text-[#E8FF00] btn-sweep border border-[#2E2E2E] hover:border-[#E8FF00] px-5 py-2.5 transition-colors"
          >
            VIEW EVENT ARCHIVES <ArrowRight size={14} />
          </Link>
        </div>
      </SectionWrap>

      {/* PERKS: PODIUM + MARQUEE */}
      <SectionWrap>
        <SectionHeader
          index="03 — PERKS & PARTNERS"
          title="High-Value Ecosystem"
          subtitle="// global brands supporting our developers"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          <BentoMotion className="lg:col-span-2">
            <GlassCard className="p-8 md:p-10 h-full metric-podium-1 glass-card-glow">
              <Trophy className="text-[#E8FF00] mb-4" size={28} />
              <span className="text-label-tag text-[#8A8880]">// FLAGSHIP PRIZE POOL</span>
              <h3 className="text-h2-scale text-[#F0EDE6] mt-3 uppercase">TSEC Hacks 2026</h3>
              <p className="text-body-scale text-[#8A8880] mt-4 max-w-lg">
                500+ registered builders. 48-hour national hackathon. Cash prizes, mentorship, and production deployment experience.
              </p>
            </GlassCard>
          </BentoMotion>
          <BentoMotion delay={0.1}>
            <GlassCard className="p-8 h-full metric-podium-2 glass-card-glow flex flex-col justify-center">
              <span className="text-label-tag text-[#8A8880]">// WEEKLY REWARDS</span>
              <p className="font-display text-5xl font-bold text-[#4BE2C4] mt-3 neon-text-cyan">#048</p>
              <p className="font-mono text-xs text-[#8A8880] mt-2">Live challenge · Leaderboard XP</p>
            </GlassCard>
          </BentoMotion>
        </div>

        <GlassCard hover={false} className="py-6 overflow-hidden mb-6">
          <div className="premium-marquee px-6" style={{ animationDuration: `${perkDuration}s` }}>
            {[...swagPerks, ...swagPerks, ...swagPerks, ...swagPerks].map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div key={`${perk.label}-${i}`} className="flex items-center gap-3 shrink-0 px-4">
                  <Icon size={16} className="text-[#4BE2C4]" />
                  <span className="font-mono text-xs text-[#8A8880] tracking-wider uppercase whitespace-nowrap">
                    {perk.label}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard hover={false} className="py-8 overflow-hidden">
          <div className="premium-marquee flex items-center h-20" style={{ animationDuration: `${sponsorDuration}s` }}>
            {[...sponsorLogos, ...sponsorLogos, ...sponsorLogos, ...sponsorLogos].map((logo, idx) => (
              <div key={idx} className="shrink-0 flex items-center justify-center px-6 md:px-10 min-w-[120px]">
                <Image
                  src={`${logo.src}?v=2`}
                  alt={logo.alt}
                  width={150}
                  height={80}
                  className="w-32 md:w-44 h-auto max-h-16 object-contain opacity-80 hover:opacity-100 transition-opacity"
                  style={{ transform: logo.scale ? `scale(${logo.scale})` : "none" }}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </SectionWrap>


    </div>
  );
}
