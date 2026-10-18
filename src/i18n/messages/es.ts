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
import type { Messages } from './pt';

/*
 * Textos del app en español (misma estructura que `pt.ts`, ver `Messages`).
 *
 * `**texto**` se muestra en negrita (componente `Rich`).
 */

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
const days = (n: number) => plural(n, '1 día', `${n} días`);
const times = (n: number) => plural(n, '1 vez', `${n} veces`);
const meals = (n: number) => plural(n, '1 comida', `${n} comidas`);
const reports = (n: number) => plural(n, '1 informe', `${n} informes`);

export const es: Messages = {
  common: {
    back: 'Volver',
    close: 'Cerrar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    remove: 'Quitar',
    today: 'Hoy',
    yesterday: 'Ayer',
    loading: 'Cargando',
    backupFile: 'Archivo de copia de seguridad',
    days,
    meals,
    daysOf: (n: number, total: number) => `${n} de ${total} días`,
  },

  grades: {
    labels: {
      A: 'Excelente',
      B: 'Buena',
      C: 'Regular',
      D: 'Mejorable',
      E: 'Necesita atención',
    } satisfies Record<Grade, string>,
    messages: {
      A: '¡Tu alimentación va genial! Sigue así.',
      B: 'Vas por buen camino: con pequeños ajustes puedes llegar a la A.',
      C: 'Tienes buenos hábitos, pero también hay margen para mejorar.',
      D: 'Tu alimentación necesita algunos ajustes. Mira los consejos del informe.',
      E: '¿Qué tal si empiezas con pequeños cambios en el día a día? El informe te muestra por dónde empezar.',
    } satisfies Record<Grade, string>,
    badge: (grade: Grade, label: string) => `Nota ${grade} — ${label}`,
    unclassified: 'Sin clasificar',
    scale: (grade: Grade, label: string) => `Nota ${grade} en la escala de la A a la E: ${label}`,
    thermometer: (score: number, grade: Grade) =>
      `Termómetro: ${score} de 100 puntos, nota ${grade}`,
  },

  mealTypes: {
    cafe_manha: 'Desayuno',
    lanche_manha: 'Media mañana',
    almoco: 'Almuerzo',
    cafe_tarde: 'Merienda',
    jantar: 'Cena',
    ceia: 'Antes de dormir',
  } satisfies Record<MealType, string>,

  groups: {
    frutas: 'Frutas',
    verduras_legumes: 'Verduras y hortalizas',
    leguminosas: 'Legumbres',
    cereais: 'Cereales, panes, raíces y tubérculos',
    carnes_ovos: 'Carnes, pescados y huevos',
    leite_derivados: 'Leche y derivados',
    oleaginosas: 'Frutos secos y semillas',
    bebidas: 'Agua, café y té',
    bebidas_adocadas: 'Jugos y bebidas azucaradas',
    doces: 'Dulces y golosinas',
    lanches: 'Sándwiches, frituras y comida rápida',
    pratos: 'Platos y preparaciones',
    gorduras_molhos: 'Aceites, grasas y salsas',
    alcool: 'Bebidas alcohólicas',
  } satisfies Record<FoodGroup, string>,

  nova: {
    1: 'Naturales o mínimamente procesados',
    2: 'Ingredientes culinarios (aceites, azúcar, mantequilla)',
    3: 'Procesados',
    4: 'Ultraprocesados',
  } satisfies Record<Nova, string>,

  classify: {
    title: (name: string) => `¿Qué es “${name}”?`,
    description: 'Elige la categoría que mejor encaje. EatMate lo recordará la próxima vez.',
    done: (name: string, category: string) =>
      `“${name}” se clasificó como ${category.toLowerCase()}.`,
    options: {
      fruta: { label: 'Fruta', examples: 'manzana, naranja, mango' },
      verdura: { label: 'Verdura u hortaliza', examples: 'lechuga, zanahoria, tomate' },
      leguminosa: { label: 'Legumbre', examples: 'frijoles, lentejas, garbanzos' },
      cereal: { label: 'Arroz, pasta, raíz o tubérculo', examples: 'arroz, pasta, yuca' },
      pao: { label: 'Pan, tostada o galleta salada', examples: 'pan, tostadas' },
      carne: { label: 'Carne, pollo, pescado o huevo', examples: 'bistec, pollo, atún, huevo' },
      embutido: { label: 'Embutido', examples: 'jamón, salchicha, chorizo' },
      laticinio: { label: 'Leche, yogur o queso', examples: 'leche, yogur, queso' },
      oleaginosa: { label: 'Fruto seco o semilla', examples: 'nueces, almendras, chía' },
      bebida: { label: 'Agua, café o té sin azúcar', examples: 'agua, café, té' },
      adocada: { label: 'Jugo o bebida azucarada', examples: 'refresco, jugo envasado' },
      doce: { label: 'Dulce o postre', examples: 'chocolate, flan, helado' },
      lanche: {
        label: 'Sándwich, fritura o comida rápida',
        examples: 'empanada, hamburguesa, pizza',
      },
      prato_caseiro: { label: 'Plato casero', examples: 'hecho en casa con alimentos frescos' },
      prato_pronto: {
        label: 'Plato preparado o congelado',
        examples: 'lasaña congelada, sopa de sobre',
      },
      gordura: {
        label: 'Salsa, aceite o grasa',
        examples: 'mayonesa, mantequilla, aceite de oliva',
      },
      alcool: { label: 'Bebida alcohólica', examples: 'cerveza, vino, cóctel' },
    } satisfies Record<ClassifyKey, { label: string; examples: string }>,
  },

  score: {
    components: {
      qualidade: 'Calidad nutricional',
      processamento: 'Grado de procesamiento',
      frutas_verduras: 'Frutas y verduras',
      variedade: 'Variedad',
      regularidade: 'Regularidad de las comidas',
    } satisfies Record<ScoreComponentKey, string>,
    details: {
      qualidade: (s: ScoreFacts) => `Nota media de los alimentos: ${s.averageGrade}`,
      processamento: (s: ScoreFacts, f: Format) =>
        `${f.percent(s.inNaturaShare)} naturales o mínimamente procesados · ${f.percent(s.ultraShare)} ultraprocesados`,
      frutas_verduras: (s: ScoreFacts, f: Format) =>
        `${f.decimal(s.fvPerDay)} porciones al día (objetivo: ${s.fvTarget})`,
      variedade: (s: ScoreFacts) =>
        `${s.distinctGood} alimentos distintos con nota A, B o C (objetivo: ${s.varietyTarget})`,
      regularidade: (s: ScoreFacts, f: Format) =>
        `${f.percent(s.mainMealsShare)} de las comidas principales registradas (desayuno, almuerzo y cena)`,
    } satisfies Record<ScoreComponentKey, (s: ScoreFacts, f: Format) => string>,
    weight: (percent: number) => `peso ${percent} %`,
    delta: (delta: number) =>
      delta === 0
        ? 'Igual que los 7 días anteriores'
        : `${delta > 0 ? '+' : '−'}${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'punto' : 'puntos'} respecto a los 7 días anteriores`,
  },

  markers: {
    feijao: 'Legumbres',
    frutas: 'Frutas',
    verduras: 'Verduras y hortalizas',
    embutidos: 'Hamburguesas y embutidos',
    adocadas: 'Refrescos y bebidas azucaradas',
    salgadinhos: 'Fideos instantáneos, snacks de bolsa y galletas saladas',
    doces: 'Galletas rellenas, dulces y golosinas',
  } satisfies Record<MarkerKey, string>,

  /** `n` y `of` vienen de cada destacado (ver `Insight`). */
  insights: {
    fv_great: (n: number, _of: number, f: Format) =>
      `Excelente consumo de frutas y verduras: ${f.decimal(n)} porciones al día en promedio.`,
    fv_good: (n: number, of: number, f: Format) =>
      `Buen consumo de frutas y verduras (${f.decimal(n)} porciones al día). Te falta poco para llegar al objetivo de ${of}.`,
    beans_most: (n: number, of: number) =>
      `Legumbres en ${n} de ${of} días: una excelente fuente de fibra, hierro y proteína.`,
    few_ultra: (n: number, _of: number, f: Format) =>
      `Pocos ultraprocesados: solo el ${f.percent(n)} de los alimentos.`,
    no_sugary: () => 'Ningún refresco ni bebida azucarada en el período.',
    regular_meals: () =>
      'Comidas principales (desayuno, almuerzo y cena) registradas con regularidad.',
    breakfast_daily: () => 'Desayuno registrado todos los días.',
    variety_good: (n: number) => `Buena variedad: ${n} alimentos distintos de buena calidad.`,
    water: (n: number, of: number) => `Agua registrada en ${n} de ${of} días. ¡Sigue hidratándote!`,
    whole_grains: (n: number) => `Los cereales integrales aparecieron ${times(n)}.`,
    in_natura: (n: number, _of: number, f: Format) =>
      `El ${f.percent(n)} de los alimentos fueron naturales o mínimamente procesados: la base de una alimentación saludable.`,
    fv_low: (n: number, of: number, f: Format) =>
      `Pocas frutas y verduras: ${f.decimal(n)} porciones al día en promedio (lo recomendado es al menos ${of}).`,
    fruits_few: (n: number, of: number) => `Las frutas aparecieron solo en ${days(n)} de ${of}.`,
    vegetables_few: (n: number, of: number) =>
      `Las verduras aparecieron solo en ${days(n)} de ${of}.`,
    ultra_high: (n: number, _of: number, f: Format) =>
      `Los ultraprocesados fueron el ${f.percent(n)} de los alimentos. Da prioridad a los alimentos naturales y a las preparaciones caseras.`,
    sugary: (n: number) =>
      `Los refrescos y bebidas azucaradas aparecieron ${times(n)}. Cámbialos por agua, agua con gas y limón o jugo natural sin azúcar.`,
    sweets: (n: number, of: number) => `Los dulces y golosinas aparecieron en ${n} de ${of} días.`,
    processed_meat: (n: number) =>
      `Las hamburguesas y embutidos aparecieron ${times(n)}: suelen tener mucho sodio y conservantes.`,
    salty_snacks: (n: number) =>
      `Los snacks de bolsa, galletas saladas o fideos instantáneos aparecieron ${times(n)}.`,
    fast_food: (n: number) => `Los sándwiches, frituras y comida rápida aparecieron ${times(n)}.`,
    alcohol: (n: number) => `Las bebidas alcohólicas aparecieron ${times(n)}.`,
    no_breakfast: (n: number) => `Sin desayuno registrado en ${days(n)}.`,
    skipped_meals: (n: number) =>
      `El almuerzo o la cena quedaron sin registrar en ${days(n)}. Si te saltaste comidas, intenta mantener horarios regulares.`,
    beans_low: (n: number, of: number) =>
      `Pocas legumbres (${days(n)} de ${of}). Los frijoles, las lentejas y los garbanzos son una fuente barata de fibra, hierro y proteína.`,
    variety_low: (n: number) =>
      `Poca variedad: ${n} alimentos distintos de buena calidad. Variar te ayuda a obtener más nutrientes.`,
    incomplete: (n: number, of: number) =>
      `Registraste ${days(n)} de ${of}. Con registros completos, el informe es más fiel.`,
    unclassified: (n: number) =>
      n === 1
        ? '1 alimento no se reconoció y quedó fuera del cálculo. Puedes clasificarlo editando la comida.'
        : `${n} alimentos no se reconocieron y quedaron fuera del cálculo. Puedes clasificarlos editando la comida.`,
  } satisfies Record<InsightKey, (n: number, of: number, f: Format) => string>,

  /** Consejos basados en la Guía Alimentaria para la Población Brasileña (Ministerio de Salud de Brasil). */
  tips: [
    'Haz de los alimentos naturales o mínimamente procesados (frutas, verduras, arroz, legumbres, huevos) la base de tu alimentación.',
    'Usa aceites, grasas, sal y azúcar en pequeñas cantidades al condimentar y cocinar.',
    'Limita los alimentos procesados, como conservas, quesos y panes industriales.',
    'Evita los ultraprocesados, como refrescos, galletas rellenas, snacks de bolsa y fideos instantáneos.',
    'Come con regularidad y atención, en ambientes tranquilos y, siempre que puedas, en compañía.',
    'Siempre que puedas, compra en mercados y fruterías con variedad de alimentos frescos.',
    'Cocinar es un gran hábito: prueba una receta nueva esta semana.',
    'Planifica las comidas de la semana: así es más fácil evitar la comida rápida de último momento.',
    'Cuando comas fuera, elige lugares que sirvan comida recién hecha.',
    'Desconfía de la publicidad de alimentos: vende productos, no salud.',
    'Las legumbres (frijoles, lentejas, garbanzos) con arroz u otro cereal forman una combinación completa: aportan fibra, hierro y proteína.',
    'Intenta incluir una fruta en el desayuno y otra en la merienda.',
    'Bebe agua a lo largo del día: tener una botella cerca te ayuda a recordarlo.',
    'Cambia el refresco por agua con gas y limón o por un jugo natural sin azúcar.',
    'Llenar medio plato con verduras es una forma fácil de llegar a las 5 porciones diarias.',
    'Elige la fruta entera en lugar del jugo: tiene más fibra y sacia más.',
    'Los frutos secos, la fruta y el yogur natural son excelentes opciones para picar entre comidas, en lugar de galletas.',
    'Varía los colores del plato: cada color de verdura aporta nutrientes diferentes.',
  ],

  nav: {
    label: 'Navegación principal',
    home: 'Inicio',
    history: 'Historial',
    add: 'Registrar comida',
    reports: 'Informes',
    profile: 'Perfil',
  },

  update: {
    available: 'Hay una nueva versión de EatMate.',
    update: 'Actualizar',
    later: 'Más tarde',
  },

  locked: {
    title: 'Termómetro de la alimentación',
    text: (n: number) =>
      `Registra lo que comes durante ${n} días para ver la calidad de tu alimentación, con una nota de la A a la E, y recibir tu primer informe.`,
    progress: (n: number, total: number) => `${n} de ${total} días registrados`,
    count: (n: number, total: number) => `${n} de ${total} días`,
    missing: (n: number) => (n === 1 ? 'falta 1 día' : `faltan ${n} días`),
    registered: 'registrados',
    example: 'Ver un informe de ejemplo',
  },

  onboarding: {
    title: 'Te damos la bienvenida a EatMate',
    subtitle: 'Tu diario de comidas sencillo, sin contar calorías.',
    features: [
      {
        title: 'Registra lo que comiste',
        text: 'A tu manera, en el momento o más tarde: "café con leche y tostadas".',
      },
      {
        title: 'Termómetro de la alimentación',
        text: 'Después de 7 días, mira la calidad de tu alimentación con una nota de la A a la E.',
      },
      {
        title: 'Informes para compartir',
        text: 'Muéstraselos a tu nutricionista o pégalos en una IA para recibir sugerencias.',
      },
    ],
    nameLabel: '¿Cómo te llamamos?',
    namePlaceholder: 'Tu nombre',
    start: 'Empezar',
    restore: '¿Ya usas EatMate? Restaurar copia de seguridad',
    restored: (n: number) => `Copia de seguridad restaurada: ${meals(n)}.`,
    askName: 'Ahora solo falta que nos digas cómo te llamamos.',
    privacy: 'Tus datos se guardan solo en este dispositivo.',
  },

  dashboard: {
    hello: (name: string) => `¡Hola, ${name}!`,
    ctaTitle: 'Registrar comida',
    ctaSubtitle: '¿Qué comiste ahora o hace un rato?',
    thermoTitle: 'Calidad de tu alimentación',
    seeReport: 'Ver informe completo',
    noScore:
      'Todavía no hay suficientes alimentos reconocidos en los últimos 7 días para calcular la nota.',
    today: 'Hoy',
    seeDay: 'Ver día',
    add: 'Añadir',
    registered: 'Registrado',
    streak: 'días seguidos',
    registeredDays: 'días registrados',
    meals7: 'comidas en 7 días',
    tip: 'Consejo del día',
  },

  foodInput: {
    label: '¿Qué comiste?',
    placeholder: 'Ej.: "arroz, pollo y ensalada"',
    add: 'Añadir',
    suggestions: 'Sugerencias de alimentos',
    nothingFound:
      'No encontré ningún alimento en ese texto. Prueba con algo como "arroz, pollo y ensalada".',
  },

  mealForm: {
    newTitle: 'Registrar comida',
    editTitle: 'Editar comida',
    notFound: 'Comida no encontrada',
    notFoundText: 'Puede que se haya eliminado.',
    when: '¿Cuándo?',
    date: 'Fecha',
    time: 'Hora (opcional)',
    future: 'No se pueden registrar comidas en el futuro.',
    which: '¿Qué comida?',
    alreadyBefore: (meal: string) => `Ya hay un registro de ${meal.toLowerCase()} en este día.`,
    editExisting: 'Editar el registro existente',
    alreadyAfter: 'o guarda este como un registro aparte.',
    what: '¿Qué comiste?',
    hint: 'Escribe un alimento a la vez o la frase entera: EatMate separa cada alimento.',
    items: 'Alimentos de la comida',
    notRecognized: 'No reconocido · clasificar',
    quantityPlaceholder: '+ cantidad (ej.: 2 rebanadas)',
    quantityOf: (name: string) => `Cantidad de ${name}`,
    removeItem: (name: string) => `Quitar ${name}`,
    empty: 'Aún no has añadido ningún alimento.',
    quality: 'Calidad media de esta comida',
    frequent: 'Sueles comer:',
    notes: 'Notas (opcional)',
    notesPlaceholder: 'Ej.: comí fuera, tenía mucha hambre…',
    saveChanges: 'Guardar cambios',
    save: 'Guardar comida',
    changesSaved: '¡Cambios guardados!',
    saved: (meal: string) => `¡Registro de ${meal.toLowerCase()} guardado!`,
    saveError: 'No se pudo guardar. Inténtalo de nuevo.',
    deleteError: 'No se pudo eliminar la comida. Inténtalo de nuevo.',
    deleteTitle: '¿Eliminar esta comida?',
    deleteMessage: (meal: string, date: string) =>
      `${meal} del ${date}. Esta acción no se puede deshacer.`,
    deleted: 'Comida eliminada.',
    deleteLabel: 'Eliminar comida',
  },

  history: {
    title: 'Historial',
    count: (n: number) => `${n} ${n === 1 ? 'día registrado' : 'días registrados'}`,
    emptyTitle: 'Aún no hay registros',
    emptyText: 'Aquí aparecerán los días en los que registres comidas.',
    register: 'Registrar comida',
    search: 'Buscar alimento',
    searchPlaceholder: 'Buscar alimento (ej.: pizza)',
    noMatch: (query: string) => `Ningún día con “${query}”.`,
  },

  day: {
    title: 'Día',
    invalid: 'Fecha no válida',
    deleteMealTitle: (meal: string) => `¿Eliminar el registro de ${meal.toLowerCase()}?`,
    irreversible: 'Esta acción no se puede deshacer.',
    deleteDayTitle: '¿Eliminar todos los registros del día?',
    deleteDayMessage: (n: number, date: string) =>
      n === 1 ? `Se eliminará 1 comida del ${date}.` : `Se eliminarán ${n} comidas del ${date}.`,
    deleteDayConfirm: 'Eliminar día',
    dayDeleted: 'Registros del día eliminados.',
    empty: 'No hay registros en este día',
    registerHere: 'Registrar comida en este día',
    summary: 'Resumen del día',
    grade: (label: string) => `Nota del día: ${label}`,
    noGrade: 'Sin nota',
    items: (n: number) => plural(n, '1 alimento', `${n} alimentos`),
    fruitsAndVegetables: (n: number) =>
      `${n} ${n === 1 ? 'porción' : 'porciones'} de frutas y verduras`,
    ultraProcessed: (n: number) => `${n} ${n === 1 ? 'ultraprocesado' : 'ultraprocesados'}`,
    unclassified: (n: number) => `${n} sin clasificar`,
    edit: (meal: string) => `Editar ${meal}`,
    delete: (meal: string) => `Eliminar ${meal}`,
    missingLabel: 'Comidas principales sin registrar',
    missing: (meal: string) => `${meal} sin registrar`,
    addHere: 'Añadir comida en este día',
    deleteAll: 'Eliminar todos los registros del día',
  },

  report: {
    footnote:
      'Las notas de la A a la E y el grado de procesamiento son estimaciones automáticas, inspiradas en el Nutri-Score y en la Guía Alimentaria para la Población Brasileña. Este informe no sustituye la orientación de un(a) nutricionista.',
    generatedAt: (date: string) => `Generado el ${date}`,
    noScore: 'No hay suficientes alimentos reconocidos en este período para calcular la nota.',
    kpis: {
      days: 'días registrados',
      meals: 'comidas',
      fruitsAndVegetables: 'porciones de frutas y verduras al día',
      ultraProcessed: 'de ultraprocesados',
    },
    highlights: 'Destacados',
    positives: 'Puntos positivos',
    attention: 'A tener en cuenta',
    breakdown: 'Cómo se calculó la nota',
    breakdownText: 'Cinco criterios, cada uno de 0 a 100, con pesos diferentes.',
    markers: 'Marcadores de consumo',
    markersText: (n: number) =>
      `En cuántos de los ${n} días registrados apareció cada grupo (inspirado en el SISVAN del Ministerio de Salud de Brasil).`,
    markersGood: 'Lo ideal es consumirlos todos los días',
    markersAvoid: 'Lo ideal es evitarlos',
    status: { good: 'Excelente', warn: 'Puede mejorar', bad: 'Atención' },
    distributions: 'Calidad y procesamiento',
    gradesTitle: 'Notas de los alimentos (de la A a la E)',
    gradesLabel: (list: string) => `Distribución de las notas: ${list}`,
    processingTitle: 'Grado de procesamiento',
    processingLabel: (list: string) => `Grado de procesamiento: ${list}`,
    groups: 'Grupos de alimentos',
    group: 'Grupo',
    times: 'Veces',
    daysColumn: 'Días',
    meals: 'Comidas',
    mealsText: (n: number) => `En cuántos de los ${n} días registrados aparece cada comida.`,
    mealDays: (meal: string, n: number) => `${meal}: ${days(n)}`,
    of: 'de',
    topFoods: 'Alimentos más frecuentes',
    dayByDay: 'Día a día',
    diary: 'Diario de comidas completo',
    diaryText: 'Todo lo que se registró en el período, para mostrárselo a tu nutricionista.',
    notes: 'Nota:',
    noRecord: 'Sin registros.',
  },

  reportActions: {
    title: 'Usar este informe',
    text: 'Pégalo en una IA (ChatGPT, Gemini, Claude…) para recibir sugerencias de mejora, o guárdalo en PDF para llevárselo a tu nutricionista.',
    copyForAI: 'Copiar para usar en una IA',
    print: 'PDF / Imprimir',
    share: 'Compartir',
    copyText: 'Copiar texto',
    download: 'Descargar archivo',
    copiedForAI: '¡Copiado! Ahora solo tienes que pegarlo en tu IA favorita.',
    copied: 'Informe copiado.',
    copyFailed: 'No se pudo copiar.',
    shareFailed: 'No se puede compartir desde este dispositivo.',
    fileName: 'eatmate informe',
  },

  currentReport: {
    header: 'Informe',
    title: 'Últimos 7 días',
    live: 'En vivo',
    notice:
      'Este informe se actualiza solo a medida que registras. Al final de cada semana, se guarda una copia en tu historial de informes.',
    exportTitle: 'Informe de alimentación',
    savedInHistory: 'Guardado en el historial',
    updateInHistory: 'Actualizar en el historial',
    saveInHistory: 'Guardar en el historial',
    updated: 'Informe actualizado en el historial.',
    saved: 'Informe guardado en el historial.',
  },

  exampleReport: {
    header: 'Informe de ejemplo',
    title: 'Ejemplo',
    badge: 'Datos ficticios',
    notice:
      'Este es un ejemplo con una semana inventada. Tu informe real aparecerá después de 7 días de registros.',
    register: 'Registrar una comida',
  },

  reports: {
    title: 'Informes',
    subtitle: 'Tu historial de informes semanales',
    week: (n: number) => `Semana ${n}`,
    custom: 'Informe personalizado',
    current: 'Informe actual',
    currentText: 'Últimos 7 días, actualizado en tiempo real',
    info: 'Cada vez que termina una semana, se guarda aquí un informe automáticamente. Si después corriges algún registro, solo tienes que volver a generar el informe.',
    list: 'Informes guardados',
    generatedAt: (date: string) => `Generado el ${date}`,
    stale: 'Desactualizado',
    regenerate: 'Volver a generar',
    regenerateNow: 'Volver a generar con los datos actuales',
    regenerated: (title: string) => `“${title}” se volvió a generar con los datos actuales.`,
    regeneratedOne: 'Informe generado de nuevo con los datos actuales.',
    delete: 'Eliminar',
    deleteLabel: 'Eliminar informe',
    deleteTitle: (title: string) => `¿Eliminar “${title}”?`,
    deleteWeekly:
      'Tus registros de comidas siguen guardados. Puedes volver a generar este informe cuando quieras.',
    deleteCustom: 'Tus registros de comidas siguen guardados.',
    deleted: 'Informe eliminado.',
    deleteError: 'No se pudo eliminar el informe. Inténtalo de nuevo.',
    emptyTitle: 'Aún no hay informes guardados',
    emptyUnlocked:
      'El primer informe semanal aparecerá aquí cuando termine la semana. También puedes guardar el informe actual.',
    emptyLocked: 'Tus informes aparecerán aquí después de 7 días de registros.',
    other: 'Generar un informe de otro período',
    lastDay: 'Último día del período',
    covers: (period: string) => `El informe cubrirá 7 días: ${period}.`,
    pickDate: 'Elige una fecha.',
    generate: 'Generar informe',
    generated: 'Informe generado.',
    notFound: 'Informe no encontrado',
    notFoundText: 'Puede que se haya eliminado.',
    staleNotice: 'Cambiaste registros de este período después de que se generara este informe.',
  },

  profile: {
    title: 'Perfil',
    name: 'Tu nombre',
    saveName: 'Guardar nombre',
    nameSaved: 'Nombre actualizado.',
    language: 'Idioma',
    languageHint:
      'Cambia los textos de la app y de los informes, y los nombres de alimentos que EatMate reconoce cuando escribes lo que comiste.',
    appearance: 'Apariencia',
    themes: { system: 'Automático', light: 'Claro', dark: 'Oscuro' },
    install: 'Instalar la app',
    installed: 'Ya estás usando EatMate como app instalada. 🎉',
    installText:
      'Instala EatMate para abrirlo directamente desde la pantalla de inicio, como una app, incluso sin conexión.',
    installButton: 'Instalar EatMate',
    installIOS:
      'En el iPhone, ábrelo en Safari, toca **Compartir** y luego **Añadir a pantalla de inicio**.',
    installOther:
      'En el menú del navegador, busca **Instalar aplicación** o **Añadir a pantalla de inicio**.',
    data: 'Tus datos',
    dataSummary: (m: number, d: number, r: number) =>
      `${meals(m)} en ${days(d)} · ${reports(r)}. Todo se guarda solo en este dispositivo: haz una copia de seguridad de vez en cuando para no perder nada si cambias de teléfono.`,
    lastBackup: 'Última copia de seguridad:',
    never: 'nunca',
    export: 'Exportar copia de seguridad',
    import: 'Importar copia de seguridad',
    exported: 'Copia de seguridad guardada en tus archivos.',
    importTitle: '¿Importar copia de seguridad?',
    importMessage: (m: number, r: number) =>
      `El archivo tiene ${meals(m)} y ${reports(r)}. Se combinarán con tus datos actuales: no se borrará nada.`,
    importConfirm: 'Importar',
    imported: (m: number) => `Copia de seguridad importada: ${meals(m)}.`,
    customFoods: 'Mis alimentos',
    customFoodsText: 'Alimentos que clasificaste. Toca el lápiz para cambiar la categoría.',
    changeCategory: (name: string) => `Cambiar la categoría de ${name}`,
    removeFood: (name: string) => `Quitar ${name}`,
    removeFoodTitle: (name: string) => `¿Quitar “${name}”?`,
    removeFoodMessage:
      'Los registros con este alimento siguen guardados, pero quedan sin clasificar.',
    foodRemoved: 'Alimento eliminado.',
    reclassified: 'Clasificación actualizada.',
    method: {
      title: '¿Cómo se calcula la nota?',
      intro:
        'Cada alimento tiene una nota de la **A** (la mejor) a la **E**, inspirada en el Nutri-Score europeo, y un grado de procesamiento según la **Guía Alimentaria para la Población Brasileña** (naturales, ingredientes culinarios, procesados y ultraprocesados).',
      criteria: 'La nota de la semana va de 0 a 100 y combina cinco criterios:',
      items: {
        qualidade: 'Calidad nutricional de los alimentos',
        processamento: 'Grado de procesamiento',
        frutas_verduras: 'Frutas y verduras (objetivo: 5 porciones al día)',
        variedade: 'Variedad de alimentos',
        regularidade: 'Regularidad del desayuno, el almuerzo y la cena',
      } satisfies Record<ScoreComponentKey, string>,
      letters: (thresholds: string, min: number) =>
        `Después, los puntos se convierten en una letra: ${thresholds} y E por debajo de ${min}.`,
      threshold: (grade: Grade, min: number) => `${grade} a partir de ${min}`,
      disclaimer:
        'Las notas son estimaciones para ayudarte a detectar patrones: no sustituyen la orientación de un(a) nutricionista.',
    },
    danger: 'Borrar datos',
    dangerText: 'Elimina todas las comidas, informes y ajustes de este dispositivo.',
    eraseAll: 'Borrar todos los datos',
    eraseTitle: '¿Borrar todos los datos?',
    eraseMessage:
      'Se borrarán todas las comidas, informes y ajustes de este dispositivo. Si quieres guardar una copia, exporta antes una copia de seguridad.',
    eraseConfirm: 'Borrar todo',
    version: (version: string) => `EatMate ${version} · tus datos se quedan solo contigo.`,
  },

  backup: {
    invalidJson: 'El archivo no es una copia de seguridad válida de EatMate (JSON no válido).',
    notEatmate: 'Este archivo no parece ser una copia de seguridad de EatMate.',
    readError: 'No se pudo leer el archivo.',
    importError: 'No se pudo importar el archivo.',
  },

  notFound: {
    title: 'Página no encontrada',
    text: 'Esta dirección no existe en EatMate.',
    home: 'Volver al inicio',
    errorTitle: 'Algo salió mal',
    errorText: 'Tus datos siguen guardados en este dispositivo. Intenta recargar la app.',
    reload: 'Recargar la app',
  },

  /** Informe en texto (Markdown), para pegar en una IA, en WhatsApp o en un correo. */
  export: {
    title: 'Informe de alimentación',
    name: 'Nombre',
    period: 'Período',
    periodValue: (start: string, end: string, registered: number, total: number) =>
      `del ${start} al ${end} (${registered} de ${total} días registrados)`,
    meals: 'Comidas registradas',
    items: 'Alimentos',
    overall: 'Nota general',
    noData: 'sin datos suficientes',
    previous: (period: string) => `Período anterior (${period})`,
    howCalculated: 'Cómo se calculó la nota',
    weight: (percent: number) => `peso ${percent} %`,
    positives: 'Puntos positivos',
    attention: 'A tener en cuenta',
    markers: 'Marcadores de consumo alimentario',
    markersIntro: (n: number) => `Días con consumo, de ${n} días registrados:`,
    idealDaily: 'ideal: todos los días',
    idealAvoid: 'ideal: evitar',
    grades: 'Calidad de los alimentos (escala de la A a la E)',
    nova: 'Grado de procesamiento (clasificación NOVA)',
    groups: 'Grupos de alimentos',
    groupLine: (group: string, count: number, inDays: string) => `${group}: ${count}x en ${inDays}`,
    fruitsAndVegetables: (perDay: string) =>
      `Frutas y verduras: un promedio de ${perDay} porciones al día.`,
    mealsTitle: 'Comidas registradas',
    mealLine: (meal: string, n: number, ofDays: string) => `${meal}: ${n} de ${ofDays}`,
    topFoods: 'Alimentos más frecuentes',
    diary: 'Diario de comidas',
    dayGrade: (grade: Grade) => `nota del día: ${grade}`,
    noRecord: '(sin registros)',
    note: 'Nota',
    footer: (date?: string) =>
      `Generado por EatMate${date ? ` el ${date}` : ''}. Las notas (de la A a la E) y el grado de procesamiento son estimaciones automáticas, inspiradas en el Nutri-Score y en la Guía Alimentaria para la Población Brasileña. Este informe no sustituye la orientación de un(a) nutricionista.`,
    aiIntro: (name: string, period: string) =>
      `¡Hola! ${name ? `Soy ${name} y registré` : 'Registré'} mi alimentación en la app EatMate. A continuación está mi informe del período ${period}.`,
    aiAsk: [
      'A partir de él, por favor:',
      '1. Evalúa los puntos fuertes y débiles de mi alimentación;',
      '2. Sugiere mejoras prácticas y realistas, respetando mi cultura alimentaria;',
      '3. Propón cambios sencillos para los alimentos con nota D o E;',
      '4. Elabora un menú de ejemplo para un día, con desayuno, almuerzo, merienda y cena.',
    ],
    aiNote:
      'Observación: las notas de la A a la E y el grado de procesamiento los estimó automáticamente la app.',
  },
};
