"use client";

import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import WeekTimer from "@/components/layout/WeekTimer";
import {
  APPLICATIONS_OPEN,
  APPLICATIONS_OPEN_AT,
  APPLICATIONS_URL,
  INTERNSHIP_STEPS,
  QUALIFYING_SEATS,
} from "./finale-config";
import type { SeasonStanding } from "./useSeasonStanding";

const GOLD = "#D9A404";
const BRONZE = "#4A3E1C";

// What the button says depends on how close the viewer is to earning it. The
// shut states are deliberately different, so it reads as something you are
// working towards rather than something that is broken.
function noteFor({ sealed, pending, qualified, standing }: SeasonStanding) {
  if (pending) return "Checking where you stand.";
  if (sealed) return "Sign in and we will tell you whether your seat is safe.";
  if (qualified)
    return "You are inside the cut. Hold your seat through week 6 and this opens for you.";
  if (standing?.gap != null && standing.gap > 0)
    return `${standing.gap} XP would put you in the top ${QUALIFYING_SEATS}.`;
  return `Opens to the top ${QUALIFYING_SEATS} once the season closes.`;
}

export default function ApplyLock({ state }: { state: SeasonStanding }) {
  const note = noteFor(state);
  const warm = state.qualified;
  const unlocked = APPLICATIONS_OPEN && state.qualified && APPLICATIONS_URL !== null;

  return (
    <div className="border" style={{ borderColor: warm ? GOLD : "#14161e" }}>
      <div className="bg-[#0B0E15] p-7 md:p-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p
            className="font-mono text-[10px] tracking-[0.24em] uppercase"
            style={{ color: warm ? GOLD : BRONZE }}
          >
            {unlocked ? "Open" : "Locked"}
          </p>
          <h3 className="font-mono text-base text-[#F4F1EA] mt-3">Apply to the partners</h3>
          <p className="font-sans text-sm text-[#8B93A7] mt-2 max-w-md leading-relaxed">{note}</p>

          {!unlocked && APPLICATIONS_OPEN_AT && (
            <div className="mt-4">
              <WeekTimer
                endsAt={APPLICATIONS_OPEN_AT}
                suffix="until applications open"
                endedLabel="Opening"
                urgency={false}
              />
            </div>
          )}
        </div>

        {unlocked ? (
          <Link
            href={APPLICATIONS_URL as string}
            className="shrink-0 inline-flex items-center justify-center gap-2 border border-[#D9A404] bg-[#D9A404] text-[#05070C] px-7 py-4 font-mono text-[11px] tracking-[0.16em] uppercase hover:bg-[#F5C451] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
          >
            Start your application <ArrowRight size={14} />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="shrink-0 inline-flex items-center justify-center gap-2.5 border border-dashed px-7 py-4 font-mono text-[11px] tracking-[0.16em] uppercase cursor-not-allowed bg-transparent"
            style={{ borderColor: warm ? GOLD : BRONZE, color: warm ? GOLD : BRONZE }}
          >
            <Lock size={14} aria-hidden />
            Applications locked
          </button>
        )}
      </div>

      {/* The route in, in one line, so the panel answers the whole question. */}
      <ol className="bg-[#080B11] border-t border-[#14161e] px-7 md:px-9 py-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        {INTERNSHIP_STEPS.map((step, i) => (
          <li key={step.title} className="flex items-center gap-3">
            {i > 0 && (
              <span aria-hidden style={{ color: BRONZE }}>
                &#8594;
              </span>
            )}
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#8B93A7]">
              {step.title}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
