import { CyberGrid } from "../layout/CyberGrid";
import { RegistrationForm } from "../layout/RegistrationForm";

export default function RegistrationPage() {
  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-x-hidden font-sans bg-[#0a0a0a]">
      {/* Background lights and grid */}
      <CyberGrid />

      {/* Main Form Center Panel */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 md:py-20 z-30 select-text">
        <div className="w-full text-center max-w-2xl px-6 mb-8">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Weekly Challenges <span className="bg-gradient-to-r from-[#4BE2C4] via-[#00B4D8] to-[#E8FF00] bg-clip-text text-transparent">Registration</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-md mx-auto leading-relaxed font-normal">
            Verify your account and complete your academic profile to participate in the upcoming weekly challenges.
          </p>
        </div>

        {/* Dynamic form wrapper */}
        <RegistrationForm />
      </div>

      {/* Clean elegant footer */}
      <footer className="w-full border-t border-zinc-900/50 bg-[#0c0c0c]/80 backdrop-blur-md py-6 px-6 z-40 text-center text-xs text-zinc-500 font-normal">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span>Official participant portal for weekly competition sessions.</span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} TSEC CodeCell. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
