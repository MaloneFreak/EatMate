import Dexie, { type EntityTable } from 'dexie';
import type { CustomFood, Meal, SavedReport } from '../domain/types';

export interface KeyValue {
  key: string;
  value: unknown;
}

/**
 * Banco de dados local (IndexedDB). Tudo fica guardado só no aparelho da
 * pessoa — não existe servidor. Por isso o app oferece backup em arquivo.
 */
export class EatMateDB extends Dexie {
  meals!: EntityTable<Meal, 'id'>;
  reports!: EntityTable<SavedReport, 'id'>;
  customFoods!: EntityTable<CustomFood, 'id'>;
  /** Perfil e configurações (chave → valor). */
  kv!: EntityTable<KeyValue, 'key'>;

  constructor(name = 'eatmate') {
    super(name);
    this.version(1).stores({
      meals: 'id, date, type',
      reports: 'id, startDate, endDate',
      customFoods: 'id, name',
      kv: 'key',
    });
  }
}

export const db = new EatMateDB();

/** Identificador único (com alternativa para navegadores sem `crypto.randomUUID`). */
export function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
