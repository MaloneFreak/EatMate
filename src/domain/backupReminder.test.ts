import { describe, expect, it } from 'vitest';
import { daysSinceBackup, isBackupReminderDue } from './backupReminder';

const at = (iso: string) => new Date(iso).getTime();
const meal = (created: string, updated = created) => ({
  createdAt: at(created),
  updatedAt: at(updated),
});

describe('lembrete de backup', () => {
  const now = at('2026-10-29T09:00:00');

  it('é semanal por padrão e conta a partir do primeiro registro', () => {
    expect(isBackupReminderDue({ meals: [meal('2026-10-23T20:00:00')] }, now)).toBe(false);
    expect(isBackupReminderDue({ meals: [meal('2026-10-22T20:00:00')] }, now)).toBe(true);
  });

  it('conta dias do calendário desde o último backup', () => {
    const meals = [meal('2026-10-01T12:00:00', '2026-10-28T21:00:00')];
    const lastBackupAt = at('2026-10-28T20:00:00');
    expect(isBackupReminderDue({ reminder: 'daily', lastBackupAt, meals }, now)).toBe(true);
    expect(isBackupReminderDue({ reminder: 'weekly', lastBackupAt, meals }, now)).toBe(false);
    expect(daysSinceBackup(lastBackupAt, now)).toBe(1);
  });

  it('não aparece sem registros novos desde o backup', () => {
    const meals = [meal('2026-10-01T12:00:00')];
    const lastBackupAt = at('2026-10-02T12:00:00');
    expect(isBackupReminderDue({ reminder: 'daily', lastBackupAt, meals }, now)).toBe(false);
    expect(isBackupReminderDue({ reminder: 'daily', meals: [] }, now)).toBe(false);
  });

  it('pode ser desligado ou adiado', () => {
    const meals = [meal('2026-10-01T12:00:00')];
    expect(isBackupReminderDue({ reminder: 'off', meals }, now)).toBe(false);
    const snoozedAt = at('2026-10-27T10:00:00');
    expect(isBackupReminderDue({ snoozedAt, meals }, now)).toBe(false);
    expect(isBackupReminderDue({ snoozedAt, meals }, at('2026-11-03T08:00:00'))).toBe(true);
    expect(daysSinceBackup(undefined, now)).toBeUndefined();
  });
});
