import type { SavedReport } from '../domain/types';
import type { Messages } from '../i18n/messages';

export function reportTitle(report: Pick<SavedReport, 'kind' | 'weekNumber'>, t: Messages): string {
  return report.kind === 'semanal' && report.weekNumber
    ? t.reports.week(report.weekNumber)
    : t.reports.custom;
}
