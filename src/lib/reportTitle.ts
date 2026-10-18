import type { SavedReport } from '../domain/types';

export function reportTitle(report: Pick<SavedReport, 'kind' | 'weekNumber'>): string {
  return report.kind === 'semanal' && report.weekNumber
    ? `Semana ${report.weekNumber}`
    : 'Relatório personalizado';
}
