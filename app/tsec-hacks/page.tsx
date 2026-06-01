"use client";

import Link from "next/link";
import { Terminal, Shield, Award, Calendar, HelpCircle, Code } from "lucide-react";

const tracks = [
  { name: "Web3 & Decentralization", desc: "Build decentralised dApps, smart contract configurations, or Web3 financial primitives." },
  { name: "AI & Machine Intelligence", desc: "Train local LLM agents, implement vector database optimizations, or construct model evaluations." },
  { name: "Developer Tooling", desc: "Optimize compiler outputs, create developer frameworks, CLI modules, or custom IDE plugins." },
  { name: "Open Innovation", desc: "Design a solution targeting any major real-world bottleneck using full-stack capabilities." },
];

const timeline = [
  { time: "09:00 AM", label: "Check-in & System Setup", date: "FEB 21, 2026" },
  { time: "11:00 AM", label: "Opening Ceremony", date: "FEB 21, 2026" },
  { time: "12:00 PM", label: "Coding Period Starts", date: "FEB 21, 2026" },
  { time: "04:00 PM", label: "Mentor Session 01", date: "FEB 21, 2026" },
  { time: "10:00 AM", label: "Progress Checkpoint 02", date: "FEB 22, 2026" },
  { time: "12:00 PM", label: "Final Submissions", date: "FEB 23, 2026" },
];

export default function TsecHacksPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 border-b border-[#2A2A2A] pb-8">
        <span className="font-mono text-xs text-[#FF4D00] tracking-[0.2em]">04 — CONFIG_DOSSIER</span>
        <h1 className="text-stroke font-bold uppercase leading-none tracking-tighter text-4xl sm:text-7xl lg:text-8xl mt-2">
          TSEC HACKS 2026
        </h1>
        <p className="font-mono text-xs text-[#4A4A4A] mt-4 tracking-wider">
          // The flagship 48-hour building sprint of Thadomal Shahani Engineering College.
        </p>
      </div>

      {/* Main Grid: 60/40 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Mission & Tracks (60%) */}
        <div className="lg:col-span-7 space-y-12">
          {/* Section 1: Overview */}
          <div>
            <h3 className="font-mono text-xs text-[#E8FF00] tracking-widest uppercase mb-4">// MISSION BRIEF</h3>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase text-[#F0EDE6] tracking-tight mb-4">
              48 HOURS. ONE SYSTEM. BUILD THE FUTURE.
            </h2>
            <p className="font-sans text-sm text-[#4A4A4A] leading-relaxed mb-4">
              TSEC Hacks is a highly selective hackathon where developer teams congregate to build web platforms, AI architectures, smart contracts, and tool systems. We emphasize raw engineering skills, clean architecture, and visual craft.
            </p>
            <p className="font-sans text-sm text-[#4A4A4A] leading-relaxed">
              No slides-only pitches. No pre-built boilerplate submissions. Our technical review team audits github branches periodically during the hackathon to verify project progression.
            </p>
          </div>

          <hr className="border-[#2A2A2A]" />

          {/* Section 2: Tracks */}
          <div>
            <h3 className="font-mono text-xs text-[#4BE2C4] tracking-widest uppercase mb-6">// SPONSOR TRACKS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tracks.map((t, idx) => (
                <div key={idx} className="bg-[#141414] border border-[#2A2A2A] p-6 hover:border-[#E8FF00] transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Code size={16} className="text-[#FF4D00]" />
                    <h4 className="font-display font-bold uppercase text-sm text-[#F0EDE6] tracking-wider">{t.name}</h4>
                  </div>
                  <p className="font-sans text-xs text-[#4A4A4A] leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Registration details (40%) */}
        <div className="lg:col-span-5 space-y-12">
          {/* Section 1: Quick details */}
          <div className="border border-[#2A2A2A] bg-[#141414] p-6 font-mono">
            <h3 className="text-[10px] text-[#4A4A4A] uppercase tracking-wider mb-4 border-b border-[#2A2A2A] pb-2">// QUICK_FACTS.sys</h3>
            <div className="space-y-3.5 text-xs text-[#F0EDE6]">
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">PRIZE POOL:</span>
                <span className="text-[#E8FF00] font-bold">₹1,50,000 INR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">LOCATION:</span>
                <span>ON-CAMPUS SPRINT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">TEAM LIMIT:</span>
                <span>2 - 4 MEMBERS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">ELIGIBILITY:</span>
                <span>ALL COLLEGE STUDENTS</span>
              </div>
            </div>
            <button className="
              w-full
              mt-6
              btn-sweep
              bg-[#4BE2C4]
              text-[#0D0D0D]
              border
              border-[#4BE2C4]
              py-3
              text-xs
              font-bold
              tracking-[0.15em]
            ">
              [ TRANSMIT REGISTRATION ]
            </button>
          </div>

          {/* Section 2: Timeline */}
          <div>
            <h3 className="font-mono text-xs text-[#FF4D00] tracking-widest uppercase mb-6">// EVENT TIMELINE</h3>
            <div className="border-l border-[#2A2A2A] ml-2 pl-4 space-y-6">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-[#0D0D0D] border-2 border-[#E8FF00] rounded-none" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-[#4A4A4A]">{item.date} • {item.time}</span>
                    <span className="font-mono text-xs font-bold text-[#F0EDE6] mt-0.5">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}