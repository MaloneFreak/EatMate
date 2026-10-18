import { addDays } from './dates';
import type { FoodIndex } from './foodIndex';
import type { Meal, MealType } from './types';

/** Uma semana fictícia (e bem brasileira) para o "relatório de exemplo", em ids da base. */
const DEMO_WEEK: [MealType, string, string][][] = [
  [
    ['cafe_manha', '07:30', 'cafe_com_leite pao_frances manteiga mamao'],
    ['almoco', '12:30', 'arroz feijao frango salada tomate agua'],
    ['cafe_tarde', '16:00', 'iogurte banana'],
    ['jantar', '20:00', 'sopa torrada'],
  ],
  [
    ['cafe_manha', '07:15', 'cafe tapioca queijo'],
    ['almoco', '12:45', 'arroz feijao carne abobrinha suco_natural'],
    ['cafe_tarde', '16:30', 'biscoito_recheado cafe'],
    ['jantar', '20:30', 'pizza refrigerante'],
  ],
  [
    ['cafe_manha', '07:00', 'cafe_com_leite pao_integral ovo_mexido'],
    ['almoco', '12:00', 'arroz_integral lentilha peixe brocolis cenoura agua'],
    ['cafe_tarde', '15:30', 'maca castanhas'],
    ['jantar', '19:45', 'omelete salada'],
  ],
  [
    ['cafe_manha', '07:40', 'achocolatado pao_forma requeijao'],
    ['lanche_manha', '10:00', 'banana'],
    ['almoco', '13:00', 'massa_molho salada refrigerante'],
    ['cafe_tarde', '16:00', 'coxinha suco_caixinha'],
    ['jantar', '20:00', 'arroz feijao ovo_frito couve'],
  ],
  [
    ['cafe_manha', '07:20', 'cafe cuscuz ovo'],
    ['almoco', '12:30', 'arroz feijao carne_moida chuchu beterraba agua'],
    ['cafe_tarde', '16:15', 'vitamina'],
    ['jantar', '20:15', 'sanduiche_natural suco_natural'],
  ],
  [
    ['cafe_manha', '09:00', 'cafe_com_leite pao_de_queijo'],
    ['almoco', '13:30', 'feijoada arroz couve farofa laranja cerveja'],
    ['cafe_tarde', '17:00', 'bolo cafe'],
    ['jantar', '21:00', 'hamburguer batata_frita refrigerante'],
  ],
  [
    ['cafe_manha', '08:00', 'cafe pao_frances queijo_minas mamao'],
    ['almoco', '12:30', 'arroz feijao frango batata salada agua'],
    ['cafe_tarde', '16:00', 'pipoca'],
    ['jantar', '19:30', 'sopa pao_integral'],
    ['ceia', '22:00', 'cha'],
  ],
];

/** Refeições fictícias dos 7 dias que terminam em `endDate`, com os nomes no idioma do índice. */
export function buildDemoMeals(endDate: string, index: FoodIndex): Meal[] {
  const start = addDays(endDate, -(DEMO_WEEK.length - 1));
  const now = Date.now();
  return DEMO_WEEK.flatMap((day, d) =>
    day.map(([type, time, ids], m) => ({
      id: `demo-${d}-${m}`,
      date: addDays(start, d),
      time,
      type,
      items: ids.split(' ').map((foodId, i) => ({
        id: `demo-${d}-${m}-${i}`,
        name: index.get(foodId)?.name ?? foodId,
        foodId,
      })),
      createdAt: now,
      updatedAt: now,
    })),
  );
}
