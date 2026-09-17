"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Loader2, Plus } from "lucide-react";

import type { Language } from "@/lib/types/submission";
import type { TemplateResponse } from "@/lib/schemas/finale";
import { useTemplateAutosave, type AutosaveTemplateInput } from "@/hooks/useTemplateAutosave";

interface TemplateLoaderProps {
  initialTemplates: TemplateResponse[];
  onContinue: (buffers: Partial<Record<Language, string>>, activeLanguage: Language) => void;
  continueLabel?: string;
  showContinue?: boolean;
  readOnly?: boolean;
  onBuffersChange?: (buffers: Partial<Record<Language, string>>, activeLanguage: Language) => void;
}

interface WorkingSlot {
  key: string;
  id?: string;
  name: string;
  sourceCode: string;
}

const LANGUAGES: { id: Language; label: string; monaco: string }[] = [
  { id: "CPP", label: "C++", monaco: "cpp" },
  { id: "JAVA", label: "Java", monaco: "java" },
  { id: "PYTHON", label: "Python", monaco: "python" },
];

function slotFromTemplate(template: TemplateResponse): WorkingSlot {
  return {
    key: template.id,
    id: template.id,
    name: template.name,
    sourceCode: template.sourceCode,
  };
}

// the backend rejects a template with no name, so a fresh slot starts with one
// the participant can rename instead of an empty box autosave would choke on
function defaultNameFor(language: Language): string {
  const label = LANGUAGES.find((l) => l.id === language)?.label ?? language;
  return `Untitled ${label}`;
}

function buildBlankSlots(): Record<Language, WorkingSlot> {
  let seq = 0;
  const blank = (language: Language): WorkingSlot => ({
    key: `blank-${seq++}`,
    name: defaultNameFor(language),
    sourceCode: "",
  });
  return {
    CPP: blank("CPP"),
    JAVA: blank("JAVA"),
    PYTHON: blank("PYTHON"),
  };
}

export default function TemplateLoader({
  initialTemplates,
  onContinue,
  continueLabel = "Continue",
  showContinue = true,
  readOnly = false,
  onBuffersChange,
}: TemplateLoaderProps) {
  const [activeLanguage, setActiveLanguage] = useState<Language>("CPP");
  const [slots, setSlots] = useState<Record<Language, WorkingSlot>>(buildBlankSlots);
  const [templates, setTemplates] = useState<TemplateResponse[]>(initialTemplates);
  const newSlotSeq = useRef(0);

  const current = LANGUAGES.find((l) => l.id === activeLanguage) ?? LANGUAGES[0];
  const activeSlot = slots[activeLanguage];

  const handleSaved = useCallback(
    (savedInput: AutosaveTemplateInput, response: TemplateResponse) => {
      setSlots((prev) => {
        const slot = prev[savedInput.language];
        if (!slot || slot.key !== savedInput.key || slot.id === response.id) return prev;
        return { ...prev, [savedInput.language]: { ...slot, id: response.id } };
      });
      setTemplates((prev) => {
        const idx = prev.findIndex((t) => t.id === response.id);
        if (idx === -1) return [...prev, response];
        const next = [...prev];
        next[idx] = response;
        return next;
      });
    },
    []
  );

  const autosaveInput: AutosaveTemplateInput = useMemo(
    () => ({
      key: activeSlot.key,
      id: activeSlot.id,
      name: activeSlot.name,
      language: activeLanguage,
      sourceCode: activeSlot.sourceCode,
    }),
    [activeSlot, activeLanguage]
  );

  const { saving, saved, error, needsName, retry } = useTemplateAutosave(
    autosaveInput,
    readOnly ? 0 : 800,
    handleSaved
  );

  const selectTemplate = (template: TemplateResponse) => {
    setActiveLanguage(template.language);
    setSlots((prev) => ({ ...prev, [template.language]: slotFromTemplate(template) }));
  };

  const startNewTemplate = () => {
    newSlotSeq.current += 1;
    setSlots((prev) => ({
      ...prev,
      [activeLanguage]: {
        key: `new-${newSlotSeq.current}`,
        name: defaultNameFor(activeLanguage),
        sourceCode: "",
      },
    }));
  };

  const updateName = (name: string) => {
    setSlots((prev) => ({ ...prev, [activeLanguage]: { ...prev[activeLanguage], name } }));
  };

  const updateCode = (sourceCode: string) => {
    setSlots((prev) => ({ ...prev, [activeLanguage]: { ...prev[activeLanguage], sourceCode } }));
  };

  const currentBuffers = useMemo(() => {
    const buffers: Partial<Record<Language, string>> = {};
    for (const lang of LANGUAGES) {
      const slot = slots[lang.id];
      if (slot.sourceCode) buffers[lang.id] = slot.sourceCode;
    }
    return buffers;
  }, [slots]);

  useEffect(() => {
    onBuffersChange?.(currentBuffers, activeLanguage);
  }, [currentBuffers, activeLanguage, onBuffersChange]);

  const handleContinue = () => {
    onContinue(currentBuffers, activeLanguage);
  };

  const templatesForActiveLanguage = templates.filter((t) => t.language === activeLanguage);

  return (
    <div className="flex h-full flex-col bg-[#06070B] text-[#F4F1EA]">
      <div className="flex h-10 shrink-0 items-center gap-1 overflow-x-auto border-b border-[#1a1c24] bg-[#0d0f14] px-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setActiveLanguage(lang.id)}
            className={`rounded px-2.5 py-1 font-mono text-[11px] tracking-wide transition-colors cursor-pointer ${
              lang.id === activeLanguage
                ? "bg-[#151821] text-[#D9A404]"
                : "text-[#8B93A7] hover:text-[#F4F1EA]"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="flex max-h-40 shrink-0 flex-col border-b border-[#1a1c24] bg-[#0b0d13] md:max-h-none md:w-56 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between border-b border-[#1a1c24] px-3 py-2">
            <span className="font-mono text-[11px] tracking-wide text-[#8B93A7]">
              {current.label} templates
            </span>
            <button
              onClick={startNewTemplate}
              disabled={readOnly}
              title="Start a new template"
              className="rounded p-1 text-[#8B93A7] transition-colors hover:bg-[#151821] hover:text-[#D9A404] cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {templatesForActiveLanguage.length === 0 ? (
              <p className="px-3 py-2 font-sans text-xs text-[#5A5850]">
                No saved templates yet.
              </p>
            ) : (
              templatesForActiveLanguage.map((template) => (
                <button
                  key={template.id}
                  onClick={() => selectTemplate(template)}
                  className={`block w-full truncate px-3 py-2 text-left font-sans text-sm transition-colors cursor-pointer ${
                    activeSlot.id === template.id
                      ? "bg-[#151821] text-[#D9A404]"
                      : "text-[#8B93A7] hover:bg-[#151821] hover:text-[#F4F1EA]"
                  }`}
                >
                  {template.name}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#1a1c24] bg-[#0d0f14] px-3 py-2 sm:flex-nowrap sm:gap-3">
            <input
              aria-label="Template name"
              value={activeSlot.name}
              readOnly={readOnly}
              onChange={(e) => updateName(e.target.value)}
              placeholder="Template name"
              className="w-full min-w-0 flex-1 rounded border border-[#22262f] bg-[#0b0d13] px-2.5 py-1.5 font-sans text-sm text-[#F4F1EA] placeholder:text-[#5A5850] focus:border-[#D9A404]/50 focus:outline-none sm:w-auto"
            />
            {readOnly ? (
              <span className="shrink-0 font-mono text-[11px] tracking-wide text-[#8B93A7]">
                Locked for review
              </span>
            ) : (
            <SaveStatus
              saving={saving}
              saved={saved}
              error={error}
              needsName={needsName}
              retry={retry}
            />
            )}
          </div>

          <div className="relative min-h-0 flex-1">
            <Editor
              height="100%"
              language={current.monaco}
              value={activeSlot.sourceCode}
              onChange={(v) => updateCode(v ?? "")}
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
                readOnly,
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbersMinChars: 3,
                scrollBeyondLastLine: false,
                fontLigatures: true,
                tabSize: 4,
                renderLineHighlight: "none",
                overviewRulerLanes: 0,
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                bracketPairColorization: { enabled: true },
                padding: { top: 10, bottom: 10 },
                ariaLabel: "Template code",
              }}
            />
          </div>

          {showContinue && (
          <div className="flex h-12 shrink-0 items-center justify-end border-t border-[#1a1c24] bg-[#0d0f14] px-3">
            <button
              onClick={handleContinue}
              className="flex items-center gap-1.5 rounded px-4 py-1.5 font-mono text-xs font-bold text-[#06070B] transition-opacity hover:opacity-90 cursor-pointer"
              style={{ background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)" }}
            >
              {continueLabel}
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SaveStatus({
  saving,
  saved,
  error,
  needsName,
  retry,
}: {
  saving: boolean;
  saved: boolean;
  error: string | null;
  needsName: boolean;
  retry: () => void;
}) {
  if (needsName) {
    return (
      <span className="shrink-0 font-mono text-[11px] tracking-wide text-[#D9A404]">
        Add a name to save
      </span>
    );
  }

  if (error) {
    return (
      <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] tracking-wide text-[#E05252]">
        <span title={error} className="max-w-[22rem] truncate">
          {error}
        </span>
        <button
          onClick={retry}
          className="rounded border border-[#E05252]/50 px-2 py-0.5 text-[#E05252] transition-colors hover:bg-[#E05252]/10 cursor-pointer"
        >
          Retry save
        </button>
      </div>
    );
  }

  if (saving) {
    return (
      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#8B93A7]">
        <Loader2 size={12} className="animate-spin text-[#D9A404]" />
        Saving…
      </span>
    );
  }

  if (saved) {
    return (
      <span className="shrink-0 font-mono text-[11px] tracking-wide text-[#8B93A7]">Saved</span>
    );
  }

  return null;
}
