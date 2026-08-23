"use client";

import { useEffect, useState } from "react";

// urgency thresholds, in milliseconds
const ONE_HOUR = 3_600_000;
const TEN_MINUTES = 600_000;

function remaining(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  return Number.isNaN(diff) ? null : diff;
}

// days and hours while there is plenty of time, then a ticking clock once it is
// close enough that seconds start to matter
function format(ms: number) {
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total / 3600) % 24);
  const minutes = Math.floor((total / 60) % 60);
  const seconds = total % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (ms >= ONE_HOUR) return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function WeekTimer({
  endsAt,
  className = "",
}: {
  endsAt?: string;
  className?: string;
}) {
  // both renders start empty so the server and the first client paint agree
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!endsAt) return;

    let timer: ReturnType<typeof setTimeout>;

    // reschedules itself, so it speeds up to once a second only when the last
    // hour makes seconds worth showing, and stops once the week is over
    const tick = () => {
      const ms = remaining(endsAt);
      setLeft(ms);
      if (ms === null || ms <= 0) return;
      timer = setTimeout(tick, ms < ONE_HOUR ? 1000 : 30_000);
    };

    tick();
    return () => clearTimeout(timer);
  }, [endsAt]);

  if (!endsAt || left === null) return null;

  if (left <= 0) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#8B93A7] ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#5A5850]" />
        Ended
      </span>
    );
  }

  const urgent = left < TEN_MINUTES;
  const soon = left < ONE_HOUR;
  const colour = urgent ? "#E2574C" : soon ? "#D9A404" : "#8B93A7";

  return (
    <span
      title={`Week ends ${new Date(endsAt).toLocaleString()}`}
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide tabular-nums ${className}`}
      style={{ color: colour }}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${urgent ? "animate-pulse" : ""}`}
        style={{ background: colour }}
      />
      {format(left)} left
    </span>
  );
}
