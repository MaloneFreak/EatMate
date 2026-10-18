/** Nota de qualidade nutricional, na escala A (melhor) a E (pior), inspirada no Nutri-Score. */
export type Grade = 'A' | 'B' | 'C' | 'D' | 'E';

/**
 * Grau de processamento segundo a classificação NOVA, usada no
 * Guia Alimentar para a População Brasileira:
 * 1 = in natura ou minimamente processado, 2 = ingrediente culinário,
 * 3 = processado, 4 = ultraprocessado.
 */
export type Nova = 1 | 2 | 3 | 4;

export type MealType = 'cafe_manha' | 'lanche_manha' | 'almoco' | 'cafe_tarde' | 'jantar' | 'ceia';

export type FoodGroup =
  | 'frutas'
  | 'verduras_legumes'
  | 'leguminosas'
  | 'cereais'
  | 'carnes_ovos'
  | 'leite_derivados'
  | 'oleaginosas'
  | 'bebidas'
  | 'bebidas_adocadas'
  | 'doces'
  | 'lanches'
  | 'pratos'
  | 'gorduras_molhos'
  | 'alcool';

/**
 * Marcadores usados nos destaques do relatório:
 * - agua: água
 * - embutido: hambúrguer e embutidos (presunto, salsicha, linguiça...)
 * - adocada: refrigerantes, sucos industrializados e outras bebidas com açúcar
 * - salgadinho: salgadinhos de pacote, biscoitos salgados e macarrão instantâneo
 * - integral: cereais integrais
 */
export type FoodTag = 'agua' | 'embutido' | 'adocada' | 'salgadinho' | 'integral';

export interface Food {
  id: string;
  name: string;
  group: FoodGroup;
  grade: Grade;
  nova: Nova;
  aliases?: string[];
  tags?: FoodTag[];
  /**
   * O alimento "absorve" um complemento iniciado por "de":
   * "bolo de cenoura" vira um único item chamado "Bolo de cenoura"
   * (em vez de "Bolo" + "Cenoura").
   */
  absorbs?: boolean;
}

/** Alimento criado pelo usuário ao classificar um item que o app não reconheceu. */
export interface CustomFood extends Food {
  custom: true;
  createdAt: number;
}

export interface MealItem {
  id: string;
  /** Nome exibido, ex.: "Torrada" ou "Bolo de cenoura". */
  name: string;
  /** Quantidade livre, ex.: "2 fatias". */
  quantity?: string;
  /** Alimento reconhecido (da base do app ou personalizado). Sem ele, o item fica sem classificação. */
  foodId?: string;
}

export interface Meal {
  id: string;
  /** Data local no formato AAAA-MM-DD. */
  date: string;
  /** Horário no formato HH:mm (opcional). */
  time?: string;
  type: MealType;
  items: MealItem[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Profile {
  name: string;
  createdAt: number;
}

export type ScoreComponentKey =
  'qualidade' | 'processamento' | 'frutas_verduras' | 'variedade' | 'regularidade';

export interface ScoreComponent {
  key: ScoreComponentKey;
  label: string;
  /** Peso do componente na nota final (0–1). */
  weight: number;
  /** Pontuação do componente (0–100). */
  score: number;
  detail: string;
}

export interface ScoreResult {
  /** Nota final (0–100). */
  total: number;
  grade: Grade;
  components: ScoreComponent[];
}

export interface MarkerResult {
  key: 'feijao' | 'frutas' | 'verduras' | 'embutidos' | 'adocadas' | 'salgadinhos' | 'doces';
  label: string;
  /** "bom" = queremos que apareça; "evitar" = queremos que apareça pouco. */
  kind: 'bom' | 'evitar';
  days: number;
  count: number;
}

export interface ReportDiaryItem {
  name: string;
  quantity?: string;
  grade?: Grade;
}

export interface ReportDiaryMeal {
  type: MealType;
  time?: string;
  notes?: string;
  items: ReportDiaryItem[];
}

export interface ReportDay {
  date: string;
  mealsCount: number;
  itemsCount: number;
  score: number | null;
  grade: Grade | null;
  meals: ReportDiaryMeal[];
}

export interface ReportData {
  /** Versão do algoritmo que gerou o relatório. */
  version: number;
  profileName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  registeredDays: number;
  mealsCount: number;
  itemsCount: number;
  classifiedCount: number;
  unclassified: string[];
  score: ScoreResult | null;
  gradeDistribution: Record<Grade, number>;
  novaDistribution: Record<Nova, number>;
  groups: { group: FoodGroup; count: number; days: number }[];
  markers: MarkerResult[];
  mealRegularity: { type: MealType; days: number }[];
  topFoods: { name: string; count: number; grade?: Grade }[];
  positives: string[];
  attention: string[];
  fruitsAndVegetablesPerDay: number;
  ultraProcessedShare: number;
  distinctFoods: number;
  days: ReportDay[];
  previous: { startDate: string; endDate: string; score: number; grade: Grade } | null;
}

export type ReportKind = 'semanal' | 'personalizado';

export interface SavedReport {
  id: string;
  kind: ReportKind;
  weekNumber?: number;
  startDate: string;
  endDate: string;
  generatedAt: number;
  /** Impressão digital dos registros do período no momento da geração (detecta relatórios desatualizados). */
  fingerprint: string;
  data: ReportData;
}

export interface AppSettings {
  /** Primeiro dia da "Semana 1" dos relatórios automáticos. */
  weekAnchor?: string;
  /** Períodos (início_fim) de relatórios semanais excluídos pelo usuário — não são recriados automaticamente. */
  dismissedPeriods: string[];
  lastBackupAt?: number;
}
