import { describe, expect, it } from 'vitest';
import {
  addDays,
  dateRange,
  diffDays,
  formatDayMonth,
  formatPeriod,
  isValidISODate,
  toISODate,
} from './dates';
import { suggestMealType } from './meals';

describe('datas', () => {
  it('soma dias atravessando meses e anos', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('calcula intervalos', () => {
    expect(diffDays('2026-10-01', '2026-10-08')).toBe(7);
    expect(dateRange('2026-10-30', '2026-11-02')).toEqual([
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
      '2026-11-02',
    ]);
  });

  it('valida datas', () => {
    expect(isValidISODate('2026-02-28')).toBe(true);
    expect(isValidISODate('2026-02-30')).toBe(false);
    expect(isValidISODate('18/10/2026')).toBe(false);
  });

  it('usa o fuso local', () => {
    expect(toISODate(new Date(2026, 9, 18, 23, 59))).toBe('2026-10-18');
  });

  it('formata em português', () => {
    expect(formatPeriod('2026-10-12', '2026-10-18')).toBe('12/10 a 18/10');
    expect(formatPeriod('2026-12-28', '2027-01-03')).toBe('28/12/2026 a 03/01/2027');
    expect(formatDayMonth('2026-10-12')).toBe('12 de outubro');
  });
});

describe('suggestMealType', () => {
  it('sugere a refeição pelo horário', () => {
    expect(suggestMealType('07:30')).toBe('cafe_manha');
    expect(suggestMealType('10:00')).toBe('lanche_manha');
    expect(suggestMealType('12:30')).toBe('almoco');
    expect(suggestMealType('16:00')).toBe('cafe_tarde');
    expect(suggestMealType('20:00')).toBe('jantar');
    expect(suggestMealType('23:00')).toBe('ceia');
    expect(suggestMealType('02:00')).toBe('ceia');
  });
});
