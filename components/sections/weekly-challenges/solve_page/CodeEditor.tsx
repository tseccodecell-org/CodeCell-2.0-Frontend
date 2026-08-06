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
import { checkRuntimeHealth, getLocalToolchainStatus } from "@/lib/runtime-api";
import type { LanguageKey } from "@/lib/runtime-api";

interface CodeEditorProps {
  problemId?: string;
  status: SubmissionStatus;
  activeAction: "RUN" | "SUBMIT" | null;
  starterCode?: Partial<Record<Language, string>>;
  loadRequest?: { language: Language; code: string; nonce: number } | null;
  cooldownLeft?: number;
  banned?: boolean;
  onRun?: (code: string, language: Language, stdin: string) => Promise<void>;
  onSubmit?: (code: string, language: Language) => Promise<void>;
}

const LANGUAGES: { id: Language; label: string; monaco: string; runtime: LanguageKey }[] = [
  { id: "CPP", label: "C++", monaco: "cpp", runtime: "cpp" },
  { id: "JAVA", label: "Java", monaco: "java", runtime: "java" },
  { id: "PYTHON", label: "Python", monaco: "python", runtime: "python" },
];

const RUNTIME_PROBE_MS = 20000;
const EMPTY: Record<Language, string> = { CPP: "", JAVA: "", PYTHON: "" };

export default function CodeEditor({
  problemId,
  status,
  activeAction,
  starterCode,
  loadRequest,
  cooldownLeft = 0,
  banned = false,
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
  const isBusy = status === "QUEUED" || status === "RUNNING" || activeAction !== null || banned;
  const submitBusy = activeAction !== null || cooldownLeft > 0 || banned;

  const current = LANGUAGES.find((l) => l.id === language) ?? LANGUAGES[0];
  const code = codeByLang[language];

  const [localReady, setLocalReady] = useState<Partial<Record<Language, boolean>> | null>(
    null
  );

  // Helper to persist code to localStorage for a given language
  const persistCode = (lang: Language, val: string) => {
    if (typeof window === "undefined" || !problemId) return;
    try {
      const cacheKey = `codecell_code_${problemId}`;
      const cachedRaw = localStorage.getItem(cacheKey);
      const existing = cachedRaw ? JSON.parse(cachedRaw) : {};
      existing[lang] = val;
      localStorage.setItem(cacheKey, JSON.stringify(existing));
    } catch {
      // Ignore localStorage errors
    }
  };

  // ── Load cached code from localStorage on mount or problemId change ──
  useEffect(() => {
    if (typeof window === "undefined" || !problemId) return;
    try {
      const cacheKey = `codecell_code_${problemId}`;
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cachedMap: Partial<Record<Language, string>> = JSON.parse(cachedRaw);
        if (cachedMap && typeof cachedMap === "object") {
          setCodeByLang((prev) => {
            const next = { ...prev };
            let changed = false;
            for (const langId of ["CPP", "JAVA", "PYTHON"] as Language[]) {
              if (cachedMap[langId]) {
                next[langId] = cachedMap[langId]!;
                editedRef.current[langId] = true;
                changed = true;
              }
            }
            return changed ? next : prev;
          });
        }
      }
    } catch {
      // Ignore JSON parse error
    }
  }, [problemId]);

  useEffect(() => {
    let cancelled = false;

    const probe = async () => {
      const healthy = await checkRuntimeHealth();
      if (cancelled) return;

      if (!healthy) {
        setLocalReady({});
        return;
      }

      const toolchains = await getLocalToolchainStatus();
      if (cancelled) return;

      const ready: Partial<Record<Language, boolean>> = {};
      for (const lang of LANGUAGES) {
        ready[lang.id] = !!toolchains?.[lang.runtime]?.available;
      }
      setLocalReady(ready);
    };

    probe();
    const interval = setInterval(probe, RUNTIME_PROBE_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const runsLocally = !!localReady?.[language];

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
    if (!loadRequest) return;
    const target = loadRequest.language;

    if (editedRef.current[target]) {
      const ok = window.confirm(
        `Replace your current ${target} code with this submission? Your unsaved changes will be lost.`
      );
      if (!ok) return;
    }

    editedRef.current[target] = true;
    setLanguage(target);
    setCodeByLang((prev) => ({ ...prev, [target]: loadRequest.code }));
    persistCode(target, loadRequest.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadRequest]);

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
    persistCode(language, value);
  };

  const resetCode = () => {
    editedRef.current[language] = false;
    const template = starterCode?.[language] ?? "";
    setCodeByLang((prev) => ({ ...prev, [language]: template }));
    if (typeof window !== "undefined" && problemId) {
      try {
        const cacheKey = `codecell_code_${problemId}`;
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const existing = JSON.parse(cachedRaw);
          delete existing[language];
          localStorage.setItem(cacheKey, JSON.stringify(existing));
        }
      } catch {
        // Ignore errors
      }
    }
  };

  const handleRunClick = async () => {
    if (!onRun || isBusy) return;
    persistCode(language, code);
    await onRun(code, language, stdin);
  };

  const handleSubmitClick = async () => {
    if (!onSubmit || submitBusy) return;
    persistCode(language, code);
    await onSubmit(code, language);
  };

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-[#0b0d13]"
          : "flex h-full flex-col bg-[#0b0d13]"
      }
    >
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 overflow-x-auto border-b border-[#1a1c24] bg-[#0d0f14] px-2">
        <div className="flex shrink-0 items-center gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] tracking-wide transition-colors cursor-pointer ${
                lang.id === language
                  ? "bg-[#151821] text-[#D9A404]"
                  : "text-[#8B93A7] hover:text-[#F4F1EA]"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            title={
              runsLocally
                ? "Run executes on the CodeCell runtime on this machine"
                : "CodeCell runtime not detected, Run executes on the server judge"
            }
            className="flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] tracking-wide"
            style={{
              borderColor: runsLocally ? "#D9A40455" : "#22262f",
              color: runsLocally ? "#D9A404" : "#8B93A7",
              background: runsLocally ? "#D9A40412" : "transparent",
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: runsLocally ? "#D9A404" : "#5A5850" }}
            />
            <span className="hidden sm:inline">
              {localReady === null
                ? "Checking runtime"
                : runsLocally
                  ? "CodeCell Runtime"
                  : "Server Judge"}
            </span>
          </span>

          <button
            onClick={resetCode}
            title="Reset to starter code"
            className="rounded p-1.5 text-[#8B93A7] transition-colors hover:bg-[#151821] hover:text-[#D9A404] cursor-pointer"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setFullscreen((v) => !v)}
            title={fullscreen ? "Exit full screen" : "Full screen"}
            className="rounded p-1.5 text-[#8B93A7] transition-colors hover:bg-[#151821] hover:text-[#D9A404] cursor-pointer"
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
                <Loader2 size={14} className="animate-spin text-[#D9A404]" />
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
            className="h-20 w-full resize-none rounded border border-[#22262f] bg-[#0b0d13] px-2.5 py-2 font-mono text-xs text-[#F4F1EA] placeholder:text-[#5A5850] focus:border-[#D9A404]/50 focus:outline-none"
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
            onClick={handleRunClick}
            disabled={isBusy}
            title={banned ? "Your account is suspended, so you cannot run code." : undefined}
            className="flex items-center gap-1.5 rounded border border-[#22262f] px-3.5 py-1.5 font-mono text-xs font-semibold text-[#F4F1EA] transition-colors hover:border-[#D9A404]/60 hover:text-[#D9A404] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            {isRunning ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            Run
          </button>

          <button
            onClick={handleSubmitClick}
            disabled={submitBusy}
            title={
              banned
                ? "Your account is suspended, so you cannot submit."
                : cooldownLeft > 0
                  ? `You have hit the submission limit, try again in ${cooldownLeft}s`
                  : undefined
            }
            className="flex items-center gap-1.5 rounded px-4 py-1.5 font-mono text-xs font-bold text-[#06070B] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            style={{ background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)" }}
          >
            {isJudging ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {cooldownLeft > 0 ? `Submit in ${cooldownLeft}s` : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
