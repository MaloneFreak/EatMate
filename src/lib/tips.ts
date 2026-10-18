import { diffDays } from '../domain/dates';

/** A mesma dica durante o dia todo; muda a cada dia. */
export function tipOfTheDay(tips: string[], today: string): string {
  const index = Math.abs(diffDays('2026-01-01', today)) % tips.length;
  return tips[index]!;
}
