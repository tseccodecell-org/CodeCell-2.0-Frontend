"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, ShieldAlert } from "lucide-react";

const GOLD = "#D9A404";
const RED = "#F87171";

type Away = "fullscreen" | "tab";

function strikeKey(weekId: string) {
  return `codecell_finale_strikes_${weekId}`;
}

function readStrikes(weekId: string): number {
  try {
    return Number(window.localStorage.getItem(strikeKey(weekId))) || 0;
  } catch {
    return 0;
  }
}

function writeStrikes(weekId: string, value: number) {
  try {
    window.localStorage.setItem(strikeKey(weekId), String(value));
  } catch {}
}

function fullscreenSupported(): boolean {
  return typeof document !== "undefined" && document.fullscreenEnabled === true;
}

function isFullscreen(): boolean {
  return typeof document !== "undefined" && document.fullscreenElement != null;
}

export default function FocusGuard({
  weekId,
  counting,
  children,
}: {
  weekId: string | null;
  counting: boolean;
  children: React.ReactNode;
}) {
  const [supported, setSupported] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [away, setAway] = useState<Away | null>(null);
  const [strikes, setStrikes] = useState(0);
  const countingRef = useRef(counting);
  countingRef.current = counting;
  const lastStrikeRef = useRef(0);

  useEffect(() => {
    setSupported(fullscreenSupported());
    setFullscreen(isFullscreen());
    if (weekId) setStrikes(readStrikes(weekId));
  }, [weekId]);

  const strike = useCallback(
    (kind: Away) => {
      if (!weekId || !countingRef.current) return;
      setAway(kind);
      const now = Date.now();
      const sameSlip = now - lastStrikeRef.current < 2000;
      lastStrikeRef.current = now;
      if (sameSlip) return;
      setStrikes((prev) => {
        const next = prev + 1;
        writeStrikes(weekId, next);
        return next;
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

  const needsFullscreen = supported && !fullscreen;
  const showOverlay = needsFullscreen || away !== null;

  let title = "This round runs in full screen";
  let body =
    "The contest and every problem stay in full screen until you finish. Keep this tab in front: leaving full screen or switching to another tab or app during the round is against the rules.";
  let tone = GOLD;

  if (away !== null) {
    title = away === "tab" ? "You switched away from the contest" : "You left full screen";
    body =
      "Switching tabs, apps or windows and leaving full screen are not allowed while the round is live. Stay on this screen until you finish.";
    tone = RED;
  }

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
            {strikes > 0 && (
              <p data-testid="focus-strikes" className="mt-4 font-sans text-sm font-medium" style={{ color: RED }}>
                You have left the contest screen {strikes} {strikes === 1 ? "time" : "times"} during this round.
              </p>
            )}
            {needsFullscreen ? (
              <button
                autoFocus
                onClick={enterFullscreen}
                className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-sans text-sm font-semibold text-[#0A0C10] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
                style={{ background: GOLD }}
              >
                <Maximize2 size={16} />
                {away !== null ? "Return to full screen" : "Enter full screen"}
              </button>
            ) : (
              <button
                autoFocus
                onClick={() => setAway(null)}
                className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-lg px-4 py-3 font-sans text-sm font-semibold text-[#0A0C10] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A404]"
                style={{ background: GOLD }}
              >
                Back to the contest
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
