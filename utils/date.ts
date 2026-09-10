/**
 * Returns formatted date string in YYYY-MM-DD
 */
export function getTodayString(): string {
  const d = new Date();
  return formatDateString(d);
}

export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDateString(d);
}

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns list of past N days including today, ordered from oldest to newest
 */
export function getPastNDays(n: number = 7): { dateString: string; dayLabel: string; dayNumber: number }[] {
  const days: { dateString: string; dayLabel: string; dayNumber: number }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      dateString: formatDateString(d),
      dayLabel: dayNames[d.getDay()],
      dayNumber: d.getDate(),
    });
  }
  return days;
}

export function formatFriendlyDate(dateString: string): string {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (dateString === today) return 'Today';
  if (dateString === yesterday) return 'Yesterday';

  const parts = dateString.split('-');
  if (parts.length === 3) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(parts[1], 10) - 1;
    return `${months[monthIndex]} ${parseInt(parts[2], 10)}`;
  }
  return dateString;
}
