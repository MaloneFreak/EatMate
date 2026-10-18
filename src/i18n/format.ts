import { capitalize, parseISODate } from '../domain/dates';

/** Datas e números no formato do idioma escolhido ("18/10" no Brasil, "10/18" nos EUA…). */
export interface Format {
  locale: string;
  /** Número com até 1 casa decimal: "2,5". */
  decimal: (value: number) => string;
  /** Parcela (0–1) em porcentagem: "25%". */
  percent: (share: number) => string;
  /** "18/10" */
  short: (iso: string) => string;
  /** "18/10/2026" */
  full: (iso: string) => string;
  /** "Sábado, 18 de outubro" */
  long: (iso: string) => string;
  /** "sáb" */
  weekdayShort: (iso: string) => string;
  /** "18 de outubro" */
  dayMonth: (iso: string) => string;
  /** "Outubro de 2026" */
  monthYear: (iso: string) => string;
  /** "18/10/2026, 14:30" */
  dateTime: (timestamp: number) => string;
  /** "12/10 – 18/10" (com o ano quando o período passa de um ano para o outro). */
  period: (start: string, end: string) => string;
  /** "12/10/2026 – 18/10/2026" */
  periodFull: (start: string, end: string) => string;
}

const cache = new Map<string, Format>();

export function createFormat(locale: string): Format {
  const cached = cache.get(locale);
  if (cached) return cached;
  const dates = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, options);
  const short = dates({ day: '2-digit', month: '2-digit' });
  const full = dates({ day: '2-digit', month: '2-digit', year: 'numeric' });
  const long = dates({ weekday: 'long', day: 'numeric', month: 'long' });
  const weekdayShort = dates({ weekday: 'short' });
  const dayMonth = dates({ day: 'numeric', month: 'long' });
  const monthYear = dates({ month: 'long', year: 'numeric' });
  const dateTime = dates({
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const decimal = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 });
  const range = (format: Intl.DateTimeFormat, start: string, end: string) =>
    format.formatRange(parseISODate(start), parseISODate(end));

  const format: Format = {
    locale,
    decimal: (value) => decimal.format(value),
    percent: (share) => percent.format(share),
    short: (iso) => short.format(parseISODate(iso)),
    full: (iso) => full.format(parseISODate(iso)),
    long: (iso) => capitalize(long.format(parseISODate(iso))),
    weekdayShort: (iso) => weekdayShort.format(parseISODate(iso)).replace('.', ''),
    dayMonth: (iso) => dayMonth.format(parseISODate(iso)),
    monthYear: (iso) => capitalize(monthYear.format(parseISODate(iso))),
    dateTime: (timestamp) => dateTime.format(new Date(timestamp)),
    period: (start, end) => range(start.slice(0, 4) === end.slice(0, 4) ? short : full, start, end),
    periodFull: (start, end) => range(full, start, end),
  };
  cache.set(locale, format);
  return format;
}
