import { isValidISODate } from '../domain/dates';
import { isGrade, isNova } from '../domain/grades';
import { isFoodGroup } from '../domain/groups';
import { isMealType } from '../domain/meals';
import type { AppSettings, CustomFood, Meal, Profile, SavedReport } from '../domain/types';
import { db, uid } from './db';
import { getProfile, getSettings, migrateReports, updateSettings } from './repo';

export interface BackupFile {
  app: 'eatmate';
  version: 1;
  exportedAt: string;
  profile?: Profile;
  settings?: AppSettings;
  meals: Meal[];
  customFoods: CustomFood[];
  reports: SavedReport[];
}

/** Erro ao ler um arquivo de backup; `code` escolhe a mensagem no idioma do app. */
export class BackupError extends Error {
  constructor(readonly code: 'invalidJson' | 'notEatmate') {
    super(code);
    this.name = 'BackupError';
  }
}

export interface ImportSummary {
  meals: number;
  customFoods: number;
  reports: number;
}

export async function exportBackup(): Promise<BackupFile> {
  const [profile, settings, meals, customFoods, reports] = await Promise.all([
    getProfile(),
    getSettings(),
    db.meals.toArray(),
    db.customFoods.toArray(),
    db.reports.toArray(),
  ]);
  return {
    app: 'eatmate',
    version: 1,
    exportedAt: new Date().toISOString(),
    ...(profile ? { profile } : {}),
    settings,
    meals,
    customFoods,
    reports,
  };
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === 'string' ? v : undefined);
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

function sanitizeMeal(raw: unknown): Meal | undefined {
  if (!isObject(raw)) return undefined;
  const date = str(raw.date);
  if (!date || !isValidISODate(date) || !isMealType(raw.type) || !Array.isArray(raw.items))
    return undefined;
  const items = raw.items.flatMap((item) => {
    if (!isObject(item) || !str(item.name)?.trim()) return [];
    return [
      {
        id: str(item.id) ?? uid(),
        name: str(item.name)!.trim(),
        ...(str(item.quantity) ? { quantity: str(item.quantity) } : {}),
        ...(str(item.foodId) ? { foodId: str(item.foodId) } : {}),
      },
    ];
  });
  const time = str(raw.time);
  return {
    id: str(raw.id) ?? uid(),
    date,
    type: raw.type,
    ...(time && /^\d{2}:\d{2}$/.test(time) ? { time } : {}),
    ...(str(raw.notes) ? { notes: str(raw.notes) } : {}),
    items,
    createdAt: num(raw.createdAt) ?? Date.now(),
    updatedAt: num(raw.updatedAt) ?? Date.now(),
  };
}

function sanitizeCustomFood(raw: unknown): CustomFood | undefined {
  if (!isObject(raw) || !str(raw.id) || !str(raw.name)) return undefined;
  if (!isFoodGroup(raw.group) || !isGrade(raw.grade) || !isNova(raw.nova)) return undefined;
  return {
    id: str(raw.id)!,
    name: str(raw.name)!,
    group: raw.group,
    grade: raw.grade,
    nova: raw.nova,
    aliases: Array.isArray(raw.aliases)
      ? raw.aliases.filter((a): a is string => typeof a === 'string')
      : [],
    ...(Array.isArray(raw.tags) ? { tags: raw.tags as CustomFood['tags'] } : {}),
    custom: true,
    createdAt: num(raw.createdAt) ?? Date.now(),
  };
}

const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isStringArray = (v: unknown) => Array.isArray(v) && v.every((x) => typeof x === 'string');
/** Destaques: texto pronto (relatórios antigos, versão 1) ou chave da mensagem (versão 2). */
const isInsightList = (v: unknown) =>
  Array.isArray(v) &&
  v.every((x) => typeof x === 'string' || (isObject(x) && typeof x.key === 'string'));
const isArrayOf = (v: unknown, test: (x: Record<string, unknown>) => boolean) =>
  Array.isArray(v) && v.every((x) => isObject(x) && test(x));
const isDate = (v: unknown) => typeof v === 'string' && isValidISODate(v);

/**
 * Confere a estrutura de um relatório salvo, para um arquivo corrompido não quebrar as telas.
 * Relatórios da versão 1 (com textos em português) são aceitos e gerados novamente ao importar.
 */
function isReportData(d: Record<string, unknown>): boolean {
  const score = d.score;
  const scoreOk =
    score === null ||
    (isObject(score) &&
      isNumber(score.total) &&
      isGrade(score.grade) &&
      isArrayOf(score.components, (c) => isNumber(c.score) && isNumber(c.weight)));
  const previous = d.previous;
  const previousOk =
    previous === null ||
    previous === undefined ||
    (isObject(previous) &&
      isDate(previous.startDate) &&
      isDate(previous.endDate) &&
      isNumber(previous.score));
  return (
    scoreOk &&
    previousOk &&
    isDate(d.startDate) &&
    isDate(d.endDate) &&
    typeof d.profileName === 'string' &&
    [d.version, d.totalDays, d.registeredDays, d.mealsCount, d.itemsCount, d.classifiedCount].every(
      isNumber,
    ) &&
    [d.fruitsAndVegetablesPerDay, d.ultraProcessedShare, d.distinctFoods].every(isNumber) &&
    isObject(d.gradeDistribution) &&
    isObject(d.novaDistribution) &&
    isStringArray(d.unclassified) &&
    isInsightList(d.positives) &&
    isInsightList(d.attention) &&
    isArrayOf(d.groups, (g) => isFoodGroup(g.group) && isNumber(g.count) && isNumber(g.days)) &&
    isArrayOf(
      d.markers,
      (m) => typeof m.key === 'string' && isNumber(m.days) && isNumber(m.count),
    ) &&
    isArrayOf(d.mealRegularity, (m) => isMealType(m.type) && isNumber(m.days)) &&
    isArrayOf(d.topFoods, (f) => typeof f.name === 'string' && isNumber(f.count)) &&
    isArrayOf(
      d.days,
      (day) =>
        isDate(day.date) &&
        isNumber(day.mealsCount) &&
        isArrayOf(
          day.meals,
          (m) => isMealType(m.type) && isArrayOf(m.items, (i) => typeof i.name === 'string'),
        ),
    )
  );
}

function sanitizeReport(raw: unknown): SavedReport | undefined {
  if (!isObject(raw) || !str(raw.id) || !isObject(raw.data)) return undefined;
  if (raw.kind !== 'semanal' && raw.kind !== 'personalizado') return undefined;
  if (!isDate(raw.startDate) || !isDate(raw.endDate) || !isNumber(raw.generatedAt))
    return undefined;
  if (typeof raw.fingerprint !== 'string' || !isReportData(raw.data)) return undefined;
  return raw as unknown as SavedReport;
}

/** Lê e valida o conteúdo de um arquivo de backup. Lança um `BackupError` se for inválido. */
export function parseBackup(text: string): BackupFile {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new BackupError('invalidJson');
  }
  if (!isObject(data) || data.app !== 'eatmate' || !Array.isArray(data.meals)) {
    throw new BackupError('notEatmate');
  }
  const profile =
    isObject(data.profile) && str(data.profile.name)
      ? { name: str(data.profile.name)!, createdAt: num(data.profile.createdAt) ?? Date.now() }
      : undefined;
  const settings = isObject(data.settings)
    ? {
        ...(str(data.settings.weekAnchor) ? { weekAnchor: str(data.settings.weekAnchor) } : {}),
        dismissedPeriods: Array.isArray(data.settings.dismissedPeriods)
          ? data.settings.dismissedPeriods.filter((p): p is string => typeof p === 'string')
          : [],
      }
    : undefined;
  return {
    app: 'eatmate',
    version: 1,
    exportedAt: str(data.exportedAt) ?? new Date().toISOString(),
    ...(profile ? { profile } : {}),
    ...(settings ? { settings } : {}),
    meals: data.meals.map(sanitizeMeal).filter((m): m is Meal => !!m),
    customFoods: (Array.isArray(data.customFoods) ? data.customFoods : [])
      .map(sanitizeCustomFood)
      .filter((f): f is CustomFood => !!f),
    reports: (Array.isArray(data.reports) ? data.reports : [])
      .map(sanitizeReport)
      .filter((r): r is SavedReport => !!r),
  };
}

/**
 * Importa um backup juntando com os dados atuais (nada é apagado).
 * Registros com o mesmo identificador são substituídos pela versão do backup.
 */
export async function importBackup(backup: BackupFile): Promise<ImportSummary> {
  await db.transaction('rw', [db.meals, db.reports, db.customFoods, db.kv], async () => {
    await db.meals.bulkPut(backup.meals);
    await db.customFoods.bulkPut(backup.customFoods);
    await db.reports.bulkPut(backup.reports);
    if (backup.profile && !(await getProfile())) {
      await db.kv.put({ key: 'profile', value: backup.profile });
    }
    const current = await getSettings();
    await updateSettings({
      weekAnchor: current.weekAnchor ?? backup.settings?.weekAnchor,
      dismissedPeriods: [
        ...new Set([...current.dismissedPeriods, ...(backup.settings?.dismissedPeriods ?? [])]),
      ],
    });
  });
  await migrateReports();
  return {
    meals: backup.meals.length,
    customFoods: backup.customFoods.length,
    reports: backup.reports.length,
  };
}

export async function markBackupDone(): Promise<void> {
  await updateSettings({ lastBackupAt: Date.now() });
}

export function backupFileName(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `eatmate-backup-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.json`;
}
