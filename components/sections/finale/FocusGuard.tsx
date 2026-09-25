"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Lock, Maximize2, ShieldAlert } from "lucide-react";

import { reportProctorEvent, type ProctorEventKind, type ProctorStatus } from "@/lib/api-client";

const GOLD = "#D9A404";
const RED = "#F87171";

type Away = "fullscreen" | "tab";

function fullscreenSupported(): boolean {
  return typeof document !== "undefined" && document.fullscreenEnabled === true;
}

function isFullscreen(): boolean {
  return typeof document !== "undefined" && document.fullscreenElement != null;
}

const buttonClass =
  "mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-sans text-sm font-semibold text-[#0A0C10] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]";

export default function FocusGuard({
  weekId,
  counting,
  proctor,
  children,
}: {
  weekId: string | null;
  counting: boolean;
  proctor?: ProctorStatus;
  children: React.ReactNode;
}) {
  const [supported, setSupported] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [away, setAway] = useState<Away | null>(null);
  const [strikes, setStrikes] = useState(proctor?.strikes ?? 0);
  const [strikeLimit, setStrikeLimit] = useState(proctor?.strikeLimit ?? 0);
  const [locked, setLocked] = useState(proctor?.locked ?? false);
  const [lockReason, setLockReason] = useState(proctor?.lockReason ?? "");
  const countingRef = useRef(counting);
  countingRef.current = counting;
  const lastStrikeRef = useRef(0);

  useEffect(() => {
    setSupported(fullscreenSupported());
    setFullscreen(isFullscreen());
  }, []);

  useEffect(() => {
    if (!proctor) return;
    setStrikes(proctor.strikes);
    setStrikeLimit(proctor.strikeLimit);
    setLocked(proctor.locked);
    setLockReason(proctor.lockReason ?? "");
  }, [proctor]);

  const strike = useCallback(
    (kind: Away) => {
      if (!weekId || !countingRef.current) return;
      setAway(kind);

      const now = Date.now();
      const sameSlip = now - lastStrikeRef.current < 2000;
      lastStrikeRef.current = now;

      const reported: ProctorEventKind = kind === "tab" ? "TAB_SWITCH" : "FULLSCREEN_EXIT";
      reportProctorEvent(weekId, reported)
        .then((status) => {
          setStrikes(status.strikes);
          setStrikeLimit(status.strikeLimit);
          setLocked(status.locked);
          setLockReason(status.lockReason ?? "");
        })
        .catch(() => {
          if (!sameSlip) setStrikes((prev) => prev + 1);
        });
    },
    [weekId]
  );

  useEffect(() => {
    const onFullscreenChange = () => {
      const now = isFullscreen();
      setFullscreen(now);
      if (!now) strike("fullscreen");
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") strike("tab");
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [strike]);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setFullscreen(true);
      setAway(null);
    } catch {
      setFullscreen(isFullscreen());
    }
  };

  if (locked) {
    return (
      <>
        {children}
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="focus-guard-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0C10]/98 px-6"
        >
          <div className="w-full max-w-md rounded-xl border border-[#F87171]/40 bg-[#10131A] p-7 text-center">
            <Lock size={28} className="mx-auto" style={{ color: RED }} />
            <h2 id="focus-guard-title" className="mt-4 font-sans text-lg font-semibold text-[#E7E9EE]">
              Your round is locked
            </h2>
            {lockReason && (
              <p data-testid="focus-lock-reason" className="mt-2 font-sans text-sm font-medium" style={{ color: RED }}>
                {lockReason}
              </p>
            )}
            <p className="mt-3 font-sans text-sm leading-relaxed text-[#8C93A3]">
              You cannot run or submit code until an invigilator unlocks you. Raise your hand and stay at your seat.
              This screen clears on its own once you are unlocked.
            </p>
          </div>
        </div>
      </>
    );
  }

  const needsFullscreen = supported && !fullscreen;
  const showOverlay = needsFullscreen || away !== null;

  let title = "This round runs in full screen";
  let body =
    "The contest and every problem stay in full screen until you finish. Keep this tab in front: leaving full screen or switching to another tab or app during the round is recorded and shown to the invigilators.";
  let tone = GOLD;

  if (away !== null) {
    title = away === "tab" ? "You switched away from the contest" : "You left full screen";
    body =
      "Switching tabs, apps or windows and leaving full screen are not allowed while the round is live. Every time is recorded and shown to the invigilators.";
    tone = RED;
  }

  const strikeLine =
    strikes === 0
      ? null
      : strikeLimit > 0
        ? `Strike ${strikes} of ${strikeLimit}. At ${strikeLimit}, your round locks until an invigilator unlocks it.`
        : `You have left the contest screen ${strikes} ${strikes === 1 ? "time" : "times"} during this round.`;

  return (
    <>
      {children}
      {showOverlay && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="focus-guard-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0C10]/95 px-6 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-xl border border-[#1F2430] bg-[#10131A] p-7 text-center">
            {away !== null ? (
              <ShieldAlert size={28} className="mx-auto" style={{ color: tone }} />
            ) : (
              <Maximize2 size={26} className="mx-auto" style={{ color: tone }} />
            )}
            <h2 id="focus-guard-title" className="mt-4 font-sans text-lg font-semibold text-[#E7E9EE]">
              {title}
            </h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-[#8C93A3]">{body}</p>
            {strikeLine && (
              <p data-testid="focus-strikes" className="mt-4 font-sans text-sm font-medium" style={{ color: RED }}>
                {strikeLine}
              </p>
            )}
            {needsFullscreen ? (
              <button autoFocus onClick={enterFullscreen} className={buttonClass} style={{ background: GOLD }}>
                <Maximize2 size={16} />
                {away !== null ? "Return to full screen" : "Enter full screen"}
              </button>
            ) : (
              <button autoFocus onClick={() => setAway(null)} className={buttonClass} style={{ background: GOLD }}>
                Back to the contest
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
