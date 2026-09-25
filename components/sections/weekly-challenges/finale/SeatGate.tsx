"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, LogIn, MessageCircle } from "lucide-react";
import { Playfair_Display } from "next/font/google";

import { getInternshipEligibility, getCurrentFinale, ApiError, LOGIN_URL } from "@/lib/api-client";
import { QUALIFYING_SEATS, WHATSAPP_GROUP_URL } from "./finale-config";

const playfair = Playfair_Display({ subsets: ["latin"] });

const GOLD = "#D9A404";
const BRONZE = "#4A3E1C";

export type SeatState = "loading" | "invited" | "not-invited" | "signed-out";

function LockedAction({ label }: { label: string }) {
  return (
    <span
      aria-disabled="true"
      title="Not open yet"
      className="inline-flex cursor-not-allowed items-center justify-center gap-2 border border-dashed px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]"
      style={{ borderColor: BRONZE, color: BRONZE }}
    >
      <Lock size={13} aria-hidden />
      {label}
    </span>
  );
}

function OpenAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 border border-[#D9A404] bg-[#D9A404]/10 px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A404] transition-colors hover:bg-[#D9A404] hover:text-[#05070C]"
    >
      {label} <ArrowRight size={13} />
    </Link>
  );
}

export interface ActionGates {
  entry: boolean;
  templates: boolean;
  internship: boolean;
}

export function useActionGates(): ActionGates {
  const [gates, setGates] = useState<ActionGates>({
    entry: false,
    templates: false,
    internship: false,
  });

  useEffect(() => {
    let cancelled = false;
    getCurrentFinale()
      .then((status) => {
        if (cancelled) return;
        setGates({
          entry: status.entryOpen,
          templates: status.templatesOpen,
          internship: status.internshipOpen,
        });
      })
      .catch(() => {
        if (!cancelled) setGates({ entry: false, templates: false, internship: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return gates;
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

export default function SeatGate({ seat, gates }: { seat: SeatState; gates: ActionGates }) {
  if (seat === "signed-out") {
    return (
      <div className="border border-[#14161e] bg-[#0B0E15] p-7 md:p-9">
        <h2 className={`${playfair.className} text-2xl text-[#F4F1EA] md:text-3xl`}>
          Sign in to check your seat
        </h2>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#8B93A7]">
          The finale seats go to the top {QUALIFYING_SEATS} of the season. Sign in and this page
          will tell you whether one of them is yours.
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

  if (seat === "loading") {
    return (
      <div className="border border-[#14161e] bg-[#0B0E15] p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#5A5850]">
          Checking your seat
        </p>
      </div>
    );
  }

  const action = (href: string, label: string, gateOpen: boolean) =>
    gateOpen ? <OpenAction href={href} label={label} /> : <LockedAction label={label} />;

  if (seat === "invited") {
    return (
      <div className="border bg-[#0B0E15] p-7 md:p-9" style={{ borderColor: GOLD }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: GOLD }}>
          Congratulations
        </p>
        <h2 className={`${playfair.className} mt-3 text-2xl text-[#F4F1EA] md:text-3xl`}>
          You are in the top {QUALIFYING_SEATS}
        </h2>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#8B93A7]">
          Six weeks of problems and you held your place. A seat at the offline round is yours, and
          your profile goes to the internship partners.
        </p>

        <a
          href={WHATSAPP_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 border px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-colors hover:bg-[#D9A404] hover:text-[#05070C]"
          style={{ borderColor: GOLD, color: GOLD }}
        >
          <MessageCircle size={14} />
          Join the finalists group
        </a>
        <p className="mt-2 font-sans text-xs text-[#8B93A7]">
          Everything about the day is announced there. Join it now so you do not miss anything.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          {action("/events/finale/templates", "Load your templates", gates.templates)}
          {action("/events/finale/internship", "Apply for the internship", gates.internship)}
          {action("/events/finale/contest", "Enter contest", gates.entry)}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#14161e] bg-[#0B0E15] p-7 md:p-9">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: BRONZE }}>
        This season
      </p>
      <h2 className={`${playfair.className} mt-3 text-2xl text-[#F4F1EA] md:text-3xl`}>
        You finished outside the top {QUALIFYING_SEATS}
      </h2>
      <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#8B93A7]">
        The offline round takes the top {QUALIFYING_SEATS}, and this season a seat did not come your
        way. That is not a verdict. Six weeks of solving is real work and it counted.
      </p>
      <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#8B93A7]">
        The next season starts level for everyone. We hope to see you back on the board.
      </p>
    </div>
  );
}
