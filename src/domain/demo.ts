import { addDays } from './dates';
import type { FoodIndex } from './foodIndex';
import { parseFoodText } from './parser';
import type { Meal, MealType } from './types';

/** Uma semana fictícia (e bem brasileira) para o "relatório de exemplo". */
const DEMO_WEEK: [MealType, string, string][][] = [
  [
    ['cafe_manha', '07:30', 'café com leite, pão francês com manteiga, mamão'],
    ['almoco', '12:30', 'arroz, feijão, frango grelhado, salada de alface e tomate, água'],
    ['cafe_tarde', '16:00', 'iogurte, banana'],
    ['jantar', '20:00', 'sopa de legumes, torrada'],
  ],
  [
    ['cafe_manha', '07:15', 'café, tapioca com queijo'],
    ['almoco', '12:45', 'arroz, feijão, bife acebolado, abobrinha refogada, suco de laranja'],
    ['cafe_tarde', '16:30', 'biscoito recheado, café'],
    ['jantar', '20:30', 'pizza de calabresa, refrigerante'],
  ],
  [
    ['cafe_manha', '07:00', 'café com leite, 2 fatias de pão integral, ovo mexido'],
    ['almoco', '12:00', 'arroz integral, lentilha, peixe assado, brócolis, cenoura, água'],
    ['cafe_tarde', '15:30', 'maçã, castanhas'],
    ['jantar', '19:45', 'omelete, salada'],
  ],
  [
    ['cafe_manha', '07:40', 'achocolatado, bisnaguinha com requeijão'],
    ['lanche_manha', '10:00', 'banana'],
    ['almoco', '13:00', 'macarronada, salada, refrigerante'],
    ['cafe_tarde', '16:00', 'coxinha, suco de caixinha'],
    ['jantar', '20:00', 'arroz, feijão, ovo frito, couve'],
  ],
  [
    ['cafe_manha', '07:20', 'café, cuscuz com ovo'],
    ['almoco', '12:30', 'arroz, feijão, carne moída, chuchu, beterraba, água'],
    ['cafe_tarde', '16:15', 'vitamina de banana'],
    ['jantar', '20:15', 'sanduíche natural, suco de maracujá'],
  ],
  [
    ['cafe_manha', '09:00', 'café com leite, pão de queijo'],
    ['almoco', '13:30', 'feijoada, arroz, couve, farofa, laranja, cerveja'],
    ['cafe_tarde', '17:00', 'bolo de fubá, café'],
    ['jantar', '21:00', 'x-salada, batata frita, coca'],
  ],
  [
    ['cafe_manha', '08:00', 'café, pão francês, queijo minas, mamão'],
    ['almoco', '12:30', 'arroz, feijão, frango assado, batata, salada, água'],
    ['cafe_tarde', '16:00', 'pipoca'],
    ['jantar', '19:30', 'sopa de legumes, pão integral'],
    ['ceia', '22:00', 'chá de camomila'],
  ],
];

/** Refeições fictícias dos 7 dias que terminam em `endDate`. */
export function buildDemoMeals(endDate: string, index: FoodIndex): Meal[] {
  const start = addDays(endDate, -(DEMO_WEEK.length - 1));
  const now = Date.now();
  return DEMO_WEEK.flatMap((day, d) =>
    day.map(([type, time, text], m) => ({
      id: `demo-${d}-${m}`,
      date: addDays(start, d),
      time,
      type,
      items: parseFoodText(text, index).map((item, i) => ({ id: `demo-${d}-${m}-${i}`, ...item })),
      createdAt: now,
      updatedAt: now,
    })),
  );
}
