import { todayISO } from '../domain/dates';
import { FoodIndex } from '../domain/foodIndex';
import type { ClassifyOption } from '../domain/groups';
import {
  UNLOCK_DAYS,
  completedWeeksWithData,
  periodFingerprint,
  periodKey,
  registeredDates,
  weekOf,
  type Period,
} from '../domain/periods';
import { buildReport } from '../domain/report';
import type {
  AppSettings,
  CustomFood,
  Meal,
  MealItem,
  Profile,
  ReportKind,
  SavedReport,
} from '../domain/types';
import { db, uid } from './db';

const PROFILE_KEY = 'profile';
const SETTINGS_KEY = 'settings';

const DEFAULT_SETTINGS: AppSettings = { dismissedPeriods: [] };

// ---------------------------------------------------------------- Perfil

export async function getProfile(): Promise<Profile | undefined> {
  return (await db.kv.get(PROFILE_KEY))?.value as Profile | undefined;
}

export async function saveProfileName(name: string): Promise<Profile> {
  const current = await getProfile();
  const profile: Profile = { name: name.trim(), createdAt: current?.createdAt ?? Date.now() };
  await db.kv.put({ key: PROFILE_KEY, value: profile });
  return profile;
}

/** Pede ao navegador para não apagar os dados quando faltar espaço (quando suportado). */
export async function requestPersistentStorage(): Promise<void> {
  try {
    await navigator.storage?.persist?.();
  } catch {
    // Sem suporte: tudo bem, os dados continuam salvos normalmente.
  }
}

// ---------------------------------------------------------------- Configurações

export async function getSettings(): Promise<AppSettings> {
  const stored = (await db.kv.get(SETTINGS_KEY))?.value as Partial<AppSettings> | undefined;
  return { ...DEFAULT_SETTINGS, ...stored, dismissedPeriods: stored?.dismissedPeriods ?? [] };
}

export async function updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const settings = { ...(await getSettings()), ...patch };
  await db.kv.put({ key: SETTINGS_KEY, value: settings });
  return settings;
}

// ---------------------------------------------------------------- Refeições

export type MealInput = Omit<Meal, 'id' | 'createdAt' | 'updatedAt' | 'items'> & {
  id?: string;
  items: (Omit<MealItem, 'id'> & { id?: string })[];
};

export async function saveMeal(input: MealInput): Promise<Meal> {
  const existing = input.id ? await db.meals.get(input.id) : undefined;
  const now = Date.now();
  const notes = input.notes?.trim();
  const meal: Meal = {
    id: existing?.id ?? input.id ?? uid(),
    date: input.date,
    type: input.type,
    ...(input.time ? { time: input.time } : {}),
    ...(notes ? { notes } : {}),
    items: input.items
      .map((item) => ({
        id: item.id ?? uid(),
        name: item.name.trim(),
        ...(item.quantity?.trim() ? { quantity: item.quantity.trim() } : {}),
        ...(item.foodId ? { foodId: item.foodId } : {}),
      }))
      .filter((item) => item.name),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await db.meals.put(meal);
  return meal;
}

export async function deleteMeal(id: string): Promise<void> {
  await db.meals.delete(id);
}

export async function deleteDay(date: string): Promise<number> {
  return db.meals.where('date').equals(date).delete();
}

// ---------------------------------------------------------------- Alimentos personalizados

/** Cria (ou atualiza) um alimento personalizado a partir de uma categoria escolhida pela pessoa. */
export async function classifyFood(name: string, option: ClassifyOption): Promise<CustomFood> {
  const trimmed = name.trim();
  const existing = (await db.customFoods.toArray()).find(
    (f) => f.name.toLowerCase() === trimmed.toLowerCase(),
  );
  const food: CustomFood = {
    id: existing?.id ?? `custom_${uid()}`,
    name: trimmed,
    group: option.group,
    grade: option.grade,
    nova: option.nova,
    aliases: existing?.aliases ?? [],
    ...(option.tags ? { tags: option.tags } : {}),
    custom: true,
    createdAt: existing?.createdAt ?? Date.now(),
  };
  await db.customFoods.put(food);
  return food;
}

export async function deleteCustomFood(id: string): Promise<void> {
  await db.customFoods.delete(id);
}

// ---------------------------------------------------------------- Relatórios

async function loadContext() {
  const [meals, customFoods, profile] = await Promise.all([
    db.meals.toArray(),
    db.customFoods.toArray(),
    getProfile(),
  ]);
  return { meals, index: new FoodIndex(customFoods), profileName: profile?.name ?? '' };
}

function makeReport(
  context: Awaited<ReturnType<typeof loadContext>>,
  period: Period,
  kind: ReportKind,
  weekNumber: number | undefined,
  id = uid(),
): SavedReport {
  return {
    id,
    kind,
    ...(weekNumber ? { weekNumber } : {}),
    startDate: period.start,
    endDate: period.end,
    generatedAt: Date.now(),
    fingerprint: periodFingerprint(context.meals, context.index, period),
    data: buildReport({ ...context, period }),
  };
}

/**
 * Cria automaticamente o relatório de cada semana encerrada (Semana 1, 2, …),
 * a partir do momento em que a pessoa tem 7 dias registrados.
 * Relatórios excluídos pela pessoa não são recriados.
 */
export async function ensureWeeklyReports(today: string = todayISO()): Promise<SavedReport[]> {
  return db.transaction('rw', [db.meals, db.reports, db.customFoods, db.kv], async () => {
    const context = await loadContext();
    const dates = registeredDates(context.meals);
    if (dates.length < UNLOCK_DAYS) return [];
    let settings = await getSettings();
    if (!settings.weekAnchor) settings = await updateSettings({ weekAnchor: dates[0] });
    const anchor = settings.weekAnchor!;
    const existing = new Set(
      (await db.reports.toArray()).map((r) => periodKey({ start: r.startDate, end: r.endDate })),
    );
    const dismissed = new Set(settings.dismissedPeriods);
    const created = completedWeeksWithData(anchor, dates, today)
      .filter((week) => !existing.has(periodKey(week)) && !dismissed.has(periodKey(week)))
      .map((week) => makeReport(context, week, 'semanal', week.number));
    if (created.length) await db.reports.bulkAdd(created);
    return created;
  });
}

/** Salva (ou atualiza, se já existir um relatório do mesmo período) o relatório de um período. */
export async function saveReportForPeriod(period: Period): Promise<SavedReport> {
  return db.transaction('rw', [db.meals, db.reports, db.customFoods, db.kv], async () => {
    const context = await loadContext();
    const settings = await getSettings();
    const existing = (await db.reports.toArray()).find(
      (r) => r.startDate === period.start && r.endDate === period.end,
    );
    const week = settings.weekAnchor ? weekOf(settings.weekAnchor, period.start) : undefined;
    const isWeek = !!week && week.start === period.start && week.number > 0;
    const report = makeReport(
      context,
      period,
      existing?.kind ?? (isWeek ? 'semanal' : 'personalizado'),
      existing?.weekNumber ?? (isWeek ? week.number : undefined),
      existing?.id,
    );
    await db.reports.put(report);
    const key = periodKey(period);
    if (settings.dismissedPeriods.includes(key)) {
      await updateSettings({
        dismissedPeriods: settings.dismissedPeriods.filter((k) => k !== key),
      });
    }
    return report;
  });
}

/** Gera novamente um relatório salvo, com os dados atuais do mesmo período. */
export async function regenerateReport(id: string): Promise<SavedReport | undefined> {
  const report = await db.reports.get(id);
  if (!report) return undefined;
  return saveReportForPeriod({ start: report.startDate, end: report.endDate });
}

export async function deleteReport(id: string): Promise<void> {
  await db.transaction('rw', [db.reports, db.kv], async () => {
    const report = await db.reports.get(id);
    if (!report) return;
    await db.reports.delete(id);
    if (report.kind === 'semanal') {
      const settings = await getSettings();
      const key = periodKey({ start: report.startDate, end: report.endDate });
      if (!settings.dismissedPeriods.includes(key)) {
        await updateSettings({ dismissedPeriods: [...settings.dismissedPeriods, key] });
      }
    }
  });
}

/** O relatório está desatualizado se os registros do período mudaram depois que ele foi gerado. */
export function isReportStale(report: SavedReport, meals: Meal[], index: FoodIndex): boolean {
  return (
    report.fingerprint !==
    periodFingerprint(meals, index, { start: report.startDate, end: report.endDate })
  );
}

// ---------------------------------------------------------------- Tudo

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', [db.meals, db.reports, db.customFoods, db.kv], async () => {
    await Promise.all([
      db.meals.clear(),
      db.reports.clear(),
      db.customFoods.clear(),
      db.kv.clear(),
    ]);
  });
}
