import Link from "next/link";

export default function WeeklyChallengesPage() {
  return (
    <main className="min-h-screen bg-[#080c08] text-[#E8FF00] flex items-center justify-center px-6 py-16 relative">
      <div className="max-w-4xl text-center border border-[#4BE2C4]/25 bg-[#0d0d0d]/90 backdrop-blur-xl p-10 md:p-12 rounded-[32px] shadow-[0_0_80px_rgba(75,226,196,0.15)] relative overflow-hidden group">
        {/* Ambient Glowing Overlays */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#4BE2C4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#E8FF00]/10 rounded-full blur-3xl pointer-events-none" />



        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 uppercase leading-tight font-display">
          Weekly challenges <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#4BE2C4] via-[#00B4D8] to-[#E8FF00] bg-clip-text text-transparent">
            Registrations are live
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400 mb-9">
          Participate in our weekly strategic matches, solve core programmatic problems, and scale the ranks of the CodeCell leaderboard. Put your skills to the test in this week&apos;s active events.
        </p>

        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#4BE2C4] via-[#00B4D8] to-[#E8FF00] hover:shadow-[0_0_25px_rgba(75,226,196,0.4)] px-10 py-3.5 text-xs font-bold uppercase tracking-[0.24em] text-[#0d0d0d] transition duration-300 transform active:scale-95 cursor-pointer"
        >
          Register Now
        </Link>
      </div>
    </main>
  );
}