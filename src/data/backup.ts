import { isValidISODate } from '../domain/dates';
import { isGrade, isNova } from '../domain/grades';
import { isFoodGroup } from '../domain/groups';
import { isMealType } from '../domain/meals';
import type { AppSettings, CustomFood, FoodTag, Meal, Profile, SavedReport } from '../domain/types';
import { db, uid } from './db';
import { mirrorSaveFoods, mirrorSaveMeals, mirrorSaveProfile, readMirror } from './mirror';
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

/**
 * Limites de um backup. Ficam bem acima do que o app grava (o nome tem até 40 letras,
 * as observações até 500) e de anos de uso, mas impedem que um arquivo malicioso ou
 * corrompido trave o aparelho, encha o armazenamento ou quebre o layout.
 */
export const BACKUP_LIMITS = {
  /** Tamanho do arquivo: um ano de registros dá menos de 2 MB. */
  fileBytes: 20 * 1024 * 1024,
  meals: 50_000,
  itemsPerMeal: 100,
  customFoods: 5_000,
  aliases: 50,
  reports: 5_000,
  dismissedPeriods: 5_000,
  /** Identificadores (o app usa UUIDs, com 36 caracteres). */
  id: 100,
  /** Nome do perfil. */
  name: 60,
  /** Nomes de alimentos, apelidos e quantidades. */
  text: 200,
  notes: 2_000,
} as const;

/** Erro ao ler um arquivo de backup; `code` escolhe a mensagem no idioma do app. */
export class BackupError extends Error {
  constructor(readonly code: 'invalidJson' | 'notEatmate' | 'tooLarge') {
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
/** Texto aparado e cortado no tamanho máximo (ou `undefined`, se vazio). */
const clip = (v: unknown, max: number = BACKUP_LIMITS.text) => {
  const value = str(v)?.trim().slice(0, max).trim();
  return value ? value : undefined;
};
/** Identificador do arquivo, se for razoável (senão quem chama gera um novo). */
const id = (v: unknown) => {
  const value = str(v);
  return value && value.length <= BACKUP_LIMITS.id ? value : undefined;
};
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

function sanitizeMeal(raw: unknown): Meal | undefined {
  if (!isObject(raw)) return undefined;
  const date = str(raw.date);
  if (!date || !isValidISODate(date) || !isMealType(raw.type) || !Array.isArray(raw.items))
    return undefined;
  const items = raw.items.slice(0, BACKUP_LIMITS.itemsPerMeal).flatMap((item) => {
    const name = isObject(item) ? clip(item.name) : undefined;
    if (!isObject(item) || !name) return [];
    const quantity = clip(item.quantity);
    const foodId = id(item.foodId);
    return [
      {
        id: id(item.id) ?? uid(),
        name,
        ...(quantity ? { quantity } : {}),
        ...(foodId ? { foodId } : {}),
      },
    ];
  });
  const time = str(raw.time);
  const notes = clip(raw.notes, BACKUP_LIMITS.notes);
  return {
    id: id(raw.id) ?? uid(),
    date,
    type: raw.type,
    ...(time && /^\d{2}:\d{2}$/.test(time) ? { time } : {}),
    ...(notes ? { notes } : {}),
    items,
    createdAt: num(raw.createdAt) ?? Date.now(),
    updatedAt: num(raw.updatedAt) ?? Date.now(),
  };
}

/** Todas as marcações de alimento (o `Record` obriga a lista a acompanhar o tipo). */
const FOOD_TAGS: Record<FoodTag, true> = {
  agua: true,
  embutido: true,
  adocada: true,
  salgadinho: true,
  integral: true,
};
const isFoodTag = (v: unknown): v is FoodTag =>
  typeof v === 'string' && Object.hasOwn(FOOD_TAGS, v);

function sanitizeCustomFood(raw: unknown): CustomFood | undefined {
  if (!isObject(raw)) return undefined;
  const foodId = id(raw.id);
  const name = clip(raw.name);
  if (!foodId || !name) return undefined;
  if (!isFoodGroup(raw.group) || !isGrade(raw.grade) || !isNova(raw.nova)) return undefined;
  return {
    id: foodId,
    name,
    group: raw.group,
    grade: raw.grade,
    nova: raw.nova,
    aliases: Array.isArray(raw.aliases)
      ? raw.aliases
          .slice(0, BACKUP_LIMITS.aliases)
          .map((alias) => clip(alias))
          .filter((alias): alias is string => !!alias)
      : [],
    ...(Array.isArray(raw.tags) ? { tags: [...new Set(raw.tags.filter(isFoodTag))] } : {}),
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
  if (!isObject(raw) || !id(raw.id) || !isObject(raw.data)) return undefined;
  if (raw.kind !== 'semanal' && raw.kind !== 'personalizado') return undefined;
  if (!isDate(raw.startDate) || !isDate(raw.endDate) || !isNumber(raw.generatedAt))
    return undefined;
  if (typeof raw.fingerprint !== 'string' || raw.fingerprint.length > BACKUP_LIMITS.notes)
    return undefined;
  if (!isReportData(raw.data)) return undefined;
  // Só os campos conhecidos: o que mais vier no arquivo não vai para o banco.
  const data = raw.data as unknown as SavedReport['data'];
  return {
    id: raw.id as string,
    kind: raw.kind,
    ...(isNumber(raw.weekNumber) ? { weekNumber: raw.weekNumber } : {}),
    startDate: raw.startDate as string,
    endDate: raw.endDate as string,
    generatedAt: raw.generatedAt,
    fingerprint: raw.fingerprint,
    data: { ...data, profileName: data.profileName.slice(0, BACKUP_LIMITS.name) },
  };
}

/** Recusa arquivos grandes demais antes de lê-los (um arquivo enorme travaria o aparelho). */
export async function readBackupFile(file: Blob): Promise<BackupFile> {
  if (file.size > BACKUP_LIMITS.fileBytes) throw new BackupError('tooLarge');
  return parseBackup(await file.text());
}

const tooMany = (v: unknown, max: number) => Array.isArray(v) && v.length > max;

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
  if (
    tooMany(data.meals, BACKUP_LIMITS.meals) ||
    tooMany(data.customFoods, BACKUP_LIMITS.customFoods) ||
    tooMany(data.reports, BACKUP_LIMITS.reports)
  ) {
    throw new BackupError('tooLarge');
  }
  const profileName = isObject(data.profile)
    ? clip(data.profile.name, BACKUP_LIMITS.name)
    : undefined;
  const profile =
    isObject(data.profile) && profileName
      ? { name: profileName, createdAt: num(data.profile.createdAt) ?? Date.now() }
      : undefined;
  const settings = isObject(data.settings)
    ? {
        ...(isDate(data.settings.weekAnchor)
          ? { weekAnchor: data.settings.weekAnchor as string }
          : {}),
        dismissedPeriods: Array.isArray(data.settings.dismissedPeriods)
          ? data.settings.dismissedPeriods
              .slice(0, BACKUP_LIMITS.dismissedPeriods)
              .filter((p): p is string => typeof p === 'string' && p.length <= BACKUP_LIMITS.id)
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
  // Primeiro na cópia de segurança local (ver mirror.ts), depois no banco.
  const undoMeals = mirrorSaveMeals(backup.meals);
  const undoFoods = mirrorSaveFoods(backup.customFoods);
  if (backup.profile && !readMirror().profile) mirrorSaveProfile(backup.profile);
  try {
    await importIntoDb(backup);
  } catch (error) {
    undoMeals();
    undoFoods();
    throw error;
  }
  await migrateReports();
  return {
    meals: backup.meals.length,
    customFoods: backup.customFoods.length,
    reports: backup.reports.length,
  };
}

async function importIntoDb(backup: BackupFile): Promise<void> {
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
}

export async function markBackupDone(): Promise<void> {
  await updateSettings({ lastBackupAt: Date.now() });
}

export function backupFileName(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `eatmate-backup-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.json`;
}
