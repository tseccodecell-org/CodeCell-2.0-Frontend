"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Send,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronRight,
  Loader2,
} from "lucide-react";

import type { SubmissionStatus, Language } from "@/lib/types/submission";

interface CodeEditorProps {
  status: SubmissionStatus;
  activeAction: "RUN" | "SUBMIT" | null;
  starterCode?: Partial<Record<Language, string>>;
  onRun?: (code: string, language: Language, stdin: string) => Promise<void>;
  onSubmit?: (code: string, language: Language) => Promise<void>;
}

const LANGUAGES: { id: Language; label: string; monaco: string }[] = [
  { id: "CPP", label: "C++", monaco: "cpp" },
  { id: "JAVA", label: "Java", monaco: "java" },
  { id: "PYTHON", label: "Python", monaco: "python" },
];

const EMPTY: Record<Language, string> = { CPP: "", JAVA: "", PYTHON: "" };

export default function CodeEditor({
  status,
  activeAction,
  starterCode,
  onRun,
  onSubmit,
}: CodeEditorProps) {
  const [language, setLanguage] = useState<Language>("CPP");
  const [codeByLang, setCodeByLang] = useState<Record<Language, string>>(EMPTY);
  const [stdin, setStdin] = useState("");
  const [inputOpen, setInputOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const editedRef = useRef<Partial<Record<Language, boolean>>>({});

  const isRunning = activeAction === "RUN";
  const isJudging = activeAction === "SUBMIT";
  const isBusy = status === "QUEUED" || status === "RUNNING" || activeAction !== null;

  const current = LANGUAGES.find((l) => l.id === language) ?? LANGUAGES[0];
  const code = codeByLang[language];

  useEffect(() => {
    if (!starterCode) return;
    setCodeByLang((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const lang of LANGUAGES) {
        const template = starterCode[lang.id];
        if (template && !editedRef.current[lang.id] && !next[lang.id]) {
          next[lang.id] = template;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [starterCode]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const setCode = (value: string) => {
    editedRef.current[language] = true;
    setCodeByLang((prev) => ({ ...prev, [language]: value }));
  };

  const resetCode = () => {
    editedRef.current[language] = false;
    setCodeByLang((prev) => ({ ...prev, [language]: starterCode?.[language] ?? "" }));
  };

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-[#0b0d13]"
          : "flex h-full flex-col bg-[#0b0d13]"
      }
    >
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#1a1c24] bg-[#0d0f14] px-2">
        <div className="flex items-center gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] tracking-wide transition-colors cursor-pointer ${
                lang.id === language
                  ? "bg-[#151821] text-[#34D399]"
                  : "text-[#8B93A7] hover:text-[#F4F1EA]"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={resetCode}
            title="Reset to starter code"
            className="rounded p-1.5 text-[#8B93A7] transition-colors hover:bg-[#151821] hover:text-[#34D399] cursor-pointer"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setFullscreen((v) => !v)}
            title={fullscreen ? "Exit full screen" : "Full screen"}
            className="rounded p-1.5 text-[#8B93A7] transition-colors hover:bg-[#151821] hover:text-[#34D399] cursor-pointer"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <Editor
          height="100%"
          language={current.monaco}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme="vs-dark"
          loading={
            <div className="flex h-full w-full items-center justify-center bg-[#0b0d13]">
              <span className="flex items-center gap-2 font-mono text-xs text-[#8B93A7]">
                <Loader2 size={14} className="animate-spin text-[#34D399]" />
                Loading editor
              </span>
            </div>
          }
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            fontLigatures: true,
            tabSize: 4,
            renderLineHighlight: "none",
            overviewRulerLanes: 0,
            scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
            bracketPairColorization: { enabled: true },
            padding: { top: 10, bottom: 10 },
          }}
        />
      </div>

      {inputOpen && (
        <div className="shrink-0 border-t border-[#1a1c24] bg-[#06070B] px-3 py-2">
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Input passed to your program when you press Run"
            spellCheck={false}
            className="h-20 w-full resize-none rounded border border-[#22262f] bg-[#0b0d13] px-2.5 py-2 font-mono text-xs text-[#F4F1EA] placeholder:text-[#5A5850] focus:border-[#34D399]/50 focus:outline-none"
          />
        </div>
      )}

      <div className="flex h-12 shrink-0 items-center justify-between border-t border-[#1a1c24] bg-[#0d0f14] px-3">
        <button
          onClick={() => setInputOpen((v) => !v)}
          className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#8B93A7] transition-colors hover:text-[#F4F1EA] cursor-pointer"
        >
          Test against Custom Input
          <ChevronRight
            size={13}
            className={`transition-transform ${inputOpen ? "-rotate-90" : "rotate-90"}`}
          />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRun?.(code, language, stdin)}
            disabled={isBusy}
            className="flex items-center gap-1.5 rounded border border-[#22262f] px-3.5 py-1.5 font-mono text-xs font-semibold text-[#F4F1EA] transition-colors hover:border-[#34D399]/60 hover:text-[#34D399] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            {isRunning ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            Run
          </button>

          <button
            onClick={() => onSubmit?.(code, language)}
            disabled={isBusy}
            className="flex items-center gap-1.5 rounded px-4 py-1.5 font-mono text-xs font-bold text-[#06070B] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            style={{ background: "linear-gradient(180deg, #6FCF97 0%, #12A87E 100%)" }}
          >
            {isJudging ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
