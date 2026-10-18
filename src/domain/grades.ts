import type { Grade, Nova } from './types';

export const GRADES: Grade[] = ['A', 'B', 'C', 'D', 'E'];

/** Pontos de cada nota usados nas médias (0–100). */
export const GRADE_POINTS: Record<Grade, number> = { A: 100, B: 75, C: 50, D: 25, E: 0 };

/** Pontos de cada grau de processamento (NOVA) usados nas médias (0–100). */
export const NOVA_POINTS: Record<Nova, number> = { 1: 100, 2: 80, 3: 50, 4: 0 };

/** Nota mínima (0–100) para cada letra da escala. */
export const GRADE_THRESHOLDS: { grade: Grade; min: number }[] = [
  { grade: 'A', min: 85 },
  { grade: 'B', min: 70 },
  { grade: 'C', min: 55 },
  { grade: 'D', min: 40 },
  { grade: 'E', min: 0 },
];

export function gradeFromScore(score: number): Grade {
  return GRADE_THRESHOLDS.find((t) => score >= t.min)?.grade ?? 'E';
}

export const GRADE_LABELS: Record<Grade, string> = {
  A: 'Excelente',
  B: 'Boa',
  C: 'Regular',
  D: 'Precisa melhorar',
  E: 'Precisa de atenção',
};

export const GRADE_MESSAGES: Record<Grade, string> = {
  A: 'Sua alimentação está ótima! Continue assim.',
  B: 'Você está no caminho certo — pequenos ajustes podem levar ao A.',
  C: 'Há bons hábitos, mas também espaço para melhorar.',
  D: 'Sua alimentação precisa de alguns ajustes. Veja as dicas do relatório.',
  E: 'Que tal começar com pequenas trocas no dia a dia? O relatório mostra por onde começar.',
};

export function isGrade(value: unknown): value is Grade {
  return typeof value === 'string' && (GRADES as string[]).includes(value);
}

export function isNova(value: unknown): value is Nova {
  return value === 1 || value === 2 || value === 3 || value === 4;
}
