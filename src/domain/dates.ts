// Datas são guardadas como texto "AAAA-MM-DD" no fuso local do aparelho.
// As contas são feitas ao meio-dia para evitar surpresas com horário de verão.

const pad = (n: number) => String(n).padStart(2, '0');

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO(now: Date = new Date()): string {
  return toISODate(now);
}

export function nowTime(now: Date = new Date()): string {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0);
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return toISODate(parseISODate(value)) === value;
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** Diferença em dias corridos (b - a). */
export function diffDays(a: string, b: string): number {
  return Math.round((parseISODate(b).getTime() - parseISODate(a).getTime()) / 86_400_000);
}

/** Lista de datas de `start` até `end`, inclusive. */
export function dateRange(start: string, end: string): string[] {
  const out: string[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) out.push(d);
  return out;
}

const fmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('pt-BR', options);
const shortFmt = fmt({ day: '2-digit', month: '2-digit' });
const fullFmt = fmt({ day: '2-digit', month: '2-digit', year: 'numeric' });
const longFmt = fmt({ weekday: 'long', day: 'numeric', month: 'long' });
const weekdayShortFmt = fmt({ weekday: 'short' });
const monthYearFmt = fmt({ month: 'long', year: 'numeric' });
const dayMonthFmt = fmt({ day: 'numeric', month: 'long' });
const dateTimeFmt = fmt({
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** "18/10" */
export const formatShort = (iso: string) => shortFmt.format(parseISODate(iso));
/** "18/10/2026" */
export const formatFull = (iso: string) => fullFmt.format(parseISODate(iso));
/** "sábado, 18 de outubro" */
export const formatLong = (iso: string) => longFmt.format(parseISODate(iso));
/** "sáb" */
export const formatWeekdayShort = (iso: string) =>
  weekdayShortFmt.format(parseISODate(iso)).replace('.', '');
/** "16 de outubro" */
export const formatDayMonth = (iso: string) => dayMonthFmt.format(parseISODate(iso));
/** "Outubro de 2026" */
export const formatMonthYear = (iso: string) => capitalize(monthYearFmt.format(parseISODate(iso)));
/** "18/10/2026, 14:30" */
export const formatDateTime = (timestamp: number) => dateTimeFmt.format(new Date(timestamp));

/** "12/10 a 18/10" */
export function formatPeriod(start: string, end: string): string {
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return sameYear
    ? `${formatShort(start)} a ${formatShort(end)}`
    : `${formatFull(start)} a ${formatFull(end)}`;
}

export function capitalize(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}
