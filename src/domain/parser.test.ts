import { describe, expect, it } from 'vitest';
import { FoodIndex } from './foodIndex';
import type { Language } from './language';
import { parseFoodText, splitTyping } from './parser';

const index = new FoodIndex();
const parse = (text: string) =>
  parseFoodText(text, index).map((i) => ({ name: i.name, foodId: i.foodId, quantity: i.quantity }));
const names = (text: string) => parseFoodText(text, index).map((i) => i.name);

describe('parseFoodText', () => {
  it('entende frases do dia a dia', () => {
    expect(names('tomei café e comi torradas')).toEqual(['Café', 'Torrada']);
    expect(names('Tomei café da manhã com pão e manteiga')).toEqual(['Pão', 'Manteiga']);
    expect(names('arroz, feijão, bife e salada')).toEqual(['Arroz', 'Feijão', 'Bife', 'Salada']);
  });

  it('reconhece nomes compostos antes das palavras isoladas', () => {
    expect(parse('café com leite')).toEqual([
      { name: 'Café com leite', foodId: 'cafe_com_leite', quantity: undefined },
    ]);
    expect(names('pão de queijo')).toEqual(['Pão de queijo']);
    expect(names('batata doce e batata frita')).toEqual(['Batata-doce', 'Batata frita']);
    expect(names('arroz integral')).toEqual(['Arroz integral']);
    expect(names('romeu e julieta')).toEqual(['Romeu e julieta']);
  });

  it('ignora acentos, maiúsculas e plural', () => {
    expect(parse('PAES')[0]?.foodId).toBe('pao_frances');
    expect(parse('ovos mexidos')[0]?.foodId).toBe('ovo_mexido');
    expect(parse('limoes')[0]?.foodId).toBe('limao');
    expect(parse('2 pães franceses')).toEqual([
      { name: 'Pão francês', foodId: 'pao_frances', quantity: '2' },
    ]);
    expect(parse('pastéis')[0]?.foodId).toBe('pastel');
  });

  it('extrai quantidades', () => {
    expect(parse('2 fatias de pão integral com requeijão')).toEqual([
      { name: 'Pão integral', foodId: 'pao_integral', quantity: '2 fatias' },
      { name: 'Requeijão', foodId: 'requeijao', quantity: undefined },
    ]);
    expect(parse('um copo de suco de laranja')[0]).toEqual({
      name: 'Suco de laranja',
      foodId: 'suco_natural',
      quantity: '1 copo',
    });
    expect(parse('meia xícara de aveia')[0]?.quantity).toBe('meia xícara');
    expect(parse('1 colher de sopa de azeite')[0]).toEqual({
      name: 'Azeite',
      foodId: 'azeite',
      quantity: '1 colher de sopa',
    });
    expect(parse('arroz 100g')[0]?.quantity).toBe('100 g');
    expect(parse('1,5 copo de leite')[0]?.quantity).toBe('1,5 copo');
    expect(parse('um pouco de arroz')[0]).toEqual({
      name: 'Arroz',
      foodId: 'arroz',
      quantity: undefined,
    });
  });

  it('junta complementos com "de" em alimentos que descrevem sabor', () => {
    expect(parse('bolo de cenoura')).toEqual([
      { name: 'Bolo de cenoura', foodId: 'bolo', quantity: undefined },
    ]);
    expect(names('suco de acerola e pizza de calabresa')).toEqual([
      'Suco de acerola',
      'Pizza de calabresa',
    ]);
    expect(names('chá de camomila')).toEqual(['Chá de camomila']);
    expect(names('suco de limao')).toEqual(['Suco de limão']);
    expect(names('sorvete de chocolate com calda')).toEqual(['Sorvete de chocolate', 'Calda']);
  });

  it('separa "café da manhã" (refeição) de "café" (bebida)', () => {
    expect(names('no café da manhã comi tapioca')).toEqual(['Tapioca']);
    expect(names('café da tarde: café e bolo')).toEqual(['Café', 'Bolo']);
  });

  it('mantém detalhes ditos logo depois do alimento', () => {
    expect(names('frango temperado')).toEqual(['Frango temperado']);
    expect(names('arroz bem soltinho e feijão')).toEqual(['Arroz', 'Feijão']);
  });

  it('cria itens sem classificação para o que não conhece', () => {
    expect(parse('comi xpto e arroz')).toEqual([
      { name: 'Xpto', foodId: undefined, quantity: undefined },
      { name: 'Arroz', foodId: 'arroz', quantity: undefined },
    ]);
    expect(parse('2 coisas estranhas')).toEqual([
      { name: 'Coisas estranhas', foodId: undefined, quantity: '2' },
    ]);
    expect(names('comi qualquercoisa, fruta')).toEqual(['Qualquercoisa', 'Fruta']);
  });

  it('não cria itens só com palavras de ligação', () => {
    expect(parse('almoço')).toEqual([]);
    expect(parse('comi um pouco')).toEqual([]);
    expect(parse('')).toEqual([]);
  });

  it('usa os nomes populares', () => {
    expect(parse('x-tudo com fritas e coca')).toEqual([
      { name: 'X-tudo', foodId: 'hamburguer', quantity: undefined },
      { name: 'Fritas', foodId: 'batata_frita', quantity: undefined },
      { name: 'Coca', foodId: 'refrigerante', quantity: undefined },
    ]);
    expect(parse('coca zero')[0]?.foodId).toBe('refrigerante_zero');
    expect(parse('miojo')[0]?.foodId).toBe('miojo');
  });
});

describe('splitTyping', () => {
  it('isola o alimento que está sendo digitado', () => {
    expect(splitTyping('arroz, fei', 'pt')).toEqual({ done: 'arroz,', leading: '', query: 'fei' });
    expect(splitTyping('pão com mant', 'pt')).toEqual({
      done: 'pão com ',
      leading: '',
      query: 'mant',
    });
    expect(splitTyping('tomei café e comi torr', 'pt')).toEqual({
      done: 'tomei café e ',
      leading: 'comi',
      query: 'torr',
    });
    expect(splitTyping('2 fatias de pã', 'pt')).toEqual({
      done: '',
      leading: '2 fatias de',
      query: 'pã',
    });
    expect(splitTyping('banana', 'pt')).toEqual({ done: '', leading: '', query: 'banana' });
  });
});

describe('parseFoodText em inglês', () => {
  const en = new FoodIndex([], 'en');
  const parseEn = (text: string) =>
    parseFoodText(text, en).map((i) => [i.name, i.foodId, i.quantity]);

  it('entende frases, quantidades e unidades', () => {
    expect(parseEn('I had a cup of coffee and two slices of toast')).toEqual([
      ['Coffee', 'cafe', '1 cup'],
      ['Toast', 'torrada', '2 slices'],
    ]);
    expect(parseEn('a bowl of oatmeal with banana and honey')).toEqual([
      ['Oatmeal', 'aveia', '1 bowl'],
      ['Banana', 'banana', undefined],
      ['Honey', 'mel', undefined],
    ]);
  });

  it('mantém os detalhes que vêm antes do alimento', () => {
    expect(parseEn('grilled chicken, rice and beans')).toEqual([
      ['Grilled chicken', 'frango', undefined],
      ['Rice', 'arroz', undefined],
      ['Beans', 'feijao', undefined],
    ]);
    expect(parseEn('carrot cake')).toEqual([['Carrot cake', 'bolo', undefined]]);
  });

  it('ignora o nome da refeição', () => {
    expect(parseEn('for lunch I ate a tuna sandwich')).toEqual([
      ['Tuna sandwich', 'sanduiche_natural', '1'],
    ]);
    expect(parseEn('afternoon tea with scones').map(([, id]) => id)).toEqual(['pao_doce']);
  });

  it('isola o alimento que está sendo digitado', () => {
    expect(splitTyping('coffee and two slices of to', 'en')).toEqual({
      done: 'coffee and ',
      leading: 'two slices of',
      query: 'to',
    });
  });
});

describe('palavras compostas em alemão', () => {
  it('reconhece o alimento pela última parte da palavra', () => {
    const de = new FoodIndex([], 'de');
    const [item] = parseFoodText('Kirschkuchen', de);
    expect(de.lookup('Kuchen')?.food.id).toBe('bolo');
    expect(item?.foodId).toBe('bolo');
    expect(item?.name).toBe('Kirschkuchen');
    // Finais curtos, que a regra de plural mudaria na palavra inteira.
    const ids = (text: string) => parseFoodText(text, de).map((i) => i.foodId);
    expect(ids('Ziegenkäse, Kräutertee und Rotwein')).toEqual(['queijo', 'cha', 'vinho']);
    expect(ids('Himbeeren')).toEqual(['frutas_vermelhas']);
  });
});

describe('complementos e unidades em outros idiomas', () => {
  const parseIn = (language: Language, text: string) =>
    parseFoodText(text, new FoodIndex([], language)).map((i) => [i.name, i.foodId, i.quantity]);

  it('mantém o plural e o apóstrofo do complemento', () => {
    expect(parseIn('fr', 'gâteau aux carottes')).toEqual([
      ['Gâteau aux carottes', 'bolo', undefined],
    ]);
    expect(parseIn('it', "una fetta di torta all'arancia")).toEqual([
      ["Torta all'arancia", 'bolo', '1 fetta'],
    ]);
    expect(parseIn('pt', 'suco de limao')).toEqual([['Suco de limão', 'suco_natural', undefined]]);
  });

  it('não trata como unidade o começo do nome de um alimento', () => {
    expect(parseIn('fr', 'un pot-au-feu')[0]?.[0]).toBe('Pot-au-feu');
  });
});
