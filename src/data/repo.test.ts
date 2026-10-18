import { beforeEach, describe, expect, it } from 'vitest';
import { addDays } from '../domain/dates';
import { FoodIndex } from '../domain/foodIndex';
import { CLASSIFY_OPTIONS } from '../domain/groups';
import { exportBackup, importBackup, parseBackup } from './backup';
import { db } from './db';
import {
  classifyFood,
  clearAllData,
  deleteReport,
  ensureWeeklyReports,
  getSettings,
  isReportStale,
  regenerateReport,
  saveMeal,
  saveProfileName,
  saveReportForPeriod,
} from './repo';

async function logDays(start: string, count: number, text = 'Arroz') {
  for (let i = 0; i < count; i++) {
    await saveMeal({
      date: addDays(start, i),
      type: 'almoco',
      items: [{ name: text, foodId: 'arroz' }],
    });
  }
}

beforeEach(async () => {
  await clearAllData();
});

describe('relatórios semanais automáticos', () => {
  it('só começam depois de 7 dias registrados', async () => {
    await logDays('2026-10-01', 6);
    expect(await ensureWeeklyReports('2026-10-20')).toHaveLength(0);
    await logDays('2026-10-07', 1);
    const created = await ensureWeeklyReports('2026-10-20');
    expect(created.map((r) => [r.weekNumber, r.startDate, r.endDate])).toEqual([
      [1, '2026-10-01', '2026-10-07'],
    ]);
    expect((await getSettings()).weekAnchor).toBe('2026-10-01');
  });

  it('não duplica e não recria relatórios excluídos', async () => {
    await saveProfileName('Pedro');
    await logDays('2026-10-01', 14);
    expect(await ensureWeeklyReports('2026-10-15')).toHaveLength(2);
    expect(await ensureWeeklyReports('2026-10-15')).toHaveLength(0);
    const first = (await db.reports.toArray()).find((r) => r.weekNumber === 1)!;
    expect(first.data.profileName).toBe('Pedro');
    await deleteReport(first.id);
    expect(await ensureWeeklyReports('2026-10-15')).toHaveLength(0);
    expect(await db.reports.count()).toBe(1);
  });

  it('detecta relatório desatualizado e gera novamente', async () => {
    await logDays('2026-10-01', 7);
    const [report] = await ensureWeeklyReports('2026-10-08');
    const index = new FoodIndex();
    expect(isReportStale(report!, await db.meals.toArray(), index)).toBe(false);

    await saveMeal({
      date: '2026-10-03',
      type: 'jantar',
      items: [{ name: 'Refrigerante', foodId: 'refrigerante' }],
    });
    expect(isReportStale(report!, await db.meals.toArray(), index)).toBe(true);

    const regenerated = await regenerateReport(report!.id);
    expect(regenerated?.id).toBe(report!.id);
    expect(regenerated?.weekNumber).toBe(1);
    expect(isReportStale(regenerated!, await db.meals.toArray(), index)).toBe(false);
    expect(regenerated?.data.mealsCount).toBe(8);
  });

  it('salvar um período existente atualiza em vez de duplicar', async () => {
    await logDays('2026-10-01', 7);
    const period = { start: '2026-10-02', end: '2026-10-08' };
    const a = await saveReportForPeriod(period);
    const b = await saveReportForPeriod(period);
    expect(a.id).toBe(b.id);
    expect(a.kind).toBe('personalizado');
    expect(await db.reports.count()).toBe(1);
  });
});

describe('alimentos personalizados', () => {
  it('classifica um alimento desconhecido e reaproveita pelo nome', async () => {
    const fruta = CLASSIFY_OPTIONS.find((o) => o.key === 'fruta')!;
    const doce = CLASSIFY_OPTIONS.find((o) => o.key === 'doce')!;
    const a = await classifyFood('Cambuci', fruta);
    const b = await classifyFood('cambuci', doce);
    expect(b.id).toBe(a.id);
    expect(b.grade).toBe('E');
    expect(await db.customFoods.count()).toBe(1);
  });
});

describe('backup', () => {
  it('exporta e importa sem perder dados', async () => {
    await saveProfileName('Pedro');
    await logDays('2026-10-01', 8);
    await classifyFood('Cambuci', CLASSIFY_OPTIONS[0]!);
    await ensureWeeklyReports('2026-10-09');
    const backup = await exportBackup();

    await clearAllData();
    const summary = await importBackup(parseBackup(JSON.stringify(backup)));
    expect(summary).toEqual({ meals: 8, customFoods: 1, reports: 1 });
    expect(await db.meals.count()).toBe(8);
    expect((await db.kv.get('profile'))?.value).toMatchObject({ name: 'Pedro' });

    // Importar de novo não duplica.
    await importBackup(parseBackup(JSON.stringify(backup)));
    expect(await db.meals.count()).toBe(8);
  });

  it('recusa arquivos que não são backup', () => {
    expect(() => parseBackup('não é json')).toThrow(/JSON inválido/);
    expect(() => parseBackup('{"foo": 1}')).toThrow(/não parece ser um backup/);
  });

  it('ignora registros inválidos', () => {
    const parsed = parseBackup(
      JSON.stringify({
        app: 'eatmate',
        meals: [
          { id: 'ok', date: '2026-10-01', type: 'almoco', items: [{ name: 'Arroz' }] },
          { id: 'bad-date', date: '01/10/2026', type: 'almoco', items: [] },
          { id: 'bad-type', date: '2026-10-01', type: 'brunch', items: [] },
        ],
      }),
    );
    expect(parsed.meals.map((m) => m.id)).toEqual(['ok']);
  });
});

describe('backup com relatórios corrompidos', () => {
  it('descarta relatórios com estrutura inválida e mantém os válidos', async () => {
    await saveProfileName('Pedro');
    await logDays('2026-10-01', 8);
    await ensureWeeklyReports('2026-10-09');
    const backup = await exportBackup();
    const valid = backup.reports[0]!;
    const broken = { ...valid, id: 'quebrado', data: { ...valid.data, score: { total: 'muito' } } };
    const parsed = parseBackup(
      JSON.stringify({ ...backup, reports: [valid, broken, { id: 'x' }] }),
    );
    expect(parsed.reports.map((r) => r.id)).toEqual([valid.id]);
  });
});
