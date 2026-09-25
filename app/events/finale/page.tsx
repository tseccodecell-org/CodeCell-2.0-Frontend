"use client";

import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import WeekTimer from "@/components/layout/WeekTimer";
import SeatGate, {
  useSeatState,
  useActionGates,
} from "@/components/sections/weekly-challenges/finale/SeatGate";
import {
  FINALE_DATE_SHORT,
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
  const seat = useSeatState();
  const gates = useActionGates();

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

        <header className="pt-10 pb-10">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase" style={{ color: GOLD }}>
            Weekly Challenges &middot; Season 2026
          </p>

          <h1 className={`${playfair.className} text-4xl sm:text-5xl md:text-6xl leading-[0.95] mt-3`}>
            The Endgame
          </h1>

          <p className="font-sans text-sm md:text-base text-[#8B93A7] mt-4 max-w-2xl leading-relaxed">
            The top {QUALIFYING_SEATS} of the season come to campus on {FINALE_DATE_SHORT} for one
            offline round, and go forward to our internship partners.
          </p>

        </header>

        <SeatGate seat={seat} gates={gates} />

        <nav className="flex flex-wrap gap-3 mt-8" aria-label="On this page">
          <a
            href="#offline-round"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[#8B93A7] hover:text-[#D9A404] transition-colors"
          >
            The offline round <ArrowRight size={13} />
          </a>
          <a
            href="#internship"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[#8B93A7] hover:text-[#D9A404] transition-colors"
          >
            The internship track <ArrowRight size={13} />
          </a>
        </nav>

        {/* ── Act one: the offline round ─────────────────────────── */}
        <section id="offline-round" className="pt-16 scroll-mt-24">
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
                  {fact.detail &&
                    (fact.href ? (
                      <a
                        href={fact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 font-sans text-xs text-[#D9A404] underline underline-offset-4 hover:text-[#F5C451] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
                      >
                        {fact.detail}
                        <ArrowRight size={11} />
                      </a>
                    ) : (
                      <span className="block font-sans text-xs text-[#8B93A7] mt-2 leading-relaxed">
                        {fact.detail}
                      </span>
                    ))}
                  {fact.countdownTo && (
                    <WeekTimer
                      endsAt={fact.countdownTo}
                      className="mt-3"
                      suffix="away"
                      endedLabel="Today"
                      urgency={false}
                    />
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
        <section id="internship" className="pt-16 scroll-mt-24">
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

          <p className="font-sans text-xs text-[#8B93A7] mt-6 leading-relaxed max-w-2xl">
            CodeCell introduces candidates. Roles, stipend, and duration are settled between you and
            the partner.
          </p>
        </section>

      </div>
    </main>
  );
}
