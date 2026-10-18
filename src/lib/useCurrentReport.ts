import { useMemo } from 'react';
import { useData } from '../data/DataProvider';
import { UNLOCK_DAYS, currentPeriod, type Period } from '../domain/periods';
import { buildReport } from '../domain/report';
import type { ReportData } from '../domain/types';

export interface CurrentReport {
  /** O termômetro aparece depois de 7 dias com registro. */
  unlocked: boolean;
  registeredDays: number;
  period: Period | null;
  report: ReportData | null;
}

/** Relatório "ao vivo" dos 7 dias que terminam no último dia com registro. */
export function useCurrentReport(): CurrentReport {
  const { meals, index, dates, profile } = useData();
  return useMemo(() => {
    const period = currentPeriod(dates);
    return {
      unlocked: dates.length >= UNLOCK_DAYS,
      registeredDays: dates.length,
      period,
      report: period
        ? buildReport({ meals, index, period, profileName: profile?.name ?? '' })
        : null,
    };
  }, [meals, index, dates, profile]);
}
