"use client";

import { CheckCircle2, XCircle, Loader2, Terminal } from "lucide-react";
import type {
  SubmissionStatus,
  SubmissionTestResult,
} from "@/lib/types/submission";

export interface VerdictPanelProps {
  status?: SubmissionStatus;
  mode?: "RUN" | "SUBMIT" | null;
  verdict?: string;
  score?: number;
  executionTime?: number;
  compileTime?: number;
  memoryUsed?: number;
  origin?: string | null;
  stdout?: string;
  stderr?: string;
  errorMessage?: string;
  input?: string;
  testResults?: SubmissionTestResult[];
}

const OK_VERDICTS = ["ACCEPTED", "SUCCESS"];

const VERDICT_TEXT: Record<string, string> = {
  ACCEPTED: "Correct Answer",
  SUCCESS: "Correct Answer",
  WRONG_ANSWER: "Wrong Answer",
  RUNTIME_ERROR: "Runtime Error",
  COMPILE_ERROR: "Compilation Error",
  COMPILATION_ERROR: "Compilation Error",
  TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  MEMORY_LIMIT_EXCEEDED: "Memory Limit Exceeded",
  SKIPPED: "Skipped",
  INTERNAL_ERROR: "Internal Error",
};

const formatMemory = (kb?: number) => {
  if (kb === undefined || kb === null) return "--";
  if (kb >= 1024) return `${(kb / 1024).toFixed(2)} MB`;
  return `${kb} KB`;
};

const isPassed = (test: SubmissionTestResult) =>
  (test as { passed?: boolean }).passed ??
  OK_VERDICTS.includes(test.verdict);

export default function VerdictPanel({
  status = "IDLE",
  mode,
  verdict,
  score,
  executionTime,
  compileTime,
  memoryUsed,
  origin,
  stdout,
  stderr,
  errorMessage,
  input,
  testResults = [],
}: VerdictPanelProps) {
  const isBusy = status === "QUEUED" || status === "RUNNING";
  const isAccepted = !!verdict && OK_VERDICTS.includes(verdict);
  const hasFailed = status === "FAILED";

  if (status === "IDLE") {
    return (
      <Shell>
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
          <Terminal size={18} className="text-[#5A5850]" />
          <p className="font-mono text-xs text-[#5A5850]">
            Run your code to test it, or submit it to be judged.
          </p>
        </div>
      </Shell>
    );
  }

  if (isBusy) {
    return (
      <Shell>
        <Banner
          color="#D9A404"
          icon={<Loader2 size={15} className="animate-spin" />}
          text={status === "QUEUED" ? "Waiting in queue" : "Executing"}
        />
      </Shell>
    );
  }

  const passedCount = testResults.filter(isPassed).length;
  const totalCount = testResults.length;
  const totalScore =
    score ??
    (totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : undefined);

  const allPassed = totalCount > 0 && passedCount === totalCount;
  const failedByTally = totalCount > 0 && !allPassed;
  const isBad = hasFailed || (verdict && !isAccepted) || (!verdict && failedByTally);

  const bannerColor = isBad ? "#E2574C" : "#34D399";
  const bannerText = hasFailed
    ? "Judge Error"
    : verdict
      ? VERDICT_TEXT[verdict] ?? verdict.replace(/_/g, " ")
      : failedByTally
        ? "Wrong Answer"
        : "Successfully executed";

  const failureText = stderr?.trim() || errorMessage?.trim();

  return (
    <Shell>
      <Banner
        color={bannerColor}
        icon={
          bannerColor === "#34D399" ? <CheckCircle2 size={15} /> : <XCircle size={15} />
        }
        text={bannerText}
        right={
          mode === "SUBMIT" && totalScore !== undefined ? (
            <span className="font-mono text-[11px] text-[#8B93A7]">
              Score <span style={{ color: bannerColor }}>{totalScore}%</span>
            </span>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-4 py-3 font-mono text-xs">
        <Metric label="Time" value={executionTime !== undefined ? `${executionTime} ms` : "--"} />
        {compileTime !== undefined && (
          <Metric label="Compile" value={`${compileTime} ms`} />
        )}
        {memoryUsed !== undefined && (
          <Metric label="Memory" value={formatMemory(memoryUsed)} />
        )}
        {origin && <Metric label="Ran on" value={origin} />}
      </div>

      {mode === "SUBMIT" ? (
        totalCount > 0 ? (
          <div className="px-4 pb-4">
            <table className="w-full border-collapse font-mono text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wide text-[#5A5850]">
                  <th className="border-b border-[#22262f] px-3 py-2 font-normal">Test</th>
                  <th className="border-b border-[#22262f] px-3 py-2 font-normal">Result</th>
                  <th className="border-b border-[#22262f] px-3 py-2 text-right font-normal">
                    Time
                  </th>
                  <th className="border-b border-[#22262f] px-3 py-2 text-right font-normal">
                    Memory
                  </th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((test, idx) => {
                  const passed = isPassed(test);
                  const skipped = test.verdict === "SKIPPED";
                  const color = skipped ? "#5A5850" : passed ? "#34D399" : "#E2574C";
                  return (
                    <tr key={test.testCaseId || idx} className="border-b border-[#1a1c24]">
                      <td className="px-3 py-2 text-[#8B93A7]">
                        {test.orderNum !== undefined ? test.orderNum + 1 : idx + 1}
                      </td>
                      <td className="px-3 py-2" style={{ color }}>
                        {VERDICT_TEXT[test.verdict] ??
                          test.verdict?.replace(/_/g, " ") ??
                          "--"}
                      </td>
                      <td className="px-3 py-2 text-right text-[#8B93A7]">
                        {skipped || test.timeMs === undefined ? "--" : `${test.timeMs} ms`}
                      </td>
                      <td className="px-3 py-2 text-right text-[#8B93A7]">
                        {skipped ? "--" : formatMemory(test.memoryKb)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-between px-3 py-2.5 font-mono text-xs text-[#8B93A7]">
              <span>
                {passedCount} of {totalCount} passed
              </span>
              {totalScore !== undefined && (
                <span>
                  Total Score <span style={{ color: bannerColor }}>{totalScore}%</span>
                </span>
              )}
            </div>
          </div>
        ) : (
          failureText && <OutputBlock label="Error" value={failureText} color="#E2574C" />
        )
      ) : (
        <div className="space-y-3 px-4 pb-4">
          {input?.trim() && <OutputBlock label="Input" value={input} inline />}
          {failureText ? (
            <OutputBlock label="Error" value={failureText} color="#E2574C" inline />
          ) : (
            <OutputBlock label="Your Output" value={stdout?.trim() || "No output"} inline />
          )}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto bg-[#0b0d13] text-[#F4F1EA]">{children}</div>
  );
}

function Banner({
  color,
  icon,
  text,
  right,
}: {
  color: string;
  icon: React.ReactNode;
  text: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 border-l-2 px-4 py-2.5"
      style={{ borderColor: color, background: `${color}14` }}
    >
      <span
        className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wide"
        style={{ color }}
      >
        {icon}
        {text}
      </span>
      {right}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[10px] uppercase tracking-wide text-[#5A5850]">{label}</span>
      <span className="text-[#F4F1EA]">{value}</span>
    </div>
  );
}

function OutputBlock({
  label,
  value,
  color = "#F4F1EA",
  inline = false,
}: {
  label: string;
  value: string;
  color?: string;
  inline?: boolean;
}) {
  return (
    <div className={inline ? "" : "px-4 pb-4"}>
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-wide text-[#5A5850]">
        {label}
      </span>
      <pre
        className="max-h-64 overflow-auto whitespace-pre-wrap rounded border border-[#1a1c24] bg-[#06070B] px-3 py-2.5 font-mono text-xs leading-relaxed"
        style={{ color }}
      >
        {value}
      </pre>
    </div>
  );
}
