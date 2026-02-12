/**
 * Returns the number of full days elapsed from a UTC date to now.
 * If the date is in the future, returns 0.
 */
export function daysSinceUtc(utcIsoDate: string): number {
  const start = new Date(utcIsoDate);

  if (isNaN(start.getTime())) {
    throw new Error('Invalid UTC date');
  }

  const now = new Date();

  // Normalize both dates to UTC midnight
  const startUtcMidnight = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
  );

  const nowUtcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const diffDays = Math.floor((nowUtcMidnight - startUtcMidnight) / MS_PER_DAY);

  return Math.max(0, diffDays);
}
