import type { FoodGroup, FoodTag, Grade, Nova } from './types';

export interface FoodGroupInfo {
  group: FoodGroup;
  label: string;
  /**
   * Peso do item no cálculo das médias. Água, café, chá, óleos e molhos
   * entram com meio peso: são consumidos em pequenas quantidades ou
   * acompanham as refeições.
   */
  weight: number;
}

export const FOOD_GROUPS: FoodGroupInfo[] = [
  { group: 'frutas', label: 'Frutas', weight: 1 },
  { group: 'verduras_legumes', label: 'Verduras e legumes', weight: 1 },
  { group: 'leguminosas', label: 'Feijões e leguminosas', weight: 1 },
  { group: 'cereais', label: 'Cereais, pães, raízes e tubérculos', weight: 1 },
  { group: 'carnes_ovos', label: 'Carnes, peixes e ovos', weight: 1 },
  { group: 'leite_derivados', label: 'Leite e derivados', weight: 1 },
  { group: 'oleaginosas', label: 'Castanhas e sementes', weight: 1 },
  { group: 'bebidas', label: 'Água, café e chás', weight: 0.5 },
  { group: 'bebidas_adocadas', label: 'Sucos e bebidas adoçadas', weight: 1 },
  { group: 'doces', label: 'Doces e guloseimas', weight: 1 },
  { group: 'lanches', label: 'Lanches, salgados e fast food', weight: 1 },
  { group: 'pratos', label: 'Pratos e preparações', weight: 1 },
  { group: 'gorduras_molhos', label: 'Óleos, gorduras e molhos', weight: 0.5 },
  { group: 'alcool', label: 'Bebidas alcoólicas', weight: 1 },
];

const byGroup = new Map(FOOD_GROUPS.map((g) => [g.group, g]));

export function groupLabel(group: FoodGroup): string {
  return byGroup.get(group)?.label ?? group;
}

export function groupWeight(group: FoodGroup): number {
  return byGroup.get(group)?.weight ?? 1;
}

export function isFoodGroup(value: unknown): value is FoodGroup {
  return typeof value === 'string' && byGroup.has(value as FoodGroup);
}

/** Categorias oferecidas quando o usuário classifica um alimento que o app não reconheceu. */
export interface ClassifyOption {
  key: string;
  label: string;
  examples: string;
  group: FoodGroup;
  grade: Grade;
  nova: Nova;
  tags?: FoodTag[];
}

export const CLASSIFY_OPTIONS: ClassifyOption[] = [
  {
    key: 'fruta',
    label: 'Fruta',
    examples: 'banana, maçã, manga',
    group: 'frutas',
    grade: 'A',
    nova: 1,
  },
  {
    key: 'verdura',
    label: 'Verdura ou legume',
    examples: 'alface, cenoura, abobrinha',
    group: 'verduras_legumes',
    grade: 'A',
    nova: 1,
  },
  {
    key: 'leguminosa',
    label: 'Feijão ou leguminosa',
    examples: 'feijão, lentilha, grão-de-bico',
    group: 'leguminosas',
    grade: 'A',
    nova: 1,
  },
  {
    key: 'cereal',
    label: 'Arroz, massa, raiz ou tubérculo',
    examples: 'arroz, macarrão, mandioca',
    group: 'cereais',
    grade: 'A',
    nova: 1,
  },
  {
    key: 'pao',
    label: 'Pão, torrada ou bolacha salgada',
    examples: 'pão francês, torrada',
    group: 'cereais',
    grade: 'C',
    nova: 3,
  },
  {
    key: 'carne',
    label: 'Carne, frango, peixe ou ovo',
    examples: 'bife, frango, tilápia, ovo',
    group: 'carnes_ovos',
    grade: 'B',
    nova: 1,
  },
  {
    key: 'embutido',
    label: 'Embutido',
    examples: 'presunto, salsicha, linguiça',
    group: 'carnes_ovos',
    grade: 'E',
    nova: 4,
    tags: ['embutido'],
  },
  {
    key: 'laticinio',
    label: 'Leite, iogurte ou queijo',
    examples: 'leite, iogurte, queijo',
    group: 'leite_derivados',
    grade: 'C',
    nova: 3,
  },
  {
    key: 'oleaginosa',
    label: 'Castanha ou semente',
    examples: 'castanha, amendoim, chia',
    group: 'oleaginosas',
    grade: 'B',
    nova: 1,
  },
  {
    key: 'bebida',
    label: 'Água, café ou chá sem açúcar',
    examples: 'água, café, chá',
    group: 'bebidas',
    grade: 'A',
    nova: 1,
  },
  {
    key: 'adocada',
    label: 'Suco ou bebida adoçada',
    examples: 'refrigerante, suco de caixinha',
    group: 'bebidas_adocadas',
    grade: 'E',
    nova: 4,
    tags: ['adocada'],
  },
  {
    key: 'doce',
    label: 'Doce ou sobremesa',
    examples: 'bolo, chocolate, pudim',
    group: 'doces',
    grade: 'E',
    nova: 4,
  },
  {
    key: 'lanche',
    label: 'Lanche, salgado ou fast food',
    examples: 'coxinha, hambúrguer, pizza',
    group: 'lanches',
    grade: 'D',
    nova: 4,
  },
  {
    key: 'prato_caseiro',
    label: 'Prato caseiro',
    examples: 'feito em casa com alimentos frescos',
    group: 'pratos',
    grade: 'B',
    nova: 1,
  },
  {
    key: 'prato_pronto',
    label: 'Prato pronto ou congelado',
    examples: 'lasanha congelada, sopa de pacote',
    group: 'pratos',
    grade: 'D',
    nova: 4,
  },
  {
    key: 'gordura',
    label: 'Molho, óleo ou gordura',
    examples: 'maionese, manteiga, azeite',
    group: 'gorduras_molhos',
    grade: 'D',
    nova: 2,
  },
  {
    key: 'alcool',
    label: 'Bebida alcoólica',
    examples: 'cerveja, vinho, caipirinha',
    group: 'alcool',
    grade: 'E',
    nova: 3,
  },
];

export const NOVA_LABELS: Record<Nova, string> = {
  1: 'In natura ou minimamente processados',
  2: 'Ingredientes culinários (óleos, açúcar, manteiga)',
  3: 'Processados',
  4: 'Ultraprocessados',
};
