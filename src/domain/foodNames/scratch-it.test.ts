import { it } from 'vitest';
import { FoodIndex } from '../foodIndex';
import { parseFoodText } from '../parser';

const index = new FoodIndex([], 'it');
const sentences = [
  'ho preso un cappuccino e due fette biscottate',
  'due fette di pane integrale con marmellata',
  "un bicchiere di spremuta d'arancia",
  'una tazza di caffè latte',
  'un piatto di spaghetti al pomodoro',
  "un cucchiaio di olio d'oliva",
  'pizza margherita e una birra',
  'stamattina caffè senza zucchero e un cornetto alla crema',
  'a pranzo pasta al ragù, insalata mista e acqua frizzante',
  'cena: petto di pollo alla griglia con patate al forno e un bicchiere di vino rosso',
  'yogurt greco con frutti di bosco e un cucchiaino di miele',
  'merenda con una mela e una manciata di frutta secca',
  'una fetta di torta di mele e un tè verde',
  'panino al prosciutto crudo e una coca zero',
  'toast prosciutto e formaggio e un succo di frutta',
  'tre biscotti e un bicchiere di latte',
  "un etto di prosciutto cotto, due uova sode e un'insalata di pomodori",
  'aperitivo: uno spritz, patatine e olive',
  'risotto ai funghi e una fettina di vitello',
  'un trancio di pizza e una lattina di aranciata',
  'cotoletta alla milanese con patatine fritte',
  'gelato al pistacchio e un caffè',
  'tagliatelle al ragù e un calice di prosecco',
  'pasta e fagioli, pane e un bicchiere di acqua',
  'due cucchiai di yogurt bianco con avena e semi di chia',
  "un po' di parmigiano grattugiato",
  'pasta col pomodoro e basilico',
  'una barretta proteica e un caffè macchiato',
  'torta al cioccolato fatta in casa',
  "un filo d'olio e uno spicchio d'aglio",
];
it('scratch it', () => {
  for (const s of sentences) {
    const items = parseFoodText(s, index).map(
      (i) => `${i.name}${i.quantity ? ` (${i.quantity})` : ''} → ${i.foodId ?? '??'}`,
    );
    console.log(`${s}\n   ${items.join(' | ')}`);
  }
});
