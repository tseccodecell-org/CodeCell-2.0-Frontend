import { useEffect, useState } from "react";

export const END_DRIFT_TOLERANCE_MS = 5000;

export function estimateRoundEnd(
  remainingSeconds: number,
  sentAt: number,
  receivedAt: number,
  previousEnd: number | null
): number {
  const estimate = (sentAt + receivedAt) / 2 + remainingSeconds * 1000;
  if (previousEnd !== null && Math.abs(previousEnd - estimate) < END_DRIFT_TOLERANCE_MS) {
    return previousEnd;
  }
  return estimate;
}

export function useTimeReached(target: string | number | null | undefined): boolean {
  const at = target === null || target === undefined ? null : typeof target === "number" ? target : Date.parse(target);
  const [reached, setReached] = useState(() => at !== null && at <= Date.now());

  useEffect(() => {
    if (at === null) {
      setReached(false);
      return;
    }
    const check = () => setReached(at <= Date.now());
    check();
    const timer = setInterval(check, 1000);
    return () => clearInterval(timer);
  }, [at]);

  return reached;
}
