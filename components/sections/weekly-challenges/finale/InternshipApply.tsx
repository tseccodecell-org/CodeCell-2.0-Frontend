"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Check, LogIn } from "lucide-react";

import {
  applyForInternship,
  getMyInternshipApplication,
  ApiError,
  LOGIN_URL,
} from "@/lib/api-client";
import type { InternshipApplicationRequest } from "@/lib/api-client";
import { PARTNERS } from "./finale-config";

const GOLD = "#D9A404";

const BEFORE_YOU_APPLY = [
  "Applying does not guarantee an interview, an offer, or a place in any partner's process. It puts your profile in front of them.",
  "CodeCell passes your details and season record to the partners listed below. Everything after that is between you and them.",
  "Roles, stipend, duration and mode of work are decided by the partner, not by CodeCell. We do not negotiate on your behalf.",
  "Your resume link must be publicly viewable. Set Google Drive sharing to anyone with the link, or the partner cannot open it.",
  "Give details you are willing to have shared with a recruiter. You can come back and update this form any time before the deadline.",
];

const EMPTY: InternshipApplicationRequest = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  branch: "",
  graduationYear: new Date().getFullYear() + 1,
  cgpa: "",
  resumeUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  rolePreference: "",
  availability: "",
  locationPref: "",
  note: "",
};

function Field({
  label,
  id,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-sans text-sm text-[#F4F1EA]">
        {label}
        {required && <span style={{ color: GOLD }}> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-[#22262f] bg-[#0B0E15] px-3 py-2.5 font-sans text-sm text-[#F4F1EA] placeholder:text-[#5A5850] focus:border-[#D9A404]/60 focus:outline-none"
      />
      {hint && <span className="font-sans text-xs text-[#8B93A7]">{hint}</span>}
    </div>
  );
}

export default function InternshipApply() {
  const [form, setForm] = useState<InternshipApplicationRequest>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [unauthenticated, setUnauthenticated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getMyInternshipApplication()
      .then((existing) => {
        if (cancelled) return;
        setForm({
          fullName: existing.fullName,
          email: existing.email,
          phone: existing.phone,
          college: existing.college,
          branch: existing.branch,
          graduationYear: existing.graduationYear,
          cgpa: existing.cgpa ?? "",
          resumeUrl: existing.resumeUrl,
          githubUrl: existing.githubUrl ?? "",
          linkedinUrl: existing.linkedinUrl ?? "",
          portfolioUrl: existing.portfolioUrl ?? "",
          rolePreference: existing.rolePreference ?? "",
          availability: existing.availability ?? "",
          locationPref: existing.locationPref ?? "",
          note: existing.note ?? "",
        });
        setSubmitted(true);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) setUnauthenticated(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const set = (key: keyof InternshipApplicationRequest) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await applyForInternship({
        ...form,
        graduationYear: Number(form.graduationYear),
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't send your application. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (unauthenticated) {
    return (
      <div className="min-h-screen bg-[#05070C] px-6 py-20 text-[#F4F1EA]">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
          <h1 className="font-sans text-2xl font-bold">Sign in to apply</h1>
          <p className="font-sans text-sm text-[#8B93A7]">
            Your application is tied to your CodeCell account and your season record.
          </p>
          <button
            onClick={() => (window.location.href = LOGIN_URL)}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[#05070C] transition-opacity hover:opacity-90 cursor-pointer"
            style={{ background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)" }}
          >
            <LogIn size={14} />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070C] text-[#F4F1EA]">
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-10 md:py-16">
        <Link
          href="/events/finale"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#8B93A7] transition-colors hover:text-[#D9A404]"
        >
          <ChevronLeft size={14} />
          Back to the finale
        </Link>

        <h1 className="mt-10 font-sans text-3xl font-bold md:text-4xl">
          Apply to the internship partners
        </h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-[#8B93A7]">
          One form, shared with{" "}
          {PARTNERS.map((p, i) => (
            <span key={p.name}>
              {i > 0 && (i === PARTNERS.length - 1 ? " and " : ", ")}
              <span className="text-[#F4F1EA]">{p.name}</span>
            </span>
          ))}
          .
        </p>

        <section className="mt-10 border border-[#14161e] bg-[#0B0E15] p-6">
          <h2 className="font-sans text-base font-semibold">Before you apply</h2>
          <ul className="mt-4 space-y-3">
            {BEFORE_YOU_APPLY.map((line) => (
              <li key={line} className="flex gap-3">
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full"
                  style={{ background: GOLD }}
                />
                <span className="font-sans text-sm leading-relaxed text-[#8B93A7]">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {submitted && (
          <p
            role="status"
            className="mt-8 flex items-center gap-2 border px-4 py-3 font-sans text-sm"
            style={{ borderColor: GOLD, color: GOLD }}
          >
            <Check size={15} />
            Your application is in. Edit anything below and save again to update it.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
          <fieldset className="flex flex-col gap-4" disabled={loading || submitting}>
            <legend className="font-sans text-base font-semibold">About you</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" id="fullName" value={form.fullName} onChange={set("fullName")} required />
              <Field label="Email" id="email" type="email" value={form.email} onChange={set("email")} required />
              <Field label="Phone" id="phone" value={form.phone} onChange={set("phone")} required />
              <Field label="College" id="college" value={form.college} onChange={set("college")} required />
              <Field label="Branch" id="branch" value={form.branch} onChange={set("branch")} required />
              <Field
                label="Graduation year"
                id="graduationYear"
                type="number"
                value={String(form.graduationYear)}
                onChange={set("graduationYear")}
                required
              />
              <Field label="CGPA" id="cgpa" value={form.cgpa ?? ""} onChange={set("cgpa")} placeholder="8.4" />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4" disabled={loading || submitting}>
            <legend className="font-sans text-base font-semibold">Your work</legend>
            <Field
              label="Resume link"
              id="resumeUrl"
              value={form.resumeUrl}
              onChange={set("resumeUrl")}
              required
              placeholder="https://drive.google.com/file/d/..."
              hint="Paste a Drive link set to anyone with the link. A link a recruiter cannot open is the same as no resume."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="GitHub" id="githubUrl" value={form.githubUrl ?? ""} onChange={set("githubUrl")} placeholder="https://github.com/..." />
              <Field label="LinkedIn" id="linkedinUrl" value={form.linkedinUrl ?? ""} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/in/..." />
              <Field label="Portfolio" id="portfolioUrl" value={form.portfolioUrl ?? ""} onChange={set("portfolioUrl")} placeholder="https://..." />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4" disabled={loading || submitting}>
            <legend className="font-sans text-base font-semibold">What you are looking for</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Role you want"
                id="rolePreference"
                value={form.rolePreference ?? ""}
                onChange={set("rolePreference")}
                placeholder="Backend, ML, full stack"
              />
              <Field
                label="When you can start"
                id="availability"
                value={form.availability ?? ""}
                onChange={set("availability")}
                placeholder="December 2026, 6 months"
              />
              <Field
                label="Where you can work"
                id="locationPref"
                value={form.locationPref ?? ""}
                onChange={set("locationPref")}
                placeholder="Mumbai, remote"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="note" className="font-sans text-sm text-[#F4F1EA]">
                Anything else for the recruiter
              </label>
              <textarea
                id="note"
                rows={4}
                value={form.note ?? ""}
                onChange={(e) => set("note")(e.target.value)}
                placeholder="What you have built, what you want to work on."
                className="rounded border border-[#22262f] bg-[#0B0E15] px-3 py-2.5 font-sans text-sm text-[#F4F1EA] placeholder:text-[#5A5850] focus:border-[#D9A404]/60 focus:outline-none"
              />
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="font-sans text-sm text-[#E2574C]">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={loading || submitting}
              className="inline-flex items-center gap-2 border border-[#D9A404] bg-[#D9A404]/10 px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A404] transition-colors hover:bg-[#D9A404] hover:text-[#05070C] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              {submitting ? "Sending" : submitted ? "Update application" : "Send application"}
            </button>
            <span className="font-sans text-xs text-[#8B93A7]">
              You can update this any time before the deadline.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
