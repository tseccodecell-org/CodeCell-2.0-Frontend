"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code, Users, Shield, Github, Linkedin } from "lucide-react";
import AboutHero from "@/components/sections/AboutHero";
import {
  SectionHeader,
  SectionWrap,
  GlassCard,
  HexButton,
  PremiumFaq,
  BentoMotion,
  AnimatedNumber,
  type FaqItem,
} from "@/components/sections/SectionKit";



const values = [
  {
    icon: Code,
    title: "Engineering Craft",
    desc: "We focus on clean coding, micro-animations, and production-ready architectures. Slides don't build projects, code does.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "A collaborative hub designed to accelerate learning, mentorship, and peer-to-peer code review workflows.",
  },
  {
    icon: Shield,
    title: "Algorithmic Integrity",
    desc: "From Weekly Sandboxes to 48-Hour Hackathons, we evaluate raw engineering skills and competitive capabilities.",
  },
];

const timeline = [
  { year: "2023", title: "SYSTEM INIT", desc: "CodeCell kernel booted. First set of competitive challenges deployed." },
  { year: "2024", title: "V1.0 RELEASE", desc: "100+ students on the leaderboard. Hosted the first Git & Docker bootcamp." },
  { year: "2025", title: "TSEC HACKS", desc: "Flagship hackathon scaling to 500+ builders across the nation." },
  { year: "2026", title: "PROD STAGE", desc: "Current iteration. Building advanced systems and open-source contributions." },
];

const metrics = [
  { value: 500, suffix: "+", label: "Active Students", sub: "Guild members enrolled" },
  { value: 20, suffix: "+", label: "Events Hosted", sub: "Hackathons & workshops" },
  { value: 50, suffix: "+", label: "Challenges", sub: "Weekly problem sets" },
  { value: 94.8, suffix: "%", label: "Compile Success", sub: "Sandbox pass rate", isDecimal: true },
];

const faqs: FaqItem[] = [
  {
    q: "Who can join CodeCell?",
    a: "CodeCell is open to all students of Thadomal Shahani Engineering College (TSEC), Mumbai. Whether you are a beginner writing your first loop or an experienced dev shipping production apps, we have a place for you.",
  },
  {
    q: "How do I participate in weekly challenges?",
    a: "Simply navigate to our /challenges portal, sign in with your student credentials, and solve the open problems inside our web compiler. Your points will be automatically added to the global leaderboard.",
  },
  {
    q: "What technologies does CodeCell focus on?",
    a: "We focus on a wide range of modern technologies including Frontend (React, Next.js), Backend (FastAPI, Node.js), DevOps & infrastructure (Docker, Git), and Competitive Programming using C++, Python, and Java.",
  },
  {
    q: "How can I join the core committee?",
    a: "Recruitment drives for the junior and senior committee take place at the start of the academic year. Stay tuned to our Instagram, WhatsApp, and Discord channels for announcements and application forms.",
  },
  {
    q: "Is prior programming experience required?",
    a: "Not at all! We structure our workshops and coding sandboxes to accommodate all skill levels. We start from basic logic building and guide you up to systems design and competitive coding algorithms.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <AboutHero />

      {/* MISSION / VISION */}
      <SectionWrap id="mission">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <BentoMotion className="lg:col-span-7">
            <span className="text-label-tag text-[#E8FF00] block mb-4">// GUILD_MISSION</span>
            <h2 className="text-h1-scale font-bold uppercase text-[#F0EDE6] tracking-tight leading-[1.05] mb-8">
              Accelerating Student Engineering Capabilities
            </h2>
            <div className="space-y-6 text-body-scale text-[#8A8880] leading-relaxed max-w-2xl">
              <p>
                TSEC CodeCell serves as the primary technical nucleus for Thadomal Shahani Engineering College. We bridge the gap between academic guidelines and the fluid requirements of modern software engineering.
              </p>
              <p>
                We design sandboxes, organize workshops, compile programming directories, and host TSEC Hacks—our flagship hackathon. Every line of code written on our sandbox compiler represents a step towards mastering systems, UI, and computational algorithms.
              </p>
            </div>
            <Link
              href="/weekly"
              className="inline-flex items-center gap-2 mt-10 font-mono text-xs tracking-widest text-[#4BE2C4] hover:text-[#E8FF00] transition-colors"
            >
              ENTER SANDBOX →
            </Link>
          </BentoMotion>

          <BentoMotion className="lg:col-span-5" delay={0.12}>
            <div className="grid grid-cols-1 gap-4">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <GlassCard key={val.title} className="p-6 flex gap-5 glass-card-glow">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-[#161616] border border-[#2E2E2E] flex items-center justify-center">
                      <Icon size={20} className={idx === 0 ? "text-[#4BE2C4]" : idx === 1 ? "text-[#E8FF00]" : "text-[#FF4D00]"} />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-semibold text-[#F0EDE6] uppercase tracking-tight">
                        {val.title}
                      </h4>
                      <p className="text-sm text-[#8A8880] mt-2 leading-relaxed">{val.desc}</p>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </BentoMotion>
        </div>
      </SectionWrap>

      {/* METRICS BENTO */}
      <SectionWrap>
        <SectionHeader
          index="01 — IMPACT"
          title="By The Numbers"
          subtitle="// past achievements and live guild metrics"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {metrics.map((m, idx) => (
            <BentoMotion key={m.label} delay={idx * 0.06}>
              <GlassCard
                className={`p-6 md:p-8 h-full glass-card-glow ${idx < 2 ? (idx === 0 ? "metric-podium-1" : "metric-podium-2") : ""}`}
              >
                <p
                  className={`font-display text-4xl md:text-5xl font-bold tracking-tight ${idx === 0 ? "text-[#E8FF00]" : idx === 1 ? "text-[#4BE2C4]" : "text-[#F0EDE6]"
                    }`}
                >
                  {m.isDecimal ? (
                    m.value
                  ) : (
                    <AnimatedNumber value={m.value as number} />
                  )}
                  {m.suffix}
                </p>
                <p className="font-mono text-[10px] text-[#F0EDE6] mt-4 tracking-wider uppercase">{m.label}</p>
                <p className="text-label-tag text-[#8A8880] mt-2">{m.sub}</p>
              </GlassCard>
            </BentoMotion>
          ))}
        </div>
      </SectionWrap>

      {/* TIMELINE */}
      <SectionWrap>
        <SectionHeader
          index="02 — EVOLUTION"
          title="System History"
          subtitle="// boot sequence from kernel init to production"
        />
        <div className="relative max-w-3xl mx-auto pl-8 md:pl-10">
          <div className="timeline-rail" />
          <div className="space-y-12">
            {timeline.map((item, idx) => (
              <BentoMotion key={item.year} delay={idx * 0.1}>
                <div className="relative group pl-2">
                  <div className="absolute -left-8 md:-left-10 top-1 timeline-node-dot" />
                  <GlassCard className="p-6 md:p-8 glass-card-glow">
                    <span className="font-display text-3xl font-bold text-[#E8FF00]">{item.year}</span>
                    <h4 className="font-mono text-sm font-bold text-[#F0EDE6] uppercase mt-2 tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-sm text-[#8A8880] mt-3 leading-relaxed">{item.desc}</p>
                  </GlassCard>
                </div>
              </BentoMotion>
            ))}
          </div>
        </div>
      </SectionWrap>



      {/* FAQ */}
      <SectionWrap narrow>
        <SectionHeader
          index="03 — FAQ"
          title="Frequently Asked Questions"
          subtitle="// everything you need before your first commit"
          align="center"
        />
        <PremiumFaq faqs={faqs} />
      </SectionWrap>

      {/* CTA */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 cta-gradient-bg pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center max-w-xl mx-auto px-6"
        >
          <span className="text-label-tag text-[#4BE2C4] block mb-5">// READY TO COMPILE?</span>
          <h2 className="text-h1-scale font-bold uppercase text-[#F0EDE6] mb-6">Join The Guild</h2>
          <p className="text-body-scale text-[#8A8880] mb-8">
            Your first commit starts here.
          </p>
          <HexButton href="/weekly" label="START CODING" />
        </motion.div>
      </section>
    </div>
  );
}
