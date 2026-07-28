"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Send,
  RotateCcw,
  Settings,
  Maximize2,
  Terminal,
  Loader2,
} from "lucide-react";

import type { SubmissionStatus, Language } from "@/lib/types/submission";
import { runCode, LanguageKey, RunResponse } from "@/lib/runtime-api";

interface CodeEditorProps {
  status: SubmissionStatus;
  activeAction: "RUN" | "SUBMIT" | null;
  stdin?: string;
  onRun?: (code: string, language: Language) => Promise<void>;
  onRunResult?: (result: RunResponse) => void;
  onSubmit?: (code: string, language: Language) => Promise<void>;
}

const LANG_CONFIG: Record<
  Language,
  { label: string; monaco: string; runtimeKey: LanguageKey }
> = {
  CPP: {
    label: "C++",
    monaco: "cpp",
    runtimeKey: "cpp",
  },
  JAVA: {
    label: "Java",
    monaco: "java",
    runtimeKey: "java",
  },
  PYTHON: {
    label: "Python",
    monaco: "python",
    runtimeKey: "python",
  },
};

export default function CodeEditor({
  status,
  activeAction,
  stdin = "",
  onRun,
  onRunResult,
  onSubmit,
}: CodeEditorProps) {
  const [language, setLanguage] = useState<Language>("CPP");
  const [code, setCode] = useState("");
  const [isInternalRunning, setIsInternalRunning] = useState(false);

  const isRunning = activeAction === "RUN" || isInternalRunning;
  const isJudging = activeAction === "SUBMIT";
  const isBusy = status === "QUEUED" || status === "RUNNING" || isRunning || isJudging;

  const handleRunClick = async () => {
    if (isBusy) return;

    // 1. If custom parent handler is provided, trigger it
    if (onRun) {
      await onRun(code, language);
      return;
    }

    // 2. Direct execution via smart runCode (Daemon local vs Cloud fallback)
    setIsInternalRunning(true);
    try {
      const runtimeLang = LANG_CONFIG[language].runtimeKey;
      const res = await runCode({
        language: runtimeLang,
        source: code,
        stdin: stdin,
        time_limit_ms: 3000,
      });

      if (onRunResult) {
        onRunResult(res);
      }
    } catch (err) {
      console.error("Run execution failed:", err);
    } finally {
      setIsInternalRunning(false);
    }
  };

  return (
    <div className="bg-[#0b0d13] border border-[#1a1c24] shadow-xl overflow-hidden flex flex-col h-full">
      <div className="p-2 border-b border-[#1a1c24] flex justify-between items-center bg-[#0d0f14]">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-[#0d0f14] text-[#F4F1EA] border border-[#22262f] rounded px-3 py-1.5 font-mono text-xs tracking-wide focus:outline-none focus:border-[#34D399]/60 cursor-pointer"
        >
          {Object.entries(LANG_CONFIG).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>

        <div className="flex gap-1">
          <button
            onClick={() => setCode("")}
            title="Reset code"
            className="p-2 text-[#8B93A7] hover:text-[#34D399] hover:bg-[#151821] rounded transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>

          <button
            title="Settings"
            className="p-2 text-[#8B93A7] hover:text-[#34D399] hover:bg-[#151821] rounded transition-colors cursor-pointer"
          >
            <Settings size={16} />
          </button>

          <button
            title="Full screen"
            className="p-2 text-[#8B93A7] hover:text-[#34D399] hover:bg-[#151821] rounded transition-colors cursor-pointer"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={LANG_CONFIG[language].monaco}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme="vs-dark"
          loading={
            <div className="h-full w-full flex items-center justify-center bg-[#0b0d13]">
              <span className="flex items-center gap-2 font-mono text-xs text-[#8B93A7]">
                <Loader2 size={14} className="animate-spin text-[#34D399]" />
                Loading editor...
              </span>
            </div>
          }
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            fontLigatures: true,
            tabSize: 4,
            bracketPairColorization: { enabled: true },
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      <div className="px-4 py-2 border-t border-[#1a1c24] flex justify-between font-mono text-[10px] tracking-widest text-[#5A5850] bg-[#0d0f14]">
        <span>UTF-8</span>
        <span className="text-[#8B93A7]">{LANG_CONFIG[language].label}</span>
      </div>

      <div className="p-3 border-t border-[#1a1c24] bg-[#0d0f14] flex justify-between">
        <button className="flex items-center gap-2 font-mono text-xs text-[#8B93A7] hover:text-[#34D399] transition-colors cursor-pointer">
          <Terminal size={16} />
          Console
        </button>

        <div className="flex gap-2">
          {/* Run Button hooked to handleRunClick */}
          <button
            onClick={handleRunClick}
            disabled={isBusy}
            className="flex items-center gap-2 font-mono text-xs font-bold tracking-wide border border-[#22262f] hover:border-[#34D399]/60 hover:text-[#34D399] disabled:opacity-50 disabled:cursor-not-allowed text-[#F4F1EA] px-4 py-2 rounded transition-colors cursor-pointer"
          >
            {isRunning ? (
              <>
                <Loader2 size={16} className="animate-spin text-[#34D399]" />
                Running...
              </>
            ) : (
              <>
                <Play size={16} />
                Run
              </>
            )}
          </button>

          {/* Submit Button */}
          <button
            onClick={() => onSubmit?.(code, language)}
            disabled={isBusy}
            className="flex items-center gap-2 font-mono text-xs font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed text-[#06070B] px-5 py-2 rounded transition-opacity cursor-pointer"
            style={{
              background: "linear-gradient(180deg, #6FCF97 0%, #12A87E 100%)",
            }}
          >
            {isJudging ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Judging...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}