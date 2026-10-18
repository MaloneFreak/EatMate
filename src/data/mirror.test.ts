import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from './db';
import { readMirror } from './mirror';
import {
  clearAllData,
  deleteMeal,
  getProfile,
  saveMeal,
  saveProfileName,
  syncWithMirror,
  writeOptions,
} from './repo';

const lunch = { date: '2026-10-18', type: 'almoco' as const, items: [{ name: 'Arroz' }] };

beforeEach(async () => {
  await clearAllData();
});

afterEach(() => {
  writeOptions.timeoutMs = 1500;
});

describe('cópia de segurança local', () => {
  it('guarda cada refeição salva', async () => {
    const meal = await saveMeal(lunch);
    expect(readMirror().meals[meal.id]?.items[0]?.name).toBe('Arroz');
  });

  it('repõe no banco o que ele perdeu (ex.: gravação não confirmada antes de recarregar)', async () => {
    const meal = await saveMeal(lunch);
    await saveProfileName('Pedro');
    // Simula o banco sem os registros, sem passar pelo app.
    await db.meals.clear();
    await db.kv.clear();
    expect(await syncWithMirror()).toBeGreaterThanOrEqual(2);
    expect((await db.meals.get(meal.id))?.items[0]?.name).toBe('Arroz');
    expect((await getProfile())?.name).toBe('Pedro');
  });

  it('não traz de volta uma refeição excluída', async () => {
    const meal = await saveMeal(lunch);
    await deleteMeal(meal.id);
    // A exclusão não chegou ao banco.
    await db.meals.put(meal);
    await syncWithMirror();
    expect(await db.meals.get(meal.id)).toBeUndefined();
  });

  it('copia para a cópia local o que só existe no banco (dados de versões anteriores)', async () => {
    const meal = await saveMeal(lunch);
    localStorage.clear();
    expect(readMirror().meals[meal.id]).toBeUndefined();
    expect(await syncWithMirror()).toBe(0);
    expect(readMirror().meals[meal.id]).toBeDefined();
  });

  it('não deixa a tela esperando quando o banco não confirma a gravação', async () => {
    writeOptions.timeoutMs = 50;
    const put = vi.spyOn(db.meals, 'put').mockReturnValue(new Promise(() => {}) as never);
    const meal = await saveMeal(lunch);
    expect(readMirror().meals[meal.id]).toBeDefined();
    put.mockRestore();
    // Ao abrir o app de novo, a refeição volta para o banco.
    await syncWithMirror();
    expect(await db.meals.get(meal.id)).toBeDefined();
  });

  it('avisa o erro e desfaz a cópia quando o banco recusa a gravação', async () => {
    vi.spyOn(db.meals, 'put').mockRejectedValue(new Error('cheio') as never);
    await expect(saveMeal(lunch)).rejects.toThrow('cheio');
    expect(Object.keys(readMirror().meals)).toHaveLength(0);
  });

  it('apagar todos os dados apaga também a cópia', async () => {
    await saveMeal(lunch);
    await clearAllData();
    expect(Object.keys(readMirror().meals)).toHaveLength(0);
    await syncWithMirror();
    expect(await db.meals.count()).toBe(0);
  });
});
