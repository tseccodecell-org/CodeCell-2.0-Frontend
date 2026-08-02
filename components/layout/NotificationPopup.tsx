"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface SiteNotification {
  id: string;
  subject: string;
  message: string;
  created_at: string;
}

const POLL_MS = 60000;

export default function NotificationPopup() {
  const { isAuthenticated } = useAuth();
  const [queue, setQueue] = useState<SiteNotification[]>([]);
  const [leaving, setLeaving] = useState(false);
  const seenRef = useRef<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) return;

      const body = await res.json();
      if (!body?.success || !Array.isArray(body.data)) return;

      const fresh = (body.data as SiteNotification[]).filter(
        (n) => !seenRef.current.has(n.id)
      );
      if (fresh.length === 0) return;

      setQueue((prev) => {
        const known = new Set(prev.map((n) => n.id));
        return [...prev, ...fresh.filter((n) => !known.has(n.id))];
      });
    } catch {
      // offline or the backend is down, the next tick tries again
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [isAuthenticated, load]);

  const current = queue[0];

  const dismiss = useCallback(async () => {
    if (!current) return;
    seenRef.current.add(current.id);
    setLeaving(true);

    try {
      await fetch(`/api/notifications/${current.id}/seen`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // marking it seen is best effort, it just reappears next session
    }

    setTimeout(() => {
      setLeaving(false);
      setQueue((prev) => prev.slice(1));
    }, 200);
  }, [current]);

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, dismiss]);

  if (!current) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[min(92vw,34rem)] transition-all duration-200 ${
        leaving ? "opacity-0 -translate-y-3" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="border border-[#D9A404]/40 bg-[#0b0d13] shadow-2xl">
        <div className="h-[2px] bg-[#D9A404]" />
        <div className="flex items-start gap-3 p-4">
          <span className="relative flex h-2 w-2 mt-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#D9A404] animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9A404]" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#D9A404]">
              Contest Update
            </p>
            <p className="font-serif text-base font-bold text-[#F4F1EA] mt-1">
              {current.subject}
            </p>
            <p className="font-sans text-sm text-[#8B93A7] mt-1.5 whitespace-pre-wrap break-words">
              {current.message}
            </p>
            {queue.length > 1 && (
              <p className="font-mono text-[10px] text-[#5A5850] mt-2">
                {queue.length - 1} more waiting
              </p>
            )}
          </div>

          <button
            onClick={dismiss}
            aria-label="Dismiss notification"
            className="shrink-0 border border-[#1a1c24] text-[#8B93A7] hover:text-[#F4F1EA] hover:border-[#D9A404]/40 px-2 py-1 font-mono text-xs transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
