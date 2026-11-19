import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addDays } from '../domain/dates';
import { FoodIndex } from '../domain/foodIndex';
import { CLASSIFY_OPTIONS } from '../domain/groups';
import {
  BACKUP_LIMITS,
  BackupError,
  exportBackup,
  importBackup,
  parseBackup,
  readBackupFile,
} from './backup';
import { db } from './db';
import {
  classifyFood,
  clearAllData,
  deleteReport,
  ensureWeeklyReports,
  getSettings,
  isReportStale,
  migrateReports,
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

describe('relatórios da versão 1', () => {
  it('são gerados novamente no formato atual, mantendo o título', async () => {
    await logDays('2026-10-01', 7);
    const [report] = await ensureWeeklyReports('2026-10-08');
    // Formato antigo: textos prontos em português.
    const legacy = {
      ...report!,
      data: {
        ...report!.data,
        version: 1,
        positives: ['Boa variedade.'],
        attention: ['Poucas frutas.'],
      },
    };
    await db.reports.put(legacy as unknown as typeof report & object);
    expect(await migrateReports()).toBe(1);
    const migrated = await db.reports.get(report!.id);
    expect(migrated?.data.version).toBe(2);
    expect(migrated?.weekNumber).toBe(1);
    expect(migrated?.data.attention.every((i) => typeof i.key === 'string')).toBe(true);
    expect(await migrateReports()).toBe(0);
  });

  it('são aceitos ao importar um backup antigo', async () => {
    await logDays('2026-10-01', 7);
    const [report] = await ensureWeeklyReports('2026-10-08');
    const backup = await exportBackup();
    const old = JSON.parse(JSON.stringify(backup));
    old.reports[0].data.version = 1;
    old.reports[0].data.positives = ['Boa variedade.'];
    await importBackup(parseBackup(JSON.stringify(old)));
    expect((await db.reports.get(report!.id))?.data.version).toBe(2);
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
    // Os registros do arquivo já estão num backup: o lembrete só conta o que vier depois.
    expect((await getSettings()).lastBackupAt).toBe(Date.parse(backup.exportedAt));

    // Importar de novo não duplica.
    await importBackup(parseBackup(JSON.stringify(backup)));
    expect(await db.meals.count()).toBe(8);
  });

  it('recusa arquivos que não são backup', () => {
    expect(() => parseBackup('não é json')).toThrow(new BackupError('invalidJson'));
    expect(() => parseBackup('{"foo": 1}')).toThrow(new BackupError('notEatmate'));
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

  it('recusa arquivos grandes demais antes de ler', async () => {
    const file = { size: BACKUP_LIMITS.fileBytes + 1, text: vi.fn() } as unknown as Blob;
    await expect(readBackupFile(file)).rejects.toThrow(new BackupError('tooLarge'));
    expect(file.text).not.toHaveBeenCalled();
  });

  it('recusa backups com registros demais', () => {
    const meals = Array.from({ length: BACKUP_LIMITS.meals + 1 }, () => ({}));
    expect(() => parseBackup(JSON.stringify({ app: 'eatmate', meals }))).toThrow(
      new BackupError('tooLarge'),
    );
  });

  it('corta textos longos e descarta campos desconhecidos', () => {
    const long = 'x'.repeat(10_000);
    const parsed = parseBackup(
      JSON.stringify({
        app: 'eatmate',
        profile: { name: long },
        meals: [
          {
            id: long,
            date: '2026-10-01',
            type: 'almoco',
            notes: long,
            items: [{ name: long, quantity: long, foodId: long }],
          },
        ],
        customFoods: [
          {
            id: 'f1',
            name: 'Cambuci',
            group: 'frutas',
            grade: 'A',
            nova: 1,
            aliases: [long, 42],
            tags: ['agua', 'inventada', 'agua'],
          },
        ],
      }),
    );
    expect(parsed.profile?.name).toHaveLength(BACKUP_LIMITS.name);
    const meal = parsed.meals[0]!;
    expect(meal.id).not.toBe(long);
    expect(meal.notes).toHaveLength(BACKUP_LIMITS.notes);
    expect(meal.items[0]!.name).toHaveLength(BACKUP_LIMITS.text);
    expect(meal.items[0]!.quantity).toHaveLength(BACKUP_LIMITS.text);
    expect(meal.items[0]!.foodId).toBeUndefined();
    const food = parsed.customFoods[0]!;
    expect(food.aliases).toEqual(['x'.repeat(BACKUP_LIMITS.text)]);
    expect(food.tags).toEqual(['agua']);
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
