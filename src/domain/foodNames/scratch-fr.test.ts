import { it } from 'vitest';
import { FoodIndex } from '../foodIndex';
import { parseFoodText } from '../parser';

const index = new FoodIndex([], 'fr');
const sentences = [
  'une barre de céréales et une barre protéinée',
  'un plat du jour et un plat de pâtes',
  "deux tranches de pain de mie, du lait de soja et un jus de pomme",
  "un pain aux raisins, un café noisette et un verre de lait d'amande",
  'riz au lait, chocolat au lait et une eau de coco',
  'deux œufs brouillés et une omelette aux champignons',
  'une pizza quatre fromages et une salade de fruits',
  "j'ai mangé des pâtes mais pas de fromage",
  'un sandwich jambon-beurre et un Big Mac avec des frites',
  'un apéro avec des chips et des cacahuètes',
  '100 g de riz et riz 100 g',
  'un verre de lait 2% et une crème au chocolat',
  'galette complète, crêpe au jambon et galettes de riz',
  "une banane et une poignée d'amandes",
  'le petit déjeuner : céréales avec du lait',
  'brochettes de poulet, steak haché et pâtes bolognaise',
  'choucroute garnie, raclette et rösti',
  'un bol de soupe, une tasse de thé et 2 cafés',
  'une cuillère à café de sucre et une cuillerée à soupe de miel',
  "un Kinder Bueno, une glace à l'eau et des chips au paprika",
  "une part de quiche lorraine, des huîtres et du vin blanc",
  'magret de canard, confit de canard et un sandwich au thon',
  "chez moi des spaghetti bolognaise",
  'à 8h un café',
  'au resto : entrecôte, frites et une mousse au chocolat',
  'une demi-baguette, un petit pain et du pain perdu',
  'deux pains au chocolat et trois croissants',
  'une tablette de chocolat et un carré frais',
  'tarte aux fraises, éclair au café et un thé glacé',
  "un sirop de menthe, un diabolo menthe et une menthe à l'eau",
  'bœuf bourguignon et pommes vapeur',
  'pâté de campagne, rillettes et du pâté',
  'lait de coco, crème de coco et noix de coco râpée',
  'yaourt à la fraise, yaourt grec et fromage blanc aux fruits rouges',
  "une bouteille d'eau et une canette de Coca",
  'fèves au lard, pâté chinois et tourtière',
  'un chien chaud et une poutine',
  'deux rôties avec du beurre d\'arachide et un café filtre',
  'un cornet de frites, une fricadelle et une sauce andalouse',
  'nouilles sautées, nems et riz cantonais',
  'bò bún et un thé au jasmin',
  'un tajine de poulet et un couscous merguez',
  'blé d\'Inde et maïs doux',
  'une boîte de thon et une boîte de sardines',
  'gâteau au chocolat, gâteau d\'anniversaire et un muffin',
  'une compote, un petit-suisse et un yaourt à boire',
  'escalope de dinde à la crème et riz',
  'des haricots verts et des haricots rouges',
  'petits pois carottes',
  'poisson pané et purée',
];

it('fr scratch', () => {
  for (const s of sentences) {
    const items = parseFoodText(s, index).map(
      (i) => `${i.name}${i.quantity ? ` (${i.quantity})` : ''} → ${i.foodId ?? '??'}`,
    );
    console.log(`${s}\n   ${items.join(' | ')}`);
  }
});
