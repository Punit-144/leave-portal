export function calculateLeaveDays(
  startDate: Date,
  endDate: Date,
  isHalfDay: boolean
): number {
  if (isHalfDay) {
    return 0.5;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Reset time to avoid timezone issues
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // +1 because leave from 20 to 21 = 2 days
  return diffDays + 1;
}
