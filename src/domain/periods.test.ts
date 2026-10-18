import { describe, expect, it } from 'vitest';
import { FoodIndex } from './foodIndex';
import {
  completedWeeksWithData,
  currentPeriod,
  periodFingerprint,
  registeredDates,
  weekOf,
} from './periods';
import type { Meal } from './types';

const meal = (
  date: string,
  items: { name: string; foodId?: string }[] = [{ name: 'Arroz', foodId: 'arroz' }],
): Meal => ({
  id: `m-${date}-${items.length}`,
  date,
  type: 'almoco',
  items: items.map((i, n) => ({ id: `i${n}`, ...i })),
  createdAt: 0,
  updatedAt: 0,
});

describe('períodos', () => {
  it('lista os dias com registro sem repetição', () => {
    expect(registeredDates([meal('2026-10-02'), meal('2026-10-01'), meal('2026-10-02')])).toEqual([
      '2026-10-01',
      '2026-10-02',
    ]);
  });

  it('o termômetro usa os 7 dias até o último registro', () => {
    expect(currentPeriod(['2026-10-01', '2026-10-18'])).toEqual({
      start: '2026-10-12',
      end: '2026-10-18',
    });
    expect(currentPeriod([])).toBeNull();
  });

  it('numera as semanas a partir da âncora', () => {
    expect(weekOf('2026-10-01', '2026-10-01')).toEqual({
      number: 1,
      start: '2026-10-01',
      end: '2026-10-07',
    });
    expect(weekOf('2026-10-01', '2026-10-08')).toEqual({
      number: 2,
      start: '2026-10-08',
      end: '2026-10-14',
    });
  });

  it('só considera semanas encerradas e com registros', () => {
    const dates = ['2026-10-01', '2026-10-03', '2026-10-20'];
    expect(completedWeeksWithData('2026-10-01', dates, '2026-10-21')).toEqual([
      { number: 1, start: '2026-10-01', end: '2026-10-07' },
    ]);
    expect(completedWeeksWithData('2026-10-01', dates, '2026-10-22')).toEqual([
      { number: 1, start: '2026-10-01', end: '2026-10-07' },
      { number: 3, start: '2026-10-15', end: '2026-10-21' },
    ]);
    // A semana que termina hoje ainda não está encerrada.
    expect(completedWeeksWithData('2026-10-01', dates, '2026-10-07')).toEqual([]);
  });
});

describe('periodFingerprint', () => {
  const index = new FoodIndex();
  const period = { start: '2026-10-01', end: '2026-10-07' };

  it('muda quando um registro do período muda', () => {
    const base = [meal('2026-10-02')];
    const edited = [meal('2026-10-02', [{ name: 'Feijão', foodId: 'feijao' }])];
    expect(periodFingerprint(base, index, period)).toBe(
      periodFingerprint([...base], index, period),
    );
    expect(periodFingerprint(base, index, period)).not.toBe(
      periodFingerprint(edited, index, period),
    );
  });

  it('ignora registros fora do período', () => {
    const base = [meal('2026-10-02')];
    expect(periodFingerprint(base, index, period)).toBe(
      periodFingerprint([...base, meal('2026-10-20')], index, period),
    );
  });

  it('muda quando a classificação de um alimento personalizado muda', () => {
    const meals = [meal('2026-10-02', [{ name: 'Quitute', foodId: 'custom_1' }])];
    const asFruit = new FoodIndex([
      { id: 'custom_1', name: 'Quitute', group: 'frutas', grade: 'A', nova: 1 },
    ]);
    const asSweet = new FoodIndex([
      { id: 'custom_1', name: 'Quitute', group: 'doces', grade: 'E', nova: 4 },
    ]);
    expect(periodFingerprint(meals, asFruit, period)).not.toBe(
      periodFingerprint(meals, asSweet, period),
    );
  });
});
