import { it } from 'vitest';
import { FoodIndex } from '../foodIndex';
import { parseFoodText } from '../parser';

const index = new FoodIndex([], 'it');
const sentences = [
  'spaghetti alla carbonara e pasta al forno',
  'un cappuccino e una brioche al bar',
  'latte macchiato con zucchero',
  'tè freddo alla pesca e caffè d\'orzo',
  'uovo al tegamino con pancetta',
  'bistecca ai ferri con insalata',
  'un trancio di salmone al forno con verdure grigliate',
  'filetto di branzino e minestrone di verdure',
  'zuppa di pesce e una scatoletta di tonno',
  'insalata di riso',
  'un pacchetto di patatine e una porzione di patatine fritte',
  'hamburger con patatine e Coca-Cola',
  'un panino con la mortadella',
  'pane e Nutella',
  'una piadina con prosciutto crudo e squacquerone',
  'una tazza di latte con cereali',
  'un ghiacciolo al limone e due palline di gelato',
  'una fetta di crostata alla marmellata',
  'un pezzo di parmigiano e carote crude',
  'polpette al sugo e zucchine grigliate',
  'ho bevuto due litri d\'acqua',
  'un amaro dopo cena e un\'aranciata',
  'mezzo litro di vino e una pinta di birra',
  'una tisana alla camomilla',
  'una banana, un kiwi, tre mandarini e due arance',
  'pomodori e mozzarella',
  'bruschette al pomodoro',
  'riso in bianco con olio',
  'uova strapazzate col bacon',
  'pollo al curry con riso basmati',
  'una fetta di pandoro e un bicchiere di prosecco',
  'un negroni e crostini con paté',
  'ho mangiato una pesca e del pesce',
  'una pera e una mela',
  'due fette biscottate integrali con miele',
  'caffè con un goccio di latte',
  'un succo di frutta alla pesca',
  'frittata di zucchine e pane tostato',
  'cornetto vuoto e caffè amaro',
  'una barretta proteica e una barretta di cioccolato',
  'gnocchi al pesto',
  'un piatto di pasta con le zucchine',
  'un cono al pistacchio',
  'una coppetta di gelato',
];
it('scratch it', () => {
  for (const s of sentences) {
    const items = parseFoodText(s, index).map(
      (i) => `${i.name}${i.quantity ? ` (${i.quantity})` : ''} → ${i.foodId ?? '??'}`,
    );
    console.log(`${s}\n   ${items.join(' | ')}`);
  }
});
