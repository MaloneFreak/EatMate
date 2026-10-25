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
 * Textos do app em alemão (mesma estrutura de `pt`, ver `Messages`).
 * Tratamento informal ("du"), como nos apps de consumo em alemão.
 *
 * `**texto**` vira negrito na tela (componente `Rich`).
 */

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
const days = (n: number) => plural(n, '1 Tag', `${n} Tage`);
/** Dativo, depois de "an"/"von": "an 3 Tagen". */
const daysDative = (n: number) => plural(n, '1 Tag', `${n} Tagen`);
/** `common.days` vem no nominativo ("3 Tage"); depois de "an"/"von" o alemão pede "3 Tagen". */
const dative = (text: string) => text.replace(/ Tage$/, ' Tagen');
const times = (n: number) => plural(n, 'einmal', `${n}-mal`);
const meals = (n: number) => plural(n, '1 Mahlzeit', `${n} Mahlzeiten`);
const reports = (n: number) => plural(n, '1 Bericht', `${n} Berichte`);
const foods = (n: number) => plural(n, '1 Lebensmittel', `${n} verschiedene Lebensmittel`);
/** Recebe o número já formatado ("2,5"). */
const portions = (value: string) => `${value} ${value === '1' ? 'Portion' : 'Portionen'}`;

const classifyOptions = {
  fruta: { label: 'Obst', examples: 'Banane, Apfel, Birne' },
  verdura: { label: 'Gemüse oder Salat', examples: 'Kopfsalat, Karotte, Zucchini' },
  leguminosa: { label: 'Bohnen oder Hülsenfrüchte', examples: 'Bohnen, Linsen, Kichererbsen' },
  cereal: {
    label: 'Reis, Nudeln, Kartoffeln oder Knollen',
    examples: 'Reis, Spaghetti, Kartoffeln',
  },
  pao: { label: 'Brot, Toast oder Cracker', examples: 'Brötchen, Vollkornbrot' },
  carne: { label: 'Fleisch, Geflügel, Fisch oder Ei', examples: 'Schnitzel, Hähnchen, Lachs, Ei' },
  embutido: { label: 'Wurst oder Aufschnitt', examples: 'Schinken, Würstchen, Salami' },
  laticinio: { label: 'Milch, Joghurt oder Käse', examples: 'Milch, Quark, Gouda' },
  oleaginosa: { label: 'Nüsse oder Samen', examples: 'Walnüsse, Erdnüsse, Leinsamen' },
  bebida: {
    label: 'Wasser, Kaffee oder Tee ohne Zucker',
    examples: 'Mineralwasser, Kaffee, Kräutertee',
  },
  adocada: { label: 'Saft oder gesüßtes Getränk', examples: 'Cola, Limonade, Eistee' },
  doce: { label: 'Süßes oder Dessert', examples: 'Kuchen, Schokolade, Pudding' },
  lanche: { label: 'Snack, Imbiss oder Fast Food', examples: 'Döner, Burger, Pizza' },
  prato_caseiro: {
    label: 'Selbst gekochtes Gericht',
    examples: 'zu Hause aus frischen Zutaten gekocht',
  },
  prato_pronto: {
    label: 'Fertig- oder Tiefkühlgericht',
    examples: 'Tiefkühl-Lasagne, Tütensuppe',
  },
  gordura: { label: 'Soße, Öl oder Fett', examples: 'Mayonnaise, Butter, Olivenöl' },
  alcool: { label: 'Alkoholisches Getränk', examples: 'Bier, Wein, Sekt' },
} satisfies Record<ClassifyKey, { label: string; examples: string }>;

export const de: Messages = {
  common: {
    back: 'Zurück',
    close: 'Schließen',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    delete: 'Löschen',
    remove: 'Entfernen',
    today: 'Heute',
    yesterday: 'Gestern',
    loading: 'Wird geladen',
    backupFile: 'Backup-Datei',
    days,
    meals,
    daysOf: (n: number, total: number) => `${n} von ${total} Tagen`,
  },

  grades: {
    labels: {
      A: 'Ausgezeichnet',
      B: 'Gut',
      C: 'Mittel',
      D: 'Ausbaufähig',
      E: 'Achtung',
    } satisfies Record<Grade, string>,
    messages: {
      A: 'Deine Ernährung ist super! Weiter so.',
      B: 'Du bist auf einem guten Weg – mit kleinen Anpassungen schaffst du das A.',
      C: 'Du hast schon gute Gewohnheiten, aber auch noch Luft nach oben.',
      D: 'Deine Ernährung braucht ein paar Anpassungen. Schau dir die Tipps im Bericht an.',
      E: 'Wie wäre es, im Alltag mit kleinen Veränderungen anzufangen? Der Bericht zeigt dir, wo du ansetzen kannst.',
    } satisfies Record<Grade, string>,
    badge: (grade: Grade, label: string) => `Note ${grade} – ${label}`,
    unclassified: 'Nicht eingeordnet',
    scale: (grade: Grade, label: string) => `Note ${grade} auf der Skala von A bis E: ${label}`,
    thermometer: (score: number, grade: Grade) =>
      `Thermometer: ${score} von 100 Punkten, Note ${grade}`,
  },

  // Hífen opcional (\u00ad): os nomes longos quebram na junção da palavra composta.
  mealTypes: {
    cafe_manha: 'Frühstück',
    lanche_manha: 'Vormittags\u00adsnack',
    almoco: 'Mittagessen',
    cafe_tarde: 'Nachmittags\u00adsnack',
    jantar: 'Abendessen',
    ceia: 'Spätsnack',
  } satisfies Record<MealType, string>,

  groups: {
    frutas: 'Obst',
    verduras_legumes: 'Gemüse und Salat',
    leguminosas: 'Bohnen und Hülsenfrüchte',
    cereais: 'Getreide, Brot, Kartoffeln und Knollen',
    carnes_ovos: 'Fleisch, Fisch und Eier',
    leite_derivados: 'Milch und Milchprodukte',
    oleaginosas: 'Nüsse und Samen',
    bebidas: 'Wasser, Kaffee und Tee',
    bebidas_adocadas: 'Säfte und gesüßte Getränke',
    doces: 'Süßes und Naschereien',
    lanches: 'Snacks, Imbiss und Fast Food',
    pratos: 'Gerichte und Zubereitungen',
    gorduras_molhos: 'Öle, Fette und Soßen',
    alcool: 'Alkoholische Getränke',
  } satisfies Record<FoodGroup, string>,

  nova: {
    1: 'Unverarbeitet oder minimal verarbeitet',
    2: 'Küchenzutaten (Öle, Zucker, Butter)',
    3: 'Verarbeitet',
    4: 'Hochverarbeitet',
  } satisfies Record<Nova, string>,

  classify: {
    title: (name: string) => `Was ist „${name}“?`,
    description:
      'Wähl die Kategorie, die am besten passt. EatMate merkt sie sich fürs nächste Mal.',
    done: (name: string, category: string) => `„${name}“ als ${category} eingeordnet.`,
    options: classifyOptions,
  },

  score: {
    components: {
      qualidade: 'Nährwertqualität',
      processamento: 'Verarbeitungsgrad',
      frutas_verduras: 'Obst und Gemüse',
      variedade: 'Abwechslung',
      regularidade: 'Regelmäßige Mahlzeiten',
    } satisfies Record<ScoreComponentKey, string>,
    details: {
      qualidade: (s: ScoreFacts) => `Durchschnittsnote der Lebensmittel: ${s.averageGrade}`,
      processamento: (s: ScoreFacts, f: Format) =>
        `${f.percent(s.inNaturaShare)} unverarbeitet oder minimal verarbeitet · ${f.percent(s.ultraShare)} hochverarbeitet`,
      frutas_verduras: (s: ScoreFacts, f: Format) =>
        `${portions(f.decimal(s.fvPerDay))} pro Tag (Ziel: ${s.fvTarget})`,
      variedade: (s: ScoreFacts) =>
        `${foods(s.distinctGood)} mit Note A, B oder C (Ziel: ${s.varietyTarget})`,
      regularidade: (s: ScoreFacts, f: Format) =>
        `${f.percent(s.mainMealsShare)} der Hauptmahlzeiten eingetragen (Frühstück, Mittag- und Abendessen)`,
    } satisfies Record<ScoreComponentKey, (s: ScoreFacts, f: Format) => string>,
    weight: (percent: number) => `Gewichtung ${percent}\u00a0%`,
    delta: (delta: number) =>
      delta === 0
        ? 'Unverändert gegenüber den 7 Tagen davor'
        : `${delta > 0 ? '+' : '−'}${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'Punkt' : 'Punkte'} gegenüber den 7 Tagen davor`,
  },

  markers: {
    feijao: 'Bohnen und andere Hülsenfrüchte',
    frutas: 'Obst',
    verduras: 'Gemüse und Salat',
    embutidos: 'Burger und Wurstwaren',
    adocadas: 'Softdrinks und gesüßte Getränke',
    salgadinhos: 'Instantnudeln, Chips und Salzgebäck',
    doces: 'Gefüllte Kekse, Süßigkeiten und Naschereien',
  } satisfies Record<MarkerKey, string>,

  /** `n` e `of` vêm de cada destaque (ver `Insight`). */
  insights: {
    fv_great: (n: number, _of: number, f: Format) =>
      `Sehr gut: viel Obst und Gemüse – im Schnitt ${portions(f.decimal(n))} pro Tag.`,
    fv_good: (n: number, of: number, f: Format) =>
      `Gut: schon einiges an Obst und Gemüse (${portions(f.decimal(n))} pro Tag). Bis zum Ziel von ${of} fehlt nicht mehr viel.`,
    beans_most: (n: number, of: number) =>
      `Bohnen oder andere Hülsenfrüchte an ${n} von ${of} Tagen – super Quelle für Ballaststoffe, Eisen und Eiweiß.`,
    few_ultra: (n: number, _of: number, f: Format) =>
      `Wenig Hochverarbeitetes: nur ${f.percent(n)} der Lebensmittel.`,
    no_sugary: () => 'Keine Softdrinks oder gesüßten Getränke im Zeitraum.',
    regular_meals: () =>
      'Hauptmahlzeiten (Frühstück, Mittag- und Abendessen) regelmäßig eingetragen.',
    breakfast_daily: () => 'Frühstück an allen Tagen eingetragen.',
    variety_good: (n: number) => `Schöne Abwechslung: ${foods(n)} von guter Qualität.`,
    water: (n: number, of: number) =>
      `Wasser an ${n} von ${of} Tagen eingetragen. Bleib dran und trink genug!`,
    whole_grains: (n: number) => `Vollkornprodukte kamen ${times(n)} vor.`,
    in_natura: (n: number, _of: number, f: Format) =>
      `${f.percent(n)} der Lebensmittel waren unverarbeitet oder minimal verarbeitet – die Basis einer gesunden Ernährung.`,
    fv_low: (n: number, of: number, f: Format) =>
      `Wenig Obst und Gemüse: im Schnitt ${portions(f.decimal(n))} pro Tag (empfohlen sind mindestens ${of}).`,
    fruits_few: (n: number, of: number) => `Obst gab es nur an ${n} von ${of} Tagen.`,
    vegetables_few: (n: number, of: number) =>
      `Gemüse und Salat gab es nur an ${n} von ${of} Tagen.`,
    ultra_high: (n: number, _of: number, f: Format) =>
      `Hochverarbeitete Lebensmittel machten ${f.percent(n)} der Einträge aus. Greif lieber zu unverarbeiteten Lebensmitteln und selbst Gekochtem.`,
    sugary: (n: number) =>
      `Softdrinks und gesüßte Getränke kamen ${times(n)} vor. Ersetze sie durch Wasser, Mineralwasser mit Zitrone oder frisch gepressten Saft ohne Zucker.`,
    sweets: (n: number, of: number) => `Süßes und Naschereien gab es an ${n} von ${of} Tagen.`,
    processed_meat: (n: number) =>
      `Burger und Wurstwaren kamen ${times(n)} vor – sie enthalten oft viel Salz und Konservierungsstoffe.`,
    salty_snacks: (n: number) => `Chips, Salzgebäck oder Instantnudeln kamen ${times(n)} vor.`,
    fast_food: (n: number) => `Snacks, Imbiss und Fast Food kamen ${times(n)} vor.`,
    alcohol: (n: number) => `Alkoholische Getränke kamen ${times(n)} vor.`,
    no_breakfast: (n: number) => `An ${daysDative(n)} kein Frühstück eingetragen.`,
    skipped_meals: (n: number) =>
      `An ${daysDative(n)} fehlt ein Eintrag für Mittag- oder Abendessen. Falls du Mahlzeiten ausgelassen hast, versuch, regelmäßige Essenszeiten einzuhalten.`,
    beans_low: (n: number, of: number) =>
      `Hülsenfrüchte gab es selten (an ${n} von ${of} Tagen). Bohnen, Linsen und Kichererbsen sind günstige Lieferanten für Ballaststoffe, Eisen und Eiweiß.`,
    variety_low: (n: number) =>
      `Wenig Abwechslung: ${foods(n)} von guter Qualität. Mehr Vielfalt bringt dir mehr Nährstoffe.`,
    incomplete: (n: number, of: number) =>
      `Du hast an ${n} von ${of} Tagen etwas eingetragen. Vollständige Einträge machen den Bericht genauer.`,
    unclassified: (n: number) =>
      n === 1
        ? '1 Lebensmittel wurde nicht erkannt und fließt nicht in die Berechnung ein. Du kannst es einordnen, indem du die Mahlzeit bearbeitest.'
        : `${n} Lebensmittel wurden nicht erkannt und fließen nicht in die Berechnung ein. Du kannst sie einordnen, indem du die Mahlzeit bearbeitest.`,
  } satisfies Record<InsightKey, (n: number, of: number, f: Format) => string>,

  /** Dicas baseadas no Guia Alimentar para a População Brasileira (Ministério da Saúde). */
  tips: [
    'Mach unverarbeitete oder minimal verarbeitete Lebensmittel – Obst, Gemüse, Getreide, Hülsenfrüchte, Eier – zur Basis deiner Ernährung.',
    'Verwende Öle, Fette, Salz und Zucker beim Würzen und Kochen nur in kleinen Mengen.',
    'Schränke verarbeitete Lebensmittel wie Konserven, Käse und industriell hergestelltes Brot ein.',
    'Meide hochverarbeitete Produkte wie Softdrinks, gefüllte Kekse, Chips und Instantnudeln.',
    'Iss regelmäßig und bewusst, in ruhiger Umgebung und wann immer möglich in Gesellschaft.',
    'Kauf am besten auf Wochenmärkten, in Obst- und Gemüseläden und in Geschäften mit großer Auswahl an frischen Lebensmitteln ein.',
    'Kochen ist eine tolle Gewohnheit: Probier diese Woche ein neues Rezept aus.',
    'Plane deine Mahlzeiten für die Woche – so vermeidest du leichter spontane Snacks in letzter Minute.',
    'Wenn du auswärts isst, wähl am besten Orte, an denen frisch gekocht wird.',
    'Sei skeptisch bei Lebensmittelwerbung: Sie verkauft Produkte, nicht Gesundheit.',
    'Linsen, Bohnen und Kichererbsen sind echte Alleskönner: Sie liefern günstig Ballaststoffe, Eisen und Eiweiß.',
    'Versuch, ein Stück Obst zum Frühstück und eins zum Nachmittagssnack einzuplanen.',
    'Trink über den Tag verteilt Wasser – eine Flasche in Reichweite erinnert dich daran.',
    'Tausch Softdrinks gegen Mineralwasser mit Zitrone oder frisch gepressten Saft ohne Zucker.',
    'Füll die Hälfte deines Tellers mit Gemüse und Salat – so kommst du leicht auf 5 Portionen am Tag.',
    'Greif lieber zu ganzem Obst statt zu Saft: Es hat mehr Ballaststoffe und macht länger satt.',
    'Nüsse, Obst und Naturjoghurt sind tolle Snacks anstelle von Keksen.',
    'Bring Farbe auf den Teller: Jede Gemüsefarbe liefert andere Nährstoffe.',
  ],

  nav: {
    label: 'Hauptnavigation',
    home: 'Start',
    history: 'Verlauf',
    add: 'Mahlzeit eintragen',
    reports: 'Berichte',
    profile: 'Profil',
  },

  update: {
    available: 'Eine neue Version von EatMate ist verfügbar.',
    update: 'Aktualisieren',
    later: 'Später',
  },

  locked: {
    title: 'Ernährungsthermometer',
    text: (n: number) =>
      `Trag ${days(n)} lang ein, was du isst, um die Qualität deiner Ernährung als Note von A bis E zu sehen und deinen ersten Bericht zu bekommen.`,
    progress: (n: number, total: number) => `${n} von ${total} Tagen erfasst`,
    count: (n: number, total: number) => `${n} von ${total} Tagen`,
    missing: (n: number) => `noch ${days(n)}`,
    registered: 'erfasst',
    example: 'Beispielbericht ansehen',
  },

  onboarding: {
    title: 'Willkommen bei EatMate',
    subtitle: 'Dein einfaches Ernährungstagebuch – ganz ohne Kalorienzählen.',
    features: [
      {
        title: 'Trag ein, was du gegessen hast',
        text: 'Ganz wie du willst, sofort oder später: „Kaffee mit Milch und ein Brötchen“.',
      },
      {
        title: 'Ernährungsthermometer',
        text: 'Nach 7 Tagen siehst du die Qualität deiner Ernährung als Note von A bis E.',
      },
      {
        title: 'Berichte zum Teilen',
        text: 'Zeig sie in deiner Ernährungsberatung oder füg sie in eine KI ein, um Tipps zu bekommen.',
      },
    ],
    nameLabel: 'Wie dürfen wir dich nennen?',
    namePlaceholder: 'Dein Name',
    start: 'Loslegen',
    restore: 'Du nutzt EatMate schon? Backup wiederherstellen',
    restored: (n: number) => `Backup wiederhergestellt: ${meals(n)}.`,
    askName: 'Jetzt sag uns nur noch, wie wir dich nennen dürfen.',
    privacy: 'Deine Daten bleiben nur auf diesem Gerät.',
  },

  dashboard: {
    hello: (name: string) => `Hallo, ${name}!`,
    ctaTitle: 'Mahlzeit eintragen',
    ctaSubtitle: 'Was hast du gerade oder vorhin gegessen?',
    thermoTitle: 'Qualität deiner Ernährung',
    seeReport: 'Ganzen Bericht ansehen',
    noScore:
      'In den letzten 7 Tagen gibt es noch nicht genug erkannte Lebensmittel, um eine Note zu berechnen.',
    today: 'Heute',
    seeDay: 'Tag ansehen',
    add: 'Hinzufügen',
    registered: 'Eingetragen',
    streak: 'Tage in Folge',
    registeredDays: 'erfasste Tage',
    meals7: 'Mahlzeiten in 7 Tagen',
    tip: 'Tipp des Tages',
  },

  foodInput: {
    label: 'Was hast du gegessen?',
    placeholder: 'z. B. „Müsli mit Joghurt und Apfel“',
    add: 'Hinzufügen',
    suggestions: 'Vorschläge für Lebensmittel',
    nothingFound:
      'In diesem Text habe ich kein Lebensmittel gefunden. Versuch es mit etwas wie „Müsli mit Joghurt und Apfel“.',
  },

  mealForm: {
    newTitle: 'Mahlzeit eintragen',
    editTitle: 'Mahlzeit bearbeiten',
    notFound: 'Mahlzeit nicht gefunden',
    notFoundText: 'Vielleicht wurde sie gelöscht.',
    when: 'Wann?',
    date: 'Datum',
    time: 'Uhrzeit (optional)',
    future: 'Mahlzeiten in der Zukunft kannst du nicht eintragen.',
    which: 'Welche Mahlzeit?',
    alreadyBefore: (meal: string) => `${meal} ist für diesen Tag schon eingetragen.`,
    editExisting: 'Bestehenden Eintrag bearbeiten',
    alreadyAfter: 'oder diesen als separaten Eintrag speichern.',
    what: 'Was hast du gegessen?',
    hint: 'Schreib ein Lebensmittel nach dem anderen oder gleich den ganzen Satz – EatMate trennt die einzelnen Lebensmittel.',
    items: 'Lebensmittel in dieser Mahlzeit',
    notRecognized: 'Nicht erkannt · einordnen',
    quantityPlaceholder: '+ Menge (z. B. 2 Scheiben)',
    quantityOf: (name: string) => `Menge für ${name}`,
    removeItem: (name: string) => `${name} entfernen`,
    empty: 'Noch keine Lebensmittel hinzugefügt.',
    quality: 'Durchschnittliche Qualität dieser Mahlzeit',
    frequent: 'Das isst du oft:',
    notes: 'Notizen (optional)',
    notesPlaceholder: 'z. B. auswärts gegessen, war sehr hungrig …',
    saveChanges: 'Änderungen speichern',
    save: 'Mahlzeit speichern',
    changesSaved: 'Änderungen gespeichert!',
    saved: (meal: string) => `${meal} eingetragen!`,
    saveError: 'Speichern hat nicht geklappt. Versuch es noch mal.',
    deleteError: 'Die Mahlzeit konnte nicht gelöscht werden. Versuch es noch mal.',
    deleteTitle: 'Diese Mahlzeit löschen?',
    deleteMessage: (meal: string, date: string) =>
      `${meal} vom ${date}. Das kann nicht rückgängig gemacht werden.`,
    deleted: 'Mahlzeit gelöscht.',
    deleteLabel: 'Mahlzeit löschen',
  },

  history: {
    title: 'Verlauf',
    count: (n: number) => `${n} ${n === 1 ? 'erfasster Tag' : 'erfasste Tage'}`,
    emptyTitle: 'Noch keine Einträge',
    emptyText: 'Hier erscheinen die Tage, an denen du Mahlzeiten einträgst.',
    register: 'Mahlzeit eintragen',
    search: 'Lebensmittel suchen',
    searchPlaceholder: 'Lebensmittel suchen (z. B. Pizza)',
    noMatch: (query: string) => `Kein Tag mit „${query}“.`,
  },

  day: {
    title: 'Tag',
    invalid: 'Ungültiges Datum',
    deleteMealTitle: (meal: string) => `${meal} löschen?`,
    irreversible: 'Das kann nicht rückgängig gemacht werden.',
    deleteDayTitle: 'Alle Einträge dieses Tages löschen?',
    deleteDayMessage: (n: number, date: string) =>
      `${meals(n)} vom ${date} ${n === 1 ? 'wird' : 'werden'} gelöscht.`,
    deleteDayConfirm: 'Tag löschen',
    dayDeleted: 'Einträge des Tages gelöscht.',
    empty: 'Keine Einträge an diesem Tag',
    registerHere: 'Mahlzeit für diesen Tag eintragen',
    summary: 'Tagesübersicht',
    grade: (label: string) => `Tagesnote: ${label}`,
    noGrade: 'Keine Note',
    items: (n: number) => plural(n, '1 Lebensmittel', `${n} Lebensmittel`),
    fruitsAndVegetables: (n: number) => `${n} ${n === 1 ? 'Portion' : 'Portionen'} Obst und Gemüse`,
    ultraProcessed: (n: number) => `${n} hochverarbeitet`,
    unclassified: (n: number) => `${n} nicht eingeordnet`,
    edit: (meal: string) => `${meal} bearbeiten`,
    delete: (meal: string) => `${meal} löschen`,
    missingLabel: 'Hauptmahlzeiten ohne Eintrag',
    missing: (meal: string) => `${meal} nicht eingetragen`,
    addHere: 'Mahlzeit zu diesem Tag hinzufügen',
    deleteAll: 'Alle Einträge dieses Tages löschen',
  },

  report: {
    footnote:
      'Die Noten von A bis E und der Verarbeitungsgrad sind automatische Schätzungen, angelehnt an den Nutri-Score und den Ernährungsleitfaden für die brasilianische Bevölkerung. Dieser Bericht ersetzt keine professionelle Ernährungsberatung.',
    generatedAt: (date: string) => `Erstellt am ${date}`,
    noScore:
      'In diesem Zeitraum gibt es nicht genug erkannte Lebensmittel, um eine Note zu berechnen.',
    kpis: {
      days: 'erfasste Tage',
      meals: 'Mahlzeiten',
      fruitsAndVegetables: 'Portionen Obst und Gemüse pro Tag',
      ultraProcessed: 'hochverarbeitet',
    },
    highlights: 'Das Wichtigste',
    positives: 'Das läuft gut',
    attention: 'Darauf kannst du achten',
    breakdown: 'So wurde die Note berechnet',
    breakdownText: 'Fünf Kriterien, jeweils von 0 bis 100, unterschiedlich gewichtet.',
    markers: 'Ernährungsmarker',
    markersText: (n: number) =>
      `An wie vielen der ${n} erfassten Tage jede Gruppe vorkam (angelehnt an das SISVAN des brasilianischen Gesundheitsministeriums).`,
    markersGood: 'Am besten jeden Tag',
    markersAvoid: 'Am besten meiden',
    status: { good: 'Sehr gut', warn: 'Geht noch besser', bad: 'Achtung' },
    distributions: 'Qualität und Verarbeitung',
    gradesTitle: 'Noten der Lebensmittel (A bis E)',
    gradesLabel: (list: string) => `Verteilung der Noten: ${list}`,
    processingTitle: 'Verarbeitungsgrad',
    processingLabel: (list: string) => `Verarbeitungsgrad: ${list}`,
    groups: 'Lebensmittelgruppen',
    group: 'Gruppe',
    times: 'Anzahl',
    daysColumn: 'Tage',
    meals: 'Mahlzeiten',
    mealsText: (n: number) => `An wie vielen der ${n} erfassten Tage jede Mahlzeit vorkommt.`,
    mealDays: (meal: string, n: number) => `${meal}: ${days(n)}`,
    of: 'von',
    topFoods: 'Häufigste Lebensmittel',
    dayByDay: 'Tag für Tag',
    diary: 'Vollständiges Ernährungstagebuch',
    diaryText: 'Alles, was im Zeitraum eingetragen wurde – zum Zeigen in der Ernährungsberatung.',
    notes: 'Notiz:',
    noRecord: 'Kein Eintrag.',
  },

  reportActions: {
    title: 'Diesen Bericht nutzen',
    text: 'Füg ihn in eine KI ein (ChatGPT, Gemini, Claude …), um Verbesserungsvorschläge zu bekommen, oder speichere ihn als PDF für deine Ernährungsberatung.',
    copyForAI: 'Für eine KI kopieren',
    print: 'PDF / Drucken',
    share: 'Teilen',
    copyText: 'Text kopieren',
    download: 'Datei herunterladen',
    copiedForAI: 'Kopiert! Jetzt einfach in die KI deiner Wahl einfügen.',
    copied: 'Bericht kopiert.',
    copyFailed: 'Kopieren hat nicht geklappt.',
    shareFailed: 'Teilen ist auf diesem Gerät nicht möglich.',
    fileName: 'eatmate bericht',
  },

  currentReport: {
    header: 'Bericht',
    title: 'Letzte 7 Tage',
    live: 'Live',
    notice:
      'Dieser Bericht aktualisiert sich automatisch, während du einträgst. Am Ende jeder Woche wird eine Kopie in deinem Berichtsverlauf gespeichert.',
    exportTitle: 'Ernährungsbericht',
    savedInHistory: 'Im Verlauf gespeichert',
    updateInHistory: 'Im Verlauf aktualisieren',
    saveInHistory: 'Im Verlauf speichern',
    updated: 'Bericht im Verlauf aktualisiert.',
    saved: 'Bericht im Verlauf gespeichert.',
  },

  exampleReport: {
    header: 'Beispielbericht',
    title: 'Beispiel',
    badge: 'Fiktive Daten',
    notice:
      'Das ist ein Beispiel mit einer ausgedachten Woche. Dein echter Bericht erscheint nach 7 Tagen mit Einträgen.',
    register: 'Eine Mahlzeit eintragen',
  },

  reports: {
    title: 'Berichte',
    subtitle: 'Deine bisherigen Wochenberichte',
    week: (n: number) => `Woche ${n}`,
    custom: 'Individueller Bericht',
    current: 'Aktueller Bericht',
    currentText: 'Letzte 7 Tage, in Echtzeit aktualisiert',
    info: 'Nach jeder abgeschlossenen Woche wird hier automatisch ein Bericht gespeichert. Wenn du später Einträge korrigierst, erstell den Bericht einfach neu.',
    list: 'Gespeicherte Berichte',
    generatedAt: (date: string) => `Erstellt am ${date}`,
    stale: 'Veraltet',
    regenerate: 'Neu erstellen',
    regenerateNow: 'Mit aktuellen Daten neu erstellen',
    regenerated: (title: string) => `${title} mit aktuellen Daten neu erstellt.`,
    regeneratedOne: 'Bericht mit aktuellen Daten neu erstellt.',
    delete: 'Löschen',
    deleteLabel: 'Bericht löschen',
    deleteTitle: (title: string) => `„${title}“ löschen?`,
    deleteWeekly:
      'Deine eingetragenen Mahlzeiten bleiben gespeichert. Du kannst diesen Bericht jederzeit neu erstellen.',
    deleteCustom: 'Deine eingetragenen Mahlzeiten bleiben gespeichert.',
    deleted: 'Bericht gelöscht.',
    deleteError: 'Der Bericht konnte nicht gelöscht werden. Versuch es noch mal.',
    emptyTitle: 'Noch keine gespeicherten Berichte',
    emptyUnlocked:
      'Der erste Wochenbericht erscheint hier, sobald die Woche vorbei ist. Du kannst auch den aktuellen Bericht speichern.',
    emptyLocked: 'Deine Berichte erscheinen hier nach 7 Tagen mit Einträgen.',
    other: 'Bericht für einen anderen Zeitraum erstellen',
    lastDay: 'Letzter Tag des Zeitraums',
    covers: (period: string) => `Der Bericht umfasst die 7 Tage vom ${period}.`,
    pickDate: 'Wähl ein Datum.',
    generate: 'Bericht erstellen',
    generated: 'Bericht erstellt.',
    notFound: 'Bericht nicht gefunden',
    notFoundText: 'Vielleicht wurde er gelöscht.',
    staleNotice:
      'Du hast Einträge aus diesem Zeitraum geändert, nachdem dieser Bericht erstellt wurde.',
  },

  profile: {
    title: 'Profil',
    name: 'Dein Name',
    saveName: 'Name speichern',
    nameSaved: 'Name aktualisiert.',
    language: 'Sprache',
    languageHint:
      'Ändert die Texte der App und der Berichte sowie die Lebensmittelnamen, die EatMate erkennt, wenn du eingibst, was du gegessen hast.',
    appearance: 'Darstellung',
    themes: { system: 'Automatisch', light: 'Hell', dark: 'Dunkel' },
    install: 'App installieren',
    installed: 'Du nutzt EatMate schon als installierte App. 🎉',
    installText:
      'Installiere EatMate, um es wie eine App direkt vom Startbildschirm zu öffnen – auch ohne Internet.',
    installButton: 'EatMate installieren',
    installIOS:
      'Öffne EatMate auf dem iPhone in Safari, tippe auf **Teilen** und dann auf **Zum Home-Bildschirm**.',
    installOther:
      'Such im Browsermenü nach **App installieren** oder **Zum Startbildschirm hinzufügen**.',
    data: 'Deine Daten',
    dataSummary: (mealCount: number, dayCount: number, reportCount: number) =>
      `${meals(mealCount)} an ${daysDative(dayCount)} · ${reports(reportCount)}. Alles wird nur auf diesem Gerät gespeichert – mach ab und zu ein Backup, damit nichts verloren geht, wenn du dein Handy wechselst.`,
    lastBackup: 'Letztes Backup:',
    never: 'noch nie',
    export: 'Backup exportieren',
    import: 'Backup importieren',
    exported: 'Backup in deinen Dateien gespeichert.',
    importTitle: 'Backup importieren?',
    importMessage: (mealCount: number, reportCount: number) =>
      `Die Datei enthält ${meals(mealCount)} und ${reports(reportCount)}. Sie werden mit deinen aktuellen Daten zusammengeführt – nichts wird gelöscht.`,
    importConfirm: 'Importieren',
    imported: (n: number) => `Backup importiert: ${meals(n)}.`,
    customFoods: 'Meine Lebensmittel',
    customFoodsText:
      'Lebensmittel, die du eingeordnet hast. Tippe auf den Stift, um die Kategorie zu ändern.',
    changeCategory: (name: string) => `Kategorie für ${name} ändern`,
    removeFood: (name: string) => `${name} entfernen`,
    removeFoodTitle: (name: string) => `„${name}“ entfernen?`,
    removeFoodMessage:
      'Einträge mit diesem Lebensmittel bleiben gespeichert, sind dann aber nicht mehr eingeordnet.',
    foodRemoved: 'Lebensmittel entfernt.',
    reclassified: 'Einordnung aktualisiert.',
    method: {
      title: 'Wie wird die Note berechnet?',
      intro:
        'Jedes Lebensmittel bekommt eine Note von **A** (am besten) bis **E**, angelehnt an den europäischen Nutri-Score, und einen Verarbeitungsgrad nach dem **Ernährungsleitfaden für die brasilianische Bevölkerung** (unverarbeitet, Küchenzutaten, verarbeitet und hochverarbeitet).',
      criteria: 'Die Wochennote reicht von 0 bis 100 und setzt sich aus fünf Kriterien zusammen:',
      items: {
        qualidade: 'Nährwertqualität der Lebensmittel',
        processamento: 'Verarbeitungsgrad',
        frutas_verduras: 'Obst und Gemüse (Ziel: 5 Portionen pro Tag)',
        variedade: 'Abwechslung bei den Lebensmitteln',
        regularidade: 'Regelmäßigkeit von Frühstück, Mittag- und Abendessen',
      } satisfies Record<ScoreComponentKey, string>,
      letters: (thresholds: string, min: number) =>
        `Danach werden die Punkte zu einer Note: ${thresholds} und E unter ${min}.`,
      threshold: (grade: Grade, min: number) => `${grade} ab ${min}`,
      disclaimer:
        'Die Noten sind Schätzungen, die dir helfen sollen, Muster zu erkennen – sie ersetzen keine professionelle Ernährungsberatung.',
    },
    danger: 'Daten löschen',
    dangerText: 'Entfernt alle Mahlzeiten, Berichte und Einstellungen von diesem Gerät.',
    eraseAll: 'Alle Daten löschen',
    eraseTitle: 'Alle Daten löschen?',
    eraseMessage:
      'Alle Mahlzeiten, Berichte und Einstellungen auf diesem Gerät werden gelöscht. Wenn du eine Kopie behalten möchtest, exportiere vorher ein Backup.',
    eraseConfirm: 'Alles löschen',
    version: (version: string) => `EatMate ${version} · deine Daten bleiben bei dir.`,
  },

  backup: {
    invalidJson: 'Die Datei ist kein gültiges EatMate-Backup (ungültiges JSON).',
    notEatmate: 'Diese Datei scheint kein EatMate-Backup zu sein.',
    tooLarge: 'Die Datei ist zu groß für ein EatMate-Backup.',
    readError: 'Die Datei konnte nicht gelesen werden.',
    importError: 'Die Datei konnte nicht importiert werden.',
  },

  notFound: {
    title: 'Seite nicht gefunden',
    text: 'Diese Adresse gibt es bei EatMate nicht.',
    home: 'Zurück zum Start',
    errorTitle: 'Da ist etwas schiefgelaufen',
    errorText:
      'Deine Daten sind weiterhin auf diesem Gerät gespeichert. Versuch, die App neu zu laden.',
    reload: 'App neu laden',
  },

  /** Relatório em texto (Markdown), para colar em uma IA, no WhatsApp ou em um e-mail. */
  export: {
    title: 'Ernährungsbericht',
    name: 'Name',
    period: 'Zeitraum',
    periodValue: (start: string, end: string, registered: number, total: number) =>
      `${start} bis ${end} (${registered} von ${total} Tagen erfasst)`,
    meals: 'Eingetragene Mahlzeiten',
    items: 'Lebensmittel',
    overall: 'Gesamtnote',
    noData: 'nicht genug Daten',
    previous: (period: string) => `Vorheriger Zeitraum (${period})`,
    howCalculated: 'So wurde die Note berechnet',
    weight: (percent: number) => `Gewichtung ${percent}\u00a0%`,
    positives: 'Stärken',
    attention: 'Verbesserungspotenzial',
    markers: 'Ernährungsmarker',
    markersIntro: (n: number) =>
      `Tage mit Verzehr (von ${plural(n, '1 erfassten Tag', `${n} erfassten Tagen`)}):`,
    idealDaily: 'ideal: jeden Tag',
    idealAvoid: 'ideal: meiden',
    grades: 'Qualität der Lebensmittel (Skala A bis E)',
    nova: 'Verarbeitungsgrad (NOVA-Klassifikation)',
    groups: 'Lebensmittelgruppen',
    groupLine: (group: string, count: number, dayText: string) =>
      `${group}: ${count}x an ${dative(dayText)}`,
    fruitsAndVegetables: (perDay: string) =>
      `Obst und Gemüse: im Schnitt ${portions(perDay)} pro Tag.`,
    mealsTitle: 'Eingetragene Mahlzeiten',
    mealLine: (meal: string, n: number, dayText: string) => `${meal}: ${n} von ${dative(dayText)}`,
    topFoods: 'Häufigste Lebensmittel',
    diary: 'Ernährungstagebuch',
    dayGrade: (grade: Grade) => `Tagesnote: ${grade}`,
    noRecord: '(kein Eintrag)',
    note: 'Notiz',
    footer: (date?: string) =>
      `Erstellt mit EatMate${date ? ` am ${date}` : ''}. Die Noten (A bis E) und der Verarbeitungsgrad sind automatische Schätzungen, angelehnt an den Nutri-Score und den Ernährungsleitfaden für die brasilianische Bevölkerung. Dieser Bericht ersetzt keine professionelle Ernährungsberatung.`,
    aiIntro: (name: string, period: string) =>
      `Hallo! ${name ? `Ich bin ${name} und habe` : 'Ich habe'} meine Ernährung mit der App EatMate festgehalten. Unten findest du meinen Bericht für den Zeitraum ${period}.`,
    aiAsk: [
      'Bitte mach auf dieser Grundlage Folgendes:',
      '1. Bewerte die Stärken und Schwächen meiner Ernährung;',
      '2. Schlag praktische und realistische Verbesserungen vor, passend zu meiner Esskultur;',
      '3. Nenne einfache Alternativen für die Lebensmittel mit Note D oder E;',
      '4. Stell einen Beispiel-Speiseplan für einen Tag zusammen – mit Frühstück, Mittagessen, Snack und Abendessen.',
    ],
    aiNote:
      'Hinweis: Die Noten A–E und der Verarbeitungsgrad wurden von der App automatisch geschätzt.',
  },
};
