"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Lock, ChevronRight, Trophy, Radio, ShieldCheck } from "lucide-react";
import Link from "next/link";



/* ============================================================
   TACTICUS — WEEKLY CHALLENGES
   Cinematic competitive-programming campaign page with an
   8-Queens chess progression layer. Tailwind CSS + Next.js.

   SETUP NOTES
   - This is a Client Component ("use client").
   - Fonts: for best results, load Playfair Display + JetBrains Mono
     via next/font in app/layout.tsx and swap the inline
     [font-family:'Playfair_Display',...] / [font-family:'JetBrains_Mono',...]
     arbitrary values below for your font variables, e.g.
       className={`${playfair.variable} ${jetbrainsMono.variable}`}
     and reference theme.fontFamily.serif / .mono in tailwind.config.
     Until then this falls back to system serif/mono, which still works.
   - The handful of custom @keyframes (smoke drift, queen emergence,
     particle float, etc.) live in the <style jsx global> block at the
     bottom of this file — Tailwind's arbitrary `animate-[name_..]`
     utilities reference them directly, no tailwind.config changes needed.
   ============================================================ */

const SOLUTION = [0, 4, 7, 5, 2, 6, 1, 3];

type WeekStatus = "completed" | "current" | "locked";

interface Week {
  id: number;
  col: number;
  row: number;
  title: string;
  status: WeekStatus;
  brief: string;
}

const WEEKS: Week[] = [
  { id: 1, col: 0, row: SOLUTION[0], title: "Opening Gambit", status: "completed", brief: "Greedy structures, first blood." },
  { id: 2, col: 1, row: SOLUTION[1], title: "Forked Paths", status: "completed", brief: "Graph traversal under pressure." },
  { id: 3, col: 2, row: SOLUTION[2], title: "The Long Diagonal", status: "completed", brief: "Range queries, segment trees." },
  { id: 4, col: 3, row: SOLUTION[3], title: "Shadow Pawns", status: "current", brief: "Dynamic programming, hidden states." },
  { id: 5, col: 4, row: SOLUTION[4], title: "Silent Sacrifice", status: "locked", brief: "Classified." },
  { id: 6, col: 5, row: SOLUTION[5], title: "The Pinned King", status: "locked", brief: "Classified." },
  { id: 7, col: 6, row: SOLUTION[6], title: "Endgame Horizon", status: "locked", brief: "Classified." },
  { id: 8, col: 7, row: SOLUTION[7], title: "Checkmate Protocol", status: "locked", brief: "Classified." },
];

const FEED = [
  { t: "21:42:08", msg: 'OPERATIVE "NULLROOT" ACHIEVED PERFECT SCORE' },
  { t: "20:11:54", msg: "WEEK 05 UNLOCKS IN 2 DAYS" },
  { t: "19:03:21", msg: "BONUS CHALLENGE DETECTED — SECTOR C4" },
  { t: "16:47:02", msg: "WEEK 03 BOARD CLOSED — 1,204 QUEENS PLACED" },
  { t: "14:20:39", msg: 'OPERATIVE "K_VECTOR" CLIMBED TO RANK 002' },
  { t: "09:58:11", msg: "SYSTEM: LEADERBOARD RECALIBRATED" },
];

const FILES = ["A", "B", "C", "D", "E", "F", "G", "H"];
const LOADER_MS = 5000;

function useCountdown(target: number) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    setRemaining(Math.max(0, target - Date.now()));
    const id = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  const d = Math.floor(remaining / 86400000);
  const h = Math.floor((remaining % 86400000) / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return { d, h, m, s };
}

export default function WeeklyChallenges() {
  const [booted, setBooted] = useState(false);
  const [loaderLeaving, setLoaderLeaving] = useState(false);
  const [placed, setPlaced] = useState<Set<number>>(new Set([1, 2]));
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);
  const [justPlaced, setJustPlaced] = useState<number | null>(null);
  const [launching, setLaunching] = useState(false);

  const targetRef = useRef<number | null>(null);
  if (targetRef.current === null) {
    targetRef.current = Date.now() + (2 * 86400000 + 14 * 3600000 + 9 * 60000);
  }
  const { d, h, m, s } = useCountdown(targetRef.current);

  useEffect(() => {
    const t1 = setTimeout(() => setLoaderLeaving(true), LOADER_MS - 100);
    const t2 = setTimeout(() => setBooted(true), LOADER_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const weekByCell = useMemo(() => {
    const map = new Map<string, Week>();
    WEEKS.forEach((w) => map.set(`${w.row}-${w.col}`, w));
    return map;
  }, []);

  const placedCells = useMemo(() => WEEKS.filter((w) => placed.has(w.id)), [placed]);

  function attackLine(a: Week, b: Week) {
    return a.row === b.row || a.col === b.col || Math.abs(a.row - b.row) === Math.abs(a.col - b.col);
  }

  function tryPlace(week: Week) {
    if (week.status !== "completed" || placed.has(week.id)) return;
    setPlaced((prev) => new Set(prev).add(week.id));
    setJustPlaced(week.id);
    setTimeout(() => setJustPlaced(null), 900);
  }

  const liveWeek = WEEKS.find((w) => w.status === "current")!;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="relative min-h-screen bg-[#06070A] text-[#EDEAE2] font-sans antialiased [&_*]:box-border">
      {/* ===================== CINEMATIC LOADER ===================== */}
      {!booted && (
        <div
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black transition-[opacity,filter] duration-[700ms] ease-out ${
            loaderLeaving ? "opacity-0 blur-md pointer-events-none" : "opacity-100"
          }`}
        >
          {/* base + smoke */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#0d0f14_0%,#050608_55%,#020203_100%)]" />
          <div className="absolute -inset-1/4 opacity-50 blur-3xl bg-[radial-gradient(38%_32%_at_28%_72%,rgba(47,190,143,0.10),transparent_60%)] animate-[fogDrift_11s_ease-in-out_infinite_alternate]" />
          <div className="absolute -inset-1/4 opacity-60 blur-3xl bg-[radial-gradient(46%_40%_at_68%_30%,rgba(212,175,106,0.20),transparent_60%)] animate-[fogDrift2_13s_ease-in-out_infinite_alternate]" />
          <div className="absolute -inset-1/3 opacity-40 blur-[60px] bg-[radial-gradient(30%_50%_at_50%_60%,rgba(240,205,133,0.12),transparent_65%)] animate-[fogDrift3_9s_ease-in-out_infinite_alternate]" />

          {/* descending golden light beam */}
          <div className="absolute top-0 left-1/2 h-[70%] w-[460px] -translate-x-1/2 bg-gradient-to-b from-[rgba(240,205,133,0.30)] via-[rgba(240,205,133,0.06)] to-transparent opacity-0 blur-2xl [clip-path:polygon(46%_0%,54%_0%,100%_100%,0%_100%)] animate-[beamIn_2.4s_ease-out_0.4s_forwards]" />

          {/* tactical grid */}
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(212,175,106,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,106,0.6)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_70%)]" />

          {/* embers */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="absolute bottom-[-10px] h-[2px] w-[2px] rounded-full bg-[#F0CD85] opacity-0 animate-[floatUp_linear_infinite]"
                style={{
                  left: `${(i * 33) % 100}%`,
                  animationDelay: `${0.6 + (i % 10) * 0.35}s`,
                  animationDuration: `${5 + (i % 6)}s`,
                }}
              />
            ))}
          </div>

          {/* queen emerging from smoke */}
          <div className="relative z-[2] flex h-[220px] w-[220px] items-center justify-center">
            <div className="absolute h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(212,175,106,0.0)_0%,rgba(212,175,106,0.0)_45%,transparent_70%)] opacity-0 blur-md animate-[glowReveal_3s_ease-out_0.5s_forwards,glowPulse_3s_ease-in-out_3.5s_infinite]" />
            <div className="absolute h-[180px] w-[180px] rounded-full opacity-0 blur-xl bg-[radial-gradient(circle,rgba(240,205,133,0.45),transparent_70%)] animate-[coreFlare_1.6s_ease-out_1.8s_forwards]" />
            <div
              className="relative text-[120px] leading-none text-[#F2DDA8] opacity-0 blur-[22px] [text-shadow:0_0_50px_rgba(212,175,106,0.7),0_0_110px_rgba(212,175,106,0.35)] animate-[queenEmerge_3.4s_cubic-bezier(0.16,0.9,0.25,1)_0.6s_forwards,queenSpin_7s_linear_4s_infinite]"
            >
              ♛
            </div>
          </div>

          <p className="relative z-[2] mt-9 translate-y-2 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[11.5px] uppercase tracking-[0.24em] text-[#8B8F98] opacity-0 animate-[fadeUp_1s_ease_3.3s_forwards]">
            8 WEEKS. 8 QUEENS. ONE SURVIVING STRATEGY.
          </p>
        </div>
      )}

      {/* ===================== MAIN PAGE ===================== */}
      <div className={`transition-opacity duration-700 ease-out ${booted ? "opacity-100" : "opacity-0"}`}>
        {/* NAV */}
        <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-[#06070A]/70 px-5 py-5 backdrop-blur-md md:px-16">
          <div className="flex items-center gap-2 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[13px] tracking-[0.14em] text-[#EDEAE2]">
            <span className="text-base text-[#D4AF6A]">♜</span>
            TACTICUS <span className="font-normal text-[#565B64]">// WEEKLY CHALLENGES</span>
          </div>
          {/* <button className="flex items-center gap-2 rounded-[3px] border border-[rgba(212,175,106,0.16)] px-4 py-2.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[11px] tracking-[0.16em] text-[#F0CD85] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4AF6A] hover:bg-[rgba(212,175,106,0.08)]">
            <Trophy size={14} strokeWidth={1.75} />
            LEADERBOARD
          </button> */}

         

<Link
  href="/challenges/leaderboard"
  className="flex items-center gap-2 rounded-[3px] border border-[rgba(212,175,106,0.16)] px-4 py-2.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[11px] tracking-[0.16em] text-[#F0CD85] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4AF6A] hover:bg-[rgba(212,175,106,0.08)]"
>
  <Trophy size={14} strokeWidth={1.75} />
  LEADERBOARD
</Link>
        </nav>

        {/* HERO */}
        <section className="relative overflow-hidden px-5 pb-14 pt-12 md:px-16 md:pb-24 md:pt-24">
          {/* layered atmosphere */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[#06070A]" />
            <div className="absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(47,190,143,0.10),transparent_65%)] blur-3xl" />
            <div className="absolute -left-32 top-1/3 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(212,175,106,0.10),transparent_65%)] blur-3xl" />

            {/* perspective tactical floor grid */}
            <div className="absolute inset-x-0 bottom-0 h-[60%] opacity-[0.16] [mask-image:linear-gradient(to_top,black,transparent)]">
              <div className="h-full w-full origin-bottom [transform:perspective(700px)_rotateX(62deg)] bg-[linear-gradient(rgba(212,175,106,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,106,0.7)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            {/* faint oversized queen watermark */}
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 select-none text-[480px] leading-none text-[#D4AF6A] opacity-[0.05] blur-[2px] [font-family:serif]">
              ♛
            </div>

            {/* scanlines */}
            <div className="absolute inset-0 opacity-[0.035] bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.6)_0px,rgba(255,255,255,0.6)_1px,transparent_1px,transparent_3px)]" />

            {/* vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
          </div>

          <div className="relative z-[2] grid grid-cols-1 items-start gap-8 md:grid-cols-[1.3fr_0.95fr] md:gap-16">
            <div>
              <div className="mb-5 flex items-center gap-2 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.2em] text-[#2FBE8F]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2FBE8F] animate-[dotPulse_1.8s_ease-in-out_infinite]" />
                LIVE&nbsp;&nbsp;·&nbsp;&nbsp;CHAPTER 04 / WEEK 04
              </div>
              <h1 className="mb-5 bg-gradient-to-br from-[#F4E6C2] via-[#D4AF6A] to-[#B98E4C] bg-clip-text text-[40px] italic leading-[1.02] text-transparent [font-family:'Playfair_Display',Georgia,serif] md:text-[76px]">
                {liveWeek.title}
              </h1>
              <p className="mb-9 max-w-[46ch] text-[15.5px] leading-[1.85] text-[#8B8F98]">
                A black pawn appears where you least expect it.
                <br />
                The board you built for three weeks no longer stands alone.
                <br />
                Its shadow falls across diagonals you thought were safe.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
  href="/challenges/editor"
  onClick={() => {
    setLaunching(true);
    setTimeout(() => setLaunching(false), 1400);
  }}
  className="inline-flex items-center gap-2 rounded-[3px] bg-gradient-to-br from-[#F0CD85] to-[#D4AF6A] px-6 py-3.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-xs font-semibold tracking-[0.12em] text-[#16130A] shadow-[0_8px_28px_rgba(212,175,106,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(212,175,106,0.32)]"
>
  {launching ? "ESTABLISHING UPLINK…" : "ENTER LIVE CONTEST"}

  <ChevronRight size={16} strokeWidth={2} />
</Link>
                
                <a
                  href="#board"
                  className="inline-flex items-center rounded-[3px] border border-white/[0.14] px-5 py-3.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-xs tracking-[0.12em] text-[#EDEAE2] transition-all duration-200 hover:border-[#D4AF6A] hover:bg-white/[0.03] hover:text-[#F0CD85]"
                >
                  VIEW THE BOARD
                </a>
              </div>
            </div>

            <aside>
              <div className="rounded-lg border border-[rgba(212,175,106,0.16)] bg-gradient-to-br from-white/[0.045] to-white/[0.015] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-2 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[11px] tracking-[0.18em] text-[#F0CD85]">
                  <Radio size={13} strokeWidth={2} />
                  OPERATION STATUS
                </div>

                <div className="mb-2.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[10px] tracking-[0.16em] text-[#565B64]">
                  SUBMISSIONS CLOSE IN
                </div>
                <div className="mb-1.5 flex items-baseline gap-1.5">
                  {[
                    [d, "D"],
                    [h, "H"],
                    [m, "M"],
                    [s, "S"],
                  ].map(([val, label], i, arr) => (
                    <span key={label as string} className="flex items-baseline gap-1.5">
                      <span className="flex flex-col items-center">
                        <span className="[font-variant-numeric:tabular-nums] [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[22px] font-semibold text-[#EDEAE2] md:text-[30px]">
                          {pad(val as number)}
                        </span>
                        <span className="[font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[9px] tracking-[0.1em] text-[#565B64]">
                          {label}
                        </span>
                      </span>
                      {i < arr.length - 1 && (
                        <span className="-translate-y-1.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-xl text-[#565B64]">:</span>
                      )}
                    </span>
                  ))}
                </div>

                <div className="my-5 h-px bg-white/[0.08]" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="[font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[22px] font-semibold text-[#2FBE8F]">3,482</div>
                    <div className="mt-1 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[9.5px] tracking-[0.12em] text-[#565B64]">OPERATIVES ENGAGED</div>
                  </div>
                  <div>
                    <div className="[font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[22px] font-semibold text-[#2FBE8F]">
                      850 <small className="text-[11px] text-[#565B64]">PTS</small>
                    </div>
                    <div className="mt-1 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[9.5px] tracking-[0.12em] text-[#565B64]">REWARD CEILING</div>
                  </div>
                </div>

                <div className="my-5 h-px bg-white/[0.08]" />
                <div className="flex items-center gap-2 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[10.5px] tracking-[0.1em] text-[#8B8F98]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2FBE8F] animate-[dotPulse_1.8s_ease-in-out_infinite]" />
                  SYSTEM ONLINE — ACCEPTING SUBMISSIONS
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* BOARD */}
        <section className="relative px-5 pb-16 pt-10 md:px-16" id="board">
          <div className="mx-auto mb-11 max-w-[620px] text-center">
            <div className="mb-3.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[10.5px] tracking-[0.22em] text-[#2FBE8F]">
              PROGRESSION LAYER
            </div>
            <h2 className="mb-3.5 text-[28px] italic text-[#EDEAE2] [font-family:'Playfair_Display',Georgia,serif] md:text-[42px]">
              The Campaign Board
            </h2>
            <p className="text-[14.5px] leading-[1.75] text-[#8B8F98]">
              Solve a week&rsquo;s problem set to unlock its queen. Place her on an open,
              non-attacking square to bank a strategic bonus. Eight weeks. Eight queens. One board.
            </p>
          </div>

          <div className="mx-auto max-w-[560px]">
            <div className="ml-[24px] mb-1.5 grid grid-cols-8">
              {FILES.map((f) => (
                <span key={f} className="text-center [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[10px] tracking-[0.05em] text-[#565B64]">
                  {f}
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <div className="grid w-[18px] grid-rows-8">
                {[8, 7, 6, 5, 4, 3, 2, 1].map((r) => (
                  <span key={r} className="flex items-center justify-center [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[10px] text-[#565B64]">
                    {r}
                  </span>
                ))}
              </div>

              <div className="relative grid aspect-square flex-1 grid-cols-8 grid-rows-8 overflow-hidden rounded border border-[rgba(212,175,106,0.18)] shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
                {Array.from({ length: 8 }).map((_, row) =>
                  Array.from({ length: 8 }).map((_, col) => {
                    const week = weekByCell.get(`${row}-${col}`);
                    const dark = (row + col) % 2 === 1;
                    const isPlaced = !!week && placed.has(week.id);
                    const isHover = hovered?.row === row && hovered?.col === col;

                    const statusBg =
                      week?.status === "completed"
                        ? "bg-[radial-gradient(circle,rgba(47,190,143,0.16),transparent_70%)] cursor-pointer"
                        : week?.status === "current"
                        ? "bg-[radial-gradient(circle,rgba(212,175,106,0.22),transparent_70%)]"
                        : week?.status === "locked"
                        ? "brightness-[0.55] saturate-[0.7]"
                        : "";

                    return (
                      <button
                        key={`${row}-${col}`}
                        className={`relative flex aspect-square items-center justify-center border-0 p-0 transition-colors duration-200 ${
                          dark ? "bg-[#0C0E12]" : "bg-[#121419]"
                        } ${statusBg} ${isPlaced ? "bg-[radial-gradient(circle,rgba(212,175,106,0.18),transparent_65%)]" : ""} ${
                          !week || week.status === "locked" ? "cursor-default" : ""
                        } focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#F0CD85] focus-visible:outline-offset-2`}
                        onMouseEnter={() => week && setHovered({ row, col })}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => week && setHovered({ row, col })}
                        onBlur={() => setHovered(null)}
                        onClick={() => week && tryPlace(week)}
                        disabled={!week || week.status === "locked"}
                        aria-label={week ? `Week ${week.id}: ${week.title} — ${week.status}` : "Inactive sector"}
                      >
                        {justPlaced === week?.id && (
                          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(212,175,106,0.55),transparent_70%)] animate-[burstFade_0.8s_ease-out_forwards]" />
                        )}

                        {week?.status === "locked" && <Lock size={11} strokeWidth={2} className="text-[#565B64]" />}
                        {isPlaced && (
                          <span className="text-[20px] text-[#F2DDA8] [text-shadow:0_0_14px_rgba(212,175,106,0.7),0_0_26px_rgba(212,175,106,0.35)] animate-[queenIn_0.5s_cubic-bezier(0.2,1.4,0.4,1)_forwards] md:text-[30px]">
                            ♛
                          </span>
                        )}
                        {week?.status === "current" && !isPlaced && (
                          <span className="h-3.5 w-3.5 rounded-full border-[1.5px] border-[#F0CD85] animate-[ringPulse_1.6s_ease-out_infinite]" />
                        )}
                        {week?.status === "completed" && !isPlaced && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2FBE8F] shadow-[0_0_10px_rgba(47,190,143,0.7)]" />
                        )}

                        {isHover && week && (
                          <div className="absolute bottom-[calc(100%+8px)] left-1/2 z-10 w-max max-w-[180px] -translate-x-1/2 rounded-md border border-[rgba(212,175,106,0.16)] bg-[#0E1015] px-3.5 py-2.5 pointer-events-none shadow-[0_12px_30px_rgba(0,0,0,0.5)] animate-[tipIn_0.18s_ease_forwards]">
                            <div className="mb-1 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[9px] tracking-[0.14em] text-[#D4AF6A]">
                              WEEK {String(week.id).padStart(2, "0")}
                            </div>
                            <div className="mb-1 text-sm italic text-[#EDEAE2] [font-family:'Playfair_Display',Georgia,serif]">{week.title}</div>
                            <div className="text-[11px] leading-[1.4] text-[#8B8F98]">{week.brief}</div>
                            {week.status === "completed" && !isPlaced && (
                              <div className="mt-2 flex items-center gap-1.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[9px] tracking-[0.08em] text-[#2FBE8F]">
                                <ShieldCheck size={11} strokeWidth={2} /> CLICK TO PLACE QUEEN
                              </div>
                            )}
                            {week.status === "locked" && (
                              <div className="mt-1.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[9px] tracking-[0.1em] text-[#565B64]">
                                SECTOR LOCKED
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })
                )}

                <svg className="pointer-events-none absolute inset-0" viewBox="0 0 800 800" preserveAspectRatio="none">
                  {placedCells.map((a, i) =>
                    placedCells.slice(i + 1).map((b) => (
                      <line
                        key={`${a.id}-${b.id}`}
                        x1={a.col * 100 + 50}
                        y1={a.row * 100 + 50}
                        x2={b.col * 100 + 50}
                        y2={b.row * 100 + 50}
                        stroke="rgba(212,175,106,0.28)"
                        strokeWidth={1}
                      />
                    ))
                  )}
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[10px] tracking-[0.08em] text-[#565B64]">
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#2FBE8F]" /> Queen unlocked</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#D4AF6A]" /> Live this week</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#3A3D44]" /> Sealed</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#F0CD85] shadow-[0_0_8px_rgba(212,175,106,0.6)]" /> Queen placed</div>
          </div>
        </section>

        {/* TACTICAL FEED */}
        <section className="px-5 pb-20 md:px-16">
          <div className="mx-auto max-w-[760px] overflow-hidden rounded-md border border-white/[0.08] bg-[#0A0B0F]">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[10.5px] tracking-[0.16em] text-[#2FBE8F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2FBE8F] animate-[dotPulse_1.8s_ease-in-out_infinite]" />
              TACTICAL FEED — LIVE
            </div>
            <div className="px-5 pb-5 pt-4">
              {FEED.map((f, i) => (
                <div key={i} className="flex gap-3 py-1.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-xs text-[#8B8F98]">
                  <span className="flex-shrink-0 text-[#565B64]">[{f.t}]</span>
                  <span className="tracking-[0.02em] text-[#C9CCD3]">{f.msg}</span>
                </div>
              ))}
              <div className="flex gap-3 py-1.5 [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-xs text-[#D4AF6A]">
                <span className="text-[#565B64]">[{new Date().toTimeString().slice(0, 8)}]</span>
                <span className="animate-[blink_1s_step-end_infinite]">_</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/[0.06] px-5 py-6 text-center [font-family:'JetBrains_Mono','IBM_Plex_Mono',monospace] text-[10px] tracking-[0.12em] text-[#565B64] md:flex-row md:justify-between md:px-16 md:py-10 md:text-left">
          <span>TACTICUS PROTOCOL — SEASON 02</span>
          <span>8 SECTORS / 1 BOARD</span>
        </footer>
      </div>

      {/* Custom keyframes used by the arbitrary animate-[...] utilities above.
          Next.js supports styled-jsx out of the box, so these need no
          tailwind.config changes. */}
      <style jsx global>{`
        @keyframes fogDrift { from { transform: translate(-2%, -1%) scale(1); } to { transform: translate(3%, 2%) scale(1.08); } }
        @keyframes fogDrift2 { from { transform: translate(2%, 1%) scale(1.04); } to { transform: translate(-3%, -2%) scale(1); } }
        @keyframes fogDrift3 { from { transform: translate(0%, 2%) scale(1); } to { transform: translate(1%, -3%) scale(1.1); } }
        @keyframes beamIn { from { opacity: 0; } to { opacity: 0.7; } }
        @keyframes glowReveal {
          from { opacity: 0; background: radial-gradient(circle, rgba(212,175,106,0.0) 0%, rgba(212,175,106,0.0) 45%, transparent 70%); }
          to { opacity: 1; background: radial-gradient(circle, rgba(212,175,106,0.30) 0%, rgba(212,175,106,0.07) 45%, transparent 70%); }
        }
        @keyframes glowPulse { 0%, 100% { opacity: 0.7; transform: scale(0.96); } 50% { opacity: 1; transform: scale(1.05); } }
        @keyframes coreFlare { 0% { opacity: 0; transform: scale(0.4); } 40% { opacity: 1; transform: scale(1.15); } 100% { opacity: 0; transform: scale(1.6); } }
        @keyframes queenEmerge {
          0% { opacity: 0; filter: blur(22px); transform: scale(0.55) translateY(34px) rotateY(0deg); }
          55% { opacity: 1; filter: blur(2px); transform: scale(1.02) translateY(-2px) rotateY(0deg); }
          100% { opacity: 1; filter: blur(0px); transform: scale(1) translateY(0px) rotateY(0deg); }
        }
        @keyframes queenSpin {
          0% { transform: rotateY(0deg) translateY(0px); }
          50% { transform: rotateY(180deg) translateY(-4px); }
          100% { transform: rotateY(360deg) translateY(0px); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          12% { opacity: 0.7; }
          88% { opacity: 0.25; }
          100% { transform: translateY(-92vh) translateX(14px); opacity: 0; }
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dotPulse {
          0% { box-shadow: 0 0 0 0 rgba(47,190,143,0.55); }
          70% { box-shadow: 0 0 0 8px rgba(47,190,143,0); }
          100% { box-shadow: 0 0 0 0 rgba(47,190,143,0); }
        }
        @keyframes ringPulse { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes burstFade { from { opacity: 1; transform: scale(0.3); } to { opacity: 0; transform: scale(2.2); } }
        @keyframes queenIn { from { transform: scale(0.2) rotate(-25deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }
        @keyframes tipIn { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes blink { 50% { opacity: 0; } }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}