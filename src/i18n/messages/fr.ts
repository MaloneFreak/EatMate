import type { Grade, ScoreFacts } from '../../domain/types';
import type { Format } from '../format';
import type { Messages } from './pt';

/*
 * Textos do app em francês (mesma estrutura de `pt.ts`).
 *
 * Tipografia francesa: espaço inseparável (`\u00a0`) antes de ? ! : ; e dentro de « ».
 * Plural: em francês, 0 e 1 ficam no singular ("0 jour", "1 jour", "2 jours").
 */

const plural = (n: number, one: string, many: string) => (Math.abs(n) < 2 ? one : many);
const dayCount = (n: number) => plural(n, `${n} jour`, `${n} jours`);
const recordedDays = (n: number) => plural(n, `${n} jour enregistré`, `${n} jours enregistrés`);
const times = (n: number) => `${n} fois`;
const reportCount = (n: number) => plural(n, `${n} rapport`, `${n} rapports`);
const portionWord = (n: number) => plural(n, 'portion', 'portions');
/** "1,5 portion", "2 portions" (o plural segue o número já arredondado como é exibido). */
const portions = (n: number, f: Format) =>
  `${f.decimal(n)} ${portionWord(Math.round(n * 10) / 10)}`;
const goodFoods = (n: number) =>
  `${n} ${plural(n, 'aliment différent', 'aliments différents')} de bonne qualité`;

export const fr: Messages = {
  common: {
    back: 'Retour',
    close: 'Fermer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    delete: 'Supprimer',
    remove: 'Retirer',
    today: 'Aujourd’hui',
    yesterday: 'Hier',
    loading: 'Chargement',
    backupFile: 'Fichier de sauvegarde',
    days: dayCount,
    meals: (n: number) => `${n} repas`,
    daysOf: (n: number, total: number) => `${dayCount(n)} sur ${total}`,
  },

  grades: {
    labels: {
      A: 'Excellente',
      B: 'Bonne',
      C: 'Moyenne',
      D: 'À améliorer',
      E: 'À surveiller',
    },
    messages: {
      A: 'Votre alimentation est excellente\u00a0! Continuez comme ça.',
      B: 'Vous êtes sur la bonne voie — quelques petits ajustements peuvent vous mener au A.',
      C: 'Il y a de bonnes habitudes, mais aussi de la marge pour progresser.',
      D: 'Votre alimentation a besoin de quelques ajustements. Consultez les conseils du rapport.',
      E: 'Et si vous commenciez par de petits changements au quotidien\u00a0? Le rapport vous montre par où commencer.',
    },
    badge: (grade: Grade, label: string) => `Note ${grade} — ${label}`,
    unclassified: 'Non classé',
    scale: (grade: Grade, label: string) =>
      `Note ${grade} sur une échelle de A à E\u00a0: ${label}`,
    thermometer: (score: number, grade: Grade) =>
      `Thermomètre\u00a0: ${score} ${plural(score, 'point', 'points')} sur 100, note ${grade}`,
  },

  mealTypes: {
    cafe_manha: 'Petit-déjeuner',
    lanche_manha: 'Collation du matin',
    almoco: 'Déjeuner',
    cafe_tarde: 'Goûter',
    jantar: 'Dîner',
    ceia: 'Collation du soir',
  },

  groups: {
    frutas: 'Fruits',
    verduras_legumes: 'Légumes',
    leguminosas: 'Légumineuses',
    cereais: 'Céréales, pains, racines et tubercules',
    carnes_ovos: 'Viandes, poissons et œufs',
    leite_derivados: 'Lait et produits laitiers',
    oleaginosas: 'Fruits à coque et graines',
    bebidas: 'Eau, café et thé',
    bebidas_adocadas: 'Jus et boissons sucrées',
    doces: 'Sucreries et friandises',
    lanches: 'Sandwichs, snacks salés et fast-food',
    pratos: 'Plats et préparations',
    gorduras_molhos: 'Huiles, matières grasses et sauces',
    alcool: 'Boissons alcoolisées',
  },

  nova: {
    1: 'Bruts ou peu transformés',
    2: 'Ingrédients culinaires (huiles, sucre, beurre)',
    3: 'Transformés',
    4: 'Ultra-transformés',
  },

  classify: {
    title: (name: string) => `Qu’est-ce que «\u00a0${name}\u00a0»\u00a0?`,
    description:
      'Choisissez la catégorie qui correspond le mieux. EatMate s’en souviendra la prochaine fois.',
    done: (name: string, category: string) =>
      `«\u00a0${name}\u00a0» classé dans la catégorie «\u00a0${category}\u00a0».`,
    options: {
      fruta: { label: 'Fruit', examples: 'banane, pomme, orange' },
      verdura: { label: 'Légume ou salade', examples: 'laitue, carotte, courgette' },
      leguminosa: { label: 'Légumineuse', examples: 'haricots rouges, lentilles, pois chiches' },
      cereal: { label: 'Riz, pâtes, racine ou tubercule', examples: 'riz, pâtes, pomme de terre' },
      pao: { label: 'Pain, biscotte ou biscuit salé', examples: 'baguette, pain de mie, biscotte' },
      carne: {
        label: 'Viande, poulet, poisson ou œuf',
        examples: 'steak, poulet, saumon, œuf',
      },
      embutido: { label: 'Charcuterie', examples: 'jambon, saucisse, saucisson' },
      laticinio: { label: 'Lait, yaourt ou fromage', examples: 'lait, yaourt, fromage' },
      oleaginosa: {
        label: 'Fruit à coque ou graine',
        examples: 'noix, cacahuètes, graines de chia',
      },
      bebida: { label: 'Eau, café ou thé sans sucre', examples: 'eau, café, thé' },
      adocada: { label: 'Jus ou boisson sucrée', examples: 'soda, jus en brique' },
      doce: { label: 'Sucrerie ou dessert', examples: 'gâteau, chocolat, flan' },
      lanche: {
        label: 'Sandwich, snack salé ou fast-food',
        examples: 'croque-monsieur, hamburger, pizza',
      },
      prato_caseiro: {
        label: 'Plat fait maison',
        examples: 'cuisiné à la maison avec des produits frais',
      },
      prato_pronto: {
        label: 'Plat préparé ou surgelé',
        examples: 'lasagnes surgelées, soupe en sachet',
      },
      gordura: {
        label: 'Sauce, huile ou matière grasse',
        examples: 'mayonnaise, beurre, huile d’olive',
      },
      alcool: { label: 'Boisson alcoolisée', examples: 'bière, vin, cocktail' },
    },
  },

  score: {
    components: {
      qualidade: 'Qualité nutritionnelle',
      processamento: 'Degré de transformation',
      frutas_verduras: 'Fruits et légumes',
      variedade: 'Variété',
      regularidade: 'Régularité des repas',
    },
    details: {
      qualidade: (s: ScoreFacts) => `Moyenne des notes des aliments\u00a0: ${s.averageGrade}`,
      processamento: (s: ScoreFacts, f: Format) =>
        `${f.percent(s.inNaturaShare)} bruts ou peu transformés · ${f.percent(s.ultraShare)} ultra-transformés`,
      frutas_verduras: (s: ScoreFacts, f: Format) =>
        `${portions(s.fvPerDay, f)} par jour (objectif\u00a0: ${s.fvTarget})`,
      variedade: (s: ScoreFacts) =>
        `${s.distinctGood} ${plural(s.distinctGood, 'aliment différent noté', 'aliments différents notés')} A, B ou C (objectif\u00a0: ${s.varietyTarget})`,
      regularidade: (s: ScoreFacts, f: Format) =>
        `${f.percent(s.mainMealsShare)} des repas principaux enregistrés (petit-déjeuner, déjeuner et dîner)`,
    },
    weight: (percent: number) => `poids ${percent}\u00a0%`,
    delta: (delta: number) =>
      delta === 0
        ? 'Stable par rapport aux 7 jours précédents'
        : `${delta > 0 ? '+' : '−'}${Math.abs(delta)} ${plural(delta, 'point', 'points')} par rapport aux 7 jours précédents`,
  },

  markers: {
    feijao: 'Légumineuses (haricots, lentilles…)',
    frutas: 'Fruits',
    verduras: 'Légumes',
    embutidos: 'Hamburgers et charcuterie',
    adocadas: 'Sodas et boissons sucrées',
    salgadinhos: 'Nouilles instantanées, chips et biscuits apéritifs',
    doces: 'Biscuits fourrés, sucreries et friandises',
  },

  insights: {
    fv_great: (n: number, _of: number, f: Format) =>
      `Excellente consommation de fruits et légumes\u00a0: ${portions(n, f)} par jour en moyenne.`,
    fv_good: (n: number, of: number, f: Format) =>
      `Bonne consommation de fruits et légumes (${portions(n, f)} par jour). L’objectif de ${of} est tout proche.`,
    beans_most: (n: number, of: number) =>
      `Des légumineuses ${dayCount(n)} sur ${of} — une excellente source de fibres, de fer et de protéines.`,
    few_ultra: (n: number, _of: number, f: Format) =>
      `Peu d’ultra-transformés\u00a0: seulement ${f.percent(n)} des aliments.`,
    no_sugary: () => 'Aucun soda ni boisson sucrée sur la période.',
    regular_meals: () =>
      'Repas principaux (petit-déjeuner, déjeuner et dîner) enregistrés régulièrement.',
    breakfast_daily: () => 'Petit-déjeuner enregistré tous les jours.',
    variety_good: (n: number) => `Bonne variété\u00a0: ${goodFoods(n)}.`,
    water: (n: number, of: number) =>
      `Eau enregistrée ${dayCount(n)} sur ${of}. Continuez à bien vous hydrater\u00a0!`,
    whole_grains: (n: number) => `Les céréales complètes sont apparues ${times(n)}.`,
    in_natura: (n: number, _of: number, f: Format) =>
      `${f.percent(n)} des aliments étaient bruts ou peu transformés — la base d’une alimentation saine.`,
    fv_low: (n: number, of: number, f: Format) =>
      `Peu de fruits et légumes\u00a0: ${portions(n, f)} par jour en moyenne (il est recommandé d’en consommer au moins ${of}).`,
    fruits_few: (n: number, of: number) =>
      `Les fruits ne sont apparus que ${dayCount(n)} sur ${of}.`,
    vegetables_few: (n: number, of: number) =>
      `Les légumes ne sont apparus que ${dayCount(n)} sur ${of}.`,
    ultra_high: (n: number, _of: number, f: Format) =>
      `Les ultra-transformés ont représenté ${f.percent(n)} des aliments. Privilégiez les aliments bruts et les plats faits maison.`,
    sugary: (n: number) =>
      `Les sodas et boissons sucrées sont apparus ${times(n)}. Remplacez-les par de l’eau, de l’eau pétillante avec du citron ou un jus de fruits frais sans sucre ajouté.`,
    sweets: (n: number, of: number) =>
      `Les sucreries et friandises sont apparues ${dayCount(n)} sur ${of}.`,
    processed_meat: (n: number) =>
      `Les hamburgers et la charcuterie sont apparus ${times(n)} — ils contiennent souvent beaucoup de sel et de conservateurs.`,
    salty_snacks: (n: number) =>
      `Les chips, biscuits apéritifs ou nouilles instantanées sont apparus ${times(n)}.`,
    fast_food: (n: number) => `Les sandwichs, snacks salés et fast-food sont apparus ${times(n)}.`,
    alcohol: (n: number) => `Les boissons alcoolisées sont apparues ${times(n)}.`,
    no_breakfast: (n: number) => `${dayCount(n)} sans petit-déjeuner enregistré.`,
    skipped_meals: (n: number) =>
      `${dayCount(n)} sans déjeuner ou dîner enregistré. Si vous avez sauté des repas, essayez de garder des horaires réguliers.`,
    beans_low: (n: number, of: number) =>
      `Peu de légumineuses (${dayCount(n)} sur ${of}). Haricots, lentilles et pois chiches sont une source économique de fibres, de fer et de protéines.`,
    variety_low: (n: number) =>
      `Peu de variété\u00a0: ${goodFoods(n)}. Varier son alimentation permet d’obtenir plus de nutriments.`,
    incomplete: (n: number, of: number) =>
      `Vous avez enregistré ${dayCount(n)} sur ${of}. Des enregistrements complets rendent le rapport plus fidèle.`,
    unclassified: (n: number) =>
      plural(
        n,
        `${n} aliment n’a pas été reconnu et n’est pas pris en compte dans le calcul. Vous pouvez le classer en modifiant le repas.`,
        `${n} aliments n’ont pas été reconnus et ne sont pas pris en compte dans le calcul. Vous pouvez les classer en modifiant le repas.`,
      ),
  },

  /** Conseils inspirés du Guide alimentaire pour la population brésilienne (ministère de la Santé). */
  tips: [
    'Faites des aliments bruts ou peu transformés — fruits, légumes, riz, légumineuses, œufs — la base de votre alimentation.',
    'Utilisez les huiles, matières grasses, le sel et le sucre en petites quantités pour assaisonner et cuisiner.',
    'Limitez les aliments transformés, comme les conserves, les fromages et le pain industriel.',
    'Évitez les ultra-transformés, comme les sodas, les biscuits fourrés, les chips et les nouilles instantanées.',
    'Mangez régulièrement et avec attention, dans un endroit calme et, si possible, en compagnie.',
    'Faites vos courses de préférence sur les marchés, chez les primeurs et dans les magasins qui proposent une grande variété de produits frais.',
    'Cuisiner est une excellente habitude\u00a0: essayez une nouvelle recette cette semaine.',
    'Planifiez les repas de la semaine — il devient plus facile d’éviter les en-cas de dernière minute.',
    'Quand vous mangez à l’extérieur, choisissez des endroits qui servent des plats cuisinés sur place.',
    'Méfiez-vous des publicités alimentaires\u00a0: elles vendent des produits, pas la santé.',
    'Les légumineuses (haricots, lentilles, pois chiches) sont une source économique de fibres, de fer et de protéines.',
    'Essayez d’ajouter un fruit au petit-déjeuner et un autre au goûter.',
    'Buvez de l’eau tout au long de la journée — garder une gourde à portée de main aide à y penser.',
    'Remplacez le soda par de l’eau pétillante avec du citron ou par un jus de fruits frais sans sucre ajouté.',
    'Remplir la moitié de l’assiette de légumes est un moyen simple d’atteindre les 5 portions par jour.',
    'Préférez le fruit entier au jus\u00a0: il contient plus de fibres et rassasie davantage.',
    'Fruits à coque, fruits frais et yaourt nature sont d’excellents en-cas pour remplacer les biscuits.',
    'Variez les couleurs dans l’assiette\u00a0: chaque couleur de légume apporte des nutriments différents.',
  ],

  nav: {
    label: 'Navigation principale',
    home: 'Accueil',
    history: 'Historique',
    add: 'Ajouter un repas',
    reports: 'Rapports',
    profile: 'Profil',
  },

  update: {
    available: 'Nouvelle version d’EatMate disponible.',
    update: 'Mettre à jour',
    later: 'Plus tard',
  },

  locked: {
    title: 'Thermomètre alimentaire',
    text: (days: number) =>
      `Enregistrez ce que vous mangez pendant ${dayCount(days)} pour découvrir la qualité de votre alimentation, avec une note de A à E, et recevoir votre premier rapport.`,
    progress: (n: number, total: number) => `${recordedDays(n)} sur ${total}`,
    count: (n: number, total: number) => `${dayCount(n)} sur ${total}`,
    missing: (n: number) => `encore ${dayCount(n)}`,
    registered: 'à votre actif',
    example: 'Voir un exemple de rapport',
  },

  onboarding: {
    title: 'Bienvenue sur EatMate',
    subtitle: 'Votre journal alimentaire simple, sans compter les calories.',
    features: [
      {
        title: 'Notez ce que vous avez mangé',
        text: 'À votre façon, sur le moment ou plus tard\u00a0: «\u00a0café au lait et tartines\u00a0».',
      },
      {
        title: 'Thermomètre alimentaire',
        text: 'Après 7 jours, découvrez la qualité de votre alimentation avec une note de A à E.',
      },
      {
        title: 'Des rapports à partager',
        text: 'Montrez-les à votre nutritionniste ou collez-les dans une IA pour recevoir des suggestions.',
      },
    ],
    nameLabel: 'Comment pouvons-nous vous appeler\u00a0?',
    namePlaceholder: 'Votre prénom',
    start: 'Commencer',
    restore: 'Vous utilisez déjà EatMate\u00a0? Restaurer une sauvegarde',
    restored: (meals: number) => `Sauvegarde restaurée\u00a0: ${meals} repas.`,
    askName: 'Il ne reste plus qu’à nous dire comment vous appeler.',
    privacy: 'Vos données restent uniquement sur cet appareil.',
  },

  dashboard: {
    hello: (name: string) => `Bonjour ${name}\u00a0!`,
    ctaTitle: 'Ajouter un repas',
    ctaSubtitle: 'Qu’avez-vous mangé, à l’instant ou plus tôt\u00a0?',
    thermoTitle: 'Qualité de votre alimentation',
    seeReport: 'Voir le rapport complet',
    noScore: 'Pas encore assez d’aliments reconnus sur les 7 derniers jours pour calculer la note.',
    today: 'Aujourd’hui',
    seeDay: 'Voir la journée',
    add: 'Ajouter',
    registered: 'Repas enregistré',
    streak: 'jours d’affilée',
    registeredDays: 'jours enregistrés',
    meals7: 'repas en 7 jours',
    tip: 'Conseil du jour',
    backupTitle: 'C’est l’heure de la sauvegarde',
    backupNever:
      'Vous n’avez encore fait aucune sauvegarde. Enregistrez une copie de vos entrées dans Google Drive, iCloud ou ailleurs.',
    backupSince: (n: number) =>
      `Votre dernière sauvegarde date ${n === 1 ? 'd’hier' : `d’il y a ${n} jours`}. Enregistrez une copie de vos nouvelles entrées dans Google Drive, iCloud ou ailleurs.`,
    backupSave: 'Sauvegarder',
    backupLater: 'Plus tard',
    backupSettings: 'Vous pouvez modifier ou désactiver ce rappel dans **Profil**.',
  },

  foodInput: {
    label: 'Qu’avez-vous mangé\u00a0?',
    placeholder: 'Ex.\u00a0: «\u00a0poulet, riz et salade\u00a0»',
    add: 'Ajouter',
    suggestions: 'Suggestions d’aliments',
    nothingFound:
      'Je n’ai trouvé aucun aliment dans ce texte. Essayez par exemple «\u00a0poulet, riz et salade\u00a0».',
  },

  mealForm: {
    newTitle: 'Ajouter un repas',
    editTitle: 'Modifier le repas',
    notFound: 'Repas introuvable',
    notFoundText: 'Il a peut-être été supprimé.',
    when: 'Quand\u00a0?',
    date: 'Date',
    time: 'Heure (facultatif)',
    future: 'Impossible d’enregistrer un repas dans le futur.',
    which: 'Quel repas\u00a0?',
    alreadyBefore: (meal: string) =>
      `Vous avez déjà enregistré votre ${meal.toLowerCase()} ce jour-là.`,
    editExisting: 'Modifier l’enregistrement existant',
    alreadyAfter: 'ou enregistrez celui-ci comme un repas distinct.',
    what: 'Qu’avez-vous mangé\u00a0?',
    hint: 'Écrivez un aliment à la fois ou toute une phrase — EatMate sépare les aliments.',
    items: 'Aliments du repas',
    notRecognized: 'Non reconnu · classer',
    quantityPlaceholder: '+ quantité (ex.\u00a0: 2 tranches)',
    quantityOf: (name: string) => `Quantité de «\u00a0${name}\u00a0»`,
    removeItem: (name: string) => `Retirer ${name}`,
    empty: 'Aucun aliment ajouté pour l’instant.',
    quality: 'Qualité moyenne de ce repas',
    frequent: 'Vous mangez souvent\u00a0:',
    notes: 'Remarques (facultatif)',
    notesPlaceholder: 'Ex.\u00a0: mangé à l’extérieur, j’avais très faim…',
    saveChanges: 'Enregistrer les modifications',
    save: 'Enregistrer le repas',
    changesSaved: 'Modifications enregistrées\u00a0!',
    saved: (meal: string) => `${meal}\u00a0: c’est noté\u00a0!`,
    saveError: 'Impossible d’enregistrer. Réessayez.',
    deleteError: 'Impossible de supprimer le repas. Réessayez.',
    deleteTitle: 'Supprimer ce repas\u00a0?',
    deleteMessage: (meal: string, date: string) =>
      `${meal} du ${date}. Cette action est irréversible.`,
    deleted: 'Repas supprimé.',
    deleteLabel: 'Supprimer le repas',
  },

  history: {
    title: 'Historique',
    count: (n: number) => recordedDays(n),
    emptyTitle: 'Aucun enregistrement pour l’instant',
    emptyText: 'Les jours où vous enregistrez des repas apparaîtront ici.',
    register: 'Ajouter un repas',
    search: 'Rechercher un aliment',
    searchPlaceholder: 'Rechercher un aliment (ex.\u00a0: pizza)',
    noMatch: (query: string) => `Aucun jour avec «\u00a0${query}\u00a0».`,
  },

  day: {
    title: 'Jour',
    invalid: 'Date invalide',
    deleteMealTitle: (meal: string) => `Supprimer votre ${meal.toLowerCase()}\u00a0?`,
    irreversible: 'Cette action est irréversible.',
    deleteDayTitle: 'Supprimer tous les enregistrements de la journée\u00a0?',
    deleteDayMessage: (meals: number, date: string) =>
      `${meals} repas du ${date} ${plural(meals, 'sera supprimé', 'seront supprimés')}.`,
    deleteDayConfirm: 'Supprimer la journée',
    dayDeleted: 'Enregistrements de la journée supprimés.',
    empty: 'Aucun enregistrement ce jour-là',
    registerHere: 'Ajouter un repas ce jour-là',
    summary: 'Résumé de la journée',
    grade: (label: string) => `Note du jour\u00a0: ${label}`,
    noGrade: 'Sans note',
    items: (n: number) => plural(n, `${n} aliment`, `${n} aliments`),
    fruitsAndVegetables: (n: number) => `${n} ${portionWord(n)} de fruits et légumes`,
    ultraProcessed: (n: number) => `${n} ${plural(n, 'ultra-transformé', 'ultra-transformés')}`,
    unclassified: (n: number) => `${n} ${plural(n, 'non classé', 'non classés')}`,
    edit: (meal: string) => `Modifier votre ${meal.toLowerCase()}`,
    delete: (meal: string) => `Supprimer votre ${meal.toLowerCase()}`,
    missingLabel: 'Repas principaux non enregistrés',
    missing: (meal: string) => `${meal}\u00a0: aucun enregistrement`,
    addHere: 'Ajouter un repas ce jour-là',
    deleteAll: 'Supprimer tous les enregistrements de la journée',
  },

  report: {
    footnote:
      'Les notes de A à E et le degré de transformation sont des estimations automatiques, inspirées du Nutri-Score et du Guide alimentaire pour la population brésilienne. Ce rapport ne remplace pas l’avis d’un(e) nutritionniste.',
    generatedAt: (date: string) => `Généré le ${date}`,
    noScore: 'Pas assez d’aliments reconnus sur cette période pour calculer la note.',
    kpis: {
      days: 'jours enregistrés',
      meals: 'repas',
      fruitsAndVegetables: 'portions de fruits et légumes par jour',
      ultraProcessed: 'd’ultra-transformés',
    },
    highlights: 'Points clés',
    positives: 'Points positifs',
    attention: 'Points de vigilance',
    breakdown: 'Comment la note a été calculée',
    breakdownText: 'Cinq critères, chacun noté de 0 à 100, avec des poids différents.',
    markers: 'Marqueurs de consommation',
    markersText: (days: number) =>
      `Nombre de jours où chaque groupe est apparu, sur ${recordedDays(days)} (inspiré du SISVAN du ministère de la Santé brésilien).`,
    markersGood: 'L’idéal est d’en consommer tous les jours',
    markersAvoid: 'L’idéal est de les éviter',
    status: { good: 'Très bien', warn: 'À améliorer', bad: 'Attention' },
    distributions: 'Qualité et transformation',
    gradesTitle: 'Notes des aliments (A à E)',
    gradesLabel: (list: string) => `Répartition des notes\u00a0: ${list}`,
    processingTitle: 'Degré de transformation',
    processingLabel: (list: string) => `Degré de transformation\u00a0: ${list}`,
    groups: 'Groupes d’aliments',
    group: 'Groupe',
    times: 'Fois',
    daysColumn: 'Jours',
    meals: 'Repas',
    mealsText: (days: number) =>
      `Nombre de jours où chaque repas apparaît, sur ${recordedDays(days)}.`,
    mealDays: (meal: string, days: number) => `${meal}\u00a0: ${dayCount(days)}`,
    of: 'sur',
    topFoods: 'Aliments les plus fréquents',
    dayByDay: 'Jour par jour',
    diary: 'Journal alimentaire complet',
    diaryText: 'Tout ce qui a été enregistré sur la période, à montrer à votre nutritionniste.',
    notes: 'Remarque\u00a0:',
    noRecord: 'Aucun enregistrement.',
  },

  reportActions: {
    title: 'Utiliser ce rapport',
    text: 'Collez-le dans une IA (ChatGPT, Gemini, Claude…) pour recevoir des suggestions d’amélioration, ou enregistrez-le en PDF pour le montrer à votre nutritionniste.',
    copyForAI: 'Copier pour une IA',
    print: 'PDF / Imprimer',
    share: 'Partager',
    copyText: 'Copier le texte',
    download: 'Télécharger le fichier',
    copiedForAI: 'Copié\u00a0! Il ne reste plus qu’à le coller dans l’IA de votre choix.',
    copied: 'Rapport copié.',
    copyFailed: 'Impossible de copier.',
    shareFailed: 'Impossible de partager sur cet appareil.',
    fileName: 'eatmate rapport',
  },

  currentReport: {
    header: 'Rapport',
    title: '7 derniers jours',
    live: 'En direct',
    notice:
      'Ce rapport se met à jour automatiquement au fil de vos enregistrements. À la fin de chaque semaine, une copie est conservée dans votre historique de rapports.',
    exportTitle: 'Rapport alimentaire',
    savedInHistory: 'Enregistré dans l’historique',
    updateInHistory: 'Mettre à jour dans l’historique',
    saveInHistory: 'Enregistrer dans l’historique',
    updated: 'Rapport mis à jour dans l’historique.',
    saved: 'Rapport enregistré dans l’historique.',
  },

  exampleReport: {
    header: 'Exemple de rapport',
    title: 'Exemple',
    badge: 'Données fictives',
    notice:
      'Voici un exemple basé sur une semaine inventée. Votre vrai rapport apparaîtra après 7 jours d’enregistrement.',
    register: 'Ajouter un repas',
  },

  reports: {
    title: 'Rapports',
    subtitle: 'Votre historique de rapports hebdomadaires',
    week: (n: number) => `Semaine ${n}`,
    custom: 'Rapport personnalisé',
    current: 'Rapport actuel',
    currentText: '7 derniers jours, mis à jour en temps réel',
    info: 'À la fin de chaque semaine, un rapport est automatiquement enregistré ici. Si vous corrigez un enregistrement par la suite, il suffit de régénérer le rapport.',
    list: 'Rapports enregistrés',
    generatedAt: (date: string) => `Généré le ${date}`,
    stale: 'Pas à jour',
    regenerate: 'Régénérer',
    regenerateNow: 'Régénérer avec les données actuelles',
    regenerated: (title: string) => `${title}\u00a0: rapport régénéré avec les données actuelles.`,
    regeneratedOne: 'Rapport régénéré avec les données actuelles.',
    delete: 'Supprimer',
    deleteLabel: 'Supprimer le rapport',
    deleteTitle: (title: string) => `Supprimer «\u00a0${title}\u00a0»\u00a0?`,
    deleteWeekly:
      'Vos repas enregistrés restent sauvegardés. Vous pourrez régénérer ce rapport quand vous voudrez.',
    deleteCustom: 'Vos repas enregistrés restent sauvegardés.',
    deleted: 'Rapport supprimé.',
    deleteError: 'Impossible de supprimer le rapport. Réessayez.',
    emptyTitle: 'Aucun rapport enregistré pour l’instant',
    emptyUnlocked:
      'Le premier rapport hebdomadaire apparaîtra ici à la fin de la semaine. Vous pouvez aussi enregistrer le rapport actuel.',
    emptyLocked: 'Vos rapports apparaîtront ici après 7 jours d’enregistrement.',
    other: 'Générer un rapport sur une autre période',
    lastDay: 'Dernier jour de la période',
    covers: (period: string) => `Le rapport couvrira 7 jours\u00a0: ${period}.`,
    pickDate: 'Choisissez une date.',
    generate: 'Générer le rapport',
    generated: 'Rapport généré.',
    notFound: 'Rapport introuvable',
    notFoundText: 'Il a peut-être été supprimé.',
    staleNotice:
      'Vous avez modifié des enregistrements de cette période après la génération de ce rapport.',
  },

  profile: {
    title: 'Profil',
    name: 'Votre prénom',
    saveName: 'Enregistrer le prénom',
    nameSaved: 'Prénom mis à jour.',
    language: 'Langue',
    languageHint:
      'Modifie les textes de l’application et des rapports, ainsi que les noms d’aliments qu’EatMate reconnaît quand vous écrivez ce que vous avez mangé.',
    appearance: 'Apparence',
    themes: { system: 'Automatique', light: 'Clair', dark: 'Sombre' },
    install: 'Installer l’application',
    installed: 'Vous utilisez déjà la version installée d’EatMate. 🎉',
    installText:
      'Installez EatMate pour l’ouvrir directement depuis l’écran d’accueil, comme une application, même sans connexion internet.',
    installButton: 'Installer EatMate',
    installIOS:
      'Sur iPhone, ouvrez la page dans Safari, touchez **Partager** puis **Sur l’écran d’accueil**.',
    installOther:
      'Dans le menu du navigateur, cherchez **Installer l’application** ou **Ajouter à l’écran d’accueil**.',
    data: 'Vos données',
    dataSummary: (meals: number, days: number, reports: number) =>
      `${meals} repas sur ${dayCount(days)} · ${reportCount(reports)}. Tout est enregistré uniquement sur cet appareil — faites une sauvegarde de temps en temps pour ne rien perdre si vous changez de téléphone.`,
    lastBackup: 'Dernière sauvegarde\u00a0:',
    never: 'jamais',
    export: 'Exporter une sauvegarde',
    import: 'Importer une sauvegarde',
    exported: 'Sauvegarde enregistrée dans vos fichiers.',
    saveCloud: 'Enregistrer dans Drive ou iCloud',
    saveCloudHint:
      'Dans le menu qui s’ouvre, choisissez **Drive** (Android) ou **Enregistrer dans Fichiers**, puis Google Drive ou iCloud Drive (iPhone). Pour restaurer, touchez **Importer une sauvegarde** et choisissez le fichier.',
    shared: 'Sauvegarde enregistrée.',
    reminder: 'Rappel de sauvegarde',
    reminderOptions: { off: 'Désactivé', daily: 'Chaque jour', weekly: 'Chaque semaine' },
    reminderHint:
      'Le rappel apparaît sur l’écran d’accueil quand vous avez de nouvelles entrées qui ne sont encore dans aucune sauvegarde.',
    importTitle: 'Importer la sauvegarde\u00a0?',
    importMessage: (meals: number, reports: number) =>
      `Le fichier contient ${meals} repas et ${reportCount(reports)}. Ils seront ajoutés à vos données actuelles — rien ne sera effacé.`,
    importConfirm: 'Importer',
    imported: (meals: number) => `Sauvegarde importée\u00a0: ${meals} repas.`,
    customFoods: 'Mes aliments',
    customFoodsText:
      'Les aliments que vous avez classés. Touchez le crayon pour changer leur catégorie.',
    changeCategory: (name: string) => `Changer la catégorie de «\u00a0${name}\u00a0»`,
    removeFood: (name: string) => `Retirer ${name}`,
    removeFoodTitle: (name: string) => `Retirer «\u00a0${name}\u00a0»\u00a0?`,
    removeFoodMessage:
      'Les repas contenant cet aliment restent enregistrés, mais il ne sera plus classé.',
    foodRemoved: 'Aliment retiré.',
    reclassified: 'Catégorie mise à jour.',
    method: {
      title: 'Comment la note est-elle calculée\u00a0?',
      intro:
        'Chaque aliment reçoit une note de **A** (la meilleure) à **E**, inspirée du Nutri-Score, et un degré de transformation selon le **Guide alimentaire pour la population brésilienne** (bruts, ingrédients culinaires, transformés et ultra-transformés).',
      criteria: 'La note de la semaine va de 0 à 100 et combine cinq critères\u00a0:',
      items: {
        qualidade: 'Qualité nutritionnelle des aliments',
        processamento: 'Degré de transformation',
        frutas_verduras: 'Fruits et légumes (objectif\u00a0: 5 portions par jour)',
        variedade: 'Variété des aliments',
        regularidade: 'Régularité du petit-déjeuner, du déjeuner et du dîner',
      },
      letters: (thresholds: string, min: number) =>
        `Ensuite, les points sont convertis en lettre\u00a0: ${thresholds} et E en dessous de ${min}.`,
      threshold: (grade: Grade, min: number) => `${grade} à partir de ${min}`,
      disclaimer:
        'Les notes sont des estimations pour vous aider à repérer des tendances — elles ne remplacent pas l’avis d’un(e) nutritionniste.',
    },
    danger: 'Effacer les données',
    dangerText: 'Supprime tous les repas, rapports et réglages de cet appareil.',
    eraseAll: 'Effacer toutes les données',
    eraseTitle: 'Effacer toutes les données\u00a0?',
    eraseMessage:
      'Tous les repas, rapports et réglages de cet appareil seront effacés. Pour en garder une copie, exportez d’abord une sauvegarde.',
    eraseConfirm: 'Tout effacer',
    version: (version: string) => `EatMate ${version} · vos données restent chez vous.`,
  },

  backup: {
    invalidJson: 'Ce fichier n’est pas une sauvegarde EatMate valide (JSON invalide).',
    notEatmate: 'Ce fichier ne semble pas être une sauvegarde EatMate.',
    tooLarge: 'Ce fichier est trop volumineux pour être une sauvegarde EatMate.',
    readError: 'Impossible de lire le fichier.',
    importError: 'Impossible d’importer le fichier.',
  },

  notFound: {
    title: 'Page introuvable',
    text: 'Cette adresse n’existe pas sur EatMate.',
    home: 'Retour à l’accueil',
    errorTitle: 'Un problème est survenu',
    errorText:
      'Vos données sont toujours enregistrées sur cet appareil. Essayez de recharger l’application.',
    reload: 'Recharger l’application',
  },

  /** Rapport en texte (Markdown), à coller dans une IA, sur WhatsApp ou dans un e-mail. */
  export: {
    title: 'Rapport alimentaire',
    name: 'Nom',
    period: 'Période',
    periodValue: (start: string, end: string, registered: number, total: number) =>
      `du ${start} au ${end} (${recordedDays(registered)} sur ${total})`,
    meals: 'Repas enregistrés',
    items: 'Aliments',
    overall: 'Note globale',
    noData: 'données insuffisantes',
    previous: (period: string) => `Période précédente (${period})`,
    howCalculated: 'Comment la note a été calculée',
    weight: (percent: number) => `poids ${percent}\u00a0%`,
    positives: 'Points positifs',
    attention: 'Points de vigilance',
    markers: 'Marqueurs de consommation alimentaire',
    markersIntro: (days: number) => `Jours de consommation, sur ${recordedDays(days)}\u00a0:`,
    idealDaily: 'idéal\u00a0: tous les jours',
    idealAvoid: 'idéal\u00a0: à éviter',
    grades: 'Qualité des aliments (échelle de A à E)',
    nova: 'Degré de transformation (classification NOVA)',
    groups: 'Groupes d’aliments',
    groupLine: (group: string, count: number, days: string) =>
      `${group}\u00a0: ${count} fois en ${days}`,
    fruitsAndVegetables: (perDay: string) =>
      `Fruits et légumes\u00a0: ${perDay} ${portionWord(Number(perDay.replace(',', '.')))} par jour en moyenne.`,
    mealsTitle: 'Repas enregistrés',
    mealLine: (meal: string, n: number, days: string) => `${meal}\u00a0: ${n} sur ${days}`,
    topFoods: 'Aliments les plus fréquents',
    diary: 'Journal alimentaire',
    dayGrade: (grade: Grade) => `note du jour\u00a0: ${grade}`,
    noRecord: '(aucun enregistrement)',
    note: 'Remarque',
    footer: (date?: string) =>
      `Généré par EatMate${date ? ` le ${date}` : ''}. Les notes (A à E) et le degré de transformation sont des estimations automatiques, inspirées du Nutri-Score et du Guide alimentaire pour la population brésilienne. Ce rapport ne remplace pas l’avis d’un(e) nutritionniste.`,
    aiIntro: (name: string, period: string) =>
      `Bonjour\u00a0! ${name ? `Je m’appelle ${name} et j’ai noté` : 'J’ai noté'} mon alimentation dans l’application EatMate. Voici mon rapport pour la période ${period}.`,
    aiAsk: [
      'À partir de ce rapport, merci de\u00a0:',
      '1. Évaluer les points forts et les points faibles de mon alimentation\u00a0;',
      '2. Suggérer des améliorations pratiques et réalistes, en respectant ma culture alimentaire\u00a0;',
      '3. Proposer des remplacements simples pour les aliments notés D ou E\u00a0;',
      '4. Composer un exemple de menu pour une journée, avec petit-déjeuner, déjeuner, goûter et dîner.',
    ],
    aiNote:
      'Remarque\u00a0: les notes A–E et le degré de transformation ont été estimés automatiquement par l’application.',
  },
};
