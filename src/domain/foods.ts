import { FOOD_NAMES } from './foodNames';
import { INTERNATIONAL_NAMES } from './foodNames/international';
import { LANGUAGE_RULES } from './lang';
import type { Language } from './language';
import { foodKey } from './text';
import type { Food, FoodGroup, FoodTag, Grade, Nova } from './types';

/*
 * Base de alimentos do EatMate.
 *
 * Cada alimento tem:
 * - nota (A–E): estimativa da qualidade nutricional típica, inspirada no
 *   algoritmo do Nutri-Score (açúcar, gordura saturada, sal e calorias pesam
 *   contra; fibras, proteínas, frutas, verduras e leguminosas pesam a favor);
 * - NOVA (1–4): grau de processamento, como no Guia Alimentar para a
 *   População Brasileira (Ministério da Saúde, 2014);
 * - apelidos: outros nomes pelos quais o alimento é reconhecido no texto.
 *
 * As notas são aproximações para alimentos e pratos "típicos" — a ideia é
 * avaliar o padrão da alimentação ao longo da semana, não um produto
 * específico. Para corrigir ou incluir alimentos, basta editar a lista abaixo
 * (os testes verificam se há apelidos repetidos).
 */

interface Extra {
  tags?: FoodTag[];
  /** Absorve um complemento com "de": "bolo de cenoura" vira um único item. */
  absorbs?: boolean;
}

const food = (
  id: string,
  name: string,
  group: FoodGroup,
  grade: Grade,
  nova: Nova,
  aliases: string[] = [],
  extra: Extra = {},
): Food => ({ id, name, group, grade, nova, aliases, ...extra });

const absorbs = { absorbs: true } as const;

const frutas: Food[] = [
  food('banana', 'Banana', 'frutas', 'A', 1, ['banana prata', 'banana nanica', 'banana maçã', 'banana da terra', 'banana ouro']),
  food('maca', 'Maçã', 'frutas', 'A', 1, ['maçã verde', 'maçã gala', 'maçã fuji']),
  food('laranja', 'Laranja', 'frutas', 'A', 1, ['laranja pera', 'laranja lima', 'laranja bahia', 'toranja', 'grapefruit']),
  food('mexerica', 'Mexerica', 'frutas', 'A', 1, ['tangerina', 'bergamota', 'ponkan', 'murcote']),
  food('mamao', 'Mamão', 'frutas', 'A', 1, ['papaia', 'papaya', 'mamão papaia', 'mamão formosa']),
  food('manga', 'Manga', 'frutas', 'A', 1, ['manga palmer', 'manga tommy', 'manga espada']),
  food('abacaxi', 'Abacaxi', 'frutas', 'A', 1, ['ananás']),
  food('melancia', 'Melancia', 'frutas', 'A', 1),
  food('melao', 'Melão', 'frutas', 'A', 1),
  food('uva', 'Uva', 'frutas', 'A', 1, ['uva verde', 'uva roxa', 'uva thompson']),
  food('morango', 'Morango', 'frutas', 'A', 1),
  food('goiaba', 'Goiaba', 'frutas', 'A', 1),
  food('maracuja', 'Maracujá', 'frutas', 'A', 1),
  food('abacate', 'Abacate', 'frutas', 'A', 1, ['avocado']),
  food('kiwi', 'Kiwi', 'frutas', 'A', 1),
  food('pera', 'Pera', 'frutas', 'A', 1),
  food('pessego', 'Pêssego', 'frutas', 'A', 1),
  food('nectarina', 'Nectarina', 'frutas', 'A', 1),
  food('ameixa', 'Ameixa', 'frutas', 'A', 1, ['ameixa fresca']),
  food('nespera', 'Nêspera', 'frutas', 'A', 1, ['ameixa amarela']),
  food('caqui', 'Caqui', 'frutas', 'A', 1),
  food('acerola', 'Acerola', 'frutas', 'A', 1),
  food('jabuticaba', 'Jabuticaba', 'frutas', 'A', 1),
  food('caju', 'Caju', 'frutas', 'A', 1),
  food('pitanga', 'Pitanga', 'frutas', 'A', 1),
  food('carambola', 'Carambola', 'frutas', 'A', 1),
  food('graviola', 'Graviola', 'frutas', 'A', 1),
  food('cupuacu', 'Cupuaçu', 'frutas', 'A', 1),
  food('limao', 'Limão', 'frutas', 'A', 1, ['lima']),
  food('figo', 'Figo', 'frutas', 'A', 1),
  food('roma', 'Romã', 'frutas', 'A', 1),
  food('pitaya', 'Pitaya', 'frutas', 'A', 1, ['pitaia']),
  food('lichia', 'Lichia', 'frutas', 'A', 1),
  food('umbu', 'Umbu', 'frutas', 'A', 1),
  food('caja', 'Cajá', 'frutas', 'A', 1),
  food('seriguela', 'Seriguela', 'frutas', 'A', 1, ['siriguela']),
  food('tamarindo', 'Tamarindo', 'frutas', 'A', 1),
  food('mangaba', 'Mangaba', 'frutas', 'A', 1),
  food('sapoti', 'Sapoti', 'frutas', 'A', 1),
  food('jaca', 'Jaca', 'frutas', 'A', 1, ['jaca mole', 'jaca dura', 'carne de jaca']),
  food('pinha', 'Pinha', 'frutas', 'A', 1, ['fruta-do-conde', 'ata', 'atemoia', 'condessa']),
  food('frutas_vermelhas', 'Frutas vermelhas', 'frutas', 'A', 1, ['framboesa', 'amora', 'mirtilo', 'blueberry', 'cereja']),
  food('coco', 'Coco', 'frutas', 'C', 1, ['coco fresco', 'coco ralado']),
  food('fruta', 'Fruta', 'frutas', 'A', 1, ['fruta da estação', 'fruta picada', 'bacuri', 'buriti', 'cambuci', 'jambo', 'mangostão', 'rambutã', 'pequi', 'abiu', 'jenipapo', 'murici', 'ingá', 'cabeludinha', 'uvaia', 'grumixama', 'cagaita', 'araçá', 'bacaba', 'tucumã', 'pupunha', 'feijoa', 'goiaba-serrana', 'jatobá', 'jamelão']),
  food('salada_frutas', 'Salada de frutas', 'frutas', 'A', 1),
  food('polpa_acai', 'Polpa de açaí sem açúcar', 'frutas', 'A', 1, ['açaí puro', 'açaí sem açúcar', 'polpa de açaí']),
  food('frutas_secas', 'Frutas secas', 'frutas', 'B', 1, ['uva-passa', 'passas', 'ameixa seca', 'damasco', 'damasco seco', 'tâmara', 'banana-passa']),
];

const verduras: Food[] = [
  food('alface', 'Alface', 'verduras_legumes', 'A', 1, ['alface americana', 'alface crespa', 'alface roxa']),
  food('tomate', 'Tomate', 'verduras_legumes', 'A', 1, ['tomate cereja', 'tomate seco']),
  food('cenoura', 'Cenoura', 'verduras_legumes', 'A', 1, ['cenoura ralada', 'cenoura cozida']),
  food('beterraba', 'Beterraba', 'verduras_legumes', 'A', 1),
  food('pepino', 'Pepino', 'verduras_legumes', 'A', 1),
  food('brocolis', 'Brócolis', 'verduras_legumes', 'A', 1, ['brócolis no vapor', 'brócolis cozido', 'brócolis refogado']),
  food('couve', 'Couve', 'verduras_legumes', 'A', 1, ['couve manteiga', 'couve refogada']),
  food('couve_flor', 'Couve-flor', 'verduras_legumes', 'A', 1),
  food('repolho', 'Repolho', 'verduras_legumes', 'A', 1, ['repolho roxo', 'repolho chinês', 'acelga chinesa']),
  food('abobrinha', 'Abobrinha', 'verduras_legumes', 'A', 1),
  food('abobora', 'Abóbora', 'verduras_legumes', 'A', 1, ['moranga', 'jerimum', 'cabotiá', 'abóbora cabotiá', 'abóbora japonesa']),
  food('berinjela', 'Berinjela', 'verduras_legumes', 'A', 1, ['babaganoush', 'baba ganoush', 'babaganuche']),
  food('chuchu', 'Chuchu', 'verduras_legumes', 'A', 1),
  food('quiabo', 'Quiabo', 'verduras_legumes', 'A', 1),
  food('vagem', 'Vagem', 'verduras_legumes', 'A', 1, ['ervilha torta', 'feijão-vagem']),
  food('espinafre', 'Espinafre', 'verduras_legumes', 'A', 1),
  food('rucula', 'Rúcula', 'verduras_legumes', 'A', 1),
  food('agriao', 'Agrião', 'verduras_legumes', 'A', 1),
  food('acelga', 'Acelga', 'verduras_legumes', 'A', 1),
  food('escarola', 'Escarola', 'verduras_legumes', 'A', 1, ['chicória', 'almeirão', 'radite']),
  food('pimentao', 'Pimentão', 'verduras_legumes', 'A', 1),
  food('cebola', 'Cebola', 'verduras_legumes', 'A', 1),
  food('alho', 'Alho', 'verduras_legumes', 'A', 1, ['alho-poró']),
  food('cheiro_verde', 'Cheiro-verde', 'verduras_legumes', 'A', 1, ['cebolinha', 'salsinha', 'salsa', 'coentro', 'manjericão', 'hortelã', 'endro', 'sálvia', 'estragão', 'ervas frescas', 'ervas finas']),
  food('jilo', 'Jiló', 'verduras_legumes', 'A', 1),
  food('maxixe', 'Maxixe', 'verduras_legumes', 'A', 1),
  food('rabanete', 'Rabanete', 'verduras_legumes', 'A', 1, ['nabo']),
  food('aspargo', 'Aspargo', 'verduras_legumes', 'A', 1),
  food('salsao', 'Salsão', 'verduras_legumes', 'A', 1, ['aipo']),
  food('cogumelo', 'Cogumelo', 'verduras_legumes', 'A', 1, ['champignon', 'shimeji', 'shiitake']),
  food('alcachofra', 'Alcachofra', 'verduras_legumes', 'A', 1, ['coração de alcachofra', 'fundo de alcachofra']),
  food('couve_bruxelas', 'Couve-de-bruxelas', 'verduras_legumes', 'A', 1),
  food('erva_doce', 'Erva-doce', 'verduras_legumes', 'A', 1, ['funcho', 'bulbo de erva-doce']),
  food('broto', 'Brotos', 'verduras_legumes', 'A', 1, ['broto de feijão', 'broto de alfafa', 'broto de bambu', 'broto de soja', 'brotinho', 'microverdes', 'germinados']),
  food('alga', 'Algas', 'verduras_legumes', 'A', 1, ['alga nori', 'salada de algas', 'algas marinhas']),
  food('palmito', 'Palmito', 'verduras_legumes', 'B', 3),
  food('azeitona', 'Azeitona', 'verduras_legumes', 'D', 3),
  food('picles', 'Picles', 'verduras_legumes', 'C', 3, ['pepino em conserva', 'conserva']),
  food('salada', 'Salada', 'verduras_legumes', 'A', 1, ['salada verde', 'salada mista', 'salada crua', 'salada de folhas', 'folhas', 'salada caesar', 'mix de folhas'], absorbs),
  food('legumes', 'Legumes', 'verduras_legumes', 'A', 1, ['legumes cozidos', 'legumes no vapor', 'legumes refogados', 'legumes assados', 'antepasto', 'legumes grelhados']),
  food('verduras', 'Verduras', 'verduras_legumes', 'A', 1, ['folhas verdes', 'verdura refogada', 'taioba', 'ora-pro-nóbis', 'bertalha', 'serralha', 'beldroega', 'vinagreira', 'capuchinha', 'peixinho-da-horta', 'mostarda em folha']),
  food('vinagrete', 'Vinagrete', 'verduras_legumes', 'A', 1, ['molho vinagrete']),
];

const leguminosas: Food[] = [
  food('feijao', 'Feijão', 'leguminosas', 'A', 1, ['feijão carioca', 'feijão preto', 'feijão de corda', 'feijão fradinho', 'feijão branco', 'feijão vermelho', 'feijão rajado', 'feijão roxinho', 'caldo de feijão', 'feijãozinho', 'feijão-verde', 'fava', 'feijão-fava', 'feijão-guandu', 'guandu', 'andu', 'feijão-azuki', 'azuki', 'feijão-mungo', 'feijão-jalo', 'feijão-bolinha', 'feijão-manteiga', 'feijão-mulatinho', 'mulatinho', 'feijão macassar']),
  food('lentilha', 'Lentilha', 'leguminosas', 'A', 1),
  food('grao_de_bico', 'Grão-de-bico', 'leguminosas', 'A', 1, ['tremoço']),
  food('ervilha', 'Ervilha', 'leguminosas', 'A', 1, ['ervilha fresca', 'ervilha em lata']),
  food('soja', 'Soja', 'leguminosas', 'A', 1, ['edamame', 'soja em grão']),
  food('tofu', 'Tofu', 'leguminosas', 'A', 3),
  food('proteina_soja', 'Proteína de soja', 'leguminosas', 'A', 3, ['carne de soja', 'pts', 'proteína texturizada de soja']),
  food('homus', 'Homus', 'leguminosas', 'B', 3, ['hummus', 'humus', 'pasta de grão-de-bico']),
  food('falafel', 'Falafel', 'leguminosas', 'C', 3, ['bolinho de grão-de-bico']),
  food('tempeh', 'Tempeh', 'leguminosas', 'A', 1, ['tempê']),
  food('tutu', 'Tutu de feijão', 'leguminosas', 'B', 1, ['tutu', 'tutu à mineira']),
  food('feijoada', 'Feijoada', 'leguminosas', 'C', 3, ['dobradinha', 'maniçoba']),
  food('feijao_tropeiro', 'Feijão tropeiro', 'leguminosas', 'C', 3, ['tropeiro']),
  food('baiao_de_dois', 'Baião de dois', 'leguminosas', 'C', 3, ['baião']),
];

const cereais: Food[] = [
  food('arroz', 'Arroz', 'cereais', 'A', 1, ['arroz branco', 'arroz soltinho', 'arroz cozido', 'arroz parboilizado', 'arroz japonês', 'arroz de sushi', 'arroz arbóreo', 'arroz jasmim', 'arroz basmati']),
  food('arroz_integral', 'Arroz integral', 'cereais', 'A', 1, ['arroz 7 grãos', 'arroz negro', 'arroz vermelho', 'arroz selvagem'], { tags: ['integral'] }),
  food('macarrao', 'Macarrão', 'cereais', 'A', 1, ['massa', 'espaguete', 'talharim', 'penne', 'parafuso', 'fusilli', 'macarrão alho e óleo', 'macarrão cozido', 'macarrão de arroz', 'bifum', 'cabelo de anjo', 'gravatinha', 'conchinha']),
  food('macarrao_integral', 'Macarrão integral', 'cereais', 'A', 1, ['massa integral'], { tags: ['integral'] }),
  food('pao_frances', 'Pão francês', 'cereais', 'B', 3, ['pão', 'pão de sal', 'pãozinho', 'cacetinho', 'pão careca', 'filão', 'baguete', 'pão branco', "pão d'água", 'pão na manteiga', 'pão italiano', 'pão de fermentação natural', 'fermentação natural', 'levain', 'sourdough', 'bagel'], absorbs),
  food('pao_forma', 'Pão de forma', 'cereais', 'C', 4, ['pão de forma branco', 'pão de sanduíche', 'pão pullman', 'bisnaguinha', 'pão de hambúrguer', 'pão de cachorro-quente', 'pão de batata']),
  food('pao_integral', 'Pão integral', 'cereais', 'A', 3, ['pão de forma integral', 'pão multigrãos', 'pão 7 grãos', 'pão de centeio', 'pão australiano', 'pão preto', 'pão de aveia'], { tags: ['integral'] }),
  food('pao_sirio', 'Pão sírio', 'cereais', 'B', 3, ['pão árabe', 'pão folha', 'wrap', 'rap10', 'tortilha', 'pão pita', 'pão naan']),
  food('torrada', 'Torrada', 'cereais', 'B', 3, ['torradinha', 'pão torrado']),
  food('torrada_integral', 'Torrada integral', 'cereais', 'A', 3, [], { tags: ['integral'] }),
  food('pao_de_queijo', 'Pão de queijo', 'cereais', 'D', 3, ['chipa']),
  food('pao_na_chapa', 'Pão na chapa', 'cereais', 'C', 3),
  food('tapioca', 'Tapioca', 'cereais', 'B', 1, ['goma de tapioca', 'beiju', 'biju'], absorbs),
  food('cuscuz', 'Cuscuz', 'cereais', 'A', 1, ['cuscuz nordestino', 'cuscuz de milho', 'flocão']),
  food('cuscuz_marroquino', 'Cuscuz marroquino', 'cereais', 'A', 1, ['cuscuz de sêmola']),
  food('milho', 'Milho verde', 'cereais', 'A', 1, ['milho', 'milho cozido']),
  food('pamonha', 'Pamonha', 'cereais', 'B', 1),
  food('pipoca', 'Pipoca', 'cereais', 'B', 1, ['pipoca caseira', 'pipoca de panela']),
  food('aveia', 'Aveia', 'cereais', 'A', 1, ['flocos de aveia', 'farelo de aveia', 'aveia em flocos'], { tags: ['integral'] }),
  food('mingau', 'Mingau', 'cereais', 'C', 1, ['mingau de aveia', 'mingau de maisena', 'papa'], absorbs),
  food('granola', 'Granola', 'cereais', 'C', 4),
  food('muesli', 'Muesli', 'cereais', 'B', 3, ['musli'], { tags: ['integral'] }),
  food('cereal_matinal', 'Cereal matinal', 'cereais', 'D', 4, ['sucrilhos', 'corn flakes', 'cereal de chocolate', 'nescau cereal', 'froot loops', 'cereal', 'neston', 'mucilon', 'farinha láctea']),
  food('barra_cereal', 'Barra de cereal', 'cereais', 'C', 4, ['barrinha', 'barrinha de cereal', 'barra de proteína', 'barrinha de proteína']),
  food('batata', 'Batata', 'cereais', 'A', 1, ['batata cozida', 'batata assada', 'batata inglesa', 'batata sauté', 'batata rústica']),
  food('batata_doce', 'Batata-doce', 'cereais', 'A', 1),
  food('mandioca', 'Mandioca', 'cereais', 'A', 1, ['aipim', 'macaxeira', 'mandioca cozida']),
  food('inhame', 'Inhame', 'cereais', 'A', 1, ['cará']),
  food('mandioquinha', 'Mandioquinha', 'cereais', 'A', 1, ['batata baroa', 'batata salsa']),
  food('pure', 'Purê', 'cereais', 'B', 1, ['purê de batata'], absorbs),
  food('farofa', 'Farofa', 'cereais', 'C', 3, [], absorbs),
  food('farinha_mandioca', 'Farinha de mandioca', 'cereais', 'B', 1, ['farinha', 'farinha de milho', 'farinha d’água']),
  food('polenta', 'Polenta', 'cereais', 'A', 1, ['angu', 'canjiquinha', 'quirera', 'xerém']),
  food('quinoa', 'Quinoa', 'cereais', 'A', 1, ['quinua'], { tags: ['integral'] }),
  food('graos_integrais', 'Grãos integrais', 'cereais', 'A', 1, ['trigo para quibe', 'triguilho', 'trigo em grão', 'cevada', 'cevadinha', 'centeio em grão', 'trigo sarraceno', 'amaranto', 'painço', 'milheto', 'sorgo', 'espelta', 'farelo de trigo'], { tags: ['integral'] }),
  food('broa', 'Broa de milho', 'cereais', 'C', 3, ['broa']),
];

const carnes: Food[] = [
  food('frango', 'Frango', 'carnes_ovos', 'A', 1, ['frango grelhado', 'frango assado', 'frango cozido', 'peito de frango', 'filé de frango', 'frango desfiado', 'sobrecoxa', 'coxa de frango', 'galinha', 'frango ensopado', 'frango xadrez', 'sassami', 'galeto', 'frango caipira', 'asa de frango', 'asinha', 'coxinha da asa', 'tulipa', 'drumet', 'frango teriyaki', 'frango ao curry', 'peru', 'peru assado', 'chester', 'codorna', 'coelho']),
  food('frango_frito', 'Frango frito', 'carnes_ovos', 'C', 3, ['frango à passarinho', 'frango empanado', 'frango à milanesa', 'asinha frita', 'isca de frango']),
  food('nuggets', 'Nuggets', 'carnes_ovos', 'D', 4, ['nugget', 'empanado de frango', 'empanado']),
  food('carne', 'Carne bovina', 'carnes_ovos', 'B', 1, ['carne', 'bife', 'carne vermelha', 'contrafilé', 'alcatra', 'patinho', 'maminha', 'filé mignon', 'coxão mole', 'coxão duro', 'lagarto', 'carne assada', 'carne cozida', 'carne de panela', 'picadinho', 'carne de boi', 'bife grelhado', 'bife acebolado', 'rosbife', 'fraldinha', 'acém', 'músculo', 'carne louca', 'bife ancho', 'bife de chorizo', 'ancho', 'ossobuco', 'carne de onça', 'bife à cavalo', 'búfalo', 'carne de búfalo']),
  food('carne_moida', 'Carne moída', 'carnes_ovos', 'B', 1, ['carne moída refogada', 'almôndega', 'kafta']),
  food('churrasco', 'Churrasco', 'carnes_ovos', 'C', 1, ['espetinho', 'carne de churrasco', 'churrasquinho']),
  food('picanha', 'Picanha', 'carnes_ovos', 'C', 1),
  food('costela', 'Costela', 'carnes_ovos', 'D', 1, ['costela bovina', 'costelinha', 'rabada']),
  food('cupim', 'Cupim', 'carnes_ovos', 'D', 1),
  food('porco', 'Carne de porco', 'carnes_ovos', 'B', 1, ['lombo', 'bisteca', 'pernil', 'carré', 'carne suína', 'lombinho', 'porco', 'leitão', 'leitoa', 'joelho de porco', 'eisbein', 'javali']),
  food('cordeiro', 'Cordeiro', 'carnes_ovos', 'B', 1, ['carneiro', 'cabrito', 'bode', 'ovelha', 'carne de carneiro', 'carne de cordeiro', 'paleta de cordeiro', 'costeleta de cordeiro', 'pernil de cordeiro', 'carré de cordeiro']),
  food('pato', 'Pato', 'carnes_ovos', 'C', 1, ['marreco', 'peito de pato', 'pato assado', 'confit de pato', 'pato no tucupi']),
  food('torresmo', 'Torresmo', 'carnes_ovos', 'E', 3, ['pururuca', 'panceta', 'barriga de porco']),
  food('bacon', 'Bacon', 'carnes_ovos', 'E', 4, [], { tags: ['embutido'] }),
  food('linguica', 'Linguiça', 'carnes_ovos', 'D', 4, ['linguiça toscana', 'linguiça calabresa', 'calabresa', 'linguiça de frango', 'linguiça de porco', 'chouriço', 'paio'], { tags: ['embutido'] }),
  food('salsicha', 'Salsicha', 'carnes_ovos', 'E', 4, ['salsichão', 'salsicha de frango'], { tags: ['embutido'] }),
  food('presunto', 'Presunto', 'carnes_ovos', 'D', 4, ['apresuntado', 'presunto cozido', 'tender', 'lombo canadense', 'lombo defumado'], { tags: ['embutido'] }),
  food('peito_peru', 'Peito de peru', 'carnes_ovos', 'C', 4, ['blanquet', 'peito de peru defumado'], { tags: ['embutido'] }),
  food('mortadela', 'Mortadela', 'carnes_ovos', 'E', 4, [], { tags: ['embutido'] }),
  food('salame', 'Salame', 'carnes_ovos', 'E', 4, ['copa', 'pepperoni', 'presunto cru', 'presunto parma', 'parma'], { tags: ['embutido'] }),
  food('hamburguer_carne', 'Carne de hambúrguer', 'carnes_ovos', 'D', 4, ['hambúrguer congelado', 'burger', 'blend de hambúrguer'], { tags: ['embutido'] }),
  food('carne_seca', 'Carne-seca', 'carnes_ovos', 'C', 3, ['charque', 'carne de sol', 'jabá']),
  food('figado', 'Fígado', 'carnes_ovos', 'A', 1, ['bife de fígado', 'fígado acebolado', 'moela', 'coração de frango', 'miúdos']),
  food('peixe', 'Peixe', 'carnes_ovos', 'A', 1, ['tilápia', 'merluza', 'pescada', 'salmão', 'filé de peixe', 'peixe grelhado', 'peixe assado', 'peixe cozido', 'robalo', 'pintado', 'tambaqui', 'pacu', 'cação', 'truta', 'dourado', 'saint peter', 'sardinha fresca', 'moqueca', 'sashimi', 'tainha', 'linguado', 'namorado', 'badejo', 'garoupa', 'corvina', 'pescadinha', 'pirarucu', 'tucunaré', 'surubim', 'matrinxã', 'pargo', 'anchova', 'enchova', 'cavala', 'bagre', 'piranha', 'pescado', 'peixe-espada', 'filhote', 'curimatã', 'atum fresco', 'atum selado']),
  food('peixe_frito', 'Peixe frito', 'carnes_ovos', 'C', 3, ['peixe empanado', 'isca de peixe', 'filé de peixe frito', 'camarão empanado', 'camarão frito', 'lula à dorê', 'anéis de lula', 'manjubinha', 'manjuba frita']),
  food('atum', 'Atum', 'carnes_ovos', 'A', 3, ['atum em lata', 'atum enlatado', 'atum sólido', 'atum ralado']),
  food('sardinha', 'Sardinha', 'carnes_ovos', 'B', 3, ['sardinha em lata', 'sardinha enlatada']),
  food('frutos_do_mar', 'Frutos do mar', 'carnes_ovos', 'A', 1, ['camarão', 'lula', 'polvo', 'mexilhão', 'marisco', 'siri', 'caranguejo', 'ostra', 'vieira', 'lagosta', 'lagostim', 'sururu', 'vôngole', 'berbigão', 'casquinha de siri']),
  food('bacalhau', 'Bacalhau', 'carnes_ovos', 'C', 3, ['bacalhoada']),
  food('ovo', 'Ovo', 'carnes_ovos', 'A', 1, ['ovo cozido', 'ovo pochê', 'clara de ovo', 'ovo de codorna', 'ovo quente', 'gema', 'ovo caipira', 'ovo de pata']),
  food('ovo_frito', 'Ovo frito', 'carnes_ovos', 'B', 1, ['ovo estrelado']),
  food('ovo_mexido', 'Ovo mexido', 'carnes_ovos', 'A', 1),
  food('omelete', 'Omelete', 'carnes_ovos', 'B', 1, ['omelet', 'fritada'], absorbs),
];

const laticinios: Food[] = [
  food('leite', 'Leite', 'leite_derivados', 'B', 1, ['leite integral', 'leite desnatado', 'leite semidesnatado', 'leite sem lactose', 'leite quente', 'leite em pó', 'leite de vaca', 'leite morno', 'leite de cabra', 'leite zero lactose']),
  food('cafe_com_leite', 'Café com leite', 'leite_derivados', 'B', 1, ['pingado', 'leite com café', 'galão', 'meia de leite']),
  food('iogurte_natural', 'Iogurte natural', 'leite_derivados', 'A', 1, ['coalhada', 'iogurte natural desnatado', 'iogurte grego natural', 'iogurte sem açúcar', 'kefir', 'coalhada seca']),
  food('iogurte', 'Iogurte', 'leite_derivados', 'C', 4, ['iogurte com sabor', 'iogurte grego', 'iogurte de polpa', 'iogurte com frutas', 'danone', 'activia', 'iogurte proteico', 'yopro'], absorbs),
  food('bebida_lactea', 'Bebida láctea', 'leite_derivados', 'D', 4, ['leite fermentado', 'yakult', 'chamyto', 'danoninho', 'petit suisse']),
  food('queijo', 'Queijo', 'leite_derivados', 'D', 3, ['queijo amarelo', 'mussarela', 'muçarela', 'queijo prato', 'parmesão', 'provolone', 'cheddar', 'queijo coalho', 'queijo derretido', 'gorgonzola', 'queijo gratinado', 'queijo ralado', 'brie', 'queijo canastra', 'queijo suíço', 'queijo estepe', 'estepe', 'queijo do reino', 'queijo serrano', 'queijo manteiga', 'queijo de búfala', 'muçarela de búfala', 'mussarela de búfala', 'búfala', 'queijo azul', 'queijo de cabra', 'queijo colonial', 'queijo meia cura', 'queijo curado', 'minas padrão', 'queijo minas padrão', 'queijo serra da estrela'], absorbs),
  food('queijo_minas', 'Queijo minas frescal', 'leite_derivados', 'C', 3, ['queijo minas', 'queijo branco', 'queijo fresco', 'minas frescal', 'queijo de minas']),
  food('ricota', 'Ricota', 'leite_derivados', 'B', 3, ['cottage', 'queijo cottage', 'queijo quark']),
  food('requeijao', 'Requeijão', 'leite_derivados', 'D', 4, ['requeijão cremoso', 'catupiry', 'cream cheese', 'queijo processado', 'polenguinho', 'queijo cremoso', 'cheddar cremoso']),
  food('bebida_vegetal', 'Bebida vegetal', 'leite_derivados', 'B', 4, ['leite de soja', 'leite de amêndoas', 'leite de aveia', 'leite de castanha', 'leite vegetal', 'leite de arroz']),
  food('vitamina', 'Vitamina de frutas', 'leite_derivados', 'B', 1, ['vitamina', 'smoothie'], absorbs),
  food('whey', 'Whey protein', 'leite_derivados', 'B', 4, ['whey', 'shake de proteína', 'proteína em pó', 'albumina', 'proteína vegana', 'shake proteico']),
];

const oleaginosas: Food[] = [
  food('castanhas', 'Castanhas', 'oleaginosas', 'B', 1, ['castanha do pará', 'castanha de caju', 'castanha do brasil', 'mix de castanhas', 'mix de nuts', 'nozes', 'amêndoas', 'avelã', 'pistache', 'macadâmia', 'nozes pecã', 'noz pecã', 'pecã', 'baru', 'castanha de baru', 'pinhão', 'castanha portuguesa', 'pinoli']),
  food('amendoim', 'Amendoim', 'oleaginosas', 'B', 1, ['amendoim torrado', 'amendoim cozido']),
  food('pasta_amendoim', 'Pasta de amendoim', 'oleaginosas', 'B', 3, ['manteiga de amendoim', 'tahine', 'pasta de gergelim', 'manteiga de amêndoa', 'pasta de amêndoa', 'pasta de castanha', 'creme de amendoim']),
  food('sementes', 'Sementes', 'oleaginosas', 'A', 1, ['chia', 'linhaça', 'gergelim', 'semente de abóbora', 'semente de girassol', 'mix de sementes', 'psyllium']),
];

const bebidas: Food[] = [
  food('agua', 'Água', 'bebidas', 'A', 1, ['água mineral', 'água com gás', 'água gelada', 'água filtrada', 'água natural', 'água com limão'], { tags: ['agua'] }),
  food('cafe', 'Café', 'bebidas', 'A', 1, ['café preto', 'café sem açúcar', 'café coado', 'expresso', 'café expresso', 'café americano', 'café com adoçante', 'café passado', 'café puro', 'café descafeinado', 'descafeinado', 'café turco']),
  food('cafe_acucar', 'Café com açúcar', 'bebidas', 'C', 1, ['cafezinho', 'café adoçado', 'café doce']),
  food('cha', 'Chá', 'bebidas', 'A', 1, ['chá verde', 'chá preto', 'chá mate', 'chá sem açúcar', 'chimarrão', 'tereré', 'infusão', 'mate', 'camomila', 'hibisco', 'erva-cidreira', 'capim-santo', 'capim-limão', 'boldo', 'erva-mate'], absorbs),
  food('agua_coco', 'Água de coco', 'bebidas', 'B', 1),
  food('kombucha', 'Kombucha', 'bebidas', 'B', 3),
];

const bebidasAdocadas: Food[] = [
  food('suco_natural', 'Suco natural', 'bebidas_adocadas', 'C', 1, ['suco', 'suco de laranja', 'suco de fruta', 'suco natural de laranja', 'suco de limão', 'suco de uva integral', 'suco verde', 'suco detox', 'suco sem açúcar', 'suco de polpa', 'suco integral'], absorbs),
  food('suco_acucar', 'Suco com açúcar', 'bebidas_adocadas', 'D', 1, ['suco natural com açúcar', 'suco adoçado', 'limonada', 'limonada suíça'], { tags: ['adocada'] }),
  food('suco_caixinha', 'Suco de caixinha', 'bebidas_adocadas', 'E', 4, ['suco industrializado', 'néctar', 'suco pronto', 'suco de garrafa', 'del valle', 'suco de soja', 'kapo', 'maguary', 'ades', 'tampico', 'guaravita'], { tags: ['adocada'] }),
  food('suco_po', 'Suco em pó', 'bebidas_adocadas', 'E', 4, ['refresco em pó', 'tang', 'refresco', 'suco de pacotinho', 'suco de saquinho', 'ki-suco', 'clight'], { tags: ['adocada'] }),
  food('refrigerante', 'Refrigerante', 'bebidas_adocadas', 'E', 4, ['refri', 'coca', 'coca-cola', 'guaraná', 'guaraná antarctica', 'fanta', 'sprite', 'pepsi', 'soda', 'refrigerante de cola', 'tubaína', 'guaraná jesus', 'kuat', 'soda limonada', 'água tônica', 'tônica', 'soda italiana', 'itubaína', 'dolly', 'sukita', 'mineirinho'], { tags: ['adocada'] }),
  food('refrigerante_zero', 'Refrigerante zero', 'bebidas_adocadas', 'C', 4, ['refri zero', 'coca zero', 'coca-cola zero', 'refrigerante diet', 'guaraná zero', 'refrigerante light', 'pepsi black', 'sprite zero', 'refri diet', 'h2oh', 'coca sem açúcar', 'coca-cola sem açúcar']),
  food('cha_gelado', 'Chá gelado industrializado', 'bebidas_adocadas', 'D', 4, ['chá pronto', 'ice tea', 'chá de garrafa', 'chá gelado', 'fuze tea', 'matte leão'], { tags: ['adocada'] }),
  food('energetico', 'Energético', 'bebidas_adocadas', 'E', 4, ['red bull', 'monster', 'energy drink', 'tnt', 'baly'], { tags: ['adocada'] }),
  food('isotonico', 'Isotônico', 'bebidas_adocadas', 'D', 4, ['gatorade', 'powerade'], { tags: ['adocada'] }),
  food('achocolatado', 'Achocolatado', 'bebidas_adocadas', 'D', 4, ['nescau', 'toddy', 'leite com achocolatado', 'leite com nescau', 'leite com toddy', 'toddynho', 'chocolate quente', 'leite com chocolate', 'leite com ovomaltine'], { tags: ['adocada'] }),
  food('caldo_cana', 'Caldo de cana', 'bebidas_adocadas', 'E', 1, ['garapa'], { tags: ['adocada'] }),
  food('cappuccino', 'Cappuccino', 'bebidas_adocadas', 'D', 4, ['capuccino', 'capuchino', 'mocha', 'frappuccino', 'café gelado', 'café com chantilly'], { tags: ['adocada'] }),
];

const doces: Food[] = [
  food('chocolate', 'Chocolate', 'doces', 'E', 4, ['chocolate ao leite', 'bombom', 'chocolate branco', 'kit kat', 'kitkat', 'bis', 'sonho de valsa', 'ouro branco', 'trufa', 'ovo de páscoa', 'talento', 'chokito', 'prestígio', 'nutella', 'creme de avelã', 'lacta', 'baton', 'diamante negro', 'laka', 'suflair', 'alpino', 'charge', 'lollo', 'galak', 'serenata de amor', 'kinder ovo', 'crunch', 'garoto', 'cacau show', 'hersheys']),
  food('chocolate_amargo', 'Chocolate amargo', 'doces', 'D', 3, ['chocolate 70%', 'chocolate meio amargo', 'chocolate 85%', 'cacau', 'cacau em pó', 'nibs de cacau']),
  food('brigadeiro', 'Brigadeiro', 'doces', 'E', 3, ['beijinho', 'docinho', 'docinho de festa', 'cajuzinho', 'bicho de pé', 'brigadeiro de colher']),
  food('bolo', 'Bolo', 'doces', 'D', 3, ['bolo caseiro', 'bolo simples'], absorbs),
  food('bolo_cobertura', 'Bolo com cobertura', 'doces', 'E', 3, ['bolo de aniversário', 'bolo recheado', 'bolo confeitado', 'bolo de festa', 'bolo com cobertura de chocolate', 'bolo de pote', 'bolo de rolo', 'naked cake']),
  food('bolinho_industrializado', 'Bolinho industrializado', 'doces', 'E', 4, ['bolinho', 'ana maria', 'bolo de pacote', 'bolinho recheado', 'bolo pronto', 'panetone', 'chocotone']),
  food('biscoito_recheado', 'Biscoito recheado', 'doces', 'E', 4, ['bolacha recheada', 'oreo', 'negresco', 'trakinas', 'passatempo', 'recheadinho', 'bono', 'calipso'], absorbs),
  food('biscoito_doce', 'Biscoito doce', 'doces', 'D', 4, ['biscoito', 'bolacha', 'biscoito maisena', 'bolacha maria', 'biscoito maria', 'rosquinha', 'biscoito amanteigado', 'biscoito de leite', 'bolacha doce', 'biscoito de goiabinha', 'goiabinha', 'biscoito de nata', 'sequilho', 'casadinho', 'biscoito integral'], absorbs),
  food('cookie', 'Cookie', 'doces', 'E', 4, ['wafer', 'biscoito wafer', 'brownie']),
  food('sorvete', 'Sorvete', 'doces', 'D', 4, ['sorvete de massa', 'casquinha', 'sundae', 'gelato', 'frozen'], absorbs),
  food('picole', 'Picolé', 'doces', 'D', 4, ['geladinho', 'sacolé', 'chup chup', 'dindin', 'paleta mexicana'], absorbs),
  food('milkshake', 'Milk-shake', 'doces', 'E', 4, ['milkshake', 'milk shake']),
  food('pudim', 'Pudim', 'doces', 'E', 3, ['pudim de leite', 'flan', 'manjar', 'manjar branco'], absorbs),
  food('mousse', 'Mousse', 'doces', 'E', 3, ['musse'], absorbs),
  food('torta_doce', 'Torta doce', 'doces', 'E', 3, ['pavê', 'torta holandesa', 'cheesecake', 'torta de limão', 'torta de morango', 'torta de chocolate', 'torta de maçã', 'banoffee', 'petit gateau', 'pastel de belém', 'torta alemã', 'mil-folhas']),
  food('gelatina', 'Gelatina', 'doces', 'D', 4, ['gelatina colorida', 'gelatina de caixinha']),
  food('doce_de_leite', 'Doce de leite', 'doces', 'E', 3),
  food('leite_condensado', 'Leite condensado', 'doces', 'E', 3),
  food('goiabada', 'Goiabada', 'doces', 'E', 3, ['marmelada', 'doce de goiaba', 'romeu e julieta', 'bananada']),
  food('doce', 'Doce', 'doces', 'E', 3, ['docinho caseiro', 'cocada', 'quindim', 'pé de moleque', 'canjica', 'mungunzá', 'arroz doce', 'curau', 'ambrosia', 'bolinho de chuva', 'pipoca doce', 'maria-mole', 'suspiro', 'olho de sogra', 'bem-casado', 'doce de abóbora', 'doce de coco', 'compota', 'fruta em calda', 'sagu', 'bomba de chocolate', 'carolina'], absorbs),
  food('pacoca', 'Paçoca', 'doces', 'D', 4, ['paçoquinha']),
  food('bala', 'Bala', 'doces', 'E', 4, ['pirulito', 'chiclete', 'jujuba', 'bala de goma', 'confete', 'm&m']),
  food('churros', 'Churros', 'doces', 'E', 3, ['churro']),
  food('acai_tigela', 'Açaí na tigela', 'doces', 'D', 4, ['açaí', 'açaí com granola', 'açaí com banana', 'açaí no copo', 'bowl de açaí']),
  food('pao_doce', 'Pão doce', 'doces', 'D', 4, ['sonho', 'rosca doce', 'pão de leite', 'pão de mel', 'cuca', 'croissant']),
  food('waffle', 'Waffle', 'doces', 'D', 3, ['panqueca doce', 'crepe doce', 'rabanada', 'panqueca americana', 'crepe']),
  food('acucar', 'Açúcar', 'doces', 'E', 2, ['açúcar refinado', 'açúcar mascavo', 'açúcar demerara', 'açúcar cristal', 'rapadura']),
  food('mel', 'Mel', 'doces', 'E', 1, ['melado', 'melaço']),
  food('geleia', 'Geleia', 'doces', 'D', 3, ['geléia', 'chimia'], absorbs),
  food('calda', 'Calda', 'doces', 'E', 4, ['cobertura', 'calda de chocolate', 'calda de caramelo', 'cobertura de chocolate']),
];

const lanches: Food[] = [
  food('coxinha', 'Coxinha', 'lanches', 'D', 3, [], absorbs),
  food('pastel', 'Pastel', 'lanches', 'D', 3, ['pastel de feira', 'pastel frito'], absorbs),
  food('esfiha', 'Esfiha', 'lanches', 'C', 3, ['esfirra', 'esfiha aberta', 'esfiha fechada'], absorbs),
  food('empada', 'Empada', 'lanches', 'D', 3, ['empadinha', 'empadão'], absorbs),
  food('salgado_frito', 'Salgado frito', 'lanches', 'D', 3, ['salgado', 'salgadinho de festa', 'risole', 'croquete', 'bolinha de queijo', 'bolinho de bacalhau', 'kibe', 'quibe', 'kibe frito', 'acarajé', 'enroladinho', 'bolinho de arroz', 'bolinho de mandioca', 'bolinho de aipim', 'bolinho de feijoada', 'rolinho primavera', 'harumaki', 'abará', 'bolinho caipira', 'anel de cebola', 'anéis de cebola', 'palitinho de queijo']),
  food('salgado_assado', 'Salgado assado', 'lanches', 'C', 3, ['folhado', 'enroladinho assado', 'joelho', 'italianinho', 'pastel assado', 'guioza', 'trouxinha']),
  food('hamburguer', 'Hambúrguer', 'lanches', 'D', 4, ['x-burguer', 'x-salada', 'x-bacon', 'x-tudo', 'x-egg', 'cheeseburger', 'big mac', 'sanduíche de hambúrguer', 'lanche de hamburgueria', 'xis', 'xis salada', 'xis bacon', 'xis tudo', 'xis egg', 'hambúrguer artesanal', 'x-frango', 'x-calabresa', 'x-picanha', 'x-coração'], { tags: ['embutido'] }),
  food('cachorro_quente', 'Cachorro-quente', 'lanches', 'D', 4, ['hot dog', 'dogão', 'podrão'], { tags: ['embutido'] }),
  food('pizza', 'Pizza', 'lanches', 'D', 3, ['pizza congelada'], absorbs),
  food('sanduiche_natural', 'Sanduíche natural', 'lanches', 'B', 3, ['lanche natural', 'sanduba natural']),
  food('sanduiche', 'Sanduíche', 'lanches', 'C', 3, ['sanduba', 'baguete recheada', 'bauru', 'beirute', 'churrasco grego', 'americano'], absorbs),
  food('misto_quente', 'Misto quente', 'lanches', 'D', 4, ['misto'], { tags: ['embutido'] }),
  food('queijo_quente', 'Queijo quente', 'lanches', 'D', 3),
  food('batata_frita', 'Batata frita', 'lanches', 'D', 3, ['fritas', 'batata frita do mc', 'batata palito', 'batata canoa', 'batata smile', 'batata rosti', 'batata suíça']),
  food('mandioca_frita', 'Mandioca frita', 'lanches', 'D', 3, ['aipim frito', 'macaxeira frita', 'polenta frita']),
  food('salgadinho', 'Salgadinho de pacote', 'lanches', 'E', 4, ['salgadinho', 'chips', 'batata chips', 'doritos', 'ruffles', 'cheetos', 'fandangos', 'baconzitos', 'torcida', 'elma chips', 'batata palha', 'pipoca de micro-ondas', 'amendoim japonês', 'cebolitos', "pingo d'ouro"], { tags: ['salgadinho'] }),
  food('biscoito_salgado', 'Biscoito salgado', 'lanches', 'C', 4, ['cream cracker', 'biscoito água e sal', 'bolacha água e sal', 'bolacha salgada', 'biscoito de polvilho', 'polvilho', 'biscoito de arroz', 'torradinha industrializada', 'club social', 'biscoito club social', 'biscoito de queijo'], { tags: ['salgadinho'] }),
];

const pratos: Food[] = [
  food('torta_salgada', 'Torta salgada', 'pratos', 'C', 3, ['torta', 'quiche', 'torta de frango', 'torta de palmito', 'fogazza'], absorbs),
  food('estrogonofe', 'Estrogonofe', 'pratos', 'C', 3, ['strogonoff', 'estrogonofe de frango', 'estrogonofe de carne'], absorbs),
  food('lasanha', 'Lasanha', 'pratos', 'C', 3, ['lasanha à bolonhesa', 'lasanha congelada'], absorbs),
  food('massa_molho', 'Massa com molho', 'pratos', 'B', 1, ['macarronada', 'macarrão com molho', 'macarrão à bolonhesa', 'espaguete à bolonhesa', 'macarrão ao sugo', 'macarrão com carne moída', 'nhoque', 'ravioli', 'capeletti', 'canelone', 'rondelli', 'macarrão à carbonara', 'macarrão ao pesto']),
  food('risoto', 'Risoto', 'pratos', 'C', 3, [], absorbs),
  food('sopa', 'Sopa', 'pratos', 'A', 1, ['canja', 'caldo', 'sopa caseira', 'creme de abóbora', 'creme de legumes', 'sopa de missô', 'missoshiro', 'missô'], absorbs),
  food('caldo_verde', 'Caldo verde', 'pratos', 'C', 3),
  food('sopa_pacote', 'Sopa instantânea', 'pratos', 'D', 4, ['sopa de pacote', 'sopa pronta', 'vono', 'cup noodles']),
  food('miojo', 'Macarrão instantâneo', 'pratos', 'E', 4, ['miojo', 'lámen', 'nissin'], { tags: ['salgadinho'] }),
  food('ramen', 'Ramen', 'pratos', 'C', 3),
  food('escondidinho', 'Escondidinho', 'pratos', 'C', 3, ['batata gratinada', 'gratinado'], absorbs),
  food('panqueca', 'Panqueca', 'pratos', 'C', 3, [], absorbs),
  food('crepioca', 'Crepioca', 'pratos', 'B', 1, ['omelete de tapioca']),
  food('arroz_carreteiro', 'Arroz carreteiro', 'pratos', 'C', 3, ['carreteiro', 'arroz de forno', 'arroz frito', 'arroz chop suey']),
  food('galinhada', 'Galinhada', 'pratos', 'B', 1, ['arroz com pequi', 'paella', 'arroz à grega', 'arroz de pato', 'arroz de polvo', 'arroz de marisco']),
  food('parmegiana', 'Parmegiana', 'pratos', 'C', 3, ['frango à parmegiana', 'bife à parmegiana', 'filé à parmegiana', 'bife à milanesa', 'milanesa']),
  food('cuscuz_paulista', 'Cuscuz paulista', 'pratos', 'B', 3),
  food('bobo', 'Bobó de camarão', 'pratos', 'C', 3, ['bobó', 'moqueca baiana', 'caril']),
  food('vatapa', 'Vatapá', 'pratos', 'C', 3, ['caruru', 'tacacá']),
  food('yakisoba', 'Yakisoba', 'pratos', 'C', 3, ['comida chinesa']),
  food('sushi', 'Sushi', 'pratos', 'B', 3, ['temaki', 'comida japonesa', 'combinado', 'hot roll', 'uramaki', 'niguiri', 'hossomaki', 'hot philadelphia']),
  food('prato_feito', 'Prato feito', 'pratos', 'B', 1, ['pf', 'comercial', 'marmita', 'marmitex', 'self service', 'executivo', 'refeição caseira', 'virado à paulista', 'arrumadinho', 'quentinha', 'marmita fit', 'bandejão', 'à la minute', 'charutinho', 'charuto de folha de uva', 'charuto de repolho']),
  food('salada_maionese', 'Salada de maionese', 'pratos', 'C', 3, ['maionese de batata', 'salpicão']),
  food('quibe_assado', 'Quibe assado', 'pratos', 'B', 1, ['kibe assado', 'kibe cru', 'quibe cru']),
];

const gorduras: Food[] = [
  food('azeite', 'Azeite', 'gorduras_molhos', 'B', 2, ['azeite de oliva', 'azeite extra virgem']),
  food('oleo', 'Óleo', 'gorduras_molhos', 'C', 2, ['óleo de soja', 'óleo de girassol', 'óleo de canola', 'óleo vegetal', 'dendê', 'azeite de dendê', 'óleo de coco']),
  food('manteiga', 'Manteiga', 'gorduras_molhos', 'E', 2, ['manteiga com sal', 'manteiga sem sal', 'ghee', 'banha', 'manteiga de garrafa', 'manteiga da terra']),
  food('margarina', 'Margarina', 'gorduras_molhos', 'D', 4, ['creme vegetal', 'qualy', 'doriana', 'gordura vegetal', 'gordura hidrogenada']),
  food('maionese', 'Maionese', 'gorduras_molhos', 'E', 4, ['maionese temperada', 'molho de alho', 'molho tártaro', 'molho caesar', 'molho ranch']),
  food('ketchup', 'Ketchup', 'gorduras_molhos', 'D', 4, ['catchup', 'molho barbecue', 'barbecue', 'molho especial', 'molho agridoce', 'molho sweet chili']),
  food('mostarda', 'Mostarda', 'gorduras_molhos', 'C', 4, ['molho de mostarda e mel']),
  food('molho_tomate', 'Molho de tomate', 'gorduras_molhos', 'B', 3, ['extrato de tomate', 'molho sugo', 'molho pronto']),
  food('molho', 'Molho', 'gorduras_molhos', 'C', 3, ['molho branco', 'molho bechamel', 'molho pesto', 'molho madeira', 'molho de queijo', 'molho rosé'], absorbs),
  food('shoyu', 'Shoyu', 'gorduras_molhos', 'E', 3, ['molho shoyu', 'molho de soja', 'molho inglês', 'tarê']),
  food('creme_de_leite', 'Creme de leite', 'gorduras_molhos', 'D', 3, ['chantilly', 'nata', 'creme de leite fresco', 'creme azedo']),
  food('tempero_pronto', 'Tempero pronto', 'gorduras_molhos', 'E', 4, ['caldo em cubo', 'caldo knorr', 'sazón', 'caldo de galinha em cubo', 'tempero em pó', 'ajinomoto', 'glutamato']),
  food('temperos', 'Temperos e especiarias', 'gorduras_molhos', 'B', 1, ['tempero', 'tempero natural', 'tempero caseiro', 'especiarias', 'canela', 'canela em pó', 'cúrcuma', 'açafrão', 'açafrão-da-terra', 'páprica', 'páprica defumada', 'colorau', 'urucum', 'cominho', 'noz-moscada', 'pimenta-do-reino', 'pimenta', 'pimenta calabresa', 'pimenta dedo-de-moça', 'pimenta biquinho', 'pimenta malagueta', 'gengibre', 'cravo', 'cravo-da-índia', 'louro', 'folha de louro', 'alecrim', 'tomilho', 'curry em pó', 'vinagre', 'vinagre balsâmico', 'vinagre de maçã', 'aceto balsâmico', 'raiz-forte', 'lemon pepper']),
  food('leite_coco', 'Leite de coco', 'gorduras_molhos', 'D', 3),
  food('pate', 'Patê', 'gorduras_molhos', 'D', 4, ['pasta de atum', 'pasta de frango']),
];

const alcool: Food[] = [
  food('cerveja', 'Cerveja', 'alcool', 'E', 3, ['chopp', 'chope', 'long neck', 'cerveja artesanal', 'breja', 'brahma', 'skol', 'antarctica', 'itaipava', 'amstel', 'stella', 'pilsen', 'ipa', 'weiss', 'cerveja puro malte', 'cerveja sem álcool']),
  food('vinho', 'Vinho', 'alcool', 'E', 3, ['vinho tinto', 'vinho branco', 'espumante', 'rosé', 'sangria', 'champanhe', 'vinho do porto', 'vinho verde', 'frisante', 'sidra', 'chopp de vinho', 'catuaba', 'clericot']),
  food('destilado', 'Destilado', 'alcool', 'E', 4, ['cachaça', 'pinga', 'vodka', 'vodca', 'whisky', 'uísque', 'gin', 'tequila', 'rum', 'conhaque', 'licor', 'steinhäger', 'vermute', 'cynar', 'fernet', 'amarula', 'absinto', 'licor 43', 'jurupinga']),
  food('drink', 'Drink', 'alcool', 'E', 4, ['caipirinha', 'caipiroska', 'drinque', 'coquetel', 'gin tônica', 'batida', 'cuba libre', 'quentão', 'aperol', 'caipifruta', 'caipisaquê', 'batida de coco', 'corote']),
];

export const BUILTIN_FOODS: Food[] = [
  ...frutas,
  ...verduras,
  ...leguminosas,
  ...cereais,
  ...carnes,
  ...laticinios,
  ...oleaginosas,
  ...bebidas,
  ...bebidasAdocadas,
  ...doces,
  ...lanches,
  ...pratos,
  ...gorduras,
  ...alcool,
];

const localized = new Map<Language, Food[]>();

/** A base com nomes e apelidos no idioma escolhido (nota, grupo e NOVA não mudam). */
export function localizedFoods(language: Language): Food[] {
  let foods = localized.get(language);
  if (!foods) {
    if (language === 'pt') {
      foods = BUILTIN_FOODS;
    } else {
      const names = FOOD_NAMES[language];
      if (!names) throw new Error(`Nomes dos alimentos em "${language}" ainda não carregados`);
      foods = BUILTIN_FOODS.map((f) => {
        const [name, ...aliases] = names[f.id] ?? [f.name, ...(f.aliases ?? [])];
        return { ...f, name, aliases };
      });
    }
    foods = withInternationalNames(foods, language);
    localized.set(language, foods);
  }
  return foods;
}

/**
 * Acrescenta os nomes internacionais (`foodNames/international.ts`) que o idioma
 * ainda não usa — nem para outro alimento, nem como palavra do texto ("e",
 * "com", unidades…). Em alemão, nomes curtos de uma palavra ficam de fora, para
 * não virarem o final de palavras compostas desconhecidas.
 */
function withInternationalNames(foods: Food[], language: Language): Food[] {
  const rules = LANGUAGE_RULES[language];
  const key = (text: string) => foodKey(text, rules.singularize);
  const words = [
    ...rules.stopwords,
    ...rules.separators,
    ...rules.ofWords,
    ...rules.units,
    ...Object.keys(rules.numberWords),
  ];
  const taken = new Set(words.flatMap((w) => [w, rules.singularize(w)]));
  for (const food of foods) {
    for (const text of [food.name, ...(food.aliases ?? [])]) taken.add(key(text));
  }
  return foods.map((food) => {
    const extra = (INTERNATIONAL_NAMES[food.id] ?? []).filter((text) => {
      const k = key(text);
      if (!k || taken.has(k)) return false;
      if (rules.compounds && !k.includes(' ') && k.length < 5) return false;
      taken.add(k);
      return true;
    });
    return extra.length ? { ...food, aliases: [...(food.aliases ?? []), ...extra] } : food;
  });
}
