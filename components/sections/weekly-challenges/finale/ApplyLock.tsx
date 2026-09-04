"use client";

import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import WeekTimer from "@/components/layout/WeekTimer";
import {
  APPLICATIONS_OPEN,
  APPLICATIONS_OPEN_AT,
  APPLICATIONS_URL,
  QUALIFYING_SEATS,
} from "./finale-config";
import type { SeasonStanding } from "./useSeasonStanding";

const GOLD = "#D9A404";
const BRONZE = "#4A3E1C";

// What the button says depends on how close the viewer is to earning it. The
// three shut states are deliberately different, so the button reads as a thing
// you are working towards rather than a thing that is broken.
function statusFor({ sealed, pending, qualified, standing }: SeasonStanding) {
  if (pending) return { note: "Checking where you stand.", warm: false };
  if (sealed)
    return {
      note: "Sign in and we will tell you whether your seat is safe.",
      warm: false,
    };
  if (qualified)
    return {
      note: "You are inside the cut. Hold your seat through week 6 and this opens for you.",
      warm: true,
    };
  if (standing?.gap != null && standing.gap > 0)
    return {
      note: `${standing.gap} XP would put you in the top ${QUALIFYING_SEATS}. The season is still running.`,
      warm: false,
    };
  return {
    note: `Applications open to the top ${QUALIFYING_SEATS} once the season closes.`,
    warm: false,
  };
}

export default function ApplyLock({ state }: { state: SeasonStanding }) {
  const { note, warm } = statusFor(state);
  const unlocked = APPLICATIONS_OPEN && state.qualified && APPLICATIONS_URL !== null;

  return (
    <div
      className="border bg-[#0B0E15] p-7 md:p-9 mt-12"
      style={{ borderColor: warm ? GOLD : "#14161e" }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p
            className="font-mono text-[10px] tracking-[0.24em] uppercase"
            style={{ color: warm ? GOLD : BRONZE }}
          >
            {unlocked ? "Open" : "Locked"}
          </p>
          <h3 className="font-mono text-base text-[#F4F1EA] mt-3">
            Apply to the hiring partners
          </h3>
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
    </div>
  );
}
