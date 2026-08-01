"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const GATED_PREFIXES = [
  "/events/weekly-challenges/timeline",
  "/events/weekly-challenges/week",
  "/events/weekly-challenges/solve",
  "/events/weekly-challenges/leaderboard",
];

export default function RegistrationGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, isAuthenticated, isRegistered } = useAuth();

  const gated = GATED_PREFIXES.some((prefix) => pathname?.startsWith(prefix));
  const mustRegister = gated && !isLoading && isAuthenticated && !isRegistered;

  useEffect(() => {
    if (mustRegister) {
      router.replace("/register");
    }
  }, [mustRegister, router]);

  if (mustRegister) return null;

  return <>{children}</>;
}
