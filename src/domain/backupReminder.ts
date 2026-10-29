import { diffDays, toISODate } from './dates';
import type { BackupReminder, Meal } from './types';

export const DEFAULT_BACKUP_REMINDER: BackupReminder = 'weekly';

export const BACKUP_REMINDERS: BackupReminder[] = ['off', 'daily', 'weekly'];

const INTERVAL_DAYS: Record<Exclude<BackupReminder, 'off'>, number> = { daily: 1, weekly: 7 };

export interface BackupReminderInput {
  reminder?: BackupReminder;
  lastBackupAt?: number;
  snoozedAt?: number;
  meals: Pick<Meal, 'createdAt' | 'updatedAt'>[];
}

const day = (time: number) => toISODate(new Date(time));

/** Dias (do calendário) desde o último backup; `undefined` se nunca foi feito. */
export function daysSinceBackup(
  lastBackupAt: number | undefined,
  now = Date.now(),
): number | undefined {
  return lastBackupAt === undefined ? undefined : diffDays(day(lastBackupAt), day(now));
}

/**
 * O lembrete de backup aparece na tela inicial quando há registros novos sem
 * backup e já passou o intervalo escolhido (1 ou 7 dias do calendário) desde o
 * último backup — ou, se nunca houve um, desde o primeiro registro. "Agora não"
 * adia o lembrete pelo mesmo intervalo.
 */
export function isBackupReminderDue(
  { reminder = DEFAULT_BACKUP_REMINDER, lastBackupAt, snoozedAt, meals }: BackupReminderInput,
  now = Date.now(),
): boolean {
  if (reminder === 'off' || !meals.length) return false;
  const lastChange = meals.reduce((max, m) => Math.max(max, m.updatedAt), 0);
  if (lastBackupAt !== undefined && lastChange <= lastBackupAt) return false;
  const start = lastBackupAt ?? meals.reduce((min, m) => Math.min(min, m.createdAt), now);
  const since = Math.max(start, snoozedAt ?? 0);
  return diffDays(day(since), day(now)) >= INTERVAL_DAYS[reminder];
}
