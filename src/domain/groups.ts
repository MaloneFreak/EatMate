import type { FoodGroup, FoodTag, Grade, Nova } from './types';

export interface FoodGroupInfo {
  group: FoodGroup;
  /**
   * Peso do item no cálculo das médias. Água, café, chá, óleos e molhos
   * entram com meio peso: são consumidos em pequenas quantidades ou
   * acompanham as refeições.
   */
  weight: number;
}

export const FOOD_GROUPS: FoodGroupInfo[] = [
  { group: 'frutas', weight: 1 },
  { group: 'verduras_legumes', weight: 1 },
  { group: 'leguminosas', weight: 1 },
  { group: 'cereais', weight: 1 },
  { group: 'carnes_ovos', weight: 1 },
  { group: 'leite_derivados', weight: 1 },
  { group: 'oleaginosas', weight: 1 },
  { group: 'bebidas', weight: 0.5 },
  { group: 'bebidas_adocadas', weight: 1 },
  { group: 'doces', weight: 1 },
  { group: 'lanches', weight: 1 },
  { group: 'pratos', weight: 1 },
  { group: 'gorduras_molhos', weight: 0.5 },
  { group: 'alcool', weight: 1 },
];

const byGroup = new Map(FOOD_GROUPS.map((g) => [g.group, g]));

export function groupWeight(group: FoodGroup): number {
  return byGroup.get(group)?.weight ?? 1;
}

export function isFoodGroup(value: unknown): value is FoodGroup {
  return typeof value === 'string' && byGroup.has(value as FoodGroup);
}

export type ClassifyKey =
  | 'fruta'
  | 'verdura'
  | 'leguminosa'
  | 'cereal'
  | 'pao'
  | 'carne'
  | 'embutido'
  | 'laticinio'
  | 'oleaginosa'
  | 'bebida'
  | 'adocada'
  | 'doce'
  | 'lanche'
  | 'prato_caseiro'
  | 'prato_pronto'
  | 'gordura'
  | 'alcool';

/** Categorias oferecidas quando o usuário classifica um alimento que o app não reconheceu. */
export interface ClassifyOption {
  /** Chave dos textos da categoria (`messages.classify.options`). */
  key: ClassifyKey;
  group: FoodGroup;
  grade: Grade;
  nova: Nova;
  tags?: FoodTag[];
}

export const CLASSIFY_OPTIONS: ClassifyOption[] = [
  {
    key: 'fruta',
    group: 'frutas',
    grade: 'A',
    nova: 1,
  },
  {
    key: 'verdura',
    group: 'verduras_legumes',
    grade: 'A',
    nova: 1,
  },
  {
    key: 'leguminosa',
    group: 'leguminosas',
    grade: 'A',
    nova: 1,
  },
  {
    key: 'cereal',
    group: 'cereais',
    grade: 'A',
    nova: 1,
  },
  {
    key: 'pao',
    group: 'cereais',
    grade: 'C',
    nova: 3,
  },
  {
    key: 'carne',
    group: 'carnes_ovos',
    grade: 'B',
    nova: 1,
  },
  {
    key: 'embutido',
    group: 'carnes_ovos',
    grade: 'E',
    nova: 4,
    tags: ['embutido'],
  },
  {
    key: 'laticinio',
    group: 'leite_derivados',
    grade: 'C',
    nova: 3,
  },
  {
    key: 'oleaginosa',
    group: 'oleaginosas',
    grade: 'B',
    nova: 1,
  },
  {
    key: 'bebida',
    group: 'bebidas',
    grade: 'A',
    nova: 1,
  },
  {
    key: 'adocada',
    group: 'bebidas_adocadas',
    grade: 'E',
    nova: 4,
    tags: ['adocada'],
  },
  {
    key: 'doce',
    group: 'doces',
    grade: 'E',
    nova: 4,
  },
  {
    key: 'lanche',
    group: 'lanches',
    grade: 'D',
    nova: 4,
  },
  {
    key: 'prato_caseiro',
    group: 'pratos',
    grade: 'B',
    nova: 1,
  },
  {
    key: 'prato_pronto',
    group: 'pratos',
    grade: 'D',
    nova: 4,
  },
  {
    key: 'gordura',
    group: 'gorduras_molhos',
    grade: 'D',
    nova: 2,
  },
  {
    key: 'alcool',
    group: 'alcool',
    grade: 'E',
    nova: 3,
  },
];
