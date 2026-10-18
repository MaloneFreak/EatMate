import type { AppSettings, CustomFood, Meal, Profile } from '../domain/types';

/*
 * Cópia de segurança automática dos registros no localStorage.
 *
 * O banco principal é o IndexedDB, mas em alguns aparelhos (principalmente
 * Safari no iPhone) ele às vezes demora ou deixa de confirmar uma gravação.
 * Se o app recarregar nessa hora (por exemplo, numa atualização), o registro
 * se perderia. Por isso cada alteração vai primeiro para esta cópia, gravada
 * na hora, e ao abrir o app tudo o que falta no banco é reposto a partir dela
 * (ver `syncWithMirror` em repo.ts). Relatórios não entram: são gerados de
 * novo a partir das refeições.
 */

const KEY = 'eatmate:mirror';

export interface Mirror {
  version: 1;
  meals: Record<string, Meal>;
  /** id → quando a refeição foi excluída (para ela não voltar ao repor). */
  deletedMeals: Record<string, number>;
  customFoods: Record<string, CustomFood>;
  deletedFoods: Record<string, number>;
  profile?: Profile;
  settings?: AppSettings;
}

/** Desfaz uma mudança na cópia (quando a gravação no banco falha de verdade). */
export type Undo = () => void;

const empty = (): Mirror => ({
  version: 1,
  meals: {},
  deletedMeals: {},
  customFoods: {},
  deletedFoods: {},
});

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export function readMirror(): Mirror {
  try {
    const raw = localStorage.getItem(KEY);
    const data: unknown = raw ? JSON.parse(raw) : null;
    if (!isRecord(data) || data.version !== 1) return empty();
    const map = <T>(v: unknown) => (isRecord(v) ? (v as Record<string, T>) : {});
    return {
      version: 1,
      meals: map<Meal>(data.meals),
      deletedMeals: map<number>(data.deletedMeals),
      customFoods: map<CustomFood>(data.customFoods),
      deletedFoods: map<number>(data.deletedFoods),
      ...(isRecord(data.profile) ? { profile: data.profile as unknown as Profile } : {}),
      ...(isRecord(data.settings) ? { settings: data.settings as unknown as AppSettings } : {}),
    };
  } catch {
    return empty();
  }
}

export function writeMirror(mirror: Mirror): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(mirror));
  } catch (error) {
    // Sem espaço ou sem localStorage: o banco principal continua valendo.
    console.warn('Não foi possível atualizar a cópia de segurança local', error);
  }
}

/** Aplica uma mudança; `apply` devolve como desfazê-la sobre a cópia mais recente. */
function change(apply: (mirror: Mirror) => (current: Mirror) => void): Undo {
  const mirror = readMirror();
  const revert = apply(mirror);
  writeMirror(mirror);
  return () => {
    const current = readMirror();
    revert(current);
    writeMirror(current);
  };
}

/** Volta uma chave ao valor anterior (ou a remove, se não existia). */
function restore<T>(map: Record<string, T>, key: string, previous: T | undefined) {
  if (previous === undefined) delete map[key];
  else map[key] = previous;
}

export function mirrorSaveMeals(meals: Meal[]): Undo {
  return change((m) => {
    const before = meals.map((meal) => [m.meals[meal.id], m.deletedMeals[meal.id]] as const);
    for (const meal of meals) {
      m.meals[meal.id] = meal;
      delete m.deletedMeals[meal.id];
    }
    return (current) =>
      meals.forEach((meal, i) => {
        restore(current.meals, meal.id, before[i]![0]);
        restore(current.deletedMeals, meal.id, before[i]![1]);
      });
  });
}

export function mirrorDeleteMeals(ids: string[], at = Date.now()): Undo {
  return change((m) => {
    const before = ids.map((id) => [m.meals[id], m.deletedMeals[id]] as const);
    for (const id of ids) {
      delete m.meals[id];
      m.deletedMeals[id] = at;
    }
    return (current) =>
      ids.forEach((id, i) => {
        restore(current.meals, id, before[i]![0]);
        restore(current.deletedMeals, id, before[i]![1]);
      });
  });
}

export function mirrorSaveFoods(foods: CustomFood[]): Undo {
  return change((m) => {
    const before = foods.map((food) => [m.customFoods[food.id], m.deletedFoods[food.id]] as const);
    for (const food of foods) {
      m.customFoods[food.id] = food;
      delete m.deletedFoods[food.id];
    }
    return (current) =>
      foods.forEach((food, i) => {
        restore(current.customFoods, food.id, before[i]![0]);
        restore(current.deletedFoods, food.id, before[i]![1]);
      });
  });
}

export function mirrorDeleteFood(id: string, at = Date.now()): Undo {
  return change((m) => {
    const before = [m.customFoods[id], m.deletedFoods[id]] as const;
    delete m.customFoods[id];
    m.deletedFoods[id] = at;
    return (current) => {
      restore(current.customFoods, id, before[0]);
      restore(current.deletedFoods, id, before[1]);
    };
  });
}

export function mirrorSaveProfile(profile: Profile): void {
  const mirror = readMirror();
  mirror.profile = profile;
  writeMirror(mirror);
}

export function mirrorSaveSettings(settings: AppSettings): void {
  const mirror = readMirror();
  mirror.settings = settings;
  writeMirror(mirror);
}

export function clearMirror(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Sem localStorage: nada a apagar.
  }
}
