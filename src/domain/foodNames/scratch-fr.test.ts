import { it } from 'vitest';
import { FoodIndex } from '../foodIndex';
import { parseFoodText } from '../parser';

const index = new FoodIndex([], 'fr');
const sentences = [
  "j'ai pris un café au lait et deux tartines",
  'deux tranches de pain complet avec du beurre',
  "un verre de jus d'orange",
  'une tasse de café au lait',
  "une cuillère à soupe d'huile d'olive",
  'steak frites',
  'un yaourt nature',
  "au petit-déj : un pain au chocolat, un croissant au beurre et un jus d'orange pressé",
  "p'tit déj : biscottes, confiture de fraises et thé à la menthe",
  'ce midi une salade de chèvre chaud et une crème brûlée',
  'ce soir des pâtes à la carbonara, un verre de vin rouge et une boule de glace à la vanille',
  'gâteau aux carottes et un café sucré',
  'poulet rôti, haricots verts et purée de pommes de terre',
  'un croque-monsieur, une tarte aux pommes et un Coca zéro',
  'des moules frites et une bière pression',
  "j'ai mangé des lentilles, du riz complet et un œuf au plat",
  'une poutine et une liqueur douce',
  'deux pintes de bière et un paquet de chips',
  'au goûter : un carré de chocolat noir 70% et une pomme',
  'blanquette de veau, riz basmati et un fromage blanc',
  'un grand verre de lait demi-écrémé avec des céréales',
  'une barre de céréales et un smoothie banane fraise',
  'un kebab frites et un Orangina',
  'soupe de légumes, pain de campagne et un morceau de comté',
  "j'ai bu deux verres d'eau gazeuse et un thé vert",
  'une crêpe au Nutella et un chocolat chaud',
  'saumon fumé, avocat et quinoa',
  'filet de poulet, brocolis et une compote de pommes',
  'un pot-au-feu et une part de tarte au citron',
  'pâtes au saumon avec de la crème fraîche',
];

it('fr scratch', () => {
  for (const s of sentences) {
    const items = parseFoodText(s, index).map(
      (i) => `${i.name}${i.quantity ? ` (${i.quantity})` : ''} → ${i.foodId ?? '??'}`,
    );
    console.log(`${s}\n   ${items.join(' | ')}`);
  }
});
