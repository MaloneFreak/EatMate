import type { Messages } from './pt';

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
const days = (n: number) => plural(n, '1 day', `${n} days`);
const times = (n: number) => plural(n, 'once', n === 2 ? 'twice' : `${n} times`);

export const en: Messages = {
  common: {
    back: 'Back',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    remove: 'Remove',
    today: 'Today',
    yesterday: 'Yesterday',
    loading: 'Loading',
    backupFile: 'Backup file',
    days,
    meals: (n) => plural(n, '1 meal', `${n} meals`),
    daysOf: (n, total) => `${n} of ${total} days`,
  },

  grades: {
    labels: {
      A: 'Excellent',
      B: 'Good',
      C: 'Fair',
      D: 'Needs work',
      E: 'Needs attention',
    },
    messages: {
      A: 'Your diet is looking great! Keep it up.',
      B: "You're on the right track — a few small tweaks could get you to an A.",
      C: 'There are good habits here, and also room to improve.',
      D: 'Your diet needs a few adjustments. Check the tips in your report.',
      E: 'How about starting with small swaps in your day-to-day? Your report shows where to begin.',
    },
    badge: (grade, label) => `Grade ${grade} — ${label}`,
    unclassified: 'Not classified',
    scale: (grade, label) => `Grade ${grade} on the A to E scale: ${label}`,
    thermometer: (score, grade) => `Thermometer: ${score} out of 100 points, grade ${grade}`,
  },

  mealTypes: {
    cafe_manha: 'Breakfast',
    lanche_manha: 'Morning snack',
    almoco: 'Lunch',
    cafe_tarde: 'Afternoon snack',
    jantar: 'Dinner',
    ceia: 'Late snack',
  },

  groups: {
    frutas: 'Fruits',
    verduras_legumes: 'Vegetables',
    leguminosas: 'Beans and legumes',
    cereais: 'Grains, bread, roots and tubers',
    carnes_ovos: 'Meat, fish and eggs',
    leite_derivados: 'Milk and dairy',
    oleaginosas: 'Nuts and seeds',
    bebidas: 'Water, coffee and tea',
    bebidas_adocadas: 'Juices and sweetened drinks',
    doces: 'Sweets and treats',
    lanches: 'Snacks, savory pastries and fast food',
    pratos: 'Dishes and recipes',
    gorduras_molhos: 'Oils, fats and sauces',
    alcool: 'Alcoholic drinks',
  },

  nova: {
    1: 'Unprocessed or minimally processed',
    2: 'Culinary ingredients (oils, sugar, butter)',
    3: 'Processed',
    4: 'Ultra-processed',
  },

  classify: {
    title: (name) => `What is “${name}”?`,
    description: 'Pick the category that fits best. EatMate will remember it next time.',
    done: (name, category) => `“${name}” classified as ${category.toLowerCase()}.`,
    options: {
      fruta: { label: 'Fruit', examples: 'banana, apple, mango' },
      verdura: { label: 'Vegetable', examples: 'lettuce, carrot, zucchini' },
      leguminosa: { label: 'Beans or legumes', examples: 'beans, lentils, chickpeas' },
      cereal: { label: 'Rice, pasta, roots or tubers', examples: 'rice, pasta, potato' },
      pao: { label: 'Bread, toast or crackers', examples: 'white bread, toast' },
      carne: { label: 'Meat, chicken, fish or egg', examples: 'steak, chicken, salmon, egg' },
      embutido: { label: 'Processed meat', examples: 'ham, sausage, salami' },
      laticinio: { label: 'Milk, yogurt or cheese', examples: 'milk, yogurt, cheese' },
      oleaginosa: { label: 'Nuts or seeds', examples: 'almonds, peanuts, chia' },
      bebida: { label: 'Water, coffee or unsweetened tea', examples: 'water, coffee, tea' },
      adocada: { label: 'Juice or sweetened drink', examples: 'soda, boxed juice' },
      doce: { label: 'Sweet or dessert', examples: 'cake, chocolate, pudding' },
      lanche: { label: 'Snack or fast food', examples: 'fries, burger, pizza' },
      prato_caseiro: { label: 'Home-cooked dish', examples: 'made at home with fresh food' },
      prato_pronto: {
        label: 'Ready meal or frozen dish',
        examples: 'frozen lasagna, instant soup',
      },
      gordura: { label: 'Sauce, oil or fat', examples: 'mayonnaise, butter, olive oil' },
      alcool: { label: 'Alcoholic drink', examples: 'beer, wine, cocktail' },
    },
  },

  score: {
    components: {
      qualidade: 'Nutritional quality',
      processamento: 'Degree of processing',
      frutas_verduras: 'Fruits and vegetables',
      variedade: 'Variety',
      regularidade: 'Regular meals',
    },
    details: {
      qualidade: (s) => `Average grade of the foods: ${s.averageGrade}`,
      processamento: (s, f) =>
        `${f.percent(s.inNaturaShare)} unprocessed or minimally processed · ${f.percent(s.ultraShare)} ultra-processed`,
      frutas_verduras: (s, f) => `${f.decimal(s.fvPerDay)} servings per day (goal: ${s.fvTarget})`,
      variedade: (s) =>
        `${s.distinctGood} different foods graded A, B or C (goal: ${s.varietyTarget})`,
      regularidade: (s, f) =>
        `${f.percent(s.mainMealsShare)} of main meals logged (breakfast, lunch and dinner)`,
    },
    weight: (percent) => `weight ${percent}%`,
    delta: (delta) =>
      delta === 0
        ? 'Same as the previous 7 days'
        : `${delta > 0 ? '+' : '−'}${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'point' : 'points'} compared with the previous 7 days`,
  },

  markers: {
    feijao: 'Beans and other legumes',
    frutas: 'Fruits',
    verduras: 'Vegetables',
    embutidos: 'Burgers and processed meats',
    adocadas: 'Soft drinks and sweetened drinks',
    salgadinhos: 'Instant noodles, chips and salty crackers',
    doces: 'Filled cookies, sweets and treats',
  },

  insights: {
    fv_great: (n, _of, f) =>
      `Great intake of fruits and vegetables: ${f.decimal(n)} servings per day on average.`,
    fv_good: (n, of, f) =>
      `Good intake of fruits and vegetables (${f.decimal(n)} servings per day). You're close to the goal of ${of}.`,
    beans_most: (n, of) =>
      `Beans or other legumes on ${n} of ${of} days — a great source of fiber, iron and protein.`,
    few_ultra: (n, _of, f) => `Few ultra-processed foods: only ${f.percent(n)} of items.`,
    no_sugary: () => 'No soft drinks or sweetened drinks in this period.',
    regular_meals: () => 'Main meals (breakfast, lunch and dinner) logged regularly.',
    breakfast_daily: () => 'Breakfast logged every day.',
    variety_good: (n) => `Good variety: ${n} different good-quality foods.`,
    water: (n, of) => `Water logged on ${n} of ${of} days. Keep hydrating!`,
    whole_grains: (n) => `Whole grains showed up ${times(n)}.`,
    in_natura: (n, _of, f) =>
      `${f.percent(n)} of items were unprocessed or minimally processed foods — the basis of a healthy diet.`,
    fv_low: (n, of, f) =>
      `Few fruits and vegetables: ${f.decimal(n)} servings per day on average (the recommendation is at least ${of}).`,
    fruits_few: (n, of) => `Fruit showed up on only ${days(n)} out of ${of}.`,
    vegetables_few: (n, of) => `Vegetables showed up on only ${days(n)} out of ${of}.`,
    ultra_high: (n, _of, f) =>
      `Ultra-processed foods made up ${f.percent(n)} of items. Prefer fresh foods and home cooking.`,
    sugary: (n) =>
      `Soft drinks and sweetened drinks showed up ${times(n)}. Swap them for water, sparkling water with lemon or unsweetened fresh juice.`,
    sweets: (n, of) => `Sweets and treats showed up on ${n} of ${of} days.`,
    processed_meat: (n) =>
      `Burgers and processed meats showed up ${times(n)} — they tend to be high in sodium and preservatives.`,
    salty_snacks: (n) => `Packaged chips, salty crackers or instant noodles showed up ${times(n)}.`,
    fast_food: (n) => `Snacks, savory pastries and fast food showed up ${times(n)}.`,
    alcohol: (n) => `Alcoholic drinks showed up ${times(n)}.`,
    no_breakfast: (n) => `No breakfast logged on ${days(n)}.`,
    skipped_meals: (n) =>
      `Lunch or dinner wasn't logged on ${days(n)}. If you skipped meals, try to keep regular mealtimes.`,
    beans_low: (n, of) =>
      `Few legumes (${days(n)} out of ${of}). Beans, lentils and chickpeas are an affordable source of fiber, iron and protein.`,
    variety_low: (n) =>
      `Low variety: ${n} different good-quality foods. Eating a wider range helps you get more nutrients.`,
    incomplete: (n, of) =>
      `You logged ${days(n)} out of ${of}. Complete logs make the report more accurate.`,
    unclassified: (n) =>
      n === 1
        ? "1 item wasn't recognized and was left out of the score. You can classify it by editing the meal."
        : `${n} items weren't recognized and were left out of the score. You can classify them by editing the meal.`,
  },

  tips: [
    'Make fresh or minimally processed foods — fruits, vegetables, grains, beans, eggs — the basis of your diet.',
    'Use oils, fats, salt and sugar in small amounts when seasoning and cooking.',
    'Limit processed foods such as canned goods, cheeses and packaged breads.',
    'Avoid ultra-processed foods such as soft drinks, filled cookies, packaged chips and instant noodles.',
    'Eat regularly and mindfully, in a calm setting and, whenever possible, with company.',
    'Shop at markets and stores with a good variety of fresh food.',
    'Cooking is a great habit: try a new recipe this week.',
    'Plan your meals for the week — it makes last-minute snacks easier to avoid.',
    'When eating out, choose places that serve freshly made food.',
    'Be wary of food advertising: it sells products, not health.',
    'Beans, lentils and chickpeas are affordable and nutritious: they have fiber, iron and protein.',
    'Try to include a piece of fruit at breakfast and another one in the afternoon.',
    'Drink water throughout the day — keeping a bottle nearby helps you remember.',
    'Swap soda for sparkling water with lemon or an unsweetened fresh juice.',
    'Filling half your plate with vegetables is an easy way to reach 5 servings a day.',
    'Prefer whole fruit to juice: it has more fiber and keeps you full longer.',
    'Nuts, fruit and plain yogurt are great snacks instead of cookies.',
    'Eat the rainbow: each vegetable color brings different nutrients.',
  ],

  nav: {
    label: 'Main navigation',
    home: 'Home',
    history: 'History',
    add: 'Log a meal',
    reports: 'Reports',
    profile: 'Profile',
  },

  update: {
    available: 'A new version of EatMate is available.',
    update: 'Update',
    later: 'Later',
  },

  locked: {
    title: 'Diet thermometer',
    text: (n) =>
      `Log what you eat for ${n} days to see the quality of your diet, graded from A to E, and get your first report.`,
    progress: (n, total) => `${n} of ${total} days logged`,
    count: (n, total) => `${n} of ${total} days`,
    missing: (n) => (n === 1 ? '1 day to go' : `${n} days to go`),
    registered: 'logged',
    example: 'See an example report',
  },

  onboarding: {
    title: 'Welcome to EatMate',
    subtitle: 'Your simple food diary — no calorie counting.',
    features: [
      {
        title: 'Log what you ate',
        text: 'Your way, right away or later: "coffee with milk and two slices of toast".',
      },
      {
        title: 'Diet thermometer',
        text: 'After 7 days, see the quality of your diet as a grade from A to E.',
      },
      {
        title: 'Reports to share',
        text: 'Show them to your dietitian or paste them into an AI to get suggestions.',
      },
    ],
    nameLabel: 'What should we call you?',
    namePlaceholder: 'Your name',
    start: 'Get started',
    restore: 'Already use EatMate? Restore a backup',
    restored: (meals) => `Backup restored: ${meals} meals.`,
    askName: 'Now just tell us what to call you.',
    privacy: 'Your data stays on this device only.',
  },

  dashboard: {
    hello: (name) => `Hi, ${name}!`,
    ctaTitle: 'Log a meal',
    ctaSubtitle: 'What did you eat just now or earlier?',
    thermoTitle: 'Your diet quality',
    seeReport: 'See full report',
    noScore: "There aren't enough recognized foods in the last 7 days to calculate a grade yet.",
    today: 'Today',
    seeDay: 'See day',
    add: 'Add',
    registered: 'Logged',
    streak: 'day streak',
    registeredDays: 'days logged',
    meals7: 'meals in 7 days',
    tip: 'Tip of the day',
    backupTitle: 'Time for a backup',
    backupNever:
      "You haven't made a backup yet. Save a copy of your entries to Google Drive, iCloud or wherever you like.",
    backupSince: (n: number) =>
      `Your last backup was ${n === 1 ? 'yesterday' : `${n} days ago`}. Save a copy of your new entries to Google Drive, iCloud or wherever you like.`,
    backupSave: 'Back up now',
    backupLater: 'Not now',
    backupSettings: 'You can change or turn off this reminder in **Profile**.',
  },

  foodInput: {
    label: 'What did you eat?',
    placeholder: 'E.g. "chicken, rice and salad"',
    add: 'Add',
    suggestions: 'Food suggestions',
    nothingFound:
      'I couldn\'t find any food in that text. Try something like "chicken, rice and salad".',
  },

  mealForm: {
    newTitle: 'Log a meal',
    editTitle: 'Edit meal',
    notFound: 'Meal not found',
    notFoundText: 'It may have been deleted.',
    when: 'When?',
    date: 'Date',
    time: 'Time (optional)',
    future: "You can't log meals in the future.",
    which: 'Which meal?',
    alreadyBefore: (meal) => `You've already logged ${meal.toLowerCase()} on this day.`,
    editExisting: 'Edit the existing entry',
    alreadyAfter: 'or save this one as a separate entry.',
    what: 'What did you eat?',
    hint: 'Type one food at a time or a whole sentence — EatMate splits it into items.',
    items: 'Meal items',
    notRecognized: 'Not recognized · classify',
    quantityPlaceholder: '+ amount (e.g. 2 slices)',
    quantityOf: (name) => `Amount of ${name}`,
    removeItem: (name) => `Remove ${name}`,
    empty: 'No foods added yet.',
    quality: 'Average quality of this meal',
    frequent: 'You often eat:',
    notes: 'Notes (optional)',
    notesPlaceholder: 'E.g. ate out, was very hungry…',
    saveChanges: 'Save changes',
    save: 'Save meal',
    changesSaved: 'Changes saved!',
    saved: (meal) => `${meal} logged!`,
    saveError: "Couldn't save. Please try again.",
    deleteError: "Couldn't delete the meal. Please try again.",
    deleteTitle: 'Delete this meal?',
    deleteMessage: (meal, date) => `${meal} on ${date}. This can't be undone.`,
    deleted: 'Meal deleted.',
    deleteLabel: 'Delete meal',
  },

  history: {
    title: 'History',
    count: (n) => plural(n, '1 day logged', `${n} days logged`),
    emptyTitle: 'Nothing logged yet',
    emptyText: 'The days you log meals on will show up here.',
    register: 'Log a meal',
    search: 'Search food',
    searchPlaceholder: 'Search food (e.g. pizza)',
    noMatch: (query) => `No days with “${query}”.`,
  },

  day: {
    title: 'Day',
    invalid: 'Invalid date',
    deleteMealTitle: (meal) => `Delete ${meal.toLowerCase()}?`,
    irreversible: "This can't be undone.",
    deleteDayTitle: 'Delete everything logged on this day?',
    deleteDayMessage: (meals, date) =>
      `${plural(meals, '1 meal', `${meals} meals`)} on ${date} will be deleted.`,
    deleteDayConfirm: 'Delete day',
    dayDeleted: 'Day deleted.',
    empty: 'Nothing logged on this day',
    registerHere: 'Log a meal on this day',
    summary: 'Day summary',
    grade: (label) => `Day grade: ${label}`,
    noGrade: 'No grade',
    items: (n) => plural(n, '1 item', `${n} items`),
    fruitsAndVegetables: (n) => `${n} ${n === 1 ? 'serving' : 'servings'} of fruits and vegetables`,
    ultraProcessed: (n) => `${n} ultra-processed`,
    unclassified: (n) => `${n} not classified`,
    edit: (meal) => `Edit ${meal}`,
    delete: (meal) => `Delete ${meal}`,
    missingLabel: 'Main meals not logged',
    missing: (meal) => `${meal} not logged`,
    addHere: 'Add a meal on this day',
    deleteAll: 'Delete everything logged on this day',
  },

  report: {
    footnote:
      'The A to E grades and the degree of processing are automatic estimates, inspired by the Nutri-Score and the Dietary Guidelines for the Brazilian Population. This report does not replace advice from a dietitian.',
    generatedAt: (date) => `Generated on ${date}`,
    noScore: "There aren't enough recognized foods in this period to calculate a grade.",
    kpis: {
      days: 'days logged',
      meals: 'meals',
      fruitsAndVegetables: 'servings of fruits and vegetables per day',
      ultraProcessed: 'ultra-processed',
    },
    highlights: 'Highlights',
    positives: 'What went well',
    attention: 'What to watch',
    breakdown: 'How the grade was calculated',
    breakdownText: 'Five criteria, each from 0 to 100, with different weights.',
    markers: 'Food intake markers',
    markersText: (n) =>
      `On how many of the ${n} logged days each group appeared (inspired by SISVAN, from the Brazilian Ministry of Health).`,
    markersGood: 'Ideally every day',
    markersAvoid: 'Ideally avoid',
    status: { good: 'Great', warn: 'Could improve', bad: 'Watch out' },
    distributions: 'Quality and processing',
    gradesTitle: 'Food grades (A to E)',
    gradesLabel: (list) => `Grade distribution: ${list}`,
    processingTitle: 'Degree of processing',
    processingLabel: (list) => `Degree of processing: ${list}`,
    groups: 'Food groups',
    group: 'Group',
    times: 'Times',
    daysColumn: 'Days',
    meals: 'Meals',
    mealsText: (n) => `On how many of the ${n} logged days each meal appears.`,
    mealDays: (meal, n) => `${meal}: ${days(n)}`,
    of: 'of',
    topFoods: 'Most frequent foods',
    dayByDay: 'Day by day',
    diary: 'Full food diary',
    diaryText: 'Everything logged in this period, to show your dietitian.',
    notes: 'Notes:',
    noRecord: 'Nothing logged.',
  },

  reportActions: {
    title: 'Use this report',
    text: 'Paste it into an AI (ChatGPT, Gemini, Claude…) for improvement ideas, or save it as a PDF to take to your dietitian.',
    copyForAI: 'Copy to use with an AI',
    print: 'PDF / Print',
    share: 'Share',
    copyText: 'Copy text',
    download: 'Download file',
    copiedForAI: 'Copied! Now just paste it into your favorite AI.',
    copied: 'Report copied.',
    copyFailed: "Couldn't copy.",
    shareFailed: "Sharing isn't available on this device.",
    fileName: 'eatmate report',
  },

  currentReport: {
    header: 'Report',
    title: 'Last 7 days',
    live: 'Live',
    notice:
      'This report updates by itself as you log meals. At the end of each week, a copy is saved in your report history.',
    exportTitle: 'Food report',
    savedInHistory: 'Saved in history',
    updateInHistory: 'Update in history',
    saveInHistory: 'Save in history',
    updated: 'Report updated in history.',
    saved: 'Report saved in history.',
  },

  exampleReport: {
    header: 'Example report',
    title: 'Example',
    badge: 'Sample data',
    notice:
      'This is an example with a made-up week. Your real report shows up after 7 days of logging.',
    register: 'Log a meal',
  },

  reports: {
    title: 'Reports',
    subtitle: 'Your weekly report history',
    week: (n) => `Week ${n}`,
    custom: 'Custom report',
    current: 'Current report',
    currentText: 'Last 7 days, updated in real time',
    info: 'Each time a week ends, a report is saved here automatically. If you fix an entry later, just generate the report again.',
    list: 'Saved reports',
    generatedAt: (date) => `Generated on ${date}`,
    stale: 'Out of date',
    regenerate: 'Generate again',
    regenerateNow: 'Generate again with current data',
    regenerated: (title) => `${title} generated again with current data.`,
    regeneratedOne: 'Report generated again with current data.',
    delete: 'Delete',
    deleteLabel: 'Delete report',
    deleteTitle: (title) => `Delete “${title}”?`,
    deleteWeekly:
      'Your logged meals stay saved. You can generate this report again whenever you like.',
    deleteCustom: 'Your logged meals stay saved.',
    deleted: 'Report deleted.',
    deleteError: "Couldn't delete the report. Please try again.",
    emptyTitle: 'No saved reports yet',
    emptyUnlocked:
      'Your first weekly report shows up here when the week ends. You can also save the current report.',
    emptyLocked: 'Your reports show up here after 7 days of logging.',
    other: 'Generate a report for another period',
    lastDay: 'Last day of the period',
    covers: (period) => `The report will cover the 7 days of ${period}.`,
    pickDate: 'Choose a date.',
    generate: 'Generate report',
    generated: 'Report generated.',
    notFound: 'Report not found',
    notFoundText: 'It may have been deleted.',
    staleNotice: 'You changed entries in this period after this report was generated.',
  },

  profile: {
    title: 'Profile',
    name: 'Your name',
    saveName: 'Save name',
    nameSaved: 'Name updated.',
    language: 'Language',
    languageHint:
      'Changes the app and report texts, and the food names EatMate recognizes when you type what you ate.',
    appearance: 'Appearance',
    themes: { system: 'Automatic', light: 'Light', dark: 'Dark' },
    install: 'Install the app',
    installed: "You're already using the installed EatMate. 🎉",
    installText:
      'Install EatMate to open it straight from your home screen, like an app, even offline.',
    installButton: 'Install EatMate',
    installIOS: 'On iPhone, open it in Safari, tap **Share** and then **Add to Home Screen**.',
    installOther: 'In your browser menu, look for **Install app** or **Add to Home screen**.',
    data: 'Your data',
    dataSummary: (meals, n, reports) =>
      `${meals} meals over ${days(n)} · ${reports} reports. Everything is saved on this device only — make a backup now and then so you don't lose anything if you switch phones.`,
    lastBackup: 'Last backup:',
    never: 'never',
    export: 'Export backup',
    import: 'Import backup',
    exported: 'Backup saved to your files.',
    saveCloud: 'Save to Drive or iCloud',
    saveCloudHint:
      'In the menu that opens, choose **Drive** (Android) or **Save to Files**, then Google Drive or iCloud Drive (iPhone). To restore, tap **Import backup** and pick the file.',
    shared: 'Backup saved.',
    reminder: 'Backup reminder',
    reminderOptions: { off: 'Off', daily: 'Every day', weekly: 'Every week' },
    reminderHint:
      "The reminder shows up on the home screen when you have new entries that aren't in a backup yet.",
    importTitle: 'Import backup?',
    importMessage: (meals, reports) =>
      `The file has ${meals} meals and ${reports} reports. They'll be merged with your current data — nothing will be deleted.`,
    importConfirm: 'Import',
    imported: (meals) => `Backup imported: ${meals} meals.`,
    customFoods: 'My foods',
    customFoodsText: 'Foods you classified. Tap the pencil to change the category.',
    changeCategory: (name) => `Change category of ${name}`,
    removeFood: (name) => `Remove ${name}`,
    removeFoodTitle: (name) => `Remove “${name}”?`,
    removeFoodMessage: 'Entries with this food stay saved, but become unclassified.',
    foodRemoved: 'Food removed.',
    reclassified: 'Category updated.',
    method: {
      title: 'How is the grade calculated?',
      intro:
        'Each food has a grade from **A** (best) to **E**, inspired by the European Nutri-Score, and a degree of processing based on the **Dietary Guidelines for the Brazilian Population** (unprocessed, culinary ingredients, processed and ultra-processed).',
      criteria: 'The weekly score goes from 0 to 100 and combines five criteria:',
      items: {
        qualidade: 'Nutritional quality of the foods',
        processamento: 'Degree of processing',
        frutas_verduras: 'Fruits and vegetables (goal: 5 servings a day)',
        variedade: 'Food variety',
        regularidade: 'Regular breakfast, lunch and dinner',
      },
      letters: (thresholds, min) =>
        `Then the points become a letter: ${thresholds}, and E below ${min}.`,
      threshold: (grade, min) => `${grade} from ${min}`,
      disclaimer:
        "The grades are estimates to help you notice patterns — they don't replace advice from a dietitian.",
    },
    danger: 'Delete data',
    dangerText: 'Removes all meals, reports and settings from this device.',
    eraseAll: 'Delete all data',
    eraseTitle: 'Delete all data?',
    eraseMessage:
      'All meals, reports and settings on this device will be deleted. If you want to keep a copy, export a backup first.',
    eraseConfirm: 'Delete everything',
    version: (version) => `EatMate ${version} · your data stays with you.`,
  },

  backup: {
    invalidJson: "This file isn't a valid EatMate backup (invalid JSON).",
    notEatmate: "This file doesn't look like an EatMate backup.",
    tooLarge: 'This file is too large to be an EatMate backup.',
    readError: "Couldn't read the file.",
    importError: "Couldn't import the file.",
  },

  notFound: {
    title: 'Page not found',
    text: "This address doesn't exist in EatMate.",
    home: 'Back to home',
    errorTitle: 'Something went wrong',
    errorText: 'Your data is still saved on this device. Try reloading the app.',
    reload: 'Reload the app',
  },

  export: {
    title: 'Food report',
    name: 'Name',
    period: 'Period',
    periodValue: (start, end, registered, total) =>
      `${start} to ${end} (${registered} of ${total} days logged)`,
    meals: 'Meals logged',
    items: 'Items',
    overall: 'Overall grade',
    noData: 'not enough data',
    previous: (period) => `Previous period (${period})`,
    howCalculated: 'How the grade was calculated',
    weight: (percent) => `weight ${percent}%`,
    positives: 'What went well',
    attention: 'What to watch',
    markers: 'Food intake markers',
    markersIntro: (n) => `Days with intake, out of ${days(n)} logged:`,
    idealDaily: 'ideally every day',
    idealAvoid: 'ideally avoid',
    grades: 'Food quality (A to E scale)',
    nova: 'Degree of processing (NOVA classification)',
    groups: 'Food groups',
    groupLine: (group, count, n) => `${group}: ${count}x over ${n}`,
    fruitsAndVegetables: (perDay) =>
      `Fruits and vegetables: an average of ${perDay} servings per day.`,
    mealsTitle: 'Meals logged',
    mealLine: (meal, n, total) => `${meal}: ${n} of ${total}`,
    topFoods: 'Most frequent foods',
    diary: 'Food diary',
    dayGrade: (grade) => `day grade: ${grade}`,
    noRecord: '(nothing logged)',
    note: 'Note',
    footer: (date) =>
      `Generated by EatMate${date ? ` on ${date}` : ''}. The grades (A to E) and the degree of processing are automatic estimates, inspired by the Nutri-Score and the Dietary Guidelines for the Brazilian Population. This report does not replace advice from a dietitian.`,
    aiIntro: (name, period) =>
      `Hi! ${name ? `I'm ${name} and I logged` : 'I logged'} my meals in the EatMate app. Below is my report for ${period}.`,
    aiAsk: [
      'Based on it, please:',
      '1. Assess the strengths and weaknesses of my diet;',
      '2. Suggest practical, realistic improvements that respect my food culture;',
      '3. Propose simple swaps for the items graded D or E;',
      '4. Put together a sample menu for one day, with breakfast, lunch, a snack and dinner.',
    ],
    aiNote:
      'Note: the A–E grades and the degree of processing were estimated automatically by the app.',
  },
};
