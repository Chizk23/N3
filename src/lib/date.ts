export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
}

export function diffDateKeys(laterDateKey: string, earlierDateKey: string): number {
  const toUtcDay = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  };

  return Math.round((toUtcDay(laterDateKey) - toUtcDay(earlierDateKey)) / 86_400_000);
}
