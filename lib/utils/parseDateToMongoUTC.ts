export function parseDateToMongoUTC(dateStr: string): string {
  const [month, day, year] = dateStr.split('/').map(Number);

  const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

  return utcDate.toISOString().replace('Z', '+00:00');
}
