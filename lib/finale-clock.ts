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
