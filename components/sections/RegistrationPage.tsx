
import { CyberGrid } from "../layout/CyberGrid";
import { RegistrationForm } from "../layout/RegistrationForm";


export const metadata = {
  title: "Weekly Challenges Registration",
  description: "Register for the weekly strategic challenge events.",
};

export default function RegistrationPage() {
  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-x-hidden font-sans bg-black">

      {/* Subtle Apple-style background golds and rich blacks */}
      <CyberGrid />



      {/* Main Form Center Panel */}
      <div className="flex-1 flex flex-col items-center justify-center py-10 z-30 select-text">
        <div className="w-full text-center max-w-2xl px-4 mb-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white inline-block mb-3.5">
            Weekly Challenges Registration
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed font-medium">
            Enter your credentials and academic details to register for the upcoming week's competition.
          </p>
        </div>

        {/* Dynamic form wrapper */}
        <RegistrationForm />
      </div>

      {/* Apple-style clean footer */}
      <footer className="w-full border-t border-zinc-950 bg-black/95 py-5 px-6 z-40 text-center text-[10px] text-zinc-650 tracking-wider">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-2.5 md:space-y-0 text-zinc-500 font-medium">
          <div>
            <span>Official participant registration for weekly challenge sessions.</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} Challenge Commission. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
