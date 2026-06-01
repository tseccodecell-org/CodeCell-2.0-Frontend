"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Terminal,
  Award,
  MessageSquare,
  Users,
  Sparkles,
  Laptop,
  Plus,
  Minus,
} from "lucide-react";
import CodeConsole from "@/components/sections/CodeConsole";
import GlitchText from "@/components/sections/GlitchText";

// Scrolling Ticker Data
const tickerItems = [
  "TSEC HACKS 2026 REGISTRATIONS OPEN",
  "WEEKLY CHALLENGE #48 LIVE",
  "LEADERBOARD UPDATED: @aryan_s LEADS",
  "SYSTEM DESIGN BOOTCAMP: REPLAY AVAILABLE",
  "500+ STUDENTS ENROLLED IN THE GUILD",
];

// Past Events Data
const pastEvents = [
  {
    title: "TSEC Hacks 2026",
    type: "HACKATHON",
    date: "FEB 21 - 23, 2026",
    desc: "Our flagship 48-hour national hackathon bringing together over 500+ builders to create systems, compilers, and web apps.",
    image: "/tsec_hacks_neon.png",
    stat: "500+ Registered"
  },
  {
    title: "React Native DevSprint",
    type: "WORKSHOP",
    date: "OCT 12, 2025",
    desc: "A fast-paced developer sprint teaching mobile architectures, native modules, and styling systems.",
    image: "/burnt_circuit_board.png",
    stat: "120+ Attendance"
  },
  {
    title: "Git & GitHub BootCamp",
    type: "WORKSHOP",
    date: "DEC 19, 2025",
    desc: "Deep diving into advanced git internals, cherry-picking, workflows, and production pull requests.",
    image: "/algorithms_vector_plot.png",
    stat: "80+ Systems Connected"
  },
  {
    title: "CodeQuest Coding Contest",
    type: "CONTEST",
    date: "NOV 05, 2025",
    desc: "Speed-running algorithmic, dynamic programming, and binary search tree problems in under 3 hours.",
    image: "/sketchbook_binary_tree.png",
    stat: "150+ Submissions"
  }
];

// Team Crew Data
const teamMembers = [
  // Core
  { name: "Aryan Shah", role: "Lead Dev / Chairperson", handle: "@aryan_s", photo: "/team_lead.png", teams: ["core", "tech"] },
  { name: "Heena Kotwani", role: "Event Chair / Vice Chair", handle: "@heena_k", photo: "/team_event.png", teams: ["core", "social"] },
  { name: "Kabir Mehta", role: "Technical Head", handle: "@kabir_m", photo: "/team_tech.png", teams: ["core", "tech"] },
  { name: "Rhea Malhotra", role: "PR Manager", handle: "@rhea_m", photo: "/team_pr.png", teams: ["core", "social"] },

  // Tech
  { name: "Rohan Kalra", role: "Senior Developer", handle: "@rohan_k", photo: "/team_tech.png", teams: ["tech"] },
  { name: "Priya Sharma", role: "Fullstack Dev", handle: "@priya_codes", photo: "/team_lead.png", teams: ["tech"] },
  { name: "Devansh Mehta", role: "Competitive Exec", handle: "@devansh_m", photo: "/team_event.png", teams: ["tech"] },

  // Design
  { name: "Tanmay Shah", role: "UI/UX Lead", handle: "@tanmay_s", photo: "/team_pr.png", teams: ["design"] },
  { name: "Ishita Desai", role: "Visual Designer", handle: "@ishita_d", photo: "/team_event.png", teams: ["design"] },
  { name: "Neil D'Souza", role: "Illustrator", handle: "@neil_dsouza", photo: "/team_tech.png", teams: ["design"] },

  // Social / Outreach
  { name: "Sana Khan", role: "Social Media Head", handle: "@sana_k", photo: "/team_pr.png", teams: ["social"] },
  { name: "Armaan Roy", role: "Outreach Lead", handle: "@armaan_r", photo: "/team_lead.png", teams: ["social"] }
];

// Sponsors Wall Data
const sponsors = [
  { name: "GitHub", info: "Official Hub" },
  { name: "Devfolio", info: "Hacking Partner" },
  { name: "Polygon", info: "Web3 Infrastructure" },
  { name: "Solana", info: "Decentralized Partner" },
  { name: "Vercel", info: "Deployment Engine" },
  { name: "Postman", info: "API Platform" }
];

// Testimonials Data
const testimonials = [
  {
    text: "CodeCell's weekly challenges completely changed the way I write code. I learned how to optimize algorithms and handle edge cases that aren't taught in class.",
    author: "Rohan Kalra",
    role: "Senior Student / SDE Intern"
  },
  {
    text: "Organizing TSEC Hacks with the team was an incredible experience. We built platforms that scaled to hundreds of concurrent users under intense pressure.",
    author: "Heena Kotwani",
    role: "Event Chair & Core Organizer"
  },
  {
    text: "CodeCell isn't just a committee; it's a developer launchpad. The mentorship, systems focus, and peer review workflows helped me land my first SDE role.",
    author: "Aditya Hegde",
    role: "Alumnus, SDE at Amazon"
  }
];

// FAQs Data
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

// Live Badge Countdowns
function LiveBadge() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 border border-[#222222] bg-[#111111] px-4 py-2 font-mono text-[11px] text-[#8A8880] w-fit">
      <span className="w-1.5 h-1.5 rounded-full bg-[#4BE2C4] animate-ping" />
      <span className="text-[#F0EDE6] font-bold">LIVE</span>
      <span>Challenge #048 — closes in</span>
      <span className="text-[#4BE2C4] font-bold">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  );
}

// Animated Numbers Count Up
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    const duration = 1500;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercentage = Math.min(progress / duration, 1);

      const easeProgress = progressPercentage * (2 - progressPercentage);
      const currentVal = Math.floor(easeProgress * value);
      setDisplayValue(currentVal);

      if (progressPercentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, value]);

  return <span ref={ref}>{displayValue}</span>;
}

// Fade reveal variants
const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Home() {
  const [activeTeamTab, setActiveTeamTab] = useState<"all" | "core" | "tech" | "design" | "social">("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Filter team members based on selected tab
  const filteredTeam = teamMembers.filter((member) => {
    if (activeTeamTab === "all") return true;
    return member.teams.includes(activeTeamTab);
  });

  return (
    <div className="relative w-full overflow-hidden bg-transparent">

      {/* ========================================================
          1. HERO SECTION
          ======================================================== */}
      <section className="page-grid min-h-[calc(100vh-80px)] py-12 relative items-center">
        <div className="col-content grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full z-10">
          {/* Left Column: Headline & Action */}
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <motion.div variants={heroItemVariants} className="space-y-1 lg:-mr-16 z-20">
              <h1 className="text-display-scale uppercase text-[#F0EDE6] select-none">
                LEARN.
              </h1>
              <h1 className="text-display-scale uppercase text-stroke-editorial select-none">
                BUILD.
              </h1>
              <h1 className="text-display-scale uppercase text-[#E8FF00] select-none">
                COMPETE.
              </h1>
            </motion.div>

            <motion.hr variants={heroItemVariants} className="border-[#222222] w-full my-8" />

            <motion.p variants={heroItemVariants} className="text-mono-body text-[#8A8880] leading-relaxed">
              <span className="text-[#E8FF00]">//</span> TSEC CodeCell is the primary technical nucleus for
              <br />
              &nbsp;&nbsp;&nbsp;Thadomal Shahani Engineering College, Mumbai.
            </motion.p>
            <br />
            {/* CTAs */}
            <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row gap-4 mt-8">
              <a href="https://forms.gle/... [Placeholder]" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                <button className="
                  w-full
                  btn-sweep
                  bg-[#E8FF00]
                  text-[#0D0D0D]
                  border
                  border-[#E8FF00]
                  px-8
                  py-3.5
                  font-mono
                  text-xs
                  font-bold
                  tracking-[0.12em]
                ">
                  [ JOIN THE GUILD ]
                </button>
              </a>
              <a href="#what-is-codecell" className="w-full sm:w-auto">
                <button className="
                  w-full
                  btn-sweep-cyan
                  bg-transparent
                  text-[#F0EDE6]
                  border
                  border-[#222222]
                  px-8
                  py-3.5
                  font-mono
                  text-xs
                  font-bold
                  tracking-[0.12em]
                ">
                  [ EXPLORE MISSION ]
                </button>
              </a>
            </motion.div>

            {/* Live Status Badge */}
            <motion.div variants={heroItemVariants} className="mt-8">
              <Link href="/challenges">
                <LiveBadge />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: CodeConsole typing rotation */}
          <div className="lg:col-span-5 w-full relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t border-l border-[#FF4D00] pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b border-r border-[#E8FF00] pointer-events-none" />
            <CodeConsole />
          </div>
        </div>

        {/* Hero Marquee Ticker */}
        <div className="col-bleed border-t border-b border-[#222222] py-2 mt-16 overflow-hidden bg-[#161616] w-full">
          <div className="hidden sm:flex animate-marquee-slow whitespace-nowrap gap-12 font-mono text-label-tag text-[#8A8880]">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={index} className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full ${index % 2 === 0 ? "bg-[#E8FF00]" : "bg-[#FF4D00]"}`} />
                {item}
              </span>
            ))}
          </div>

          <div className="flex sm:hidden overflow-x-auto no-scrollbar gap-3 px-6 whitespace-nowrap scroll-smooth">
            {tickerItems.map((item, index) => (
              <div
                key={index}
                className="bg-[#111111] border border-[#222222] px-3 py-1 font-mono text-[10px] text-[#F0EDE6] flex items-center gap-2"
              >
                <span className={`w-1 h-1 rounded-full ${index % 2 === 0 ? "bg-[#E8FF00]" : "bg-[#FF4D00]"}`} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          2. STATS SECTION
          ======================================================== */}
      <section className="relative w-full bg-[#111111] py-12 border-b border-[#222222] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden text-[18vw] font-bold text-stroke-editorial opacity-[0.02]">
          STATS
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#222222]">
            {/* Stat 1: 500+ Students */}
            <div className="flex flex-col items-center justify-center text-center p-4">
              <span className="font-mono text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#E8FF00] tracking-tight">
                <AnimatedNumber value={500} />+
              </span>
              <span className="text-label-tag text-[#8A8880] mt-3">STUDENTS</span>
            </div>
            {/* Stat 2: 50+ Challenges */}
            <div className="flex flex-col items-center justify-center text-center p-4">
              <span className="font-mono text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#4BE2C4] tracking-tight">
                <AnimatedNumber value={50} />+
              </span>
              <span className="text-label-tag text-[#8A8880] mt-3">CHALLENGES</span>
            </div>
            {/* Stat 3: 20+ Events */}
            <div className="flex flex-col items-center justify-center text-center p-4">
              <span className="font-mono text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#FF4D00] tracking-tight">
                <AnimatedNumber value={20} />+
              </span>
              <span className="text-label-tag text-[#8A8880] mt-3">EVENTS</span>
            </div>
            {/* Stat 4: 1000+ Submissions */}
            <div className="flex flex-col items-center justify-center text-center p-4">
              <span className="font-mono text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#4BE2C4] tracking-tight">
                <AnimatedNumber value={1000} />+
              </span>
              <span className="text-label-tag text-[#8A8880] mt-3">SUBMISSIONS</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. WHAT IS CODECELL
          ======================================================== */}
      <section id="what-is-codecell" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-b border-[#222222]">
        <div className="relative mb-12">
          <span className="hidden md:block absolute -left-16 top-1.5 font-mono text-[11px] text-[#E8FF00] tracking-widest">
            [ 01 — ]
          </span>
          <h2 className="text-h1-scale font-bold uppercase tracking-tight text-[#F0EDE6]">
            WHAT IS CODECELL?
          </h2>
          <p className="text-mono-body text-[#8A8880] mt-3">
            // exploring the bento architecture of our technical guild
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Guild Mission (Large: spans 2 cols) */}
          <div className="md:col-span-2 bg-[#111111] border border-[#222222] p-8 flex flex-col justify-between hover:border-[#E8FF00] transition-colors duration-300 relative overflow-hidden card-scanner group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E8FF00]/5 to-transparent pointer-events-none" />
            <div>
              <span className="font-mono text-[9px] text-[#E8FF00] uppercase tracking-wider block mb-4">// CORE_NUCLEUS.sh</span>
              <h3 className="font-display text-lg sm:text-2xl font-bold uppercase text-[#F0EDE6] tracking-tight mb-4">
                BUILDING PRODUCTION-READY SYSTEMS ENGINEERS
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#8A8880] leading-relaxed">
                TSEC CodeCell serves as the primary technical nucleus for Thadomal Shahani Engineering College, Mumbai. We bridge the gap between academic guidelines and the fluid requirements of modern software engineering. We focus on clean coding, systems design, and algorithmic execution. Every compiler block we ship helps students master web architectures, logic optimization, and peer-to-peer code review workflows.
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center border-t border-[#222222]/30 pt-4 text-[10px] font-mono text-[#3E3E3C]">
              <span>SYSTEM: ONLINE</span>
              <span className="text-[#E8FF00] font-bold">LOG_01 //</span>
            </div>
          </div>

          {/* Card 2: Weekly Sandboxes (1 col) */}
          <div className="bg-[#111111] border border-[#222222] p-8 flex flex-col justify-between hover:border-[#4BE2C4] transition-colors duration-300 card-scanner card-scanner-cyan group">
            <div>
              <Terminal size={24} className="text-[#4BE2C4] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-mono text-sm font-bold uppercase text-[#F0EDE6] tracking-wider mb-2">Weekly Sandboxes</h3>
              <span className="font-mono text-[9px] text-[#8A8880] uppercase tracking-wider block mb-3">// ALGORITHMIC TRIALS</span>
              <p className="font-sans text-xs text-[#8A8880] leading-relaxed">
                Crack tree serialized paths, binary search tree solutions, and DP matrices in our compiler sandbox environment.
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center text-[10px] font-mono text-[#3E3E3C]">
              <span>COMPILER VER: v2.0</span>
              <span className="text-[#4BE2C4]">LOG_02 //</span>
            </div>
          </div>

          {/* Card 3: Flagship Hackathons (1 col) */}
          <div className="bg-[#111111] border border-[#222222] p-8 flex flex-col justify-between hover:border-[#FF4D00] transition-colors duration-300 card-scanner group">
            <div>
              <Award size={24} className="text-[#FF4D00] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-mono text-sm font-bold uppercase text-[#F0EDE6] tracking-wider mb-2">TSEC Hacks</h3>
              <span className="font-mono text-[9px] text-[#8A8880] uppercase tracking-wider block mb-3">// 48-HOUR SPRINT</span>
              <p className="font-sans text-xs text-[#8A8880] leading-relaxed">
                48 hours of intense coding, scaling, and systems deployment. Join 500+ builders in our annual developer assembly.
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center text-[10px] font-mono text-[#3E3E3C]">
              <span>REGISTERED: 500+</span>
              <span className="text-[#FF4D00]">LOG_03 //</span>
            </div>
          </div>

          {/* Card 4: Dev Bootcamps (1 col) */}
          <div className="bg-[#111111] border border-[#222222] p-8 flex flex-col justify-between hover:border-[#4BE2C4] transition-colors duration-300 card-scanner card-scanner-cyan group">
            <div>
              <Laptop size={24} className="text-[#4BE2C4] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-mono text-sm font-bold uppercase text-[#F0EDE6] tracking-wider mb-2">Dev Bootcamps</h3>
              <span className="font-mono text-[9px] text-[#8A8880] uppercase tracking-wider block mb-3">// SYSTEMS WORKSHOPS</span>
              <p className="font-sans text-xs text-[#8A8880] leading-relaxed">
                Unlocking Docker virtualization, git pipelines, and web scaling masterclasses led by senior committee devs.
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center text-[10px] font-mono text-[#3E3E3C]">
              <span>PLATFORMS: DOCKER / GIT</span>
              <span className="text-[#4BE2C4]">LOG_04 //</span>
            </div>
          </div>

          {/* Card 5: Streaks & Leaderboards (1 col) */}
          <div className="bg-[#111111] border border-[#222222] p-8 flex flex-col justify-between hover:border-[#E8FF00] transition-colors duration-300 card-scanner group">
            <div>
              <Sparkles size={24} className="text-[#E8FF00] mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-mono text-sm font-bold uppercase text-[#F0EDE6] tracking-wider mb-2">Leaderboards</h3>
              <span className="font-mono text-[9px] text-[#8A8880] uppercase tracking-wider block mb-3">// ACTIVE RANKINGS</span>
              <p className="font-sans text-xs text-[#8A8880] leading-relaxed">
                Log compilation hits, claim weekly streaks, and track real-time scores against the best coders in the college.
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center text-[10px] font-mono text-[#3E3E3C]">
              <span>METRIC: ACCURACY</span>
              <span className="text-[#E8FF00]">LOG_05 //</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. PAST EVENTS GALLERY
          ======================================================== */}
      <section className="py-24 px-6 md:px-12 lg:px-24 border-b border-[#222222] max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          className="relative mb-12 flex flex-col md:flex-row md:items-end justify-between"
        >
          <span className="hidden md:block absolute -left-16 top-1.5 font-mono text-[11px] text-[#E8FF00] tracking-widest">
            [ 01 — ]
          </span>
          <div>
            <h2 className="text-h1-scale font-bold uppercase tracking-tight text-[#F0EDE6]">
              PAST EVENTS GALLERY
            </h2>
            <p className="text-mono-body text-[#8A8880] mt-3">
              // look back at hackathons and workshops
            </p>
          </div>
          <Link
            href="/events"
            className="mt-4 md:mt-0 font-mono text-xs font-bold tracking-widest text-[#E8FF00] hover:text-[#A8D8FF] transition-colors"
          >
            [ VIEW EVENT ARCHIVES → ]
          </Link>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pastEvents.map((evt, idx) => (
            <div
              key={idx}
              className="group bg-[#111111] border border-[#222222] overflow-hidden flex flex-col hover:border-[#E8FF00] transition-colors duration-300 relative"
            >
              {/* Event Image Banner */}
              <div className="relative h-44 w-full border-b border-[#222222] bg-[#161616] overflow-hidden">
                <Image
                  src={evt.image}
                  alt={evt.title}
                  fill
                  className="object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#0D0D0D] border border-[#222222] px-2 py-0.5 font-mono text-[9px] text-[#4BE2C4] font-bold">
                  {evt.type}
                </div>
              </div>

              {/* Event Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#8A8880] block mb-1">{evt.date}</span>
                  <h3 className="font-sans text-sm font-bold uppercase tracking-tight text-[#F0EDE6] mb-3 group-hover:text-[#E8FF00] transition-colors">
                    {evt.title}
                  </h3>
                  <p className="font-sans text-xs text-[#8A8880] leading-relaxed">
                    {evt.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#222222]/30 flex justify-between items-center text-[10px] font-mono text-[#3E3E3C]">
                  <span>METRIC: {evt.stat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* ========================================================
          6. TEAM SECTION (Core, Tech, Design, Social)
          ======================================================== */}
      <section className="py-24 px-6 md:px-12 lg:px-24 border-b border-[#222222] max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          className="relative mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <span className="hidden md:block absolute -left-16 top-1.5 font-mono text-[11px] text-[#E8FF00] tracking-widest">
            [ 03 — ]
          </span>
          <div>
            <h2 className="text-h1-scale font-bold uppercase tracking-tight text-[#F0EDE6]">
              COMMITTEE CREW
            </h2>
            <p className="text-mono-body text-[#8A8880] mt-3">
              // the active developers, designers, and organizers shaping the guild
            </p>
          </div>

          {/* Interactive Filters */}
          <div className="flex flex-wrap gap-2 font-mono text-[10px]">
            {(["all", "core", "tech", "design", "social"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTeamTab(tab)}
                className={`
                  px-3
                  py-1.5
                  border
                  font-bold
                  tracking-wider
                  uppercase
                  transition-all
                  duration-200
                  ${activeTeamTab === tab
                    ? "bg-[#E8FF00] text-[#0D0D0D] border-[#E8FF00]"
                    : "bg-transparent text-[#8A8880] border-[#222222] hover:border-[#4BE2C4] hover:text-[#4BE2C4]"
                  }
                `}
              >
                [ {tab} ]
              </button>
            ))}
          </div>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTeam.map((member, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={member.name}
                className={`
                  bg-[#111111]
                  border
                  border-[#222222]
                  p-5
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
                <div className="relative w-32 h-32 border border-[#2E2E2E] overflow-hidden bg-[#161616]">
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
                <h4 className="mt-4 font-sans text-xs font-semibold text-[#F0EDE6] tracking-wide text-center">
                  {member.name}
                </h4>
                <span className={`font-mono text-[9px] tracking-wider mt-1 text-center ${idx % 2 === 0 ? "text-[#E8FF00]" : "text-[#4BE2C4]"}`}>
                  {member.role}
                </span>
                <span className="font-mono text-[9px] text-[#8A8880] tracking-wider mt-0.5">
                  {member.handle}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ========================================================
          7. SPONSORS / PARTNERS
          ======================================================== */}
      <section className="py-24 px-6 md:px-12 lg:px-24 border-b border-[#222222] max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          className="relative mb-12"
        >
          <span className="hidden md:block absolute -left-16 top-1.5 font-mono text-[11px] text-[#E8FF00] tracking-widest">
            [ 04 — ]
          </span>
          <h2 className="text-h1-scale font-bold uppercase tracking-tight text-[#F0EDE6]">
            SPONSORS & PARTNERS
          </h2>
          <p className="text-mono-body text-[#8A8880] mt-3">
            // global brands supporting our developers
          </p>
        </motion.div>

        {/* Sponsor grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 select-none">
          {sponsors.map((brand) => (
            <div
              key={brand.name}
              className="
                group
                bg-[#111111]
                border
                border-[#222222]
                py-8
                px-4
                flex
                flex-col
                items-center
                justify-center
                text-center
                hover:border-[#E8FF00]
                transition-colors
                duration-300
              "
            >
              <span className="font-mono text-sm font-black tracking-[0.2em] text-[#8A8880] group-hover:text-[#E8FF00] transition-colors uppercase">
                {brand.name}
              </span>
              <span className="font-mono text-[9px] text-[#3E3E3C] mt-2 block tracking-wider uppercase">
                // {brand.info}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          8. TESTIMONIALS
          ======================================================== */}
      <section className="py-24 px-6 md:px-12 lg:px-24 border-b border-[#222222] max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          className="relative mb-12"
        >
          <span className="hidden md:block absolute -left-16 top-1.5 font-mono text-[11px] text-[#E8FF00] tracking-widest">
            [ 05 — ]
          </span>
          <h2 className="text-h1-scale font-bold uppercase tracking-tight text-[#F0EDE6]">
            GUILD VOICE
          </h2>
          <p className="text-mono-body text-[#8A8880] mt-3">
            // reviews from students and alumni in engineering
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#111111] border border-[#222222] p-8 flex flex-col justify-between hover:border-[#4BE2C4] transition-colors duration-300 relative group"
            >
              <div>
                <MessageSquare className="text-[#3E3E3C] mb-6 group-hover:text-[#4BE2C4] transition-colors" size={20} />
                <p className="font-sans text-xs text-[#8A8880] leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#222222]/30">
                <h4 className="font-sans text-xs font-bold text-[#F0EDE6] uppercase tracking-wide">
                  {t.author}
                </h4>
                <span className="font-mono text-[9px] text-[#4BE2C4] uppercase tracking-wider block mt-0.5">
                  {t.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          10. FAQ SECTION
          ======================================================== */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          className="relative mb-12"
        >
          <span className="hidden md:block absolute -left-16 top-1.5 font-mono text-[11px] text-[#E8FF00] tracking-widest">
            [ 07 — ]
          </span>
          <h2 className="text-h1-scale font-bold uppercase tracking-tight text-[#F0EDE6]">
            FAQ
          </h2>
          <p className="text-mono-body text-[#8A8880] mt-3">
            // system queries and compiler configuration parameters
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto flex flex-col divide-y divide-[#222222] border-t border-b border-[#222222]">
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
      </section>

    </div>
  );
}

