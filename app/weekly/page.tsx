"use client"
import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bell, Lock, Sparkles, Trophy, Radio, ChevronRight, Crown } from "lucide-react";
import { ExploreChallengesCTA } from "@/components/layout/ExploreChallengesCTA";

const ChessScene = dynamic(
  () => import("@/components/layout/ChessScene").then((m) => m.ChessScene),
  { ssr: false }
);



export default function AnticipationPage() {
  return (
    <main className="grain relative max-h-screen overflow-x-hidden bg-background text-foreground">
      <Nav />
      <Hero />
      <TransmissionSection />
      <WhyCareSection />
      <RewardsTeaser />
      <ThemePreview />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2">
          <Crown className="h-4 w-4 text-[oklch(0.82_0.14_85)]" />
          <span className="font-display text-sm tracking-wide">GAMBIT&nbsp;/&nbsp;<span className="text-muted-foreground">Season 01</span></span>
        </div>
        <div className="hidden sm:block">
          <ExploreChallengesCTA />
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <section className="relative flex min-h-screen items-center justify-center pt-10 pb-20">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <Suspense fallback={<div className="h-full w-full bg-gradient-radial from-[oklch(0.18_0.02_70)] to-transparent" />}>
          <ChessScene />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-2 glass rounded-full px-4 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.14_85)] pulse-glow" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground text-yellow-500 font-bold">// Transmission incoming</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl md:text-8xl font-light leading-[0.95]"
        >
          <div className="text-5xl sm:text-7xl lg:text-9xl font-bold uppercase tracking-tighter leading-none">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#D4AF37]">
              The Board
            </span>
          </div >
          <div className="text-5xl sm:text-7xl lg:text-9xl font-bold uppercase tracking-tighter leading-none mt-1">
            <span
              style={{
                WebkitTextStroke: "1.5px #D4AF37",
                color: "transparent",
              }}
            >
              Opens Soon..
            </span>
          </div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted-foreground"
        >
          Eight weeks. Eight openings. One survivor. <span className="text-[oklch(0.82_0.14_85)]">Season 01</span> begins soon. Prepare your strategy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <ComingSoonPanel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <PreRegisterButton />
          <ExploreChallengesCTA variant="large" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-12 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span>4,218 registered</span>
          <span className="h-px w-8 bg-border" />
          <span>Initiation by invitation</span>
        </motion.div>
      </div>
    </section>
  );
}

function PreRegisterButton() {
  const [done, setDone] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => setDone(true)}
      className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-b from-[oklch(0.92_0.12_88)] to-[oklch(0.68_0.14_78)] px-8 py-4 text-sm font-semibold text-[oklch(0.12_0.01_60)] shadow-[0_10px_40px_-10px_oklch(0.82_0.14_85/0.6),inset_0_1px_0_oklch(1_0_0/0.4)] transition-shadow hover:shadow-[0_20px_60px_-10px_oklch(0.82_0.14_85/0.8),inset_0_1px_0_oklch(1_0_0/0.4)]"
    >
      <Bell className="h-4 w-4" />
      {done ? "You're on the list" : "Registrations Opening Soon"}
      {!done && <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
    </motion.button>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
      <span className="h-px w-8 bg-[oklch(0.82_0.14_85)]" />
      {children}
    </div>
  );
}

function TransmissionSection() {
  const fragments = [
    "Eight moves remain.",
    "The Queen has already made her first move.",
    "Only those who solve the opening survive.",
  ];
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <SectionTag>Theme Transmission · 01</SectionTag>
          <h2 className="font-display text-4xl sm:text-6xl font-light">
            Signal <span className="text-gold-gradient italic">intercepted.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {fragments.map((text, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="glass relative overflow-hidden rounded-2xl p-8 grain"
            >
              <span className="absolute right-4 top-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                FRAG_{(i + 1).toString().padStart(3, "0")}
              </span>
              <p className="font-display text-2xl italic leading-snug text-foreground/90">
                &ldquo;{text}&rdquo;
              </p>
              <div className="mt-8 h-px w-12 bg-[oklch(0.82_0.14_85)]" />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                Source · [REDACTED]
              </p>
            </motion.blockquote>
          ))}
        </div>

        <div className="mt-20 text-center">
          <ExploreChallengesCTA variant="large" />
        </div>
      </div>
    </section>
  );
}

function WhyCareSection() {
  const reasons = [
    { icon: Sparkles, k: "Unrepeatable", v: "Each season exists once. No reruns, no second chances." },
    { icon: Trophy, k: "Real stakes", v: "Engraved trophies, sponsorships, and a permanent seat on the Hall." },
    { icon: Lock, k: "Curated entry", v: "A vetted field. The opening week is not for everyone." },
  ];
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTag>Why this matters</SectionTag>
            <h2 className="font-display text-4xl sm:text-5xl font-light leading-tight">
              A season designed to be <span className="text-gold-gradient italic">remembered.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              We&rsquo;ve removed everything that made weekly play feel routine. What remains is rare,
              structured, and unforgiving. The earlier you commit, the better your seed.
            </p>
          </div>
          <div className="grid gap-3">
            {reasons.map(({ icon: Icon, k, v }, i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass flex items-start gap-4 rounded-xl p-6 transition-colors hover:border-[oklch(0.82_0.14_85/0.5)]"
              >
                <div className="rounded-lg glass-gold p-3">
                  <Icon className="h-5 w-5 text-[oklch(0.88_0.10_90)]" />
                </div>
                <div>
                  <h3 className="font-display text-xl">{k}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{v}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RewardsTeaser() {
  const tiers = [
    { tier: "Grandmaster", state: "[REDACTED]", hint: "Issued to one. Carried for life." },
    { tier: "Elite", state: "Unlocking Soon", hint: "Top k finishers. Engraved & numbered." },
    { tier: "Special", state: "Classified", hint: "Awarded outside the bracket. By recognition only." },
  ];
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <SectionTag>Reward Vault · Sealed</SectionTag>
          <h2 className="font-display text-4xl sm:text-6xl font-light">
            Three reveals. <span className="text-gold-gradient italic">Zero hints.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div
              key={t.tier}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              whileHover={{ y: -6 }}
              className="group glass-gold relative aspect-[3/4] overflow-hidden rounded-2xl p-8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.14_85/0.25),transparent_60%)] opacity-60 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 backdrop-blur-sm transition-all duration-500 group-hover:backdrop-blur-0" />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Tier 0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-3xl text-foreground/95">{t.tier}</h3>
                </div>

                <div className="relative flex flex-1 items-center justify-center">
                  <Lock className="h-14 w-14 text-[oklch(0.82_0.14_85)]/70 transition-all duration-500 group-hover:scale-0 group-hover:opacity-0" />
                  <div className="absolute inset-0 flex items-center justify-center px-2 text-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <p className="font-display text-lg italic text-foreground/85">{t.hint}</p>
                  </div>
                </div>

                <div>
                  <div className="mb-3 h-px w-full bg-border" />
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[oklch(0.88_0.10_90)]">
                    {t.state}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThemePreview() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <SectionTag>Theme Preview · 15%</SectionTag>
          <h2 className="font-display text-4xl sm:text-6xl font-light">
            Eight chapters. <span className="text-gold-gradient italic">Seven sealed.</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 ">
          {Array.from({ length: 8 }).map((_, i) => {
            const revealed = i === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`glass relative flex aspect-square flex-col justify-between overflow-hidden rounded-xl p-4 backdrop-blur-md ${revealed
                  ? "border border-yellow-300/50 shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                  : "border border-white/15"
                  }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground ">
                  Wk · 0{i + 1}
                </span>
                {revealed ? (
                  <>
                    <h3 className="font-display text-xl leading-tight text-gold-gradient">The Opening Gambit</h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[oklch(0.88_0.10_90)]">Revealed</span>
                  </>
                ) : (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <h3
                        className="font-display text-xl italic text-foreground/40 blur-sm select-none"
                        aria-hidden
                      >
                        {["Knight's Rebuke", "Bishop's Veil", "Castle Doctrine", "En Passant", "The Fork", "Endgame", "Coronation"][i - 1]}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                      <Lock className="mr-1 inline h-2.5 w-2.5" /> Sealed
                    </span>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Chapters unlock one week at a time. Decoding begins on launch.
        </p>
      </div>
    </section>
  );
}

function UpdatesTimeline() {
  const updates = [
    { time: "5 days ago", title: "Registration milestone unlocked", body: "3,000 invitations claimed.", live: false },
    { time: "2 days ago", title: "First teaser released", body: "&ldquo;The Queen has already moved.&rdquo;", live: false },
    { time: "Today", title: "Transmission FRAG_003 decoded", body: "Theme fragment now public.", live: true },
    { time: "In 5 days", title: "Full theme reveal", body: "Opening chapter goes live.", live: false },
  ];
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <SectionTag>Live Updates Feed</SectionTag>
          <h2 className="font-display text-4xl sm:text-5xl font-light">
            Signals from the <span className="text-gold-gradient italic">control room.</span>
          </h2>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
          {updates.map((u, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative mb-6 pl-12"
            >
              <div className={`absolute left-2 top-5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border ${u.live ? "border-[oklch(0.82_0.14_85)] bg-[oklch(0.82_0.14_85)] pulse-glow" : "border-border bg-background"
                }`} />
              <div className="glass rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{u.time}</span>
                  {u.live && (
                    <span className="inline-flex items-center gap-1.5 rounded-full glass-gold px-2 py-0.5 text-[10px] uppercase tracking-widest">
                      <Radio className="h-2.5 w-2.5" /> Live
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-xl">{u.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: u.body }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.14_85/0.18),transparent_70%)]" />
      </div>
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="glass-gold relative overflow-hidden rounded-[2rem] px-6 py-20 sm:px-12 grain"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.82_0.14_85)] to-transparent" />
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">Final transmission</span>
          <h2 className="mt-6 font-display text-5xl sm:text-7xl md:text-8xl font-light leading-[0.95]">
            <span className="block">The Board</span>
            <span className="block text-gold-gradient italic">Opens Soon.</span>
          </h2>

          <div className="mt-12 flex justify-center">
            <ComingSoonPanel />
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PreRegisterButton />
            <ExploreChallengesCTA variant="large" />
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Be the first to know when the board opens
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs uppercase tracking-[0.25em] text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Crown className="h-3.5 w-3.5 text-[oklch(0.82_0.14_85)]" />
          GAMBIT · Season 01
        </div>
        <span>© [REDACTED] — All rites reserved.</span>
      </div>
    </footer>
  );
}

function DecryptText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  useEffect(() => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      iterations += 1 / 3;
      if (iterations >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
}

function ComingSoonPanel() {
  const [percent, setPercent] = useState(64);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => (prev < 94 ? prev + Math.floor(Math.random() * 2) + 1 : 64));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotateX(-y / (box.height / 12)); // Max 12 degrees tilt
    setRotateY(x / (box.width / 12));
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="group relative flex justify-center w-full max-w-md">
      {/* Dynamic ambient background glow */}
      <div className="absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_center,oklch(0.82_0.14_85/0.15)_0%,transparent_60%)] blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-110" />

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        className="glass-gold relative w-full overflow-hidden rounded-2xl border border-[oklch(0.82_0.14_85/0.25)] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.5),0_0_50px_oklch(0.82_0.14_85/0.05),inset_0_1px_0_oklch(1_0_0/0.15)] grain"
      >
        {/* Holographic scanner sweep lines */}
        <motion.div
          className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[oklch(0.82_0.14_85/0.8)] to-transparent opacity-70 pointer-events-none"
          animate={{ top: ["-5%", "105%"] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
        />

        {/* Floating Matrix Chess data stream in background */}
        <div className="absolute inset-0 opacity-[0.035] font-mono text-[9px] p-4 pointer-events-none select-none overflow-hidden leading-relaxed" style={{ transform: "translateZ(-10px)" }}>
          <div>01001101 01001001 01010100</div>
          <div>1. e4 e5 2. Nf3 Nc6 3. Bb5 a6</div>
          <div>4. Ba4 Nf6 5. O-O Be7 6. Re1</div>
          <div>[DECRYPT_SECTOR_07_INITIALIZED]</div>
          <div>♛ ♚ ♜ ♞ ♝ ♟ ♙ ♘ ♗ ♖ ♕</div>
          <div>SYS_STATUS_ACTIVE // MEM_READ_OK</div>
          <div>e2e4 d7d5 e4d5 q8d5 b1c3</div>
        </div>

        {/* Tech Corner brackets */}
        <div className="absolute top-2 left-2 font-mono text-[8px] text-[oklch(0.82_0.14_85/0.6)] select-none pointer-events-none">┌</div>
        <div className="absolute top-2 right-2 font-mono text-[8px] text-[oklch(0.82_0.14_85/0.6)] select-none pointer-events-none">┐</div>
        <div className="absolute bottom-2 left-2 font-mono text-[8px] text-[oklch(0.82_0.14_85/0.6)] select-none pointer-events-none">└</div>
        <div className="absolute bottom-2 right-2 font-mono text-[8px] text-[oklch(0.82_0.14_85/0.6)] select-none pointer-events-none">┘</div>

        <div className="flex flex-col gap-5" style={{ transform: "translateZ(20px)" }}>
          {/* Header Row */}
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-2 rounded-full px-2.5 py-0.5 bg-[oklch(0.82_0.14_85/0.08)] border border-[oklch(0.82_0.14_85/0.2)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.82_0.14_85)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[oklch(0.82_0.14_85)]"></span>
              </span>
              <span className="font-semibold text-[oklch(0.88_0.10_90)] text-[8px] tracking-[0.2em]">DECRYPTING</span>
            </div>
            <span className="text-[oklch(0.82_0.14_85/0.8)] font-semibold tracking-wider">SEC_01_INIT</span>
          </div>

          {/* Title Row with decrypt animation */}
          <div className="text-center py-2">
            <div className="font-display text-3xl font-light tracking-[0.2em] text-foreground/90 uppercase">
              <DecryptText text="COMING SOON" />
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/80 mt-2">
              Decoding chapter 01 · <span className="text-[oklch(0.82_0.14_85)]">Opening Gambit</span>
            </p>
          </div>

          {/* Progress Bar Row */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              <span>Frequencies decrypted</span>
              <span className="text-[oklch(0.88_0.10_90)] font-semibold">{percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden p-[1px] border border-border/30">
              <motion.div
                className="h-full bg-gradient-to-r from-[oklch(0.68_0.14_78)] via-[oklch(0.82_0.14_85)] to-[oklch(0.92_0.12_88)] shadow-[0_0_12px_oklch(0.82_0.14_85/0.6)] rounded-full"
                style={{ width: `${percent}%` }}
                transition={{ ease: "easeInOut", duration: 0.5 }}
              />
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-2 gap-2 border-t border-border/30 pt-4 text-[9px] font-mono text-muted-foreground">
            <div className="flex flex-col gap-0.5">
              <span className="text-[oklch(0.82_0.14_85/0.6)] text-[8px] uppercase tracking-wider">Signal Source</span>
              <span className="text-foreground/80">[REDACTED_TSEC]</span>
            </div>
            <div className="flex flex-col gap-0.5 text-right">
              <span className="text-[oklch(0.82_0.14_85/0.6)] text-[8px] uppercase tracking-wider">Cipher Key</span>
              <span className="text-foreground/80">SHA_512_SECURE</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
