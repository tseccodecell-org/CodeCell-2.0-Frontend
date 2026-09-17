"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, LogIn } from "lucide-react";
import { Playfair_Display } from "next/font/google";

import { getInternshipEligibility, ApiError, LOGIN_URL } from "@/lib/api-client";
import { QUALIFYING_SEATS } from "./finale-config";

const playfair = Playfair_Display({ subsets: ["latin"] });

const GOLD = "#D9A404";
const BRONZE = "#4A3E1C";

export type SeatState = "loading" | "invited" | "not-invited" | "signed-out";

function LockedAction({ label, reason }: { label: string; reason: string }) {
  return (
    <span
      aria-disabled="true"
      title={reason}
      className="inline-flex cursor-not-allowed items-center justify-center gap-2 border border-dashed px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]"
      style={{ borderColor: BRONZE, color: BRONZE }}
    >
      <Lock size={13} aria-hidden />
      {label}
    </span>
  );
}

export function useSeatState(): SeatState {
  const [seat, setSeat] = useState<SeatState>("loading");

  useEffect(() => {
    let cancelled = false;

    getInternshipEligibility()
      .then((result) => {
        if (cancelled) return;
        setSeat(result.invited ? "invited" : "not-invited");
      })
      .catch((err) => {
        if (cancelled) return;
        setSeat(err instanceof ApiError && err.status === 401 ? "signed-out" : "not-invited");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return seat;
}

export default function SeatGate({ seat }: { seat: SeatState }) {
  if (seat === "loading") {
    return (
      <div className="border border-[#14161e] bg-[#0B0E15] p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5A5850]">
          Checking your seat
        </p>
      </div>
    );
  }

  if (seat === "signed-out") {
    return (
      <div className="border border-[#14161e] bg-[#0B0E15] p-7 md:p-9">
        <h2 className={`${playfair.className} text-2xl text-[#F4F1EA] md:text-3xl`}>
          Sign in to see where you stand
        </h2>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#8B93A7]">
          The finale and the internship track are open to the {QUALIFYING_SEATS} participants the
          organisers have seated. Sign in and this page will tell you whether one is yours.
        </p>
        <button
          onClick={() => (window.location.href = LOGIN_URL)}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 border border-[#D9A404] bg-[#D9A404]/10 px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A404] transition-colors hover:bg-[#D9A404] hover:text-[#05070C]"
        >
          <LogIn size={14} />
          Sign in with Google
        </button>
      </div>
    );
  }

  if (seat === "not-invited") {
    return (
      <div className="border border-[#14161e] bg-[#0B0E15] p-7 md:p-9">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.24em]"
          style={{ color: BRONZE }}
        >
          Not this season
        </p>
        <h2 className={`${playfair.className} mt-3 text-2xl text-[#F4F1EA] md:text-3xl`}>
          Your seat did not come through
        </h2>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#8B93A7]">
          The offline round and the internship track are limited to the {QUALIFYING_SEATS}{" "}
          participants the organisers seated this season. You are not among them this time, and
          that is the only thing it means. Six weeks of problems is not nothing.
        </p>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#8B93A7]">
          Your season recap is still yours to read, and the next season starts from zero for
          everyone.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <LockedAction label="Load your templates" reason="Reserved for seated participants" />
          <LockedAction
            label="Apply for the internship"
            reason="Reserved for seated participants"
          />
          <Link
            href="/events/finale/recap"
            className="inline-flex items-center justify-center gap-2 border border-[#1a1c24] px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A7] transition-colors hover:border-[#4A3E1C] hover:text-[#F4F1EA]"
          >
            Your season recap <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border bg-[#0B0E15] p-7 md:p-9" style={{ borderColor: GOLD }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: GOLD }}>
        Seat confirmed
      </p>
      <h2 className={`${playfair.className} mt-3 text-2xl text-[#F4F1EA] md:text-3xl`}>
        You are in the {QUALIFYING_SEATS}
      </h2>
      <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#8B93A7]">
        You have a seat at the offline round, and the internship track is open to you. Get your
        templates in order before the day, and put your profile in front of the partners.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/events/finale/templates"
          className="inline-flex items-center justify-center gap-2 border border-[#D9A404] bg-[#D9A404]/10 px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A404] transition-colors hover:bg-[#D9A404] hover:text-[#05070C]"
        >
          Load your templates <ArrowRight size={13} />
        </Link>
        <Link
          href="/events/finale/internship"
          className="inline-flex items-center justify-center gap-2 border border-[#D9A404] bg-[#D9A404]/10 px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A404] transition-colors hover:bg-[#D9A404] hover:text-[#05070C]"
        >
          Apply for the internship <ArrowRight size={13} />
        </Link>
        <Link
          href="/events/finale/recap"
          className="inline-flex items-center justify-center gap-2 border border-[#1a1c24] px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A7] transition-colors hover:border-[#4A3E1C] hover:text-[#F4F1EA]"
        >
          Your season recap <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
