"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createTemplate, updateTemplate } from "@/lib/api-client";
import type { TemplateResponse } from "@/lib/schemas/finale";
import type { TemplateRequest } from "@/lib/types/finale";
import type { Language } from "@/lib/types/submission";

export interface AutosaveTemplateInput {
  key: string;
  id?: string;
  name: string;
  language: Language;
  sourceCode: string;
}

export interface UseTemplateAutosaveResult {
  saving: boolean;
  saved: boolean;
  error: string | null;
  needsName: boolean;
  retry: () => void;
}

interface Baseline {
  name: string;
  sourceCode: string;
}

export function useTemplateAutosave(
  template: AutosaveTemplateInput,
  delayMs: number,
  onSaved?: (saved: AutosaveTemplateInput, response: TemplateResponse) => void
): UseTemplateAutosaveResult {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestCounters = useRef<Record<string, number>>({});
  const baselines = useRef<Record<string, Baseline>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;

  const performSave = useCallback((input: AutosaveTemplateInput) => {
    const attempt = (requestCounters.current[input.key] ?? 0) + 1;
    requestCounters.current[input.key] = attempt;

    setSaving(true);
    setSaved(false);
    setError(null);

    const body: TemplateRequest = {
      name: input.name,
      language: input.language,
      sourceCode: input.sourceCode,
    };
    const request = input.id
      ? updateTemplate(input.id, body)
      : createTemplate(body);

    request.then(
      (response) => {
        if (requestCounters.current[input.key] !== attempt) return;
        baselines.current[input.key] = { name: input.name, sourceCode: input.sourceCode };
        setSaving(false);
        setSaved(true);
        setError(null);
        onSavedRef.current?.(input, response);
      },
      (err: unknown) => {
        if (requestCounters.current[input.key] !== attempt) return;
        setSaving(false);
        setSaved(false);
        setError(err instanceof Error ? err.message : "Failed to save template");
      }
    );
  }, []);

  useEffect(() => {
    const baseline = baselines.current[template.key];

    if (!baseline) {
      baselines.current[template.key] = { name: template.name, sourceCode: template.sourceCode };
      setSaving(false);
      setSaved(!!template.id);
      setError(null);
      return;
    }

    if (baseline.name === template.name && baseline.sourceCode === template.sourceCode) {
      return;
    }

    // the backend requires a name, so an unnamed template waits here instead of
    // being sent off to come back as a 400 the participant cannot interpret
    if (!template.name.trim()) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setSaving(false);
      setSaved(false);
      setError(null);
      return;
    }

    setSaving(true);
    setSaved(false);
    setError(null);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      performSave(template);
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.key, template.id, template.name, template.sourceCode, template.language, delayMs]);

  const retry = useCallback(() => {
    if (!template.name.trim()) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    performSave(template);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performSave, template.key, template.id, template.name, template.sourceCode, template.language]);

  return { saving, saved, error, needsName: !template.name.trim(), retry };
}
