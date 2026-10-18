import type { Grade, ScoreFacts } from '../../domain/types';
import type { Format } from '../format';
import type { Messages } from './pt';

/*
 * Testi dell'app in italiano (stessa struttura del portoghese, vedi `Messages`).
 *
 * `**testo**` diventa grassetto sullo schermo (componente `Rich`).
 */

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
const days = (n: number) => plural(n, '1 giorno', `${n} giorni`);
const times = (n: number) => plural(n, '1 volta', `${n} volte`);
const meals = (n: number) => plural(n, '1 pasto', `${n} pasti`);
const reports = (n: number) => `${n} report`;
const registeredDays = (n: number) => plural(n, '1 giorno registrato', `${n} giorni registrati`);
/** Percentuale con l'articolo giusto: "il 25%", "l'8%", "l'11%", "lo 0%". */
const the = (share: string) =>
  /^0/.test(share) ? `lo ${share}` : /^(8|11|1(?!\d))/.test(share) ? `l'${share}` : `il ${share}`;
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const it: Messages = {
  common: {
    back: 'Indietro',
    close: 'Chiudi',
    cancel: 'Annulla',
    confirm: 'Conferma',
    delete: 'Elimina',
    remove: 'Rimuovi',
    today: 'Oggi',
    yesterday: 'Ieri',
    loading: 'Caricamento',
    backupFile: 'File di backup',
    days,
    meals,
    daysOf: (n: number, total: number) => `${n} su ${total} ${total === 1 ? 'giorno' : 'giorni'}`,
  },

  grades: {
    labels: {
      A: 'Ottima',
      B: 'Buona',
      C: 'Discreta',
      D: 'Da migliorare',
      E: 'Da rivedere',
    },
    messages: {
      A: 'La tua alimentazione è ottima! Continua così.',
      B: 'Sei sulla strada giusta — con piccoli aggiustamenti puoi arrivare alla A.',
      C: 'Ci sono buone abitudini, ma anche margini per migliorare.',
      D: 'La tua alimentazione ha bisogno di qualche aggiustamento. Guarda i consigli nel report.',
      E: 'Che ne dici di iniziare con piccoli cambiamenti di tutti i giorni? Il report ti mostra da dove partire.',
    },
    badge: (grade: Grade, label: string) => `Valutazione ${grade} — ${label}`,
    unclassified: 'Non classificato',
    scale: (grade: Grade, label: string) => `Valutazione ${grade} sulla scala da A a E: ${label}`,
    thermometer: (score: number, grade: Grade) =>
      `Termometro: ${score} punti su 100, valutazione ${grade}`,
  },

  mealTypes: {
    cafe_manha: 'Colazione',
    lanche_manha: 'Spuntino del mattino',
    almoco: 'Pranzo',
    cafe_tarde: 'Merenda',
    jantar: 'Cena',
    ceia: 'Spuntino serale',
  },

  groups: {
    frutas: 'Frutta',
    verduras_legumes: 'Verdure e ortaggi',
    leguminosas: 'Fagioli e altri legumi',
    cereais: 'Cereali, pane, pasta e tuberi',
    carnes_ovos: 'Carne, pesce e uova',
    leite_derivados: 'Latte e derivati',
    oleaginosas: 'Frutta secca e semi',
    bebidas: 'Acqua, caffè e tè',
    bebidas_adocadas: 'Succhi e bevande zuccherate',
    doces: 'Dolci e merendine',
    lanches: 'Panini, rosticceria e fast food',
    pratos: 'Piatti e preparazioni',
    gorduras_molhos: 'Oli, grassi e salse',
    alcool: 'Bevande alcoliche',
  },

  nova: {
    1: 'Freschi o minimamente trasformati',
    2: 'Ingredienti culinari (oli, zucchero, burro)',
    3: 'Trasformati',
    4: 'Ultraprocessati',
  },

  classify: {
    title: (name: string) => `Che cos'è “${name}”?`,
    description: 'Scegli la categoria più adatta. EatMate se ne ricorderà la prossima volta.',
    done: (name: string, category: string) =>
      `“${name}” classificato come ${category.toLowerCase()}.`,
    options: {
      fruta: { label: 'Frutta', examples: 'banana, mela, arancia' },
      verdura: { label: 'Verdura o ortaggio', examples: 'insalata, carota, zucchina' },
      leguminosa: { label: 'Fagioli o altri legumi', examples: 'fagioli, lenticchie, ceci' },
      cereal: { label: 'Riso, pasta o tuberi', examples: 'riso, pasta, patate' },
      pao: { label: 'Pane, fette biscottate o cracker', examples: 'pane, fette biscottate' },
      carne: { label: 'Carne, pollo, pesce o uova', examples: 'bistecca, pollo, merluzzo, uova' },
      embutido: { label: 'Salumi e insaccati', examples: 'prosciutto, würstel, salsiccia' },
      laticinio: { label: 'Latte, yogurt o formaggio', examples: 'latte, yogurt, formaggio' },
      oleaginosa: { label: 'Frutta secca o semi', examples: 'noci, arachidi, semi di chia' },
      bebida: { label: 'Acqua, caffè o tè senza zucchero', examples: 'acqua, caffè, tè' },
      adocada: {
        label: 'Succo o bevanda zuccherata',
        examples: 'bibita gassata, succo di frutta confezionato',
      },
      doce: { label: 'Dolce o dessert', examples: 'torta, cioccolato, tiramisù' },
      lanche: { label: 'Panino, rosticceria o fast food', examples: 'arancino, hamburger, pizza' },
      prato_caseiro: {
        label: 'Piatto fatto in casa',
        examples: 'preparato in casa con ingredienti freschi',
      },
      prato_pronto: {
        label: 'Piatto pronto o surgelato',
        examples: 'lasagne surgelate, minestra in busta',
      },
      gordura: { label: 'Salsa, olio o grasso', examples: "maionese, burro, olio d'oliva" },
      alcool: { label: 'Bevanda alcolica', examples: 'birra, vino, spritz' },
    },
  },

  score: {
    components: {
      qualidade: 'Qualità nutrizionale',
      processamento: 'Grado di trasformazione',
      frutas_verduras: 'Frutta e verdura',
      variedade: 'Varietà',
      regularidade: 'Regolarità dei pasti',
    },
    details: {
      qualidade: (s: ScoreFacts) => `Valutazione media degli alimenti: ${s.averageGrade}`,
      processamento: (s: ScoreFacts, f: Format) =>
        `${f.percent(s.inNaturaShare)} freschi o minimamente trasformati · ${f.percent(s.ultraShare)} ultraprocessati`,
      frutas_verduras: (s: ScoreFacts, f: Format) =>
        `${f.decimal(s.fvPerDay)} porzioni al giorno (obiettivo: ${s.fvTarget})`,
      variedade: (s: ScoreFacts) =>
        `${s.distinctGood} alimenti diversi con valutazione A, B o C (obiettivo: ${s.varietyTarget})`,
      regularidade: (s: ScoreFacts, f: Format) =>
        `${f.percent(s.mainMealsShare)} dei pasti principali registrati (colazione, pranzo e cena)`,
    },
    weight: (percent: number) => `peso ${percent}%`,
    delta: (delta: number) =>
      delta === 0
        ? 'Uguale ai 7 giorni precedenti'
        : `${delta > 0 ? '+' : '−'}${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'punto' : 'punti'} rispetto ai 7 giorni precedenti`,
  },

  markers: {
    feijao: 'Fagioli e altri legumi',
    frutas: 'Frutta',
    verduras: 'Verdure e ortaggi',
    embutidos: 'Hamburger e salumi',
    adocadas: 'Bibite e bevande zuccherate',
    salgadinhos: 'Noodles istantanei, patatine in busta e cracker',
    doces: 'Biscotti farciti, dolci e merendine',
  },

  /** `n` e `of` arrivano da ogni punto del report (vedi `Insight`). */
  insights: {
    fv_great: (n: number, _of: number, f: Format) =>
      `Ottimo consumo di frutta e verdura: in media ${f.decimal(n)} porzioni al giorno.`,
    fv_good: (n: number, of: number, f: Format) =>
      `Buon consumo di frutta e verdura (${f.decimal(n)} porzioni al giorno). Manca poco all'obiettivo di ${of}.`,
    beans_most: (n: number, of: number) =>
      `Fagioli o altri legumi in ${n} giorni su ${of} — ottima fonte di fibre, ferro e proteine.`,
    few_ultra: (n: number, _of: number, f: Format) =>
      `Pochi ultraprocessati: solo ${the(f.percent(n))} degli alimenti.`,
    no_sugary: () => 'Nessuna bibita o bevanda zuccherata nel periodo.',
    regular_meals: () => 'Pasti principali (colazione, pranzo e cena) registrati con regolarità.',
    breakfast_daily: () => 'Colazione registrata tutti i giorni.',
    variety_good: (n: number) => `Buona varietà: ${n} alimenti diversi di buona qualità.`,
    water: (n: number, of: number) =>
      `Acqua registrata in ${days(n)} su ${of}. Continua a idratarti!`,
    whole_grains: (n: number) => `I cereali integrali sono comparsi ${times(n)}.`,
    in_natura: (n: number, _of: number, f: Format) =>
      `${capitalize(the(f.percent(n)))} degli alimenti erano freschi o minimamente trasformati — la base di un'alimentazione sana.`,
    fv_low: (n: number, of: number, f: Format) =>
      `Poca frutta e verdura: in media ${f.decimal(n)} porzioni al giorno (se ne consigliano almeno ${of}).`,
    fruits_few: (n: number, of: number) => `La frutta è comparsa solo in ${days(n)} su ${of}.`,
    vegetables_few: (n: number, of: number) =>
      `Le verdure sono comparse solo in ${days(n)} su ${of}.`,
    ultra_high: (n: number, _of: number, f: Format) =>
      `Gli ultraprocessati erano ${the(f.percent(n))} degli alimenti. Preferisci cibi freschi e piatti fatti in casa.`,
    sugary: (n: number) =>
      `Bibite e bevande zuccherate sono comparse ${times(n)}. Sostituiscile con acqua, acqua frizzante e limone o un succo fresco senza zucchero.`,
    sweets: (n: number, of: number) => `Dolci e merendine sono comparsi in ${days(n)} su ${of}.`,
    processed_meat: (n: number) =>
      `Hamburger e salumi sono comparsi ${times(n)} — di solito contengono molto sodio e conservanti.`,
    salty_snacks: (n: number) =>
      `Patatine in busta, cracker o noodles istantanei sono comparsi ${times(n)}.`,
    fast_food: (n: number) => `Panini, rosticceria e fast food sono comparsi ${times(n)}.`,
    alcohol: (n: number) => `Le bevande alcoliche sono comparse ${times(n)}.`,
    no_breakfast: (n: number) => `Nessuna colazione registrata in ${days(n)}.`,
    skipped_meals: (n: number) =>
      `Pranzo o cena non registrati in ${days(n)}. Se hai saltato dei pasti, prova a mantenere orari regolari.`,
    beans_low: (n: number, of: number) =>
      `Pochi legumi (${days(n)} su ${of}). Fagioli, lenticchie e ceci sono una fonte economica di fibre, ferro e proteine — pasta e fagioli è un classico!`,
    variety_low: (n: number) =>
      `Poca varietà: ${plural(n, '1 solo alimento', `${n} alimenti diversi`)} di buona qualità. Variare aiuta ad assumere più nutrienti.`,
    incomplete: (n: number, of: number) =>
      `Hai registrato ${days(n)} su ${of}. Con registrazioni complete il report è più fedele.`,
    unclassified: (n: number) =>
      n === 1
        ? '1 alimento non è stato riconosciuto ed è rimasto fuori dal calcolo. Puoi classificarlo modificando il pasto.'
        : `${n} alimenti non sono stati riconosciuti e sono rimasti fuori dal calcolo. Puoi classificarli modificando il pasto.`,
  },

  /** Consigli basati sulla Guida alimentare per la popolazione brasiliana (Ministero della Salute brasiliano). */
  tips: [
    'Fai di cibi freschi o minimamente trasformati — frutta, verdura, riso, legumi, uova — la base della tua alimentazione.',
    'Usa oli, grassi, sale e zucchero in piccole quantità per condire e cucinare.',
    'Limita gli alimenti trasformati, come conserve, formaggi e pane confezionato.',
    'Evita gli ultraprocessati, come bibite gassate, biscotti farciti, patatine in busta e noodles istantanei.',
    'Mangia con regolarità e attenzione, in un ambiente tranquillo e, quando puoi, in compagnia.',
    'Fai la spesa preferibilmente nei mercati rionali, dai fruttivendoli e nei negozi con tanta scelta di cibi freschi.',
    "Cucinare è un'ottima abitudine: prova una ricetta nuova questa settimana.",
    "Pianifica i pasti della settimana: così è più facile evitare gli spuntini dell'ultimo minuto.",
    'Quando mangi fuori, scegli posti che servono cibo preparato al momento.',
    'Diffida della pubblicità degli alimenti: vende prodotti, non salute.',
    'I legumi (fagioli, lenticchie, ceci) sono una fonte economica di fibre, ferro e proteine — pasta e fagioli è un classico!',
    'Prova a mangiare un frutto a colazione e un altro a merenda.',
    'Bevi acqua durante la giornata: tenere una borraccia a portata di mano ti aiuta a ricordartene.',
    'Sostituisci le bibite con acqua frizzante e limone o con un succo fresco senza zucchero.',
    'Riempire metà del piatto di verdura è un modo facile per arrivare a 5 porzioni al giorno.',
    'Meglio la frutta intera del succo: ha più fibre e sazia di più.',
    'Frutta secca, frutta fresca e yogurt bianco sono ottimi spuntini al posto dei biscotti.',
    'Varia i colori nel piatto: ogni colore di verdura porta nutrienti diversi.',
  ],

  nav: {
    label: 'Navigazione principale',
    home: 'Home',
    history: 'Storico',
    add: 'Registra un pasto',
    reports: 'Report',
    profile: 'Profilo',
  },

  update: {
    available: 'È disponibile una nuova versione di EatMate.',
    update: 'Aggiorna',
    later: 'Più tardi',
  },

  locked: {
    title: "Termometro dell'alimentazione",
    text: (n: number) =>
      `Registra quello che mangi per ${n} giorni per scoprire la qualità della tua alimentazione, con una valutazione da A a E, e ricevere il tuo primo report.`,
    progress: (n: number, total: number) => `${n} su ${total} giorni registrati`,
    count: (n: number, total: number) => `${n} su ${total} giorni`,
    missing: (n: number) => (n === 1 ? 'manca 1 giorno' : `mancano ${n} giorni`),
    registered: 'registrati',
    example: 'Guarda un report di esempio',
  },

  onboarding: {
    title: 'Ti diamo il benvenuto in EatMate',
    subtitle: 'Il tuo diario alimentare semplice, senza contare le calorie.',
    features: [
      {
        title: 'Registra cosa hai mangiato',
        text: 'A modo tuo, subito o più tardi: "cappuccino e cornetto".',
      },
      {
        title: "Termometro dell'alimentazione",
        text: 'Dopo 7 giorni, scopri la qualità della tua alimentazione con una valutazione da A a E.',
      },
      {
        title: 'Report da condividere',
        text: "Mostralo al tuo nutrizionista o incollalo in un'IA per ricevere suggerimenti.",
      },
    ],
    nameLabel: 'Come possiamo chiamarti?',
    namePlaceholder: 'Il tuo nome',
    start: 'Iniziamo',
    restore: 'Usi già EatMate? Ripristina un backup',
    restored: (n: number) => `Backup ripristinato: ${meals(n)}.`,
    askName: 'Ora dicci solo come possiamo chiamarti.',
    privacy: 'I tuoi dati restano solo su questo dispositivo.',
  },

  dashboard: {
    hello: (name: string) => `Ciao, ${name}!`,
    ctaTitle: 'Registra un pasto',
    ctaSubtitle: 'Cosa hai mangiato, adesso o prima?',
    thermoTitle: 'La qualità della tua alimentazione',
    seeReport: 'Vedi il report completo',
    noScore:
      'Negli ultimi 7 giorni non ci sono ancora abbastanza alimenti riconosciuti per calcolare la valutazione.',
    today: 'Oggi',
    seeDay: 'Vedi giorno',
    add: 'Aggiungi',
    registered: 'Registrato',
    streak: 'giorni di fila',
    registeredDays: 'giorni registrati',
    meals7: 'pasti in 7 giorni',
    tip: 'Consiglio del giorno',
  },

  foodInput: {
    label: 'Cosa hai mangiato?',
    placeholder: 'Es.: "pasta al pomodoro e insalata"',
    add: 'Aggiungi',
    suggestions: 'Alimenti suggeriti',
    nothingFound:
      'Non ho trovato nessun alimento in questo testo. Prova con qualcosa come "pasta al pomodoro e insalata".',
  },

  mealForm: {
    newTitle: 'Registra un pasto',
    editTitle: 'Modifica pasto',
    notFound: 'Pasto non trovato',
    notFoundText: 'Potrebbe essere stato eliminato.',
    when: 'Quando?',
    date: 'Data',
    time: 'Ora (facoltativa)',
    future: 'Non puoi registrare pasti nel futuro.',
    which: 'Quale pasto?',
    alreadyBefore: (meal: string) => `Hai già registrato un pasto “${meal}” in questo giorno.`,
    editExisting: 'Modifica quello esistente',
    alreadyAfter: 'oppure salva questo come pasto separato.',
    what: 'Cosa hai mangiato?',
    hint: 'Scrivi un alimento alla volta o tutta la frase — EatMate separa i vari alimenti.',
    items: 'Alimenti del pasto',
    notRecognized: 'Non riconosciuto · classifica',
    quantityPlaceholder: '+ quantità (es.: 2 fette)',
    quantityOf: (name: string) => `Quantità di ${name}`,
    removeItem: (name: string) => `Rimuovi ${name}`,
    empty: 'Non hai ancora aggiunto alimenti.',
    quality: 'Qualità media di questo pasto',
    frequent: 'Mangi spesso:',
    notes: 'Note (facoltative)',
    notesPlaceholder: 'Es.: ho mangiato fuori, avevo molta fame…',
    saveChanges: 'Salva le modifiche',
    save: 'Salva pasto',
    changesSaved: 'Modifiche salvate!',
    saved: (meal: string) => `Pasto registrato: ${meal}.`,
    saveError: 'Impossibile salvare il pasto. Registralo di nuovo.',
    deleteError: 'Impossibile eliminare il pasto. Riprova.',
    deleteTitle: 'Eliminare questo pasto?',
    deleteMessage: (meal: string, date: string) =>
      `${meal} del giorno ${date}. Questa azione non si può annullare.`,
    deleted: 'Pasto eliminato.',
    deleteLabel: 'Elimina pasto',
  },

  history: {
    title: 'Storico',
    count: registeredDays,
    emptyTitle: 'Ancora nessuna registrazione',
    emptyText: 'Qui compariranno i giorni in cui registri dei pasti.',
    register: 'Registra un pasto',
    search: 'Cerca un alimento',
    searchPlaceholder: 'Cerca un alimento (es.: pizza)',
    noMatch: (query: string) => `Nessun giorno con “${query}”.`,
  },

  day: {
    title: 'Giorno',
    invalid: 'Data non valida',
    deleteMealTitle: (meal: string) => `Eliminare “${meal}”?`,
    irreversible: 'Questa azione non si può annullare.',
    deleteDayTitle: 'Eliminare tutte le registrazioni del giorno?',
    deleteDayMessage: (n: number, date: string) =>
      n === 1
        ? `1 pasto del giorno ${date} verrà eliminato.`
        : `${n} pasti del giorno ${date} verranno eliminati.`,
    deleteDayConfirm: 'Elimina giorno',
    dayDeleted: 'Registrazioni del giorno eliminate.',
    empty: 'Nessuna registrazione in questo giorno',
    registerHere: 'Registra un pasto in questo giorno',
    summary: 'Riepilogo del giorno',
    grade: (label: string) => `Valutazione del giorno: ${label}`,
    noGrade: 'Nessuna valutazione',
    items: (n: number) => plural(n, '1 alimento', `${n} alimenti`),
    fruitsAndVegetables: (n: number) =>
      `${n} ${n === 1 ? 'porzione' : 'porzioni'} di frutta e verdura`,
    ultraProcessed: (n: number) => `${n} ${n === 1 ? 'ultraprocessato' : 'ultraprocessati'}`,
    unclassified: (n: number) => `${n} ${n === 1 ? 'non classificato' : 'non classificati'}`,
    edit: (meal: string) => `Modifica ${meal}`,
    delete: (meal: string) => `Elimina ${meal}`,
    missingLabel: 'Pasti principali non registrati',
    missing: (meal: string) => `${meal}: da registrare`,
    addHere: 'Aggiungi un pasto in questo giorno',
    deleteAll: 'Elimina tutte le registrazioni del giorno',
  },

  report: {
    footnote:
      'Le valutazioni da A a E e il grado di trasformazione sono stime automatiche, ispirate al Nutri-Score e alla Guida alimentare per la popolazione brasiliana. Questo report non sostituisce il parere di un/una nutrizionista.',
    generatedAt: (date: string) => `Generato in data ${date}`,
    noScore:
      'In questo periodo non ci sono abbastanza alimenti riconosciuti per calcolare la valutazione.',
    kpis: {
      days: 'giorni registrati',
      meals: 'pasti',
      fruitsAndVegetables: 'porzioni di frutta e verdura al giorno',
      ultraProcessed: 'di ultraprocessati',
    },
    highlights: 'In evidenza',
    positives: 'Punti di forza',
    attention: "Da tenere d'occhio",
    breakdown: 'Come è stata calcolata la valutazione',
    breakdownText: 'Cinque criteri, ognuno da 0 a 100, con pesi diversi.',
    markers: 'Indicatori di consumo',
    markersText: (n: number) =>
      `In quanti dei ${n} giorni registrati è comparso ogni gruppo (ispirato al SISVAN del Ministero della Salute brasiliano).`,
    markersGood: "L'ideale è consumarli tutti i giorni",
    markersAvoid: "L'ideale è evitarli",
    status: { good: 'Ottimo', warn: 'Può migliorare', bad: 'Attenzione' },
    distributions: 'Qualità e trasformazione',
    gradesTitle: 'Valutazione degli alimenti (da A a E)',
    gradesLabel: (list: string) => `Distribuzione delle valutazioni: ${list}`,
    processingTitle: 'Grado di trasformazione',
    processingLabel: (list: string) => `Grado di trasformazione: ${list}`,
    groups: 'Gruppi alimentari',
    group: 'Gruppo',
    times: 'Volte',
    daysColumn: 'Giorni',
    meals: 'Pasti',
    mealsText: (n: number) => `In quanti dei ${n} giorni registrati compare ogni pasto.`,
    mealDays: (meal: string, n: number) => `${meal}: ${days(n)}`,
    of: 'su',
    topFoods: 'Alimenti più frequenti',
    dayByDay: 'Giorno per giorno',
    diary: 'Diario alimentare completo',
    diaryText: 'Tutto quello che hai registrato nel periodo, da mostrare al tuo nutrizionista.',
    notes: 'Note:',
    noRecord: 'Nessuna registrazione.',
  },

  reportActions: {
    title: 'Usa questo report',
    text: "Incollalo in un'IA (ChatGPT, Gemini, Claude…) per ricevere suggerimenti su come migliorare, oppure salvalo in PDF da portare al tuo nutrizionista.",
    copyForAI: "Copia per usarlo in un'IA",
    print: 'PDF / Stampa',
    share: 'Condividi',
    copyText: 'Copia testo',
    download: 'Scarica file',
    copiedForAI: 'Copiato! Ora incollalo nella tua IA preferita.',
    copied: 'Report copiato.',
    copyFailed: 'Impossibile copiare.',
    shareFailed: 'Impossibile condividere da questo dispositivo.',
    fileName: 'eatmate report',
  },

  currentReport: {
    header: 'Report',
    title: 'Ultimi 7 giorni',
    live: 'Live',
    notice:
      'Questo report si aggiorna da solo man mano che registri. Alla fine di ogni settimana, una copia viene salvata nel tuo storico dei report.',
    exportTitle: 'Report alimentare',
    savedInHistory: 'Salvato nello storico',
    updateInHistory: 'Aggiorna nello storico',
    saveInHistory: 'Salva nello storico',
    updated: 'Report aggiornato nello storico.',
    saved: 'Report salvato nello storico.',
  },

  exampleReport: {
    header: 'Report di esempio',
    title: 'Esempio',
    badge: 'Dati fittizi',
    notice:
      'Questo è un esempio con una settimana inventata. Il tuo vero report compare dopo 7 giorni di registrazioni.',
    register: 'Registra un pasto',
  },

  reports: {
    title: 'Report',
    subtitle: 'Lo storico dei tuoi report settimanali',
    week: (n: number) => `Settimana ${n}`,
    custom: 'Report personalizzato',
    current: 'Report attuale',
    currentText: 'Ultimi 7 giorni, aggiornato in tempo reale',
    info: 'Alla fine di ogni settimana, qui viene salvato automaticamente un report. Se in seguito correggi qualche registrazione, basta rigenerare il report.',
    list: 'Report salvati',
    generatedAt: (date: string) => `Generato in data ${date}`,
    stale: 'Non aggiornato',
    regenerate: 'Rigenera',
    regenerateNow: 'Rigenera con i dati attuali',
    regenerated: (title: string) => `${title}: report rigenerato con i dati attuali.`,
    regeneratedOne: 'Report rigenerato con i dati attuali.',
    delete: 'Elimina',
    deleteLabel: 'Elimina report',
    deleteTitle: (title: string) => `Eliminare “${title}”?`,
    deleteWeekly:
      'Le registrazioni dei tuoi pasti restano salvate. Puoi rigenerare questo report quando vuoi.',
    deleteCustom: 'Le registrazioni dei tuoi pasti restano salvate.',
    deleted: 'Report eliminato.',
    deleteError: 'Impossibile eliminare il report. Riprova.',
    emptyTitle: 'Ancora nessun report salvato',
    emptyUnlocked:
      'Il primo report settimanale comparirà qui alla fine della settimana. Puoi anche salvare il report attuale.',
    emptyLocked: 'I tuoi report compariranno qui dopo 7 giorni di registrazioni.',
    other: 'Genera un report di un altro periodo',
    lastDay: 'Ultimo giorno del periodo',
    covers: (period: string) => `Il report coprirà 7 giorni: ${period}.`,
    pickDate: 'Scegli una data.',
    generate: 'Genera report',
    generated: 'Report generato.',
    notFound: 'Report non trovato',
    notFoundText: 'Potrebbe essere stato eliminato.',
    staleNotice:
      'Hai modificato delle registrazioni di questo periodo dopo che il report è stato generato.',
  },

  profile: {
    title: 'Profilo',
    name: 'Il tuo nome',
    saveName: 'Salva nome',
    nameSaved: 'Nome aggiornato.',
    language: 'Lingua',
    languageHint:
      "Cambia i testi dell'app e dei report, e i nomi degli alimenti che EatMate riconosce quando scrivi cosa hai mangiato.",
    appearance: 'Aspetto',
    themes: { system: 'Automatico', light: 'Chiaro', dark: 'Scuro' },
    install: "Installa l'app",
    installed: 'Stai già usando EatMate come app installata. 🎉',
    installText:
      "Installa EatMate per aprirlo direttamente dalla schermata Home, come un'app, anche senza internet.",
    installButton: 'Installa EatMate',
    installIOS:
      'Su iPhone, apri la pagina in Safari, tocca **Condividi** e poi **Aggiungi alla schermata Home**.',
    installOther: 'Nel menu del browser, cerca **Installa app** o **Aggiungi a schermata Home**.',
    data: 'I tuoi dati',
    dataSummary: (nMeals: number, nDays: number, nReports: number) =>
      `${meals(nMeals)} in ${days(nDays)} · ${reports(nReports)}. È tutto salvato solo su questo dispositivo: fai un backup ogni tanto, così non perdi nulla se cambi telefono.`,
    lastBackup: 'Ultimo backup:',
    never: 'mai',
    export: 'Esporta backup',
    import: 'Importa backup',
    exported: 'Backup salvato nei tuoi file.',
    importTitle: 'Importare il backup?',
    importMessage: (nMeals: number, nReports: number) =>
      `Il file contiene ${meals(nMeals)} e ${reports(nReports)}. Verranno uniti ai tuoi dati attuali: non verrà cancellato nulla.`,
    importConfirm: 'Importa',
    imported: (n: number) => `Backup importato: ${meals(n)}.`,
    customFoods: 'I miei alimenti',
    customFoodsText: 'Alimenti che hai classificato. Tocca la matita per cambiare categoria.',
    changeCategory: (name: string) => `Cambia categoria di ${name}`,
    removeFood: (name: string) => `Rimuovi ${name}`,
    removeFoodTitle: (name: string) => `Rimuovere “${name}”?`,
    removeFoodMessage:
      'Le registrazioni con questo alimento restano salvate, ma senza classificazione.',
    foodRemoved: 'Alimento rimosso.',
    reclassified: 'Classificazione aggiornata.',
    method: {
      title: 'Come viene calcolata la valutazione?',
      intro:
        'Ogni alimento ha una valutazione da **A** (la migliore) a **E**, ispirata al Nutri-Score europeo, e un grado di trasformazione secondo la **Guida alimentare per la popolazione brasiliana** (freschi o minimamente trasformati, ingredienti culinari, trasformati e ultraprocessati).',
      criteria: 'La valutazione della settimana va da 0 a 100 e combina cinque criteri:',
      items: {
        qualidade: 'Qualità nutrizionale degli alimenti',
        processamento: 'Grado di trasformazione',
        frutas_verduras: 'Frutta e verdura (obiettivo: 5 porzioni al giorno)',
        variedade: 'Varietà degli alimenti',
        regularidade: 'Regolarità di colazione, pranzo e cena',
      },
      letters: (thresholds: string, min: number) =>
        `Poi i punti diventano una lettera: ${thresholds} ed E sotto i ${min}.`,
      threshold: (grade: Grade, min: number) => `${grade} da ${min} in su`,
      disclaimer:
        'Le valutazioni sono stime che ti aiutano a riconoscere le tue abitudini: non sostituiscono il parere di un/una nutrizionista.',
    },
    danger: 'Cancella dati',
    dangerText: 'Rimuove tutti i pasti, i report e le impostazioni da questo dispositivo.',
    eraseAll: 'Cancella tutti i dati',
    eraseTitle: 'Cancellare tutti i dati?',
    eraseMessage:
      'Tutti i pasti, i report e le impostazioni di questo dispositivo verranno cancellati. Se vuoi tenerne una copia, prima esporta un backup.',
    eraseConfirm: 'Cancella tutto',
    version: (version: string) => `EatMate ${version} · i tuoi dati restano con te.`,
  },

  backup: {
    invalidJson: 'Il file non è un backup valido di EatMate (JSON non valido).',
    notEatmate: 'Questo file non sembra un backup di EatMate.',
    readError: 'Impossibile leggere il file.',
    importError: 'Impossibile importare il file.',
  },

  notFound: {
    title: 'Pagina non trovata',
    text: 'Questo indirizzo non esiste in EatMate.',
    home: 'Torna alla home',
    errorTitle: 'Qualcosa è andato storto',
    errorText: "I tuoi dati restano salvati su questo dispositivo. Prova a ricaricare l'app.",
    reload: "Ricarica l'app",
  },

  /** Report in testo (Markdown), da incollare in un'IA, su WhatsApp o in un'e-mail. */
  export: {
    title: 'Report alimentare',
    name: 'Nome',
    period: 'Periodo',
    periodValue: (start: string, end: string, registered: number, total: number) =>
      `${start} – ${end} (${registered} su ${total} giorni registrati)`,
    meals: 'Pasti registrati',
    items: 'Alimenti',
    overall: 'Valutazione complessiva',
    noData: 'dati insufficienti',
    previous: (period: string) => `Periodo precedente (${period})`,
    howCalculated: 'Come è stata calcolata la valutazione',
    weight: (percent: number) => `peso ${percent}%`,
    positives: 'Punti di forza',
    attention: "Da tenere d'occhio",
    markers: 'Indicatori di consumo alimentare',
    markersIntro: (n: number) => `Giorni con consumo, su ${registeredDays(n)}:`,
    idealDaily: 'ideale: tutti i giorni',
    idealAvoid: 'ideale: evitare',
    grades: 'Qualità degli alimenti (scala da A a E)',
    nova: 'Grado di trasformazione (classificazione NOVA)',
    groups: 'Gruppi alimentari',
    groupLine: (group: string, count: number, inDays: string) => `${group}: ${count}x in ${inDays}`,
    fruitsAndVegetables: (perDay: string) =>
      `Frutta e verdura: in media ${perDay} porzioni al giorno.`,
    mealsTitle: 'Pasti registrati',
    mealLine: (meal: string, n: number, ofDays: string) => `${meal}: ${n} su ${ofDays}`,
    topFoods: 'Alimenti più frequenti',
    diary: 'Diario alimentare',
    dayGrade: (grade: Grade) => `valutazione del giorno: ${grade}`,
    noRecord: '(nessuna registrazione)',
    note: 'Nota',
    footer: (date?: string) =>
      `Generato da EatMate${date ? ` in data ${date}` : ''}. Le valutazioni (da A a E) e il grado di trasformazione sono stime automatiche, ispirate al Nutri-Score e alla Guida alimentare per la popolazione brasiliana. Questo report non sostituisce il parere di un/una nutrizionista.`,
    aiIntro: (name: string, period: string) =>
      `Ciao! ${name ? `Sono ${name} e ho registrato` : 'Ho registrato'} la mia alimentazione con l'app EatMate. Qui sotto trovi il mio report del periodo ${period}.`,
    aiAsk: [
      'Sulla base di questo report, per favore:',
      '1. Valuta i punti di forza e di debolezza della mia alimentazione;',
      '2. Suggerisci miglioramenti pratici e realistici, rispettando la mia cultura alimentare;',
      '3. Proponi sostituzioni semplici per gli alimenti con valutazione D o E;',
      '4. Prepara un esempio di menù per un giorno, con colazione, pranzo, spuntino e cena.',
    ],
    aiNote:
      "Nota: le valutazioni A–E e il grado di trasformazione sono stati stimati automaticamente dall'app.",
  },
};
