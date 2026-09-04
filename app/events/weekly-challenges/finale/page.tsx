"use client";

import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import StandingStrip from "@/components/sections/weekly-challenges/finale/StandingStrip";
import ApplyLock from "@/components/sections/weekly-challenges/finale/ApplyLock";
import { useSeasonStanding } from "@/components/sections/weekly-challenges/finale/useSeasonStanding";
import {
  FINALE_FACTS,
  FINALE_RULES,
  PARTNERS,
  QUALIFYING_SEATS,
} from "@/components/sections/weekly-challenges/finale/finale-config";

const playfair = Playfair_Display({ subsets: ["latin"] });

const GOLD = "#D9A404";
const BRONZE = "#4A3E1C";

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#8B93A7]">{eyebrow}</p>
      <h2 className={`${playfair.className} text-3xl md:text-4xl text-[#F4F1EA] mt-3`}>{title}</h2>
      <div className="h-px w-full bg-[#14161e] mt-6" />
    </div>
  );
}

export default function FinalePage() {
  // Read once, so your standing and the apply button always agree.
  const state = useSeasonStanding();

  return (
    <main className="min-h-screen bg-[#05070C] text-[#F4F1EA]">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
        <Link
          href="/events/weekly-challenges/timeline"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#8B93A7] hover:text-[#D9A404] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9A404]"
        >
          <ChevronLeft size={14} />
          BACK TO TIMELINE
        </Link>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <header className="pt-14 pb-16 md:pt-20 md:pb-24">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase" style={{ color: GOLD }}>
            Weekly Challenges · Season 2026
          </p>

          <h1
            className={`${playfair.className} text-5xl sm:text-6xl md:text-8xl leading-[0.95] mt-5`}
          >
            The Endgame
          </h1>

          {/* The season narrows; so do the rules. The last one is the twenty. */}
          <div aria-hidden className="mt-8 space-y-2 max-w-2xl">
            <div className="h-px w-full" style={{ background: BRONZE }} />
            <div className="h-px w-[55%]" style={{ background: BRONZE }} />
            <div className="h-px w-[18%]" style={{ background: GOLD }} />
          </div>

          <p className="font-sans text-base md:text-lg text-[#8B93A7] mt-8 max-w-2xl leading-relaxed">
            Six weeks of problems narrow the field to {QUALIFYING_SEATS}. Those{" "}
            {QUALIFYING_SEATS} come to campus for one offline round, and the same{" "}
            {QUALIFYING_SEATS} go to our internship partners.
          </p>

          <nav className="flex flex-wrap gap-3 mt-10" aria-label="On this page">
            <a
              href="#offline-round"
              className="inline-flex items-center gap-2 border border-[#D9A404] px-5 py-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[#D9A404] hover:bg-[#D9A404] hover:text-[#05070C] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
            >
              The offline round <ArrowRight size={13} />
            </a>
            <a
              href="#internship"
              className="inline-flex items-center gap-2 border border-[#1a1c24] px-5 py-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[#8B93A7] hover:text-[#F4F1EA] hover:border-[#4A3E1C] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
            >
              The internship track <ArrowRight size={13} />
            </a>
          </nav>
        </header>

        {/* ── Where you stand ────────────────────────────────────── */}
        <StandingStrip state={state} />

        {/* ── Act one: the offline round ─────────────────────────── */}
        <section id="offline-round" className="pt-24 scroll-mt-24">
          <SectionHead eyebrow="On campus" title="The offline round" />

          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#14161e] border border-[#14161e]">
            {FINALE_FACTS.map((fact) => (
              <div key={fact.label} className="bg-[#0B0E15] p-5">
                <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8B93A7]">
                  {fact.label}
                </dt>
                <dd className="mt-3">
                  {fact.value ? (
                    <span className="font-sans text-base text-[#F4F1EA]">{fact.value}</span>
                  ) : (
                    <span
                      className="font-mono text-[11px] tracking-[0.16em] uppercase"
                      style={{ color: BRONZE }}
                    >
                      Announced soon
                    </span>
                  )}
                  {fact.detail && (
                    <span className="block font-sans text-xs text-[#8B93A7] mt-2 leading-relaxed">
                      {fact.detail}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-12 divide-y divide-[#14161e] border-t border-[#14161e]">
            {FINALE_RULES.map((rule) => (
              <li key={rule.title} className="grid md:grid-cols-[1fr_2fr] gap-2 md:gap-10 py-6">
                <h3 className="font-mono text-sm text-[#F4F1EA] tracking-tight">{rule.title}</h3>
                <p className="font-sans text-sm text-[#8B93A7] leading-relaxed">{rule.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Act two: the internship track ──────────────────────── */}
        <section id="internship" className="pt-24 scroll-mt-24">
          <SectionHead eyebrow="For the same twenty" title="The internship track" />

          <p className="font-sans text-base md:text-lg text-[#F4F1EA] max-w-2xl leading-relaxed mb-10">
            Two partners are hiring from this season. There is no form to chase and no cover letter
            to write. Finish inside the top {QUALIFYING_SEATS} and your season record goes to them.
          </p>

          <div className="grid md:grid-cols-2 gap-px bg-[#14161e] border border-[#14161e]">
            {PARTNERS.map((partner) => (
              <article key={partner.name} className="bg-[#0B0E15] p-7 md:p-9">
                <p
                  className="font-mono text-[10px] tracking-[0.24em] uppercase"
                  style={{ color: BRONZE }}
                >
                  Hiring partner
                </p>
                <h3 className={`${playfair.className} text-2xl md:text-3xl text-[#F4F1EA] mt-4`}>
                  {partner.name}
                  {partner.parent && (
                    <span className="font-sans text-sm text-[#8B93A7] ml-2">{partner.parent}</span>
                  )}
                </h3>
                <p className="font-sans text-sm text-[#8B93A7] mt-4 leading-relaxed">
                  {partner.blurb}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <ApplyLock state={state} />
          </div>

          <p className="font-sans text-xs text-[#8B93A7] mt-6 leading-relaxed max-w-2xl">
            CodeCell introduces candidates. Roles, stipend, and duration are settled between you and
            the partner.
          </p>
        </section>

        {/* ── Close ──────────────────────────────────────────────── */}
        <section className="pt-24 pb-8">
          <div className="border border-[#14161e] bg-[#0B0E15] p-8 md:p-12">
            <h2 className={`${playfair.className} text-2xl md:text-3xl text-[#F4F1EA]`}>
              Seats are decided by the season board.
            </h2>
            <p className="font-sans text-sm text-[#8B93A7] mt-4 max-w-xl leading-relaxed">
              There is nothing to sign up for. Solve the weekly problems, hold your rank through
              week 6, and the seat is yours.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/events/weekly-challenges/timeline"
                className="inline-flex items-center gap-2 border border-[#D9A404] px-6 py-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[#D9A404] hover:bg-[#D9A404] hover:text-[#05070C] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
              >
                Go to this week <ArrowRight size={13} />
              </Link>
              <Link
                href="/events/weekly-challenges/leaderboard/season"
                className="inline-flex items-center gap-2 border border-[#1a1c24] px-6 py-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[#8B93A7] hover:text-[#F4F1EA] hover:border-[#4A3E1C] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
              >
                Full season board <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
