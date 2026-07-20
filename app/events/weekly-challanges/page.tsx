import Link from "next/link";

export default function WeeklyChallangesPage() {
  return (
    <main className="min-h-screen bg-[#080c08] text-[#E8FF00] flex items-center justify-center px-6 py-16">
      <div className="max-w-4xl text-center border border-[#4BE2C4]/25 bg-[#0A0A0A]/90 backdrop-blur-xl p-10 rounded-[32px] shadow-[0_0_80px_rgba(75,226,196,0.12)]">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#4BE2C4]">EVENTS / WEEKLY CHALLANGES</p>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-[0.12em] text-[#E8FF00] mb-6">Coming Soon</h1>
        <p className="mx-auto max-w-2xl text-sm leading-7 text-[#D4D7D9]/80 mb-8">
          This section is being built right now. Stay tuned for weekly challenge announcements, practice problems, and event details.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-full border border-[#4BE2C4]/60 px-8 py-3 text-sm font-bold uppercase tracking-[0.24em] text-[#F0EDE6] transition duration-200 hover:border-[#E8FF00]/80 hover:text-[#E8FF00]"
        >
          Register Now
        </Link>
      </div>
    </main>
  );
}