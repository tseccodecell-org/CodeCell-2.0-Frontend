import LeaderboardButtons from "@/components/sections/leaderboard/LeaderboardButtons";
import WeeklyTimeline from "@/components/sections/weekly-challenges/WeeklyTimeline";

const Page = () => {
  return (
    <div
      className="min-h-screen bg-[#06070B] px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col"
      style={{
        backgroundImage:
          "linear-gradient(rgba(139,147,167,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,147,167,0.04) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12 border-b border-[#1a1c24] pb-8">
        <div>
          <span className="font-mono text-[10px] text-[#D9A404] tracking-[0.2em] block mb-2">
            TSEC CODECELL • 2026
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-[#F4F1EA]">WEEKLY </span>
            <span
              style={{
                background: "linear-gradient(180deg, #F5C451 0%, #D97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CHALLENGES
            </span>
          </h1>
          <p className="font-sans text-sm text-[#8B93A7] mt-3 max-w-lg leading-relaxed">
            Six weeks, six rising pieces. Clear each round to climb the board.
          </p>
        </div>

            <div className="mt-7">
        <LeaderboardButtons />
        </div>
      </div>

      <WeeklyTimeline />
    </div>
  );
};

export default Page;