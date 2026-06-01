"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, Shield, Terminal, Code, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const teamCrew = [
  { name: "Aryan Shah", role: "Lead Dev", handle: "@aryan_s", photo: "/team_lead.png" },
  { name: "Heena Kotwani", role: "Event Chair", handle: "@heena_k", photo: "/team_event.png" },
  { name: "Kabir Mehta", role: "Technical Head", handle: "@kabir_m", photo: "/team_tech.png" },
  { name: "Rhea Malhotra", role: "PR Manager", handle: "@rhea_m", photo: "/team_pr.png" },
];

const values = [
  { 
    icon: Code, 
    title: "Engineering Craft", 
    desc: "We focus on clean coding, micro-animations, and production-ready architectures. Slides don't build projects, code does." 
  },
  { 
    icon: Users, 
    title: "Community First", 
    desc: "A collaborative hub designed to accelerate learning, mentorship, and peer-to-peer code review workflows." 
  },
  { 
    icon: Shield, 
    title: "Algorithmic Integrity", 
    desc: "From Weekly Sandboxes to 48-Hour Hackathons, we evaluate raw engineering skills and competitive capabilities." 
  },
];

const faqs = [
  {
    q: "Who can join CodeCell?",
    a: "CodeCell is open to all students of Thadomal Shahani Engineering College (TSEC), Mumbai. Whether you are a beginner writing your first loop or an experienced dev shipping production apps, we have a place for you."
  },
  {
    q: "How do I participate in weekly challenges?",
    a: "Simply navigate to our /challenges portal, sign in with your student credentials, and solve the open problems inside our web compiler. Your points will be automatically added to the global leaderboard."
  },
  {
    q: "What technologies does CodeCell focus on?",
    a: "We focus on a wide range of modern technologies including Frontend (React, Next.js), Backend (FastAPI, Node.js), DevOps & infrastructure (Docker, Git), and Competitive Programming using C++, Python, and Java."
  },
  {
    q: "How can I join the core committee?",
    a: "Recruitment drives for the junior and senior committee take place at the start of the academic year. Stay tuned to our Instagram, WhatsApp, and Discord channels for announcements and application forms."
  },
  {
    q: "Is prior programming experience required?",
    a: "Not at all! We structure our workshops and coding sandboxes to accommodate all skill levels. We start from basic logic building and guide you up to systems design and competitive coding algorithms."
  }
];


export default function AboutUsPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0D0D0D] px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="mb-12 border-b border-[#2A2A2A] pb-8">
        <span className="font-mono text-xs text-[#E8FF00] tracking-[0.2em]">05 — ABOUT_DOSSIER</span>
        <h1 className="text-4xl sm:text-7xl lg:text-8xl font-bold uppercase leading-none tracking-tighter mt-2 text-[#F0EDE6]">
          WHO WE ARE
        </h1>
        <p className="font-mono text-xs text-[#4A4A4A] mt-4 tracking-wider">
          // The official development and competitive programming guild of TSEC, Mumbai.
        </p>
      </div>

      {/* Main Grid: 60/40 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
        {/* Left Column: Mission (60%) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h3 className="font-mono text-xs text-[#4BE2C4] tracking-widest uppercase mb-4">// GUILD_MISSION</h3>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase text-[#F0EDE6] tracking-tight mb-4 leading-snug">
              ACCELERATING STUDENT ENGINEERING CAPABILITIES
            </h2>
            <p className="font-sans text-sm text-[#4A4A4A] leading-relaxed mb-4">
              TSEC CodeCell serves as the primary technical nucleus for Thadomal Shahani Engineering College. We bridge the gap between academic guidelines and the fluid requirements of modern software engineering.
            </p>
            <p className="font-sans text-sm text-[#4A4A4A] leading-relaxed">
              We design sandboxes, organize workshops, compile programming directories, and host TSEC Hacks—our flagship hackathon. Every line of code written on our sandbox compiler represents a step towards mastering systems, UI, and computational algorithms.
            </p>
          </div>

          <hr className="border-[#2A2A2A]" />

          {/* Section 2: Values */}
          <div className="space-y-6">
            <h3 className="font-mono text-xs text-[#FF4D00] tracking-widest uppercase">// CORE_VALS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {values.map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <div key={idx} className="bg-[#141414] border border-[#2A2A2A] p-5 hover:border-[#E8FF00] transition-colors duration-300">
                    <IconComponent size={18} className="text-[#FF4D00] mb-3" />
                    <h4 className="font-mono font-bold uppercase text-xs text-[#F0EDE6] tracking-wider mb-2">{val.title}</h4>
                    <p className="font-sans text-[11px] text-[#4A4A4A] leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Code Stats & Portal info (40%) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="border border-[#2A2A2A] bg-[#141414] p-6 font-mono relative overflow-hidden">
            {/* Cybersecurity overlay accent */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#E8FF00]/10 to-transparent pointer-events-none" />
            <h3 className="text-[10px] text-[#4A4A4A] uppercase tracking-wider mb-4 border-b border-[#2A2A2A] pb-2">// SYSTEM_DUMP.sh</h3>
            <div className="space-y-3.5 text-xs text-[#F0EDE6]">
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">GUILD LEVEL:</span>
                <span className="text-[#E8FF00] font-bold">PRODUCTION</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">ACTIVE USERS:</span>
                <span>500+ SYSTEMS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">COMPILATION RATIO:</span>
                <span className="text-[#4BE2C4]">94.8% SUCCESS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">LOCATIONS:</span>
                <span>BANDRA, SECURE CLOUD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Crew Section */}
      <div className="border-t border-[#2A2A2A] pt-16">
        <div className="mb-10">
          <h3 className="font-mono text-xs text-[#E8FF00] tracking-widest uppercase mb-2">// COMMAND_REGISTRY</h3>
          <h2 className="text-2xl sm:text-4xl font-bold uppercase text-[#F0EDE6] tracking-tight">
            MEET THE CREW
          </h2>
        </div>

        {/* Grid for crew */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamCrew.map((member, idx) => (
            <div
              key={idx}
              className={`
                bg-[#111111]
                border
                border-[#222222]
                p-6
                flex
                flex-col
                items-center
                group
                transition-all
                duration-300
                ${idx % 2 === 0 ? "hover:border-[#E8FF00]" : "hover:border-[#4BE2C4]"}
                card-scanner
              `}
            >
              <div className="relative w-36 h-36 border border-[#2E2E2E] overflow-hidden bg-[#161616]">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="
                    object-cover
                    filter
                    grayscale
                    group-hover:grayscale-0
                    transition-all
                    duration-300
                    ease-in-out
                  "
                />
              </div>
              <h4 className="mt-4 font-sans text-sm font-semibold text-[#F0EDE6] tracking-wide">
                {member.name}
              </h4>
              <span className={`font-mono text-xs tracking-wider mt-1 ${idx % 2 === 0 ? "text-[#E8FF00]" : "text-[#4BE2C4]"}`}>
                {member.role}
              </span>
              <span className="font-mono text-[10px] text-[#8A8880] tracking-wider mt-0.5">
                {member.handle}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-[#2A2A2A] pt-16 mt-16 pb-12">
        <div className="mb-10">
          <h3 className="font-mono text-xs text-[#E8FF00] tracking-widest uppercase mb-2">// FAQ_REGISTRY</h3>
          <h2 className="text-2xl sm:text-4xl font-bold uppercase text-[#F0EDE6] tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="max-w-3xl flex flex-col divide-y divide-[#222222] border-t border-b border-[#222222]">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-4 select-none">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between py-2 text-left hover:text-[#E8FF00] transition-colors"
                >
                  <span className="font-sans text-sm font-bold uppercase tracking-tight text-[#F0EDE6] hover:text-[#E8FF00] transition-colors">
                    {faq.q}
                  </span>
                  <span className="font-mono text-xs ml-4 text-[#8A8880]">
                    {isOpen ? <Minus size={14} className="text-[#E8FF00]" /> : <Plus size={14} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-xs text-[#8A8880] leading-relaxed pt-2 pb-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
