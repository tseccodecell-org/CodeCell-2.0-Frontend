"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Orbitron } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Code, Users, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import AboutHero from "@/components/sections/AboutHero";
import {
  SectionHeader,
  SectionWrap,
  GlassCard,
  PremiumFaq,
  BentoMotion,
  type FaqItem,
} from "@/components/sections/SectionKit";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-orbitron",
});

function GithubIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.3-.52-1.5.11-3.12 0 0 .97-.31 3.18 1.18a10.9 10.9 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.62.24 2.82.12 3.12.74.8 1.18 1.83 1.18 3.09 0 4.43-2.68 5.4-5.24 5.69.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

const teamCrew = [
  {
    name: "Aryan Bhuimbar",
    role: "Marketing, Design & Overall Coordination",
    handle: "@aryan.b",
    photo: "/Scoms%20pics/Aryan.jpeg",
    team: "Scom",
    github: "https://github.com/Aryan-26",
    linkedin: "https://in.linkedin.com/in/aryanbhuimbar",
  },
  {
    name: "Darryl Mathias",
    role: "Tech (Backend, DevOps & Cloud)",
    handle: "@darryl.m",
    photo: "/Scoms%20pics/darryl.jpg",
    team: "Scom",
    github: " https://darrylmathias.tech",
    linkedin: "https://www.linkedin.com/in/darryl-mathias-020241317/",
  },
  {
    name: "Darsh Nagrani",
    role: "Marketing & Tech (Problem Setting & Backend)",
    handle: "@darsh.n",
    photo: "/Scoms%20pics/Darsh.png",
    team: "Scom",
    github: "https://github.com/darshnagraniwork-png",
    linkedin: "https://www.linkedin.com/in/darsh-nagrani",
    position: "object-top",
  },
  {
    name: "Krishna Jaiswal",
    role: "Tech (Frontend & Backend)",
    handle: "@krishna.j",
    photo: "/Scoms%20pics/Krishna.jpg",
    team: "Scom",
    github: "https://github.com/Coderkrishna12",
    linkedin: "https://www.linkedin.com/in/krishna-jaiswal10/",
  },
  {
    name: "Laksh Shetty",
    role: "Tech & Documentation",
    handle: "@laksh.s",
    photo: "/Scoms%20pics/Laksh.jpg",
    team: "Scom",
    github: "https://github.com/Laksh-Shetty",
    linkedin: "https://in.linkedin.com/in/laksh-shetty-4bb576307",
  },
  {
    name: "Omkar Kolhe",
    role: "Tech(Frontend, Problem Setting) and Design",
    handle: "@omkar.k",
    photo: "/Scoms%20pics/Omkar.jpeg",
    team: "Scom",
    github: "https://github.com/Omkar-Kolhe",
    linkedin: "https://www.linkedin.com/in/omkarkolhe14/",
  },
  {
    name: "Piyusha Bhadane",
    role: "Design, Tech (Frontend) & Brochure",
    handle: "@piyusha.b",
    photo: "/Scoms%20pics/Piyusha.jpg",
    team: "Scom",
    github: "https://github.com/bhadanepiyusha",
    linkedin: "https://www.linkedin.com/in/piyusha-bhadane-47077b329/",
  },
  {
    name: "Pranav Soneji",
    role: "Coordinations, Marketing & Tech",
    handle: "@pranav.s",
    photo: "/Scoms%20pics/pranav.jpg",
    team: "Scom",
    github: "https://github.com/PranavSoneji-07",
    linkedin: "https://www.linkedin.com/in/pranav-soneji",
  },
  {
    name: "Rucha Sinkar",
    role: "Tech (Backend) & Design",
    handle: "@rucha.s",
    photo: "/Scoms%20pics/Rucha.jpg",
    team: "Scom",
    github: "https://github.com/RuchaSinkar",
    linkedin: "https://www.linkedin.com/in/rucha-sinkar-b81003322/",
    position: "object-[35%_5%]",
  },
  {
    name: "Sanket Bhandari",
    role: "Tech (Backend) & Documentation",
    handle: "@sanket.b",
    photo: "/Scoms%20pics/sanket.jpg",
    team: "Scom",
    github: "https://github.com/SanketBhandarii",
    linkedin: "https://linkedin.com/in/sanketbhandari",
    position: "object-[center_35%]",
  },
  {
    name: "Shaurya Wajge",
    role: "Tech (Frontend, Backend & Integration)",
    handle: "@shaurya.w",
    photo: "/Scoms%20pics/shaurya.jpeg",
    team: "Scom",
    github: "https://github.com/shaurya-w",
    linkedin: "https://in.linkedin.com/in/shaurya-wajge",
  },
  {
    name: "Shivam Thakur",
    role: "Tech (Backend)",
    handle: "@shivam.t",
    photo: "/Scoms%20pics/Shivam.jpg",
    team: "Scom",
    github: "https://github.com/codexllamma",
    linkedin: "https://www.linkedin.com/in/shivam-thakur-a404a033b/",
  },
  {
    name: "Shloka Shetiya",
    role: "Tech (Frontend & Backend)",
    handle: "@shloka.s",
    photo: "/Scoms%20pics/Shloka.png",
    team: "Scom",
    github: "https://github.com/Shloka21",
    linkedin: "https://www.linkedin.com/in/shloka-shetiya-534bb0265",
  },
  {
    name: "Shreya Awari",
    role: "Logistics & Coordination",
    handle: "@shreya.a",
    photo: "/Scoms%20pics/Shreya.jpg",
    team: "Scom",
    github: "https://github.com/shreyaawari28",
    linkedin: "https://www.linkedin.com/in/shreya-awari-"
  },
  {
    name: "Soham Keswani",
    role: "Marketing, Design ,Tech & Overall Coordination",
    handle: "@soham.k",
    photo: "/Scoms%20pics/Soham.jpg",
    team: "Scom",
    github: "https://github.com/sohamk273",
    linkedin: "https://www.linkedin.com/in/soham-keswani-b7b1a6355/",
  },
  {
    name: "Suhani Motwani",
    role: "Marketing, Overall Coordination & Tech",
    handle: "@suhani.m",
    photo: "/Scoms%20pics/Suhani.jpg",
    team: "Scom",
    github: "https://github.com/SuhaniMotwani",
    linkedin: "https://www.linkedin.com/in/suhani-motwani-502b7135a/",
  },
  {
    name: "Tanvir Singh Kohli",
    role: "Marketing, Design & Tech",
    handle: "@tanvir.s",
    photo: "/Scoms%20pics/Tanvir.jpeg",
    team: "Scom",
    github: "https://github.com/MrTSinghK",
    linkedin:
      "https://www.linkedin.com/in/tanvir-harpreet-singh-kohli-a45716219/",
  },
  {
    name: "Tejas Halvankar",
    role: "Marketing, Design & Tech",
    handle: "@tejas.h",
    photo: "/Scoms%20pics/Tejas.jpg",
    team: "Scom",
    github: "https://github.com/Tejas-H01",
    linkedin: "https://www.linkedin.com/in/tejashalvankar",
  },
  {
    name: "Wilbert Nadar",
    role: "Tech (Backend & Problem Setting)",
    handle: "@wilbert.n",
    photo: "/Scoms%20pics/Wilbert.jpg",
    team: "Scom",
    github: "https://github.com/wilbert0838n",
    linkedin: "https://www.linkedin.com/in/wilbert-nadar/",
  },
  {
    name: "Yachna Sharma",
    role: "Design & Brochure",
    handle: "@yachna.s",
    photo: "/Scoms%20pics/Yachna.jpg",
    team: "Scom",
    github: "https://github.com/yach26",
    linkedin: "https://www.linkedin.com/in/yachna-sharma-005063346",
  },
  {
    name: "Krishna Phirke",
    role: "",
    handle: "@krishna.p",
    photo: "/Codecell%20Jcoms%20pics/Krishna_Photo.png",
    team: "jcom",
    github: "https://github.com/krishnaphirke",
    linkedin: "https://www.linkedin.com/in/krishnayuvarajphirke",
  },
  {
    name: "Atharva Davkhar",
    role: "",
    handle: "@atharva.d",
    photo: "/Codecell%20Jcoms%20pics/AtharvaDavkhar_photo.png",
    team: "jcom",
    github: "https://github.com/davkharatharva",
    linkedin:
      "https://www.linkedin.com/in/atharva-davkhar-2622b23b6?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    name: "Tiya Jain",
    role: "",
    handle: "@tiya.j",
    photo: "/Codecell%20Jcoms%20pics/Tiya_photo.png",
    team: "jcom",
    github: "https://github.com/tiyaj",
    linkedin: "https://linkedin.com/in/tiya-jain-2a44a5387",
  },
  {
    name: "Naman Sabhagani",
    role: "",
    handle: "@naman.s",
    photo: "/Codecell%20Jcoms%20pics/Naman_photo.png",
    team: "jcom",
    github: "https://github.com/nmn-s",
    linkedin:
      "https://www.linkedin.com/in/naman-sabhagani-3068323b8?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    name: "Anuj Gupta",
    role: "",
    handle: "@anuj.g",
    photo: "/Codecell%20Jcoms%20pics/AnujGupta.png",
    team: "jcom",
    github: "https://github.com/anuj-devspace",
    linkedin: "https://www.linkedin.com/in/anuj-gupta-25a0ab376",
  },
  {
    name: "Atharva Deshmukh",
    role: "",
    handle: "@atharva.de",
    photo: "/Codecell%20Jcoms%20pics/Atharva_Deshmukh.jpg",
    team: "jcom",
    github: "https://github.com/atharvadeshmukh10",
    linkedin: "https://www.linkedin.com/in/atharva-deshmukh-318316356",
  },
  {
    name: "Yash Kirpalani",
    role: "",
    handle: "@yash.k",
    photo: "/Codecell%20Jcoms%20pics/Yash_photo.jpg",
    team: "jcom",
    github: "https://github.com/YashKirpalani",
    linkedin: "",
  },
  {
    name: "Purva Bhagwani",
    role: "",
    handle: "@purva.b",
    photo: "/Codecell%20Jcoms%20pics/Purva_photo.png",
    team: "jcom",
    github: "https://github.com/PurvaBhagwani07",
    linkedin: "https://www.linkedin.com/in/purva-bhagwani07/",
  },
  {
    name: "Ananya Puranik",
    role: "",
    handle: "@ananya.p",
    photo: "/Codecell%20Jcoms%20pics/ananya_photo.jpg",
    team: "jcom",
    github: "https://github.com/anabanana2617",
    linkedin:
      "https://www.linkedin.com/in/ananya-puranik-170018370?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    name: "Ankita Dharmani",
    role: "",
    handle: "@ankita.d",
    photo: "/Codecell%20Jcoms%20pics/Ankita_Photo.jpeg",
    team: "jcom",
    github: "https://github.com/ankidharmani-tech",
    linkedin: "https://www.linkedin.com/in/ankita-dharmani/",
  },
  {
    name: "Jiya Ganwani",
    role: "",
    handle: "@jiya.g",
    photo: "/Codecell%20Jcoms%20pics/jiya_photo.png",
    team: "jcom",
    github: "https://github.com/jiyaganwani15",
    linkedin: "https://www.linkedin.com/in/jiya-ganwani-7397543b9",
  },
  {
    name: "Ishaan Kumar",
    role: "",
    handle: "@ishaan.k",
    photo: "/Codecell%20Jcoms%20pics/Ishaan_Photo.jpg",
    team: "jcom",
    github: "https://github.com/ishaaaaaaan-nismo",
    linkedin:
      "https://www.linkedin.com/in/ishaan-kumar-9252b2392?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    name: "Aum Nair",
    role: "",
    handle: "@aum.n",
    photo: "/Codecell%20Jcoms%20pics/Aum_Photo.png",
    team: "jcom",
    github: "https://github.com/4umN",
    linkedin: "https://www.linkedin.com/in/aum-nair-70504b367?trk=contact-info",
  },
  {
    name: "Keshav Ashar",
    role: "",
    handle: "@keshav.a",
    photo: "/Codecell%20Jcoms%20pics/Keshav.jpg",
    team: "jcom",
    github: "https://github.com/Vertician",
    linkedin: "https://www.linkedin.com/in/keshav-a-628927359/",
  },
  {
    name: "Pranav Dewoolkar",
    role: "",
    handle: "@pranav.d",
    photo: "/Codecell%20Jcoms%20pics/Pranav%20Dewoolkar.jpg",
    team: "jcom",
    github: "https://github.com/2166pranav",
    linkedin: "https://www.linkedin.com/in/pranav-dewoolkar-bb9a38285/",
  },
  {
    name: "Dhanvin Penkar",
    role: "",
    handle: "@dhanvin.p",
    photo: "/Codecell%20Jcoms%20pics/Dhanvin_Photo.png",
    team: "jcom",
    github: "https://github.com/DaddyisLegit",
    linkedin: "https://in.linkedin.com/in/dhanvin-penkar-4356943b9",
  },
  {
    name: "Jordan Mendonca",
    role: "",
    handle: "@jordan.m",
    photo: "/Codecell%20Jcoms%20pics/Jordan_Photo.jpg",
    team: "jcom",
    github: "https://github.com/jordan210507",
    linkedin: "https://www.linkedin.com/in/jordan21/",
  },
  {
    name: "Associated Professor",
    role: "Associated Professor",
    handle: "",
    photo: "/professor/associated_prof.jpeg",
    team: "assoc",
    github: "",
    linkedin: "",
  },
];

const values = [
  {
    icon: Code,
    title: "Engineering Craft",
    desc: "Clean code and production-ready builds. We ship projects, not slides.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "A hub for mentorship, peer review, and learning by building together.",
  },
  {
    icon: Shield,
    title: "Algorithmic Integrity",
    desc: "Sandboxes and hackathons that test real, raw engineering skill.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "How can I join CodeCell?",
    a: "Every academic year, CodeCell conducts a recruitment process for both junior and senior positions. Keep an eye on our announcements for interview registrations and application details.",
  },
  {
    q: "Is there a hierarchy in CodeCell?",
    a: "Not at all. We believe in collaboration over hierarchy—everyone contributes as an equal, shares ideas freely, and works together to build impactful projects and events.",
  },
  {
    q: "What is CodeCell's flagship event?",
    a: "TSEC Hacks is our flagship hackathon, bringing together innovators, developers, and creators to solve real-world problems through technology.",
  },
  {
    q: "What other events does CodeCell organize?",
    a: "Throughout the year, we host Weekly Challenges, Dive Into Code sessions, Enigma, hands-on workshops, and other engaging technical events to keep learning fun and consistent.",
  },
  {
    q: "What skills can I develop at CodeCell?",
    a: "CodeCell helps you grow beyond coding. Members gain experience in software development, UI/UX design, marketing, communication, event management, leadership, teamwork, and social media management.",
  },
];

const TABS = [
  { key: "assoc", label: "Associate Professor", accent: "#B388FF" },
  { key: "Scom", label: "Scom", accent: "#4BE2C4" },
  { key: "jcom", label: "jcom", accent: "#E8FF00" },
] as const;

function CrewCarousel() {
  const [activeTab, setActiveTab] = useState<"Scom" | "jcom" | "assoc">(
    "assoc",
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredTeam = teamCrew.filter((m) => m.team === activeTab);
  const isSingleRow = filteredTeam.length <= 3;
  const handleNext = () => {
    scrollRef.current?.scrollBy({
      left: scrollRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };
  const handlePrev = () => {
    scrollRef.current?.scrollBy({
      left: -scrollRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full relative">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 px-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={
                isActive
                  ? {
                      backgroundColor: `${tab.accent}1A`,
                      borderColor: tab.accent,
                      color: tab.accent,
                    }
                  : undefined
              }
              className={`${orbitron.className} relative px-3 sm:px-4 py-2 text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 border rounded-sm whitespace-nowrap ${
                isActive
                  ? "scale-105"
                  : "border-[#333] text-[#888] hover:border-[#555] hover:text-[#ccc] hover:scale-[1.02]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="relative group px-2 sm:px-4 md:px-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            ref={scrollRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 scroll-smooth ${
              isSingleRow ? "justify-center" : "justify-start"
            }`}
          >
            {filteredTeam.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(idx * 0.04, 0.3),
                  ease: "easeOut",
                }}
                className="w-[78vw] sm:w-[17rem] md:w-[18rem] lg:w-[19rem] xl:w-[20rem] shrink-0 snap-start"
              >
                <GlassCard
                  className={`overflow-hidden p-0 group/card glass-card-glow w-full h-full flex flex-col transition-transform duration-300 hover:-translate-y-1 ${
                    activeTab === "Scom" ? "card-scanner" : "card-scanner-cyan"
                  }`}
                >
                  <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-[#0a0a0a]">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 18rem, 20rem"
                      className={`object-cover transition-all duration-500 group-hover/card:scale-105 ${
                        member.position || "object-center"
                      }`}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent">
                      <div className="flex gap-2">
                        <a
                          href={member.github || "#"}
                          onClick={(e) => {
                            if (!member.github) e.preventDefault();
                          }}
                          target={member.github ? "_blank" : undefined}
                          rel={
                            member.github ? "noopener noreferrer" : undefined
                          }
                          className={`flex items-center gap-1.5 font-mono text-[9px] px-3 py-1.5 rounded-sm bg-[#0D0D0D]/90 border border-[#2E2E2E] transition-colors z-20 ${
                            member.github
                              ? "text-[#4BE2C4] hover:border-[#4BE2C4]"
                              : "text-[#8A8880] opacity-50 cursor-default"
                          }`}
                        >
                          <GithubIcon size={12} /> GitHub
                        </a>
                        <a
                          href={member.linkedin || "#"}
                          onClick={(e) => {
                            if (!member.linkedin) e.preventDefault();
                          }}
                          target={member.linkedin ? "_blank" : undefined}
                          rel={
                            member.linkedin ? "noopener noreferrer" : undefined
                          }
                          className={`flex items-center gap-1.5 font-mono text-[9px] px-3 py-1.5 rounded-sm bg-[#0D0D0D]/90 border border-[#2E2E2E] transition-colors z-20 ${
                            member.linkedin
                              ? "text-[#E8FF00] hover:border-[#E8FF00]"
                              : "text-[#8A8880] opacity-50 cursor-default"
                          }`}
                        >
                          <LinkedinIcon size={12} /> LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-[#111111] flex-1 bg-[#050505] relative z-10">
                    <h4
                      className={`${orbitron.className} text-sm font-semibold text-[#F0EDE6] truncate`}
                    >
                      {member.name}
                    </h4>
                    <p
                      className={`font-mono text-[9px] mt-1 truncate ${
                        activeTab === "Scom"
                          ? "text-[#E8FF00]"
                          : activeTab === "jcom"
                            ? "text-[#4BE2C4]"
                            : "text-[#B388FF]"
                      }`}
                    >
                      {member.role}
                    </p>
                    <p className="font-mono text-[9px] text-[#8A8880] mt-0.5">
                      {member.handle}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={handlePrev}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-[#111] border border-[#333] items-center justify-center text-[#888] hover:text-[#E8FF00] hover:border-[#E8FF00] transition-all z-10 hidden md:flex opacity-40 group-hover:opacity-100 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={handleNext}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-[#111] border border-[#333] items-center justify-center text-[#888] hover:text-[#4BE2C4] hover:border-[#4BE2C4] transition-all z-10 hidden md:flex opacity-40 group-hover:opacity-100 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function AboutUsPage() {
  return (
    <div className={`${orbitron.variable} bg-[#0D0D0D] min-h-screen`}>
      <AboutHero />

      <SectionWrap id="mission">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start">
          <BentoMotion className="lg:col-span-7">
            <span
              className={`${orbitron.className} text-label-tag text-[#E8FF00] block mb-4`}
            >
              // GUILD_MISSION
            </span>
            <h2
              className={`${orbitron.className} text-h1-scale font-bold uppercase text-[#F0EDE6] tracking-tight leading-[1.05] mb-8`}
            >
              Engineers, Not Slideshows
            </h2>
            <div className="space-y-5 text-body-scale text-[#8A8880] leading-relaxed max-w-2xl">
              <p>
                TSEC CodeCell is the technical core of Thadomal Shahani
                Engineering College — closing the gap between the syllabus and
                how software actually gets built.
              </p>
              <p>
                Sandboxes, workshops, and TSEC Hacks — our flagship hackathon.
                Every line written here is a step toward real systems, real
                interfaces, real algorithms.
              </p>
            </div>
            <Link
              href="/dashboard"
              className={`${orbitron.className} group inline-flex items-center gap-2 mt-10 text-xs tracking-widest text-[#4BE2C4] hover:text-[#E8FF00] transition-colors duration-300`}
            >
              ENTER SANDBOX
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </BentoMotion>

          <BentoMotion className="md:col-span-2 lg:col-span-5" delay={0.12}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <GlassCard
                    key={val.title}
                    className="p-5 md:p-6 flex gap-4 md:gap-5 glass-card-glow transition-all duration-300 hover:-translate-y-0.5 hover:border-[#333]"
                  >
                    <div className="w-10 h-10 md:w-11 md:h-11 shrink-0 rounded-xl bg-[#161616] border border-[#2E2E2E] flex items-center justify-center transition-colors duration-300">
                      <Icon
                        size={20}
                        className={
                          idx === 0
                            ? "text-[#4BE2C4]"
                            : idx === 1
                              ? "text-[#E8FF00]"
                              : "text-[#FF4D00]"
                        }
                      />
                    </div>
                    <div>
                      <h4
                        className={`${orbitron.className} text-sm md:text-base font-semibold text-[#F0EDE6] uppercase tracking-tight`}
                      >
                        {val.title}
                      </h4>
                      <p className="text-sm text-[#8A8880] mt-2 leading-relaxed">
                        {val.desc}
                      </p>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </BentoMotion>
        </div>
      </SectionWrap>

      <SectionWrap>
        <SectionHeader
          index=""
          title="Meet The Crew"
          subtitle="// core operators running the guild systems"
          align="center"
        />
        <CrewCarousel />
      </SectionWrap>

      <SectionWrap narrow>
        <SectionHeader
          index=""
          title="Frequently Asked Questions"
          subtitle="// everything you need before your first commit"
          align="center"
        />
        <PremiumFaq faqs={faqs} />
      </SectionWrap>
    </div>
  );
}
