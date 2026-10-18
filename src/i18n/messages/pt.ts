import type { ClassifyKey } from '../../domain/groups';
import type {
  FoodGroup,
  Grade,
  InsightKey,
  MarkerKey,
  MealType,
  Nova,
  ScoreComponentKey,
  ScoreFacts,
} from '../../domain/types';
import type { Format } from '../format';

/*
 * Textos do app em português (o idioma de referência: os outros idiomas
 * seguem exatamente esta estrutura, ver `Messages`).
 *
 * `**texto**` vira negrito na tela (componente `Rich`).
 */

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
const days = (n: number) => plural(n, '1 dia', `${n} dias`);
const times = (n: number) => plural(n, '1 vez', `${n} vezes`);

export const pt = {
  common: {
    back: 'Voltar',
    close: 'Fechar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Excluir',
    remove: 'Remover',
    today: 'Hoje',
    yesterday: 'Ontem',
    loading: 'Carregando',
    backupFile: 'Arquivo de backup',
    days,
    meals: (n: number) => plural(n, '1 refeição', `${n} refeições`),
    daysOf: (n: number, total: number) => `${n} de ${total} dias`,
  },

  grades: {
    labels: {
      A: 'Excelente',
      B: 'Boa',
      C: 'Regular',
      D: 'Precisa melhorar',
      E: 'Precisa de atenção',
    } satisfies Record<Grade, string>,
    messages: {
      A: 'Sua alimentação está ótima! Continue assim.',
      B: 'Você está no caminho certo — pequenos ajustes podem levar ao A.',
      C: 'Há bons hábitos, mas também espaço para melhorar.',
      D: 'Sua alimentação precisa de alguns ajustes. Veja as dicas do relatório.',
      E: 'Que tal começar com pequenas trocas no dia a dia? O relatório mostra por onde começar.',
    } satisfies Record<Grade, string>,
    badge: (grade: Grade, label: string) => `Nota ${grade} — ${label}`,
    unclassified: 'Sem classificação',
    scale: (grade: Grade, label: string) => `Nota ${grade} na escala de A a E: ${label}`,
    thermometer: (score: number, grade: Grade) =>
      `Termômetro: ${score} de 100 pontos, nota ${grade}`,
  },

  mealTypes: {
    cafe_manha: 'Café da manhã',
    lanche_manha: 'Lanche da manhã',
    almoco: 'Almoço',
    cafe_tarde: 'Café da tarde',
    jantar: 'Jantar',
    ceia: 'Ceia',
  } satisfies Record<MealType, string>,

  groups: {
    frutas: 'Frutas',
    verduras_legumes: 'Verduras e legumes',
    leguminosas: 'Feijões e leguminosas',
    cereais: 'Cereais, pães, raízes e tubérculos',
    carnes_ovos: 'Carnes, peixes e ovos',
    leite_derivados: 'Leite e derivados',
    oleaginosas: 'Castanhas e sementes',
    bebidas: 'Água, café e chás',
    bebidas_adocadas: 'Sucos e bebidas adoçadas',
    doces: 'Doces e guloseimas',
    lanches: 'Lanches, salgados e fast food',
    pratos: 'Pratos e preparações',
    gorduras_molhos: 'Óleos, gorduras e molhos',
    alcool: 'Bebidas alcoólicas',
  } satisfies Record<FoodGroup, string>,

  nova: {
    1: 'In natura ou minimamente processados',
    2: 'Ingredientes culinários (óleos, açúcar, manteiga)',
    3: 'Processados',
    4: 'Ultraprocessados',
  } satisfies Record<Nova, string>,

  classify: {
    title: (name: string) => `O que é “${name}”?`,
    description: 'Escolha a categoria que mais combina. O EatMate vai lembrar da próxima vez.',
    done: (name: string, category: string) => `“${name}” classificado como ${category}.`,
    options: {
      fruta: { label: 'Fruta', examples: 'banana, maçã, manga' },
      verdura: { label: 'Verdura ou legume', examples: 'alface, cenoura, abobrinha' },
      leguminosa: { label: 'Feijão ou leguminosa', examples: 'feijão, lentilha, grão-de-bico' },
      cereal: { label: 'Arroz, massa, raiz ou tubérculo', examples: 'arroz, macarrão, mandioca' },
      pao: { label: 'Pão, torrada ou bolacha salgada', examples: 'pão francês, torrada' },
      carne: { label: 'Carne, frango, peixe ou ovo', examples: 'bife, frango, tilápia, ovo' },
      embutido: { label: 'Embutido', examples: 'presunto, salsicha, linguiça' },
      laticinio: { label: 'Leite, iogurte ou queijo', examples: 'leite, iogurte, queijo' },
      oleaginosa: { label: 'Castanha ou semente', examples: 'castanha, amendoim, chia' },
      bebida: { label: 'Água, café ou chá sem açúcar', examples: 'água, café, chá' },
      adocada: { label: 'Suco ou bebida adoçada', examples: 'refrigerante, suco de caixinha' },
      doce: { label: 'Doce ou sobremesa', examples: 'bolo, chocolate, pudim' },
      lanche: { label: 'Lanche, salgado ou fast food', examples: 'coxinha, hambúrguer, pizza' },
      prato_caseiro: { label: 'Prato caseiro', examples: 'feito em casa com alimentos frescos' },
      prato_pronto: {
        label: 'Prato pronto ou congelado',
        examples: 'lasanha congelada, sopa de pacote',
      },
      gordura: { label: 'Molho, óleo ou gordura', examples: 'maionese, manteiga, azeite' },
      alcool: { label: 'Bebida alcoólica', examples: 'cerveja, vinho, caipirinha' },
    } satisfies Record<ClassifyKey, { label: string; examples: string }>,
  },

  score: {
    components: {
      qualidade: 'Qualidade nutricional',
      processamento: 'Grau de processamento',
      frutas_verduras: 'Frutas, verduras e legumes',
      variedade: 'Variedade',
      regularidade: 'Regularidade das refeições',
    } satisfies Record<ScoreComponentKey, string>,
    details: {
      qualidade: (s: ScoreFacts) => `Média das notas dos alimentos: ${s.averageGrade}`,
      processamento: (s: ScoreFacts, f: Format) =>
        `${f.percent(s.inNaturaShare)} in natura ou minimamente processados · ${f.percent(s.ultraShare)} ultraprocessados`,
      frutas_verduras: (s: ScoreFacts, f: Format) =>
        `${f.decimal(s.fvPerDay)} porções por dia (meta: ${s.fvTarget})`,
      variedade: (s: ScoreFacts) =>
        `${s.distinctGood} alimentos diferentes com nota A, B ou C (meta: ${s.varietyTarget})`,
      regularidade: (s: ScoreFacts, f: Format) =>
        `${f.percent(s.mainMealsShare)} das refeições principais registradas (café da manhã, almoço e jantar)`,
    } satisfies Record<ScoreComponentKey, (s: ScoreFacts, f: Format) => string>,
    weight: (percent: number) => `peso ${percent}%`,
    delta: (delta: number) =>
      delta === 0
        ? 'Igual aos 7 dias anteriores'
        : `${delta > 0 ? '+' : '−'}${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'ponto' : 'pontos'} em relação aos 7 dias anteriores`,
  },

  markers: {
    feijao: 'Feijão e outras leguminosas',
    frutas: 'Frutas',
    verduras: 'Verduras e legumes',
    embutidos: 'Hambúrguer e embutidos',
    adocadas: 'Refrigerantes e bebidas adoçadas',
    salgadinhos: 'Macarrão instantâneo, salgadinhos e biscoitos salgados',
    doces: 'Biscoito recheado, doces e guloseimas',
  } satisfies Record<MarkerKey, string>,

  /** `n` e `of` vêm de cada destaque (ver `Insight`). */
  insights: {
    fv_great: (n: number, _of: number, f: Format) =>
      `Ótimo consumo de frutas, verduras e legumes: ${f.decimal(n)} porções por dia em média.`,
    fv_good: (n: number, of: number, f: Format) =>
      `Bom consumo de frutas, verduras e legumes (${f.decimal(n)} porções por dia). Falta pouco para a meta de ${of}.`,
    beans_most: (n: number, of: number) =>
      `Feijão ou outras leguminosas em ${n} de ${of} dias — ótima fonte de fibras, ferro e proteína.`,
    few_ultra: (n: number, _of: number, f: Format) =>
      `Poucos ultraprocessados: apenas ${f.percent(n)} dos itens.`,
    no_sugary: () => 'Nenhum refrigerante ou bebida adoçada no período.',
    regular_meals: () =>
      'Refeições principais (café da manhã, almoço e jantar) registradas com regularidade.',
    breakfast_daily: () => 'Café da manhã registrado em todos os dias.',
    variety_good: (n: number) => `Boa variedade: ${n} alimentos diferentes de boa qualidade.`,
    water: (n: number, of: number) =>
      `Água registrada em ${n} de ${of} dias. Continue se hidratando!`,
    whole_grains: (n: number) => `Cereais integrais apareceram ${times(n)}.`,
    in_natura: (n: number, _of: number, f: Format) =>
      `${f.percent(n)} dos itens foram alimentos in natura ou minimamente processados — a base de uma alimentação saudável.`,
    fv_low: (n: number, of: number, f: Format) =>
      `Poucas frutas, verduras e legumes: ${f.decimal(n)} porções por dia em média (o recomendado é pelo menos ${of}).`,
    fruits_few: (n: number, of: number) => `Frutas apareceram em apenas ${days(n)} de ${of}.`,
    vegetables_few: (n: number, of: number) =>
      `Verduras e legumes apareceram em apenas ${days(n)} de ${of}.`,
    ultra_high: (n: number, _of: number, f: Format) =>
      `Ultraprocessados representaram ${f.percent(n)} dos itens. Prefira alimentos in natura e preparações caseiras.`,
    sugary: (n: number) =>
      `Refrigerantes e bebidas adoçadas apareceram ${times(n)}. Troque por água, água com gás e limão ou suco natural sem açúcar.`,
    sweets: (n: number, of: number) => `Doces e guloseimas apareceram em ${n} de ${of} dias.`,
    processed_meat: (n: number) =>
      `Hambúrguer e embutidos apareceram ${times(n)} — costumam ter muito sódio e conservantes.`,
    salty_snacks: (n: number) =>
      `Salgadinhos de pacote, biscoitos salgados ou macarrão instantâneo apareceram ${times(n)}.`,
    fast_food: (n: number) => `Lanches, salgados e fast food apareceram ${times(n)}.`,
    alcohol: (n: number) => `Bebidas alcoólicas apareceram ${times(n)}.`,
    no_breakfast: (n: number) => `Sem café da manhã registrado em ${n} dias.`,
    skipped_meals: (n: number) =>
      `Almoço ou jantar ficaram sem registro em ${n} dias. Se você pulou refeições, tente manter horários regulares.`,
    beans_low: (n: number, of: number) =>
      `Feijão apareceu pouco (${days(n)} de ${of}). Arroz com feijão é uma combinação nutritiva e bem brasileira.`,
    variety_low: (n: number) =>
      `Pouca variedade: ${n} alimentos diferentes de boa qualidade. Variar ajuda a obter mais nutrientes.`,
    incomplete: (n: number, of: number) =>
      `Você registrou ${days(n)} de ${of}. Registros completos deixam o relatório mais fiel.`,
    unclassified: (n: number) =>
      n === 1
        ? '1 item não foi reconhecido e ficou fora do cálculo. Você pode classificá-lo editando a refeição.'
        : `${n} itens não foram reconhecidos e ficaram fora do cálculo. Você pode classificá-los editando a refeição.`,
  } satisfies Record<InsightKey, (n: number, of: number, f: Format) => string>,

  /** Dicas baseadas no Guia Alimentar para a População Brasileira (Ministério da Saúde). */
  tips: [
    'Faça de alimentos in natura ou minimamente processados — frutas, verduras, legumes, arroz, feijão, ovos — a base da sua alimentação.',
    'Use óleos, gorduras, sal e açúcar em pequenas quantidades ao temperar e cozinhar.',
    'Limite alimentos processados, como conservas, queijos e pães industrializados.',
    'Evite ultraprocessados, como refrigerantes, biscoitos recheados, salgadinhos de pacote e macarrão instantâneo.',
    'Coma com regularidade e atenção, em ambientes tranquilos e, sempre que possível, em companhia.',
    'Prefira fazer compras em feiras, sacolões e mercados com variedade de alimentos frescos.',
    'Cozinhar é um ótimo hábito: experimente uma receita nova nesta semana.',
    'Planeje as refeições da semana — fica mais fácil fugir dos lanches de última hora.',
    'Ao comer fora, prefira lugares que servem comida feita na hora.',
    'Desconfie de propagandas de alimentos: elas vendem produtos, não saúde.',
    'Arroz com feijão é uma combinação completa e bem brasileira: tem fibras, ferro e proteínas.',
    'Tente incluir uma fruta no café da manhã e outra no lanche da tarde.',
    'Beba água ao longo do dia — deixar uma garrafinha por perto ajuda a lembrar.',
    'Troque o refrigerante por água com gás e limão ou por um suco natural sem açúcar.',
    'Encher metade do prato com verduras e legumes é um jeito fácil de chegar às 5 porções diárias.',
    'Prefira a fruta inteira ao suco: ela tem mais fibras e sacia mais.',
    'Castanhas, frutas e iogurte natural são ótimas opções de lanche no lugar de biscoitos.',
    'Varie as cores do prato: cada cor de vegetal traz nutrientes diferentes.',
  ],

  nav: {
    label: 'Navegação principal',
    home: 'Início',
    history: 'Histórico',
    add: 'Registrar refeição',
    reports: 'Relatórios',
    profile: 'Perfil',
  },

  update: {
    available: 'Nova versão do EatMate disponível.',
    update: 'Atualizar',
    later: 'Depois',
  },

  locked: {
    title: 'Termômetro da alimentação',
    text: (days: number) =>
      `Registre o que você come por ${days} dias para ver a qualidade da sua alimentação, com nota de A a E, e receber seu primeiro relatório.`,
    progress: (n: number, total: number) => `${n} de ${total} dias registrados`,
    count: (n: number, total: number) => `${n} de ${total} dias`,
    missing: (n: number) => (n === 1 ? 'falta 1 dia' : `faltam ${n} dias`),
    registered: 'registrados',
    example: 'Ver um relatório de exemplo',
  },

  onboarding: {
    title: 'Bem-vindo ao EatMate',
    subtitle: 'Seu diário alimentar simples, sem contar calorias.',
    features: [
      {
        title: 'Registre o que você comeu',
        text: 'Do seu jeito, na hora ou depois: "café com leite e pão na chapa".',
      },
      {
        title: 'Termômetro da alimentação',
        text: 'Depois de 7 dias, veja a qualidade da sua alimentação em uma nota de A a E.',
      },
      {
        title: 'Relatórios para compartilhar',
        text: 'Mostre ao seu nutricionista ou cole em uma IA para receber sugestões.',
      },
    ],
    nameLabel: 'Como podemos te chamar?',
    namePlaceholder: 'Seu nome',
    start: 'Começar',
    restore: 'Já usa o EatMate? Restaurar backup',
    restored: (meals: number) => `Backup restaurado: ${meals} refeições.`,
    askName: 'Agora é só dizer como podemos te chamar.',
    privacy: 'Seus dados ficam guardados só neste aparelho.',
  },

  dashboard: {
    hello: (name: string) => `Olá, ${name}!`,
    ctaTitle: 'Registrar refeição',
    ctaSubtitle: 'O que você comeu agora ou mais cedo?',
    thermoTitle: 'Qualidade da sua alimentação',
    seeReport: 'Ver relatório completo',
    noScore:
      'Ainda não há alimentos reconhecidos suficientes nos últimos 7 dias para calcular a nota.',
    today: 'Hoje',
    seeDay: 'Ver dia',
    add: 'Adicionar',
    registered: 'Registrado',
    streak: 'dias seguidos',
    registeredDays: 'dias registrados',
    meals7: 'refeições em 7 dias',
    tip: 'Dica do dia',
  },

  foodInput: {
    label: 'O que você comeu?',
    placeholder: 'Ex.: "arroz, feijão e salada"',
    add: 'Adicionar',
    suggestions: 'Sugestões de alimentos',
    nothingFound:
      'Não encontrei nenhum alimento nesse texto. Tente algo como "arroz, feijão e salada".',
  },

  mealForm: {
    newTitle: 'Registrar refeição',
    editTitle: 'Editar refeição',
    notFound: 'Refeição não encontrada',
    notFoundText: 'Ela pode ter sido excluída.',
    when: 'Quando?',
    date: 'Data',
    time: 'Horário (opcional)',
    future: 'Não dá para registrar refeições no futuro.',
    which: 'Qual refeição?',
    alreadyBefore: (meal: string) => `Você já registrou ${meal.toLowerCase()} neste dia.`,
    editExisting: 'Editar o registro existente',
    alreadyAfter: 'ou salve este como um registro separado.',
    what: 'O que você comeu?',
    hint: 'Escreva um alimento por vez ou a frase inteira — o EatMate separa os itens.',
    items: 'Itens da refeição',
    notRecognized: 'Não reconhecido · classificar',
    quantityPlaceholder: '+ quantidade (ex.: 2 fatias)',
    quantityOf: (name: string) => `Quantidade de ${name}`,
    removeItem: (name: string) => `Remover ${name}`,
    empty: 'Nenhum alimento adicionado ainda.',
    quality: 'Qualidade média desta refeição',
    frequent: 'Você costuma comer:',
    notes: 'Observações (opcional)',
    notesPlaceholder: 'Ex.: comi fora, estava com muita fome…',
    saveChanges: 'Salvar alterações',
    save: 'Salvar refeição',
    changesSaved: 'Alterações salvas!',
    saved: (meal: string) => `${meal} registrado!`,
    saveError: 'Não foi possível salvar. Tente novamente.',
    deleteTitle: 'Excluir esta refeição?',
    deleteMessage: (meal: string, date: string) =>
      `${meal} de ${date}. Essa ação não pode ser desfeita.`,
    deleted: 'Refeição excluída.',
    deleteLabel: 'Excluir refeição',
  },

  history: {
    title: 'Histórico',
    count: (n: number) => `${n} ${n === 1 ? 'dia registrado' : 'dias registrados'}`,
    emptyTitle: 'Nenhum registro ainda',
    emptyText: 'Os dias em que você registrar refeições vão aparecer aqui.',
    register: 'Registrar refeição',
    search: 'Buscar alimento',
    searchPlaceholder: 'Buscar alimento (ex.: pizza)',
    noMatch: (query: string) => `Nenhum dia com “${query}”.`,
  },

  day: {
    title: 'Dia',
    invalid: 'Data inválida',
    deleteMealTitle: (meal: string) => `Excluir ${meal.toLowerCase()}?`,
    irreversible: 'Essa ação não pode ser desfeita.',
    deleteDayTitle: 'Excluir todos os registros do dia?',
    deleteDayMessage: (meals: number, date: string) =>
      `${meals} ${meals === 1 ? 'refeição' : 'refeições'} de ${date} serão excluídas.`,
    deleteDayConfirm: 'Excluir dia',
    dayDeleted: 'Registros do dia excluídos.',
    empty: 'Nenhum registro neste dia',
    registerHere: 'Registrar refeição neste dia',
    summary: 'Resumo do dia',
    grade: (label: string) => `Nota do dia: ${label}`,
    noGrade: 'Sem nota',
    items: (n: number) => plural(n, '1 item', `${n} itens`),
    fruitsAndVegetables: (n: number) =>
      `${n} ${n === 1 ? 'porção' : 'porções'} de frutas e verduras`,
    ultraProcessed: (n: number) => `${n} ${n === 1 ? 'ultraprocessado' : 'ultraprocessados'}`,
    unclassified: (n: number) => `${n} sem classificação`,
    edit: (meal: string) => `Editar ${meal}`,
    delete: (meal: string) => `Excluir ${meal}`,
    missingLabel: 'Refeições principais sem registro',
    missing: (meal: string) => `${meal} não registrado`,
    addHere: 'Adicionar refeição neste dia',
    deleteAll: 'Excluir todos os registros do dia',
  },

  report: {
    footnote:
      'As notas de A a E e o grau de processamento são estimativas automáticas, inspiradas no Nutri-Score e no Guia Alimentar para a População Brasileira. Este relatório não substitui a orientação de um(a) nutricionista.',
    generatedAt: (date: string) => `Gerado em ${date}`,
    noScore: 'Não há alimentos reconhecidos suficientes neste período para calcular a nota.',
    kpis: {
      days: 'dias registrados',
      meals: 'refeições',
      fruitsAndVegetables: 'porções de frutas e verduras por dia',
      ultraProcessed: 'de ultraprocessados',
    },
    highlights: 'Destaques',
    positives: 'Pontos positivos',
    attention: 'Pontos de atenção',
    breakdown: 'Como a nota foi calculada',
    breakdownText: 'Cinco critérios, cada um de 0 a 100, com pesos diferentes.',
    markers: 'Marcadores de consumo',
    markersText: (days: number) =>
      `Em quantos dos ${days} dias registrados cada grupo apareceu (inspirado no SISVAN, do Ministério da Saúde).`,
    markersGood: 'O ideal é consumir todos os dias',
    markersAvoid: 'O ideal é evitar',
    status: { good: 'Ótimo', warn: 'Pode melhorar', bad: 'Atenção' },
    distributions: 'Qualidade e processamento',
    gradesTitle: 'Notas dos alimentos (A a E)',
    gradesLabel: (list: string) => `Distribuição das notas: ${list}`,
    processingTitle: 'Grau de processamento',
    processingLabel: (list: string) => `Grau de processamento: ${list}`,
    groups: 'Grupos de alimentos',
    group: 'Grupo',
    times: 'Vezes',
    daysColumn: 'Dias',
    meals: 'Refeições',
    mealsText: (days: number) => `Em quantos dos ${days} dias registrados cada refeição aparece.`,
    mealDays: (meal: string, days: number) => `${meal}: ${days} dias`,
    of: 'de',
    topFoods: 'Alimentos mais frequentes',
    dayByDay: 'Dia a dia',
    diary: 'Diário alimentar completo',
    diaryText: 'Tudo o que foi registrado no período, para mostrar ao seu nutricionista.',
    notes: 'Obs.:',
    noRecord: 'Sem registro.',
  },

  reportActions: {
    title: 'Usar este relatório',
    text: 'Cole em uma IA (ChatGPT, Gemini, Claude…) para receber sugestões de melhoria, ou salve em PDF para levar ao seu nutricionista.',
    copyForAI: 'Copiar para usar em uma IA',
    print: 'PDF / Imprimir',
    share: 'Compartilhar',
    copyText: 'Copiar texto',
    download: 'Baixar arquivo',
    copiedForAI: 'Copiado! Agora é só colar na IA de sua preferência.',
    copied: 'Relatório copiado.',
    copyFailed: 'Não foi possível copiar.',
    shareFailed: 'Não foi possível compartilhar neste aparelho.',
    fileName: 'eatmate relatorio',
  },

  currentReport: {
    header: 'Relatório',
    title: 'Últimos 7 dias',
    live: 'Ao vivo',
    notice:
      'Este relatório se atualiza sozinho conforme você registra. Ao fim de cada semana, uma cópia é guardada no seu histórico de relatórios.',
    exportTitle: 'Relatório alimentar',
    savedInHistory: 'Salvo no histórico',
    updateInHistory: 'Atualizar no histórico',
    saveInHistory: 'Salvar no histórico',
    updated: 'Relatório atualizado no histórico.',
    saved: 'Relatório salvo no histórico.',
  },

  exampleReport: {
    header: 'Relatório de exemplo',
    title: 'Exemplo',
    badge: 'Dados fictícios',
    notice:
      'Este é um exemplo com uma semana inventada. Seu relatório de verdade aparece depois de 7 dias de registros.',
    register: 'Registrar uma refeição',
  },

  reports: {
    title: 'Relatórios',
    subtitle: 'Seu histórico de relatórios semanais',
    week: (n: number) => `Semana ${n}`,
    custom: 'Relatório personalizado',
    current: 'Relatório atual',
    currentText: 'Últimos 7 dias, atualizado em tempo real',
    info: 'A cada semana encerrada, um relatório é salvo aqui automaticamente. Se você corrigir algum registro depois, é só gerar o relatório novamente.',
    list: 'Relatórios salvos',
    generatedAt: (date: string) => `Gerado em ${date}`,
    stale: 'Desatualizado',
    regenerate: 'Gerar novamente',
    regenerateNow: 'Gerar novamente com os dados atuais',
    regenerated: (title: string) => `${title} gerado novamente com os dados atuais.`,
    regeneratedOne: 'Relatório gerado novamente com os dados atuais.',
    delete: 'Excluir',
    deleteLabel: 'Excluir relatório',
    deleteTitle: (title: string) => `Excluir “${title}”?`,
    deleteWeekly:
      'Seus registros de refeições continuam salvos. Você pode gerar este relatório de novo quando quiser.',
    deleteCustom: 'Seus registros de refeições continuam salvos.',
    deleted: 'Relatório excluído.',
    emptyTitle: 'Nenhum relatório salvo ainda',
    emptyUnlocked:
      'O primeiro relatório semanal aparece aqui quando a semana terminar. Você também pode salvar o relatório atual.',
    emptyLocked: 'Seus relatórios aparecem aqui depois de 7 dias de registros.',
    other: 'Gerar relatório de outro período',
    lastDay: 'Último dia do período',
    covers: (period: string) => `O relatório vai cobrir os 7 dias de ${period}.`,
    pickDate: 'Escolha uma data.',
    generate: 'Gerar relatório',
    generated: 'Relatório gerado.',
    notFound: 'Relatório não encontrado',
    notFoundText: 'Ele pode ter sido excluído.',
    staleNotice: 'Você alterou registros deste período depois que este relatório foi gerado.',
  },

  profile: {
    title: 'Perfil',
    name: 'Seu nome',
    saveName: 'Salvar nome',
    nameSaved: 'Nome atualizado.',
    language: 'Idioma',
    languageHint:
      'Muda os textos do app, dos relatórios e os nomes que o EatMate reconhece quando você digita o que comeu.',
    appearance: 'Aparência',
    themes: { system: 'Automático', light: 'Claro', dark: 'Escuro' },
    install: 'Instalar o app',
    installed: 'Você já está usando o EatMate instalado. 🎉',
    installText:
      'Instale o EatMate para abrir direto da tela inicial, como um aplicativo, mesmo sem internet.',
    installButton: 'Instalar EatMate',
    installIOS:
      'No iPhone, abra no Safari, toque em **Compartilhar** e depois em **Adicionar à Tela de Início**.',
    installOther: 'No menu do navegador, procure **Instalar app** ou **Adicionar à tela inicial**.',
    data: 'Seus dados',
    dataSummary: (meals: number, days: number, reports: number) =>
      `${meals} refeições em ${days} dias · ${reports} relatórios. Tudo fica salvo apenas neste aparelho — faça um backup de vez em quando para não perder nada se trocar de celular.`,
    lastBackup: 'Último backup:',
    never: 'nunca',
    export: 'Exportar backup',
    import: 'Importar backup',
    exported: 'Backup salvo nos seus arquivos.',
    importTitle: 'Importar backup?',
    importMessage: (meals: number, reports: number) =>
      `O arquivo tem ${meals} refeições e ${reports} relatórios. Eles serão juntados aos seus dados atuais — nada será apagado.`,
    importConfirm: 'Importar',
    imported: (meals: number) => `Backup importado: ${meals} refeições.`,
    customFoods: 'Meus alimentos',
    customFoodsText: 'Alimentos que você classificou. Toque no lápis para mudar a categoria.',
    changeCategory: (name: string) => `Mudar categoria de ${name}`,
    removeFood: (name: string) => `Remover ${name}`,
    removeFoodTitle: (name: string) => `Remover “${name}”?`,
    removeFoodMessage:
      'Os registros com este alimento continuam salvos, mas ficam sem classificação.',
    foodRemoved: 'Alimento removido.',
    reclassified: 'Classificação atualizada.',
    method: {
      title: 'Como a nota é calculada?',
      intro:
        'Cada alimento tem uma nota de **A** (melhor) a **E**, inspirada no Nutri-Score europeu, e um grau de processamento segundo o **Guia Alimentar para a População Brasileira** (in natura, ingredientes culinários, processados e ultraprocessados).',
      criteria: 'A nota da semana vai de 0 a 100 e combina cinco critérios:',
      items: {
        qualidade: 'Qualidade nutricional dos alimentos',
        processamento: 'Grau de processamento',
        frutas_verduras: 'Frutas, verduras e legumes (meta: 5 porções por dia)',
        variedade: 'Variedade de alimentos',
        regularidade: 'Regularidade do café da manhã, almoço e jantar',
      } satisfies Record<ScoreComponentKey, string>,
      letters: (thresholds: string, min: number) =>
        `Depois, os pontos viram letra: ${thresholds} e E abaixo de ${min}.`,
      threshold: (grade: Grade, min: number) => `${grade} a partir de ${min}`,
      disclaimer:
        'As notas são estimativas para ajudar você a perceber padrões — não substituem a orientação de um(a) nutricionista.',
    },
    danger: 'Apagar dados',
    dangerText: 'Remove todas as refeições, relatórios e configurações deste aparelho.',
    eraseAll: 'Apagar todos os dados',
    eraseTitle: 'Apagar todos os dados?',
    eraseMessage:
      'Todas as refeições, relatórios e configurações deste aparelho serão apagados. Se quiser guardar uma cópia, exporte um backup antes.',
    eraseConfirm: 'Apagar tudo',
    version: (version: string) => `EatMate ${version} · seus dados ficam só com você.`,
  },

  backup: {
    invalidJson: 'O arquivo não é um backup válido do EatMate (JSON inválido).',
    notEatmate: 'Este arquivo não parece ser um backup do EatMate.',
    readError: 'Não foi possível ler o arquivo.',
    importError: 'Não foi possível importar o arquivo.',
  },

  notFound: {
    title: 'Página não encontrada',
    text: 'Este endereço não existe no EatMate.',
    home: 'Voltar ao início',
    errorTitle: 'Algo deu errado',
    errorText: 'Seus dados continuam salvos neste aparelho. Tente recarregar o app.',
    reload: 'Recarregar o app',
  },

  /** Relatório em texto (Markdown), para colar em uma IA, no WhatsApp ou em um e-mail. */
  export: {
    title: 'Relatório alimentar',
    name: 'Nome',
    period: 'Período',
    periodValue: (start: string, end: string, registered: number, total: number) =>
      `${start} a ${end} (${registered} de ${total} dias registrados)`,
    meals: 'Refeições registradas',
    items: 'Itens',
    overall: 'Nota geral',
    noData: 'sem dados suficientes',
    previous: (period: string) => `Período anterior (${period})`,
    howCalculated: 'Como a nota foi calculada',
    weight: (percent: number) => `peso ${percent}%`,
    positives: 'Pontos positivos',
    attention: 'Pontos de atenção',
    markers: 'Marcadores de consumo alimentar',
    markersIntro: (days: number) => `Dias com consumo, de ${days} dias registrados:`,
    idealDaily: 'ideal: todos os dias',
    idealAvoid: 'ideal: evitar',
    grades: 'Qualidade dos alimentos (escala A a E)',
    nova: 'Grau de processamento (classificação NOVA)',
    groups: 'Grupos de alimentos',
    groupLine: (group: string, count: number, days: string) => `${group}: ${count}x em ${days}`,
    fruitsAndVegetables: (perDay: string) =>
      `Frutas, verduras e legumes: média de ${perDay} porções por dia.`,
    mealsTitle: 'Refeições registradas',
    mealLine: (meal: string, n: number, days: string) => `${meal}: ${n} de ${days}`,
    topFoods: 'Alimentos mais frequentes',
    diary: 'Diário alimentar',
    dayGrade: (grade: Grade) => `nota do dia: ${grade}`,
    noRecord: '(sem registro)',
    note: 'Observação',
    footer: (date?: string) =>
      `Gerado pelo EatMate${date ? ` em ${date}` : ''}. As notas (A a E) e o grau de processamento são estimativas automáticas, inspiradas no Nutri-Score e no Guia Alimentar para a População Brasileira. Este relatório não substitui a orientação de um(a) nutricionista.`,
    aiIntro: (name: string, period: string) =>
      `Olá! ${name ? `Sou ${name} e registrei` : 'Registrei'} minha alimentação no app EatMate. Abaixo está o meu relatório de ${period}.`,
    aiAsk: [
      'Com base nele, por favor:',
      '1. Avalie os pontos fortes e fracos da minha alimentação;',
      '2. Sugira melhorias práticas e realistas, respeitando a cultura alimentar brasileira;',
      '3. Proponha trocas simples para os itens com nota D ou E;',
      '4. Monte um exemplo de cardápio para um dia, com café da manhã, almoço, lanche e jantar.',
    ],
    aiNote:
      'Observação: as notas A–E e o grau de processamento foram estimados automaticamente pelo app.',
  },
};

export type Messages = typeof pt;
