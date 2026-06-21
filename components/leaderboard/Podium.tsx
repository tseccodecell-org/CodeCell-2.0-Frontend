"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import trophyGold from "@/public/trophy-gold.png";
import trophySilver from "@/public/trophy-silver.png";
import trophyBronze from "@/public/trophy-bronze.png";
import crown from "@/public/crown-pixel.png";

import type { Competitor } from "./mock-data";

const MotionImage = motion(Image);

const TROPHIES = {
  1: trophyGold,
  2: trophySilver,
  3: trophyBronze,
} as const;

const ACCENT = {
  1: "from-gold/30 via-gold/5 to-transparent border-gold/40",
  2: "from-foreground/15 via-foreground/5 to-transparent border-border",
  3: "from-orange-500/25 via-orange-500/5 to-transparent border-orange-500/30",
} as const;

const HEIGHT = {
  1: "h-44 sm:h-56",
  2: "h-36 sm:h-44",
  3: "h-28 sm:h-36",
} as const;

const ORDER = [2, 1, 3] as const;

export function Podium({ top3 }: { top3: Competitor[] }) {
  const byRank = new Map(top3.map((c) => [c.rank, c]));

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-mint/5 to-transparent blur-3xl" />

      <div className="grid grid-cols-3 items-end gap-3 sm:gap-6">
        {ORDER.map((rank, i) => {
          const c = byRank.get(rank);

          if (!c) return <div key={rank} />;

          return (
            <motion.div
              key={rank}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 + i * 0.12,
                type: "spring",
                stiffness: 120,
              }}
              className="flex flex-col items-center"
            >
              {/* Trophy + Crown */}
              <div className="relative mb-3 flex flex-col items-center">
                {rank === 1 && (
                  <MotionImage
                    src={crown}
                    alt="Crown"
                    width={64}
                    height={64}
                    className="pixelated absolute -top-10 h-12 w-12 drop-shadow-[0_0_12px_var(--gold)] sm:h-14 sm:w-14"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  />
                )}

                <Image
                  src={TROPHIES[rank]}
                  alt={`Rank ${rank} trophy`}
                  width={96}
                  height={96}
                  priority={rank === 1}
                  className={`pixelated ${
                    rank === 1
                      ? "h-24 w-24 sm:h-28 sm:w-28"
                      : "h-20 w-20 sm:h-24 sm:w-24"
                  }`}
                />
              </div>

              {/* Name plate */}
              <div className="mb-2 text-center">
                <p className="font-pixel text-[10px] text-mint">#{rank}</p>

                <p className="mt-1 truncate text-sm font-semibold text-foreground sm:text-base">
                  {c.username}
                </p>

                <p className="font-mono text-xs text-muted-foreground">
                  @{c.handle}
                </p>
              </div>

              {/* Podium Pillar */}
              <div
                className={`relative w-full overflow-hidden rounded-t-lg border-x border-t bg-gradient-to-b ${ACCENT[rank]} ${HEIGHT[rank]}`}
              >
                {/* Pixel grid */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                    backgroundSize: "12px 12px",
                  }}
                />

                <div className="absolute inset-x-0 top-3 text-center">
                  <p className="font-pixel text-[18px] text-foreground sm:text-[22px]">
                    {rank}
                  </p>
                </div>

                <div className="absolute inset-x-0 bottom-3 text-center">
                  <p className="font-mono text-xs text-muted-foreground">
                    score
                  </p>

                  <p className="font-mono text-base font-semibold tabular-nums text-foreground sm:text-lg">
                    {c.score}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}