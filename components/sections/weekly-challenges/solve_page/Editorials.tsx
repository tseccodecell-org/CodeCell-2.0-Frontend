"use client";

/**
 * EditorialPanel
 * --------------
 * Renders `problem.editorial` (markdown) using the same visual language
 * as ProblemPanel. Takes already-fetched data — no separate API call,
 * since the editorial ships as part of GET /api/problems/{problemId}.
 */

import { motion } from "framer-motion";
import { BookOpen, Lock } from "lucide-react";
import type { ProblemDetail } from "@/lib/types/problem";
import { MarkdownRenderer } from "@/components/layout/MarkdownRenderer";

const tokens = {
  bg: "#06070B",
  panel: "#0b0d13",
  panelAlt: "#0d0f14",
  border: "#1a1c24",
  borderAlt: "#22262f",
  ink: "#F4F1EA",
  muted: "#8B93A7",
  dim: "#5A5850",
  goldSoft: "#F5C451",
  goldDeep: "#D97706",
  gold: "#D9A404",
};

interface EditorialPanelProps {
  problem: ProblemDetail | null;
  className?: string;
}

function EditorialSkeleton() {
  const bar = (w: string) => (
    <div
      className="h-3 rounded animate-pulse"
      style={{ width: w, background: "rgba(217,164,4,0.08)" }}
    />
  );
  return (
    <div className="flex flex-col gap-3 p-6">
      {bar("35%")}
      <div className="pt-2 flex flex-col gap-2">
        {bar("100%")}
        {bar("92%")}
        {bar("80%")}
      </div>
      <div className="pt-3 flex flex-col gap-2">
        {bar("100%")}
        {bar("60%")}
      </div>
    </div>
  );
}

function EditorialEmpty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(217,164,4,0.08)", border: `1px solid ${tokens.borderAlt}` }}
      >
        <Lock size={16} style={{ color: tokens.gold }} />
      </div>
      <span
        className="text-[11px] font-mono font-bold uppercase tracking-wide"
        style={{ color: tokens.muted }}
      >
        {message}
      </span>
    </div>
  );
}

export default function EditorialPanel({ problem, className = "" }: EditorialPanelProps) {
  return (
    <aside
      className={`flex h-full w-full shrink-0 flex-col overflow-y-auto ${className}`}
      style={{ background: tokens.panel }}
    >
      {!problem && <EditorialSkeleton />}

      {problem && !problem.weekEnded && (
        <EditorialEmpty message="Editorial unlocks once this week's challenge ends" />
      )}

      {problem && problem.weekEnded && !problem.editorial && (
        <EditorialEmpty message="No editorial available for this problem yet" />
      )}

      {problem && problem.weekEnded && problem.editorial && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col gap-4 p-6"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={14} style={{ color: tokens.gold }} />
            <h3
              className="text-[11px] font-mono font-bold uppercase tracking-[0.14em]"
              style={{ color: tokens.gold }}
            >
              Editorial
            </h3>
          </div>

          <div style={{ borderTop: `1px solid ${tokens.border}` }} />

          <div
            className="text-[13.5px] leading-relaxed font-sans"
            style={{ color: tokens.ink, opacity: 0.9 }}
          >
            <MarkdownRenderer content={problem.editorial} />
          </div>
        </motion.div>
      )}
    </aside>
  );
}