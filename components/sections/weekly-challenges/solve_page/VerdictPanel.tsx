"use client";

import React, { useState } from "react";
import {
  Clock,
  Cpu,
  MemoryStick,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Terminal,
  Copy,
  Check,
  Zap,
  Layers,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import type {
  SubmissionStatus,
  SubmissionTestResult,
} from "@/lib/types/submission";

interface VerdictPanelProps {
  status?: SubmissionStatus;
  verdict?: string;
  score?: number;
  executionTime?: number;
  memoryUsed?: number;
  stdout?: string;
  stderr?: string;
  errorMessage?: string;
  testResults?: SubmissionTestResult[];
  onClose?: () => void;
}

export default function VerdictPanel({
  status = "IDLE",
  verdict,
  score,
  executionTime,
  memoryUsed,
  stdout,
  stderr,
  errorMessage,
  testResults = [],
  onClose,
}: VerdictPanelProps) {
  const [activeTab, setActiveTab] = useState<"stdout" | "stderr" | "testcases">("stdout");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVerdictBadge = () => {
    if (status === "IDLE") {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-700 bg-gray-900/60 font-mono text-xs text-gray-400 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-gray-500" /> Ready
        </span>
      );
    }

    if (status === "QUEUED" || status === "RUNNING") {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#4BE2C4]/40 bg-[#4BE2C4]/10 font-mono text-xs text-[#4BE2C4] uppercase tracking-wider animate-pulse">
          <span className="w-2 h-2 rounded-full bg-[#4BE2C4] animate-ping" /> Running...
        </span>
      );
    }

    if (status === "FAILED") {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/40 bg-red-500/10 font-mono text-xs text-red-400 font-bold uppercase tracking-wider">
          <XCircle size={14} /> Failed
        </span>
      );
    }

    const isAccepted = verdict === "ACCEPTED" || verdict === "SUCCESS";
    if (isAccepted) {
      return (
        <span className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-400 font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <CheckCircle2 size={15} /> ACCEPTED (100/100)
        </span>
      );
    }

    if (verdict === "WRONG_ANSWER") {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/40 bg-red-500/10 font-mono text-xs text-red-400 font-bold uppercase tracking-wider">
          <XCircle size={14} /> Wrong Answer
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#E8FF00]/40 bg-[#E8FF00]/10 font-mono text-xs text-[#E8FF00] font-bold uppercase tracking-wider">
        <Zap size={14} /> {verdict ?? "Completed"}
      </span>
    );
  };

  const getOutputText = () => {
    if (status === "IDLE") {
      return "▸ Click 'Run Code' or 'Submit Solution' to compile and execute your program.";
    }
    if (status === "RUNNING" || status === "QUEUED") {
      return "▸ Compiling source code...\n▸ Executing tests against sandbox environment...";
    }
    if (stdout && stdout.trim()) {
      return stdout;
    }
    return errorMessage || stderr || "✓ Execution completed cleanly.";
  };

  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0, y: 15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.94, opacity: 0, y: 15 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="w-full max-w-2xl bg-[#080D0A] border border-[#4BE2C4]/40 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden font-sans text-gray-200 select-none relative"
    >
      {/* Top Header Bar */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#0A100C]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#4BE2C4]/10 border border-[#4BE2C4]/30 flex items-center justify-center text-[#4BE2C4]">
            <Terminal size={16} />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider text-white">
              Execution Output
            </h3>
            <span className="font-mono text-[9px] text-[#4BE2C4] uppercase tracking-widest block -mt-0.5">
              CODECELL RUNTIME RESULT
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getVerdictBadge()}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row (Time, Memory, Points) */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-[#050806] border-b border-white/5 font-mono">
        <div className="bg-[#0A0F0C] border border-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#E8FF00]" />
            <span className="text-[10px] text-gray-400 uppercase">Time</span>
          </div>
          <span className="text-xs font-bold text-white">
            {status === "COMPLETED" && executionTime !== undefined ? `${executionTime} ms` : "--"}
          </span>
        </div>

        <div className="bg-[#0A0F0C] border border-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MemoryStick size={14} className="text-[#4BE2C4]" />
            <span className="text-[10px] text-gray-400 uppercase">Memory</span>
          </div>
          <span className="text-xs font-bold text-white">
            {status === "COMPLETED" && memoryUsed !== undefined ? `${(memoryUsed / 1024).toFixed(1)} MB` : "--"}
          </span>
        </div>

        <div className="bg-[#0A0F0C] border border-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-emerald-400" />
            <span className="text-[10px] text-gray-400 uppercase">Score</span>
          </div>
          <span className="text-xs font-bold text-white">
            {status === "COMPLETED" ? `${score ?? 100} / 100` : "--"}
          </span>
        </div>
      </div>

      {/* Output Content */}
      <div className="p-4 bg-[#030504]">
        <div className="flex items-center justify-between mb-2 font-mono text-[10px] text-gray-400 uppercase tracking-widest">
          <span>// STDOUT & LOGS</span>
          <button
            onClick={() => copyToClipboard(getOutputText())}
            className="flex items-center gap-1 text-gray-400 hover:text-white px-2 py-0.5 rounded hover:bg-white/5 transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="bg-[#010202] border border-white/10 rounded-xl p-4 font-mono text-xs leading-relaxed text-[#4BE2C4] shadow-inner max-h-[220px] overflow-y-auto">
          <pre className="whitespace-pre-wrap">{getOutputText()}</pre>
        </div>
      </div>

      {/* Footer Close CTA */}
      <div className="p-4 bg-[#060A08] border-t border-white/5 flex justify-end">
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#4BE2C4] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#E8FF00] transition-colors cursor-pointer"
          >
            CLOSE DIALOG
          </button>
        )}
      </div>
    </motion.div>
  );
}