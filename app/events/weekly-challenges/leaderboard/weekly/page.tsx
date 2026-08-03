// app/events/weekly-challenges/leaderboard/weekly/page.tsx
"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderBoard";
import { useAuth } from "@/hooks/useAuth";
import LeaderboardToggle from "@/components/sections/leaderboard/LeaderboardToggle";
import LeaderboardTable, { LeaderboardRow } from "@/components/sections/leaderboard/LeaderboardTable";
import { getWeeks, Week } from "@/lib/api-client";

function WeeklyLeaderboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // FIX BONUS ISSUE: Read weekId from URL parameter
  const urlWeekId = searchParams.get("weekId") || undefined;
  
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [defaultWeekId, setDefaultWeekId] = useState<string | undefined>(urlWeekId);
  
  useEffect(() => {
    // Fetch all weeks to populate the dropdown
    getWeeks().then((fetchedWeeks) => {
      setWeeks(fetchedWeeks);
      
      // If the user didn't request a specific week in the URL...
      if (!urlWeekId && fetchedWeeks.length > 0) {
        // 1. Is there an active week?
        const activeWeek = fetchedWeeks.find(w => w.is_active);
        
        if (activeWeek) {
          setDefaultWeekId(activeWeek.id);
        } else {
          // 2. If NO active week, default to the latest week available by week_number / date
          const sorted = [...fetchedWeeks].sort((a, b) => {
            if (a.week_number !== undefined && b.week_number !== undefined) {
              return b.week_number - a.week_number;
            }
            return new Date(b.ends_at || b.starts_at || 0).getTime() - new Date(a.ends_at || a.starts_at || 0).getTime();
          });
          if (sorted.length > 0 && sorted[0].id) {
            setDefaultWeekId(sorted[0].id);
          }
        }
      }
    }).catch(console.error);
  }, [urlWeekId]);

  const effectiveWeekId = urlWeekId || defaultWeekId;

  const {
    data,
    isLoading,
    error,
    forbidden,
    unauthorized,
    selectedTab,
    setSelectedTab,
    showToggle,
  } = useLeaderboard({ kind: "weekly", page: 1, limit: 1000, weekId: effectiveWeekId });

  const response = data as any;

  const rows: LeaderboardRow[] = useMemo(() => {
    if (!response) return [];

    let list: any[] = [];
    if (Array.isArray(response)) {
      list = response;
    } else if (Array.isArray(response.data)) {
      list = response.data;
    } else if (Array.isArray(response?.data?.data)) {
      list = response.data.data;
    }

    return list.map((entry: any, index: number) => ({
      rank: entry.rank ?? index + 1,
      id: entry.user_id ?? entry.id ?? entry.username ?? index,
      name: entry.name ?? entry.username ?? "Anonymous",
      primaryValue: entry.weekly_score ?? entry.score ?? 0,
      primaryLabel: "WEEKLY SCORE",
      secondaryValue: entry.problems_solved ?? entry.solved ?? 0,
      secondaryLabel: "SOLVED",
    }));
  }, [response]);

  const [persistentUserRow, setPersistentUserRow] = useState<LeaderboardRow | undefined>(undefined);

  useEffect(() => {
    if (user?.id) {
      const found = rows.find((r) => String(r.id) === String(user.id));
      if (found) {
        setPersistentUserRow(found);
      } else if (!isLoading && !persistentUserRow) {
        setPersistentUserRow({
          id: user.id,
          name: user.name || "Anonymous",
          rank: 0,
          primaryValue: 0,
          primaryLabel: "WEEKLY SCORE",
          secondaryValue: 0,
          secondaryLabel: "SOLVED",
        });
      }
    }
  }, [rows, user?.id, persistentUserRow, user?.name, isLoading]);

  const totalCount = response?.total ?? response?.data?.total ?? rows.length;

  return (
    <>
      <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pt-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link href="/events/weekly-challenges/timeline">
          <button className="flex items-center gap-2 text-xs font-mono text-[#8A8880] hover:text-[#D4AF37] transition-colors mb-2 md:mb-0">
            <ChevronLeft size={14} />
            BACK
          </button>
        </Link>
        
        {/* FIX BONUS ISSUE: Week Selector Dropdown */}
        {weeks.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-[#8A8880] uppercase tracking-wider">Select Week:</label>
            <select 
              value={effectiveWeekId || ""} 
              onChange={(e) => {
                const newWeekId = e.target.value;
                if (newWeekId) {
                  router.push(`/events/weekly-challenges/leaderboard/weekly?weekId=${newWeekId}`);
                } else {
                  router.push(`/events/weekly-challenges/leaderboard/weekly`);
                }
              }}
              className="bg-[#0A0A0A] border border-[#1E1E1E] text-[#D4AF37] font-mono text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4AF37] shadow-lg cursor-pointer"
            >
              <option value="">Active Week</option>
              {weeks.map(w => (
                <option key={w.id} value={w.id}>
                  Week {w.week_number} - {w.chapter_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <LeaderboardTable
        title="Weekly Leaderboard"
        eyebrow="// GRANDMASTER_ARENA.WEEKLY_TRIAL"
        description="Rankings update after each match based on difficulty, execution speed, and tactical accuracy this week."
        rows={rows}
        isLoading={isLoading}
        error={error}
        forbidden={forbidden}
        unauthorized={unauthorized}
        currentUserRow={persistentUserRow}
        totalCount={totalCount}
        controls={
          <LeaderboardToggle
            show={showToggle}
            selectedTab={selectedTab}
            onChange={(tab) => {
              setSelectedTab(tab);
            }}
          />
        }
      />
    </>
  );
}

export default function WeeklyLeaderboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06070B] flex items-center justify-center font-mono text-xs text-[#D9A404] animate-pulse">LOADING LEADERBOARD...</div>}>
      <WeeklyLeaderboardContent />
    </Suspense>
  );
}