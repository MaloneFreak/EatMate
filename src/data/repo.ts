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
import { REPORT_VERSION, buildReport } from '../domain/report';
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
import {
  clearMirror,
  mirrorDeleteFood,
  mirrorDeleteMeals,
  mirrorSaveFoods,
  mirrorSaveMeals,
  mirrorSaveProfile,
  mirrorSaveSettings,
  readMirror,
  writeMirror,
  type Undo,
} from './mirror';

const PROFILE_KEY = 'profile';
const SETTINGS_KEY = 'settings';

const DEFAULT_SETTINGS: AppSettings = { dismissedPeriods: [] };

// ---------------------------------------------------------------- Gravação

/** Quanto esperar a confirmação do banco antes de seguir (o registro já está na cópia local). */
export const writeOptions = { timeoutMs: 1500 };

/**
 * Espera a gravação no banco, que já foi feita antes na cópia de segurança local
 * (mirror.ts). Se o banco demorar mais que `writeOptions.timeoutMs` (acontece no
 * Safari do iPhone), segue assim mesmo: o registro está garantido na cópia e volta
 * para o banco em `syncWithMirror`. Se o banco recusar a gravação, a cópia é
 * desfeita e o erro chega à tela.
 */
async function commit(write: Promise<unknown>, undo: Undo): Promise<void> {
  let timedOut = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const confirmed = write.then(
    () => undefined,
    (error: unknown) => {
      if (!timedOut) {
        undo();
        throw error;
      }
      // A tela já seguiu: a cópia local continua valendo e o banco é refeito a partir dela.
      console.error('A gravação atrasada falhou; repondo a partir da cópia local', error);
      void syncWithMirror().catch(() => {});
    },
  );
  const timeout = new Promise<void>((resolve) => {
    timer = setTimeout(() => {
      timedOut = true;
      resolve();
    }, writeOptions.timeoutMs);
  });
  try {
    await Promise.race([confirmed, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

/** Leitura que não pode travar a tela: sem resposta em pouco tempo, segue sem ela. */
async function quickly<T>(read: Promise<T>, ms = 1000): Promise<T | undefined> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      read,
      new Promise<undefined>((resolve) => {
        timer = setTimeout(() => resolve(undefined), ms);
      }),
    ]);
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------- Perfil

export async function getProfile(): Promise<Profile | undefined> {
  return (await db.kv.get(PROFILE_KEY))?.value as Profile | undefined;
}

export async function saveProfileName(name: string): Promise<Profile> {
  const current = readMirror().profile ?? (await quickly(getProfile()));
  const profile: Profile = { name: name.trim(), createdAt: current?.createdAt ?? Date.now() };
  mirrorSaveProfile(profile);
  await commit(db.kv.put({ key: PROFILE_KEY, value: profile }), () => {});
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

/** Também é usada dentro de transações, por isso grava no banco sem limite de tempo. */
export async function updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const settings = { ...(await getSettings()), ...patch };
  mirrorSaveSettings(settings);
  await db.kv.put({ key: SETTINGS_KEY, value: settings });
  return settings;
}

// ---------------------------------------------------------------- Refeições

export type MealInput = Omit<Meal, 'id' | 'createdAt' | 'updatedAt' | 'items'> & {
  id?: string;
  items: (Omit<MealItem, 'id'> & { id?: string })[];
};

export async function saveMeal(input: MealInput): Promise<Meal> {
  const existing = input.id
    ? (readMirror().meals[input.id] ?? (await quickly(db.meals.get(input.id))))
    : undefined;
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
  const undo = mirrorSaveMeals([meal]);
  await commit(db.meals.put(meal), undo);
  return meal;
}

export async function deleteMeal(id: string): Promise<void> {
  const undo = mirrorDeleteMeals([id]);
  await commit(db.meals.delete(id), undo);
}

export async function deleteDay(date: string): Promise<number> {
  const fromMirror = Object.values(readMirror().meals)
    .filter((m) => m.date === date)
    .map((m) => m.id);
  const fromDb = (await quickly(db.meals.where('date').equals(date).primaryKeys())) ?? [];
  const ids = [...new Set([...fromMirror, ...fromDb])];
  const undo = mirrorDeleteMeals(ids);
  await commit(db.meals.bulkDelete(ids), undo);
  return ids.length;
}

// ---------------------------------------------------------------- Alimentos personalizados

/** Cria (ou atualiza) um alimento personalizado a partir de uma categoria escolhida pela pessoa. */
export async function classifyFood(name: string, option: ClassifyOption): Promise<CustomFood> {
  const trimmed = name.trim();
  const sameName = (f: CustomFood) => f.name.toLowerCase() === trimmed.toLowerCase();
  const existing =
    Object.values(readMirror().customFoods).find(sameName) ??
    (await quickly(db.customFoods.toArray()))?.find(sameName);
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
  const undo = mirrorSaveFoods([food]);
  await commit(db.customFoods.put(food), undo);
  return food;
}

export async function deleteCustomFood(id: string): Promise<void> {
  const undo = mirrorDeleteFood(id);
  await commit(db.customFoods.delete(id), undo);
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
  await migrateReports();
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

/**
 * Gera novamente os relatórios salvos em um formato antigo (por exemplo, os da
 * versão 1, que guardavam os textos em português), mantendo período e título.
 */
export async function migrateReports(): Promise<number> {
  return db.transaction('rw', [db.meals, db.reports, db.customFoods, db.kv], async () => {
    const outdated = (await db.reports.toArray()).filter((r) => r.data.version !== REPORT_VERSION);
    if (!outdated.length) return 0;
    const context = await loadContext();
    await db.reports.bulkPut(
      outdated.map((r) =>
        makeReport(context, { start: r.startDate, end: r.endDate }, r.kind, r.weekNumber, r.id),
      ),
    );
    return outdated.length;
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
  const write = db.transaction('rw', [db.reports, db.kv], async () => {
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
  // Relatórios não ficam na cópia local (são gerados de novo a partir das refeições).
  await commit(write, () => {});
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
  clearMirror();
  await db.transaction('rw', [db.meals, db.reports, db.customFoods, db.kv], async () => {
    await Promise.all([
      db.meals.clear(),
      db.reports.clear(),
      db.customFoods.clear(),
      db.kv.clear(),
    ]);
  });
}

// ---------------------------------------------------------------- Cópia de segurança local

/**
 * Acerta o banco com a cópia de segurança local (ao abrir o app e ao voltar para ele):
 * repõe no banco o que ele perdeu ou não chegou a gravar, e guarda na cópia o que só
 * existe no banco (por exemplo, registros feitos antes desta versão do app).
 * Devolve quantas mudanças foram feitas no banco.
 */
export async function syncWithMirror(): Promise<number> {
  const mirror = readMirror();
  const [meals, foods, profileRow, settingsRow] = await Promise.all([
    db.meals.toArray(),
    db.customFoods.toArray(),
    db.kv.get(PROFILE_KEY),
    db.kv.get(SETTINGS_KEY),
  ]);

  // Cópia → banco
  const mealsById = new Map(meals.map((m) => [m.id, m]));
  const putMeals = Object.values(mirror.meals).filter((m) => {
    const current = mealsById.get(m.id);
    return !current || current.updatedAt < m.updatedAt;
  });
  const dropMeals = Object.entries(mirror.deletedMeals)
    .filter(([id, at]) => {
      const current = mealsById.get(id);
      return !!current && current.updatedAt <= at;
    })
    .map(([id]) => id);
  const foodIds = new Set(foods.map((f) => f.id));
  const putFoods = Object.values(mirror.customFoods).filter((f) => !foodIds.has(f.id));
  const dropFoods = Object.keys(mirror.deletedFoods).filter((id) => foodIds.has(id));
  // Perfil e configurações só voltam se sumiram do banco: a cópia lida acima pode ser
  // anterior a uma mudança feita enquanto o banco respondia (ex.: início da Semana 1).
  const putProfile = !!mirror.profile && !profileRow;
  const putSettings = !!mirror.settings && !settingsRow;

  const changes =
    putMeals.length +
    dropMeals.length +
    putFoods.length +
    dropFoods.length +
    (putProfile ? 1 : 0) +
    (putSettings ? 1 : 0);
  if (changes) {
    await db.transaction('rw', [db.meals, db.customFoods, db.kv], async () => {
      if (putMeals.length) await db.meals.bulkPut(putMeals);
      if (dropMeals.length) await db.meals.bulkDelete(dropMeals);
      if (putFoods.length) await db.customFoods.bulkPut(putFoods);
      if (dropFoods.length) await db.customFoods.bulkDelete(dropFoods);
      if (putProfile) await db.kv.put({ key: PROFILE_KEY, value: mirror.profile });
      if (putSettings) await db.kv.put({ key: SETTINGS_KEY, value: mirror.settings });
    });
  }

  // Banco → cópia (lida de novo: pode ter mudado enquanto o banco respondia)
  const updated = readMirror();
  for (const meal of meals) {
    const deletedAt = updated.deletedMeals[meal.id];
    if (deletedAt !== undefined && meal.updatedAt <= deletedAt) continue;
    const current = updated.meals[meal.id];
    if (!current || current.updatedAt < meal.updatedAt) updated.meals[meal.id] = meal;
  }
  for (const food of foods) {
    if (!updated.customFoods[food.id] && updated.deletedFoods[food.id] === undefined) {
      updated.customFoods[food.id] = food;
    }
  }
  if (!updated.profile && profileRow) updated.profile = profileRow.value as Profile;
  if (!updated.settings && settingsRow) updated.settings = settingsRow.value as AppSettings;
  writeMirror(updated);
  return changes;
}
