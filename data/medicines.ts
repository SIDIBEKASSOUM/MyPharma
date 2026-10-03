import { Medicine } from "./types";

// DRAFT CONTENT — to be reviewed and validated by a pharmacist before release.
// Dosage lines are general reference information only; the prescription and the
// pharmacist's advice always take precedence. "prescription" statuses should be
// aligned with the regulations in force in Côte d'Ivoire.

const STORAGE_DEFAULT =
  "À conserver à l'abri de l'humidité et de la chaleur (moins de 30 °C), hors de portée des enfants.";

const PARACETAMOL_ADULT = {
  activeIngredient: "paracétamol",
  category: "Antalgiques",
  form: "comprimé",
  prescription: "none" as const,
  dosage:
    "Adulte et enfant de plus de 50 kg : 1 à 2 comprimés (500 mg à 1 g) par prise, en espaçant les prises d'au moins 4 à 6 heures. Ne dépassez pas 3 g (6 comprimés) par jour sans avis médical.",
  contraindications: [
    "Allergie au paracétamol",
    "Maladie grave du foie (insuffisance hépatique)",
  ],
  sideEffects: [
    "Rares : réactions allergiques (éruption cutanée, démangeaisons)",
    "Une surdose est dangereuse pour le foie : respectez la dose maximale",
  ],
  storage: STORAGE_DEFAULT,
  warning:
    "Ne prenez pas en même temps un autre médicament contenant du paracétamol.",
};

const AMOXICILLIN_500 = {
  activeIngredient: "amoxicilline",
  category: "Antibiotiques",
  form: "gélule",
  prescription: "required" as const,
  dosage:
    "Selon la prescription du médecin (nombre de prises par jour et durée). Terminez le traitement même si vous vous sentez mieux.",
  contraindications: [
    "Allergie aux pénicillines (amoxicilline, ampicilline…)",
    "Antécédent de réaction allergique grave aux antibiotiques de la famille des bêta-lactamines",
  ],
  sideEffects: [
    "Diarrhée, nausées",
    "Éruption cutanée : arrêtez et consultez en cas d'urticaire ou de gonflement du visage",
  ],
  storage: STORAGE_DEFAULT,
};

const IBUPROFEN_400 = {
  activeIngredient: "ibuprofène",
  category: "Antalgiques",
  form: "comprimé",
  prescription: "none" as const,
  dosage:
    "Adulte : 1 comprimé (400 mg) jusqu'à 3 fois par jour, pendant un repas. Sans avis médical, ne dépassez pas 1 200 mg par jour, ni 3 jours en cas de fièvre ou 5 jours en cas de douleur.",
  contraindications: [
    "Ulcère de l'estomac ou saignement digestif",
    "Grossesse : à éviter, formellement contre-indiqué à partir du 6e mois",
    "Maladie grave du rein, du foie ou du cœur",
    "Allergie à l'ibuprofène, à l'aspirine ou aux autres anti-inflammatoires",
    "Varicelle : déconseillé",
  ],
  sideEffects: [
    "Maux d'estomac, nausées, brûlures",
    "Vertiges, maux de tête",
    "Réactions allergiques ou crise d'asthme chez les personnes sensibles",
  ],
  storage: STORAGE_DEFAULT,
  warning:
    "Ne l'associez pas à un autre anti-inflammatoire (aspirine, diclofénac…).",
};

export const MEDICINES: Medicine[] = [
  // ---------- Antalgiques ----------
  {
    id: "m1",
    name: "Paracétamol 500mg",
    genericName: "Paracétamol",
    description:
      "Antalgique et antipyrétique pour soulager les douleurs légères à modérées et faire baisser la fièvre.",
    imageEmoji: "💊",
    isGeneric: true,
    brandNames: ["Efferalgan", "Dafalgan"],
    ...PARACETAMOL_ADULT,
  },
  {
    id: "m36",
    name: "Doliprane 500mg",
    genericName: "Paracétamol",
    description:
      "Version de marque du paracétamol 500 mg : même principe actif que le générique, pour la douleur et la fièvre.",
    imageEmoji: "💊",
    isGeneric: false,
    brandNames: ["Doliprane"],
    ...PARACETAMOL_ADULT,
  },
  {
    id: "m19",
    name: "Paracétamol sirop 120mg/5ml",
    genericName: "Paracétamol",
    description:
      "Paracétamol en sirop pour la fièvre et la douleur chez l'enfant, avec mesure graduée.",
    imageEmoji: "🧪",
    activeIngredient: "paracétamol",
    category: "Antalgiques",
    form: "sirop",
    prescription: "none",
    isGeneric: true,
    brandNames: ["Doliprane enfant", "Efferalgan enfant"],
    dosage:
      "Enfant : dose selon le poids (environ 15 mg par kg et par prise), toutes les 6 heures, soit 4 prises maximum par 24 heures. Utilisez uniquement la mesure fournie. En cas de doute, demandez au pharmacien.",
    contraindications: [
      "Allergie au paracétamol",
      "Maladie grave du foie",
    ],
    sideEffects: [
      "Rares : éruption cutanée, allergie",
      "Une surdose est grave pour le foie",
    ],
    storage:
      "À l'abri de la chaleur. Respectez le délai d'utilisation après ouverture indiqué sur la notice.",
    warning:
      "Ne dépassez jamais la dose : vérifiez qu'aucun autre produit ne contient du paracétamol.",
  },
  {
    id: "m4",
    name: "Ibuprofène 400mg",
    genericName: "Ibuprofène",
    description:
      "Anti-inflammatoire non stéroïdien (AINS) contre la douleur, la fièvre et l'inflammation.",
    imageEmoji: "💊",
    isGeneric: true,
    brandNames: ["Nurofen", "Brufen"],
    ...IBUPROFEN_400,
  },
  {
    id: "m39",
    name: "Advil 400mg",
    genericName: "Ibuprofène",
    description:
      "Version de marque de l'ibuprofène 400 mg, contre la douleur, la fièvre et l'inflammation.",
    imageEmoji: "💊",
    isGeneric: false,
    brandNames: ["Advil"],
    ...IBUPROFEN_400,
  },
  {
    id: "m11",
    name: "Aspirine 500mg",
    genericName: "Acide acétylsalicylique",
    description:
      "Contre les douleurs légères à modérées et la fièvre chez l'adulte.",
    imageEmoji: "💊",
    activeIngredient: "acide acétylsalicylique",
    category: "Antalgiques",
    form: "comprimé",
    prescription: "none",
    isGeneric: true,
    brandNames: ["Aspirine UPSA", "Aspégic"],
    dosage:
      "Adulte : 1 à 2 comprimés (500 mg à 1 g) par prise, espacés d'au moins 4 heures, sans dépasser 3 g (6 comprimés) par jour. À prendre pendant un repas avec un grand verre d'eau.",
    contraindications: [
      "Enfant et adolescent de moins de 16 ans avec fièvre ou infection virale (risque de syndrome de Reye)",
      "Ulcère ou saignement digestif, troubles de la coagulation",
      "Grossesse : formellement contre-indiqué à partir du 6e mois",
      "Allergie aux anti-inflammatoires ou asthme provoqué par l'aspirine",
    ],
    sideEffects: [
      "Brûlures d'estomac, nausées",
      "Risque de saignement (gencives, nez, selles noires)",
    ],
    storage: STORAGE_DEFAULT,
    warning: "Ne pas donner à un enfant de moins de 16 ans sans avis médical.",
  },
  {
    id: "m12",
    name: "Diclofénac 50mg",
    genericName: "Diclofénac",
    description:
      "Anti-inflammatoire pour les douleurs articulaires, musculaires et dentaires, sur ordonnance.",
    imageEmoji: "💊",
    activeIngredient: "diclofénac",
    category: "Antalgiques",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Voltarène"],
    dosage:
      "Selon la prescription, pendant les repas, pour la durée la plus courte possible.",
    contraindications: [
      "Ulcère ou saignement digestif",
      "Insuffisance cardiaque, rénale ou hépatique sévère",
      "Maladie cardiaque ou antécédent d'AVC",
      "Grossesse : formellement contre-indiqué à partir du 6e mois",
      "Allergie aux anti-inflammatoires",
    ],
    sideEffects: [
      "Douleurs d'estomac, nausées",
      "Vertiges, maux de tête",
      "Hausse de la tension, rétention d'eau",
    ],
    storage: STORAGE_DEFAULT,
    warning: "Ne l'associez pas à un autre anti-inflammatoire.",
  },

  // ---------- Antibiotiques ----------
  {
    id: "m2",
    name: "Amoxicilline 500mg",
    genericName: "Amoxicilline",
    description:
      "Antibiotique à large spectre utilisé pour traiter diverses infections bactériennes.",
    imageEmoji: "💊",
    isGeneric: true,
    brandNames: ["Clamoxyl"],
    ...AMOXICILLIN_500,
  },
  {
    id: "m38",
    name: "Clamoxyl 500mg",
    genericName: "Amoxicilline",
    description:
      "Version de marque de l'amoxicilline 500 mg, antibiotique contre les infections bactériennes.",
    imageEmoji: "💊",
    isGeneric: false,
    brandNames: ["Clamoxyl"],
    ...AMOXICILLIN_500,
  },
  {
    id: "m37",
    name: "Amoxicilline + Acide clavulanique 1g",
    genericName: "Amoxicilline / Acide clavulanique",
    description:
      "Antibiotique renforcé pour des infections que l'amoxicilline seule ne soigne pas toujours (sinus, oreilles, poumons, urines).",
    imageEmoji: "💊",
    activeIngredient: "amoxicilline-acide clavulanique",
    category: "Antibiotiques",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Augmentin"],
    dosage:
      "Selon la prescription, généralement 2 prises par jour au début d'un repas. Terminez le traitement.",
    contraindications: [
      "Allergie aux pénicillines",
      "Antécédent d'atteinte du foie lors d'un traitement par ce médicament",
    ],
    sideEffects: [
      "Diarrhée, nausées",
      "Éruption cutanée",
      "Mycose (candidose) possible",
    ],
    storage: STORAGE_DEFAULT,
  },
  {
    id: "m9",
    name: "Cotrimoxazole 480mg",
    genericName: "Sulfaméthoxazole-Triméthoprime",
    description:
      "Antibiotique utilisé pour traiter les infections urinaires et respiratoires.",
    imageEmoji: "💊",
    activeIngredient: "sulfaméthoxazole-triméthoprime",
    category: "Antibiotiques",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Bactrim"],
    dosage:
      "Selon la prescription, généralement 2 prises par jour. Buvez beaucoup d'eau pendant le traitement.",
    contraindications: [
      "Allergie aux sulfamides",
      "Insuffisance rénale ou hépatique sévère",
      "Grossesse (surtout 1er trimestre) : avis médical",
      "Nouveau-né de moins de 6 semaines",
    ],
    sideEffects: [
      "Nausées, vomissements, perte d'appétit",
      "Éruption cutanée : arrêtez et consultez",
      "Sensibilité accrue au soleil",
    ],
    storage: STORAGE_DEFAULT,
  },
  {
    id: "m13",
    name: "Azithromycine 250mg",
    genericName: "Azithromycine",
    description:
      "Antibiotique de la famille des macrolides, souvent prescrit en traitement court (angines, bronchites, infections de la peau).",
    imageEmoji: "💊",
    activeIngredient: "azithromycine",
    category: "Antibiotiques",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Zithromax"],
    dosage:
      "Selon la prescription ; le traitement est souvent court (3 à 5 jours). Suivez les consignes de l'ordonnance concernant les repas.",
    contraindications: [
      "Allergie aux macrolides",
      "Maladie grave du foie",
      "Troubles du rythme cardiaque connus (allongement du QT)",
    ],
    sideEffects: [
      "Diarrhée, nausées, douleurs abdominales",
      "Maux de tête, vertiges",
    ],
    storage: STORAGE_DEFAULT,
  },
  {
    id: "m14",
    name: "Ciprofloxacine 500mg",
    genericName: "Ciprofloxacine",
    description:
      "Antibiotique de la famille des quinolones, réservé à certaines infections (urinaires, digestives).",
    imageEmoji: "💊",
    activeIngredient: "ciprofloxacine",
    category: "Antibiotiques",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Ciflox"],
    dosage:
      "Selon la prescription, en général 2 prises par jour. Buvez suffisamment ; évitez les produits laitiers et les comprimés de fer ou de calcium dans les 2 heures qui entourent la prise.",
    contraindications: [
      "Allergie aux quinolones",
      "Antécédent de problème de tendon avec une quinolone",
      "Grossesse et allaitement",
      "Enfant et adolescent en croissance (sauf avis spécialisé)",
    ],
    sideEffects: [
      "Nausées, diarrhée",
      "Douleur ou gonflement d'un tendon : arrêtez et consultez",
      "Sensibilité au soleil, vertiges",
    ],
    storage: STORAGE_DEFAULT,
  },
  {
    id: "m15",
    name: "Métronidazole 250mg",
    genericName: "Métronidazole",
    description:
      "Antibiotique et antiparasitaire contre certaines infections digestives, dentaires et gynécologiques (amibes, giardia).",
    imageEmoji: "💊",
    activeIngredient: "métronidazole",
    category: "Antibiotiques",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Flagyl"],
    dosage:
      "Selon la prescription (nombre de prises et durée). Prenez les comprimés pendant les repas avec de l'eau.",
    contraindications: [
      "Allergie aux nitro-imidazolés",
      "Grossesse (1er trimestre) : avis médical",
    ],
    sideEffects: [
      "Goût métallique, nausées",
      "Urines foncées (sans gravité)",
      "Vertiges, maux de tête",
    ],
    storage: STORAGE_DEFAULT,
    warning: "Évitez toute boisson alcoolisée pendant le traitement et 48 heures après.",
  },
  {
    id: "m16",
    name: "Doxycycline 100mg",
    genericName: "Doxycycline",
    description:
      "Antibiotique de la famille des cyclines (infections respiratoires, de la peau, IST), parfois aussi en prévention du paludisme sur avis médical.",
    imageEmoji: "💊",
    activeIngredient: "doxycycline",
    category: "Antibiotiques",
    form: "gélule",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Vibramycine"],
    dosage:
      "Selon la prescription. Avalez la gélule entière avec un grand verre d'eau, en position assise ou debout, pendant un repas.",
    contraindications: [
      "Grossesse et allaitement",
      "Enfant de moins de 8 ans",
      "Allergie aux cyclines",
    ],
    sideEffects: [
      "Nausées, irritation de l'œsophage",
      "Sensibilité au soleil : protégez votre peau",
    ],
    storage: STORAGE_DEFAULT,
  },

  // ---------- Antipaludéens ----------
  {
    id: "m3",
    name: "Artémether-Luméfantrine",
    genericName: "Coartem",
    description:
      "Traitement combiné de première intention du paludisme simple (non compliqué).",
    imageEmoji: "💊",
    activeIngredient: "artémether-luméfantrine",
    category: "Antipaludéens",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Coartem"],
    dosage:
      "Traitement de 3 jours (6 prises au total), pris pendant un repas contenant des graisses ou avec du lait. Dose selon le poids, strictement selon la prescription.",
    contraindications: [
      "Paludisme grave (traitement injectable à l'hôpital)",
      "Allergie à l'un des composants",
      "Certains troubles du rythme cardiaque",
      "1er trimestre de grossesse : avis médical indispensable",
    ],
    sideEffects: [
      "Maux de tête, vertiges",
      "Nausées, douleurs abdominales",
      "Fatigue, perte d'appétit",
    ],
    storage: "À conserver à moins de 30 °C, à l'abri de l'humidité.",
    warning:
      "Fièvre persistante après le traitement, vomissements répétés ou confusion : consultez en urgence.",
  },
  {
    id: "m17",
    name: "Artésunate-Amodiaquine",
    genericName: "ASAQ",
    description:
      "Autre traitement combiné du paludisme simple (non compliqué), adapté à l'âge et au poids.",
    imageEmoji: "💊",
    activeIngredient: "artésunate-amodiaquine",
    category: "Antipaludéens",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["ASAQ", "Coarsucam"],
    dosage:
      "Traitement de 3 jours, une prise par jour, dose selon l'âge et le poids, strictement selon la prescription.",
    contraindications: [
      "Paludisme grave (hospitalisation)",
      "Allergie à l'artésunate ou à l'amodiaquine",
      "Maladie du foie ou troubles sanguins connus",
    ],
    sideEffects: [
      "Nausées, vomissements, douleurs abdominales",
      "Fatigue, vertiges, perte d'appétit",
    ],
    storage: STORAGE_DEFAULT,
    warning:
      "Si l'enfant vomit dans les 30 minutes qui suivent la prise, demandez conseil au pharmacien.",
  },
  {
    id: "m10",
    name: "Quinine 300mg",
    genericName: "Quinine",
    description:
      "Traitement du paludisme, utilisé en deuxième intention sur avis médical.",
    imageEmoji: "💊",
    activeIngredient: "quinine",
    category: "Antipaludéens",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Quinimax"],
    dosage:
      "Uniquement sur avis médical : dose et durée adaptées au poids, selon la prescription.",
    contraindications: [
      "Troubles du rythme cardiaque connus (allongement du QT)",
      "Allergie à la quinine ou à la quinidine",
      "Atteinte du nerf optique",
    ],
    sideEffects: [
      "Bourdonnements d'oreille, baisse de l'audition",
      "Maux de tête, nausées, vertiges",
      "Baisse du taux de sucre dans le sang",
    ],
    storage: STORAGE_DEFAULT,
    warning:
      "En cas de troubles de la vue, de palpitations ou de bourdonnements intenses, arrêtez et consultez.",
  },
  {
    id: "m18",
    name: "Sulfadoxine-Pyriméthamine",
    genericName: "SP",
    description:
      "Utilisée en prévention du paludisme pendant la grossesse (traitement préventif intermittent), sur avis d'un professionnel de santé.",
    imageEmoji: "💊",
    activeIngredient: "sulfadoxine-pyriméthamine",
    category: "Antipaludéens",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Fansidar"],
    dosage:
      "Prises espacées d'au moins un mois, sur indication d'une sage-femme ou d'un médecin lors du suivi de grossesse.",
    contraindications: [
      "Allergie aux sulfamides",
      "1er trimestre de grossesse",
      "Insuffisance rénale ou hépatique sévère",
      "Prise simultanée de cotrimoxazole",
    ],
    sideEffects: [
      "Nausées, vomissements",
      "Éruption cutanée : arrêtez et consultez",
      "Vertiges",
    ],
    storage: STORAGE_DEFAULT,
  },

  // ---------- Antiparasitaires ----------
  {
    id: "m31",
    name: "Albendazole 400mg",
    genericName: "Albendazole",
    description:
      "Vermifuge contre les vers intestinaux (ascaris, ankylostomes, oxyures).",
    imageEmoji: "💊",
    activeIngredient: "albendazole",
    category: "Antiparasitaires",
    form: "comprimé",
    prescription: "none",
    isGeneric: true,
    brandNames: ["Zentel"],
    dosage:
      "Adulte et enfant de plus de 2 ans : 1 comprimé (400 mg) en une seule prise, avec un repas. Enfant de moins de 2 ans : demandez conseil au pharmacien.",
    contraindications: [
      "Grossesse, surtout au 1er trimestre",
      "Allergie aux benzimidazolés",
    ],
    sideEffects: ["Maux de ventre, nausées", "Maux de tête, vertiges"],
    storage: STORAGE_DEFAULT,
  },

  // ---------- Vitamines ----------
  {
    id: "m5",
    name: "Vitamine C 500mg",
    genericName: "Acide Ascorbique",
    description:
      "Complément vitaminique pour lutter contre la fatigue et soutenir les défenses de l'organisme.",
    imageEmoji: "🍊",
    activeIngredient: "acide ascorbique",
    category: "Vitamines",
    form: "comprimé",
    prescription: "none",
    isGeneric: true,
    brandNames: ["Laroscorbine"],
    dosage:
      "1 comprimé par jour, de préférence le matin. Ne dépassez pas la dose indiquée.",
    contraindications: [
      "Antécédents de calculs rénaux",
      "Allergie à l'un des composants",
    ],
    sideEffects: ["À forte dose : diarrhée, maux d'estomac"],
    storage: STORAGE_DEFAULT,
  },
  {
    id: "m20",
    name: "Fer + Acide folique",
    genericName: "Sulfate ferreux / Acide folique",
    description:
      "Contre l'anémie par manque de fer et pour la prévention de l'anémie pendant la grossesse.",
    imageEmoji: "💊",
    activeIngredient: "fer-acide folique",
    category: "Vitamines",
    form: "comprimé",
    prescription: "none",
    isGeneric: true,
    brandNames: [],
    dosage:
      "En général 1 comprimé par jour pendant un repas, selon l'avis du médecin ou de la sage-femme.",
    contraindications: [
      "Excès de fer dans l'organisme (hémochromatose)",
      "Anémie qui n'est pas due à un manque de fer",
    ],
    sideEffects: [
      "Selles foncées (normal)",
      "Constipation, nausées, maux d'estomac",
    ],
    storage: STORAGE_DEFAULT,
    warning:
      "Gardez ce produit hors de portée des enfants : une prise massive de fer est dangereuse.",
  },

  // ---------- Cardio ----------
  {
    id: "m7",
    name: "Amlodipine 5mg",
    genericName: "Amlodipine",
    description:
      "Antihypertenseur pour le traitement de l'hypertension artérielle et de l'angine de poitrine.",
    imageEmoji: "❤️",
    activeIngredient: "amlodipine",
    category: "Cardio",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Amlor"],
    dosage:
      "Selon la prescription, généralement 1 comprimé par jour, à heure fixe. Traitement au long cours.",
    contraindications: [
      "Hypotension sévère",
      "Choc cardiogénique",
      "Allergie à l'amlodipine ou aux dihydropyridines",
    ],
    sideEffects: [
      "Gonflement des chevilles (œdèmes)",
      "Maux de tête, bouffées de chaleur",
      "Fatigue, palpitations",
    ],
    storage: STORAGE_DEFAULT,
    warning: "N'arrêtez pas ce traitement sans avis médical.",
  },
  {
    id: "m22",
    name: "Énalapril 10mg",
    genericName: "Énalapril",
    description:
      "Médicament contre l'hypertension artérielle et certaines insuffisances cardiaques.",
    imageEmoji: "❤️",
    activeIngredient: "énalapril",
    category: "Cardio",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Renitec"],
    dosage: "Selon la prescription, en une ou deux prises par jour. Traitement au long cours.",
    contraindications: [
      "Grossesse et allaitement",
      "Antécédent de gonflement du visage ou de la gorge (œdème de Quincke)",
      "Rétrécissement des artères des reins",
    ],
    sideEffects: [
      "Toux sèche persistante",
      "Vertiges, baisse de tension",
      "Taux de potassium élevé (analyses de suivi)",
    ],
    storage: STORAGE_DEFAULT,
    warning: "N'arrêtez pas ce traitement sans avis médical.",
  },
  {
    id: "m23",
    name: "Hydrochlorothiazide 25mg",
    genericName: "Hydrochlorothiazide",
    description:
      "Diurétique utilisé contre l'hypertension artérielle et la rétention d'eau.",
    imageEmoji: "❤️",
    activeIngredient: "hydrochlorothiazide",
    category: "Cardio",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Esidrex"],
    dosage: "Selon la prescription, généralement 1 comprimé le matin.",
    contraindications: [
      "Allergie aux sulfamides",
      "Insuffisance rénale sévère",
      "Taux de sodium ou de potassium très bas",
    ],
    sideEffects: [
      "Besoin d'uriner plus souvent",
      "Crampes, fatigue (baisse du potassium)",
      "Hausse de l'acide urique (crises de goutte)",
    ],
    storage: STORAGE_DEFAULT,
  },
  {
    id: "m24",
    name: "Atorvastatine 20mg",
    genericName: "Atorvastatine",
    description:
      "Médicament pour baisser le cholestérol et réduire le risque de maladies du cœur et des artères.",
    imageEmoji: "❤️",
    activeIngredient: "atorvastatine",
    category: "Cardio",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Tahor"],
    dosage: "1 comprimé par jour, à heure fixe, selon la prescription.",
    contraindications: [
      "Maladie active du foie",
      "Grossesse et allaitement",
      "Allergie à l'un des composants",
    ],
    sideEffects: [
      "Douleurs musculaires : consultez si elles sont fortes ou inhabituelles",
      "Maux de tête, troubles digestifs",
    ],
    storage: STORAGE_DEFAULT,
  },

  // ---------- Diabète ----------
  {
    id: "m6",
    name: "Métformine 500mg",
    genericName: "Metformin",
    description:
      "Antidiabétique oral pour le traitement du diabète de type 2.",
    imageEmoji: "💊",
    activeIngredient: "métformine",
    category: "Diabète",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Glucophage"],
    dosage:
      "Selon la prescription, à prendre pendant ou après les repas. Ne modifiez pas la dose sans avis médical.",
    contraindications: [
      "Insuffisance rénale ou hépatique sévère",
      "Diabète déséquilibré avec acidocétose",
      "Examen avec produit de contraste iodé : avis médical avant",
      "Excès d'alcool",
    ],
    sideEffects: [
      "Nausées, diarrhée, goût métallique en début de traitement",
      "Très rare : acidose lactique (douleurs musculaires, difficulté à respirer, fatigue intense) — urgence",
    ],
    storage: STORAGE_DEFAULT,
    warning: "Traitement au long cours : ne l'arrêtez pas sans avis médical.",
  },
  {
    id: "m25",
    name: "Glibenclamide 5mg",
    genericName: "Glibenclamide",
    description:
      "Antidiabétique oral qui stimule la production d'insuline, pour le diabète de type 2.",
    imageEmoji: "💊",
    activeIngredient: "glibenclamide",
    category: "Diabète",
    form: "comprimé",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Daonil"],
    dosage:
      "Selon la prescription, généralement avant le petit-déjeuner. Ne sautez pas de repas.",
    contraindications: [
      "Diabète de type 1",
      "Insuffisance rénale ou hépatique sévère",
      "Allergie aux sulfamides",
      "Grossesse",
    ],
    sideEffects: [
      "Hypoglycémie (sueurs, tremblements, faim intense)",
      "Prise de poids, nausées",
    ],
    storage: STORAGE_DEFAULT,
    warning:
      "Risque d'hypoglycémie : gardez du sucre sur vous et consultez si elle se répète.",
  },

  // ---------- Dermatologie ----------
  {
    id: "m8",
    name: "Clotrimazole crème",
    genericName: "Clotrimazole",
    description:
      "Antifongique en crème pour les mycoses de la peau (pied d'athlète, candidoses cutanées).",
    imageEmoji: "🧴",
    activeIngredient: "clotrimazole",
    category: "Dermatologie",
    form: "crème",
    prescription: "none",
    isGeneric: true,
    brandNames: ["Canesten"],
    dosage:
      "Appliquer en fine couche 2 à 3 fois par jour sur la peau propre et sèche. Poursuivez quelques jours après la disparition des signes, comme indiqué sur la notice.",
    contraindications: ["Allergie au clotrimazole ou aux autres imidazolés"],
    sideEffects: [
      "Irritation, rougeur ou brûlure locale",
      "Rarement : démangeaisons, allergie",
    ],
    storage: "À conserver à moins de 25 °C. Bien refermer le tube après usage.",
    warning: "Usage externe uniquement. Évitez le contact avec les yeux.",
  },
  {
    id: "m26",
    name: "Hydrocortisone crème 1%",
    genericName: "Hydrocortisone",
    description:
      "Crème à base de corticoïde pour calmer certaines inflammations et démangeaisons de la peau (eczéma, piqûres).",
    imageEmoji: "🧴",
    activeIngredient: "hydrocortisone",
    category: "Dermatologie",
    form: "crème",
    prescription: "required",
    isGeneric: true,
    brandNames: [],
    dosage:
      "Selon la prescription : en couche mince, sur une courte durée, sur la zone atteinte uniquement.",
    contraindications: [
      "Infection de la peau non traitée (bactérie, virus, champignon)",
      "Acné, rosacée",
      "Plaies ouvertes",
    ],
    sideEffects: [
      "Peau amincie en cas d'usage prolongé",
      "Irritation, rougeur locale",
    ],
    storage: "À conserver à moins de 25 °C.",
    warning:
      "Ne l'appliquez pas sur le visage ni sur de grandes surfaces sans avis médical.",
  },

  // ---------- Antiseptiques ----------
  {
    id: "m27",
    name: "Povidone iodée 10%",
    genericName: "Povidone iodée",
    description:
      "Antiseptique pour nettoyer et désinfecter les plaies et la peau avant un geste.",
    imageEmoji: "🧴",
    activeIngredient: "povidone iodée",
    category: "Antiseptiques",
    form: "solution",
    prescription: "none",
    isGeneric: true,
    brandNames: ["Bétadine"],
    dosage:
      "Appliquer sur la plaie nettoyée avec une compresse, 1 à 2 fois par jour, selon la notice.",
    contraindications: [
      "Allergie à l'iode ou à la povidone",
      "Troubles de la thyroïde",
      "Nouveau-né et nourrisson de moins de 30 mois",
      "Grossesse et allaitement (usage répété)",
    ],
    sideEffects: [
      "Irritation locale, tache brune sur la peau",
      "Allergie rare",
    ],
    storage: "À l'abri de la lumière et de la chaleur.",
    warning: "Usage externe uniquement.",
  },
  {
    id: "m28",
    name: "Chlorhexidine 0,05%",
    genericName: "Chlorhexidine",
    description:
      "Solution antiseptique pour nettoyer les petites plaies et les écorchures.",
    imageEmoji: "🧴",
    activeIngredient: "chlorhexidine",
    category: "Antiseptiques",
    form: "solution",
    prescription: "none",
    isGeneric: true,
    brandNames: [],
    dosage:
      "Nettoyer la plaie ou la peau abîmée avec une compresse imbibée, 1 à 2 fois par jour.",
    contraindications: [
      "Allergie à la chlorhexidine",
      "Ne pas utiliser dans l'œil, l'oreille ni sur de grandes plaies profondes",
    ],
    sideEffects: ["Irritation locale", "Rares allergies cutanées"],
    storage: "À l'abri de la chaleur.",
    warning: "Usage externe uniquement.",
  },

  // ---------- Digestif ----------
  {
    id: "m29",
    name: "Sels de réhydratation orale (SRO)",
    genericName: "Sels de réhydratation orale",
    description:
      "Sachet à dissoudre dans l'eau pour compenser les pertes en eau et en sels lors d'une diarrhée ou de vomissements.",
    imageEmoji: "💧",
    activeIngredient: "sels de réhydratation orale",
    category: "Digestif",
    form: "sachet",
    prescription: "none",
    isGeneric: true,
    brandNames: ["SRO", "Adiaril"],
    dosage:
      "Dissoudre 1 sachet dans la quantité d'eau potable indiquée sur le sachet. Boire à petites gorgées régulières, notamment après chaque selle liquide. Utiliser la solution dans les 24 heures.",
    contraindications: [
      "Vomissements incoercibles",
      "Occlusion intestinale",
      "Déshydratation sévère : c'est une urgence, consultez immédiatement",
    ],
    sideEffects: ["Vomissements possibles au début : reprenez plus lentement"],
    storage: "Sachet à l'abri de l'humidité.",
    warning:
      "Diarrhée de plus de 2 jours, enfant qui refuse de boire, sang dans les selles ou forte fièvre : consultez.",
  },
  {
    id: "m21",
    name: "Zinc 20mg dispersible",
    genericName: "Zinc",
    description:
      "Complément à donner à l'enfant en cas de diarrhée, avec les sels de réhydratation orale, pour réduire la durée et la gravité de la maladie.",
    imageEmoji: "💊",
    activeIngredient: "zinc",
    category: "Digestif",
    form: "comprimé dispersible",
    prescription: "none",
    isGeneric: true,
    brandNames: [],
    dosage:
      "Enfant de 6 mois à 5 ans : 1 comprimé (20 mg) par jour pendant 10 jours, dissous dans un peu d'eau ou de lait maternel, en plus des SRO. Enfant de moins de 6 mois : demandez conseil au pharmacien.",
    contraindications: ["Allergie au zinc"],
    sideEffects: ["Nausées ou vomissements : redonner en plus petites quantités"],
    storage: STORAGE_DEFAULT,
  },
  {
    id: "m30",
    name: "Oméprazole 20mg",
    genericName: "Oméprazole",
    description:
      "Réduit l'acidité de l'estomac : reflux, brûlures d'estomac, ulcère.",
    imageEmoji: "💊",
    activeIngredient: "oméprazole",
    category: "Digestif",
    form: "gélule",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Mopral", "Zoltum"],
    dosage:
      "Selon la prescription, généralement 1 gélule par jour avant le repas du matin, avalée entière.",
    contraindications: [
      "Allergie à l'oméprazole ou aux médicaments de la même famille",
      "Certains traitements contre le VIH : avis médical",
    ],
    sideEffects: [
      "Maux de tête, diarrhée ou constipation",
      "Douleurs abdominales, ballonnements",
    ],
    storage: STORAGE_DEFAULT,
  },
  {
    id: "m32",
    name: "Lopéramide 2mg",
    genericName: "Lopéramide",
    description:
      "Ralentit le transit en cas de diarrhée aiguë simple chez l'adulte, en complément de la réhydratation.",
    imageEmoji: "💊",
    activeIngredient: "lopéramide",
    category: "Digestif",
    form: "gélule",
    prescription: "none",
    isGeneric: true,
    brandNames: ["Imodium"],
    dosage:
      "Adulte : 2 gélules à la première prise, puis 1 après chaque selle liquide, sans dépasser 6 gélules par jour sans avis médical. Buvez beaucoup (SRO).",
    contraindications: [
      "Enfant de moins de 12 ans sans avis médical",
      "Diarrhée avec fièvre ou sang dans les selles",
      "Occlusion intestinale, ballonnement important",
      "Diarrhée survenant après un antibiotique",
    ],
    sideEffects: ["Constipation, ballonnements", "Nausées, vertiges"],
    storage: STORAGE_DEFAULT,
    warning: "Si la diarrhée dure plus de 2 jours, consultez.",
  },

  // ---------- Respiratoire ----------
  {
    id: "m33",
    name: "Salbutamol inhalateur 100µg",
    genericName: "Salbutamol",
    description:
      "Soulage rapidement les crises d'asthme et la gêne respiratoire par rétrécissement des bronches.",
    imageEmoji: "🌬️",
    activeIngredient: "salbutamol",
    category: "Respiratoire",
    form: "inhalateur",
    prescription: "required",
    isGeneric: true,
    brandNames: ["Ventoline"],
    dosage:
      "En cas de crise : 1 à 2 bouffées selon la prescription, à renouveler si besoin. Si vous en avez besoin très souvent, consultez.",
    contraindications: ["Allergie au salbutamol"],
    sideEffects: [
      "Tremblements des mains, palpitations",
      "Maux de tête, crampes",
    ],
    storage: "À l'abri de la chaleur et du soleil. Ne pas percer l'aérosol.",
    warning:
      "Si la crise ne cède pas ou si vous avez du mal à parler, allez aux urgences.",
  },
  {
    id: "m34",
    name: "Ambroxol sirop 30mg/5ml",
    genericName: "Ambroxol",
    description:
      "Fluidifie les sécrétions des bronches en cas de toux grasse.",
    imageEmoji: "🧪",
    activeIngredient: "ambroxol",
    category: "Respiratoire",
    form: "sirop",
    prescription: "none",
    isGeneric: true,
    brandNames: ["Surbronc", "Muxol"],
    dosage:
      "Dose selon l'âge indiquée sur la notice, avec la mesure fournie, en 2 à 3 prises par jour. Buvez beaucoup d'eau.",
    contraindications: [
      "Enfant de moins de 2 ans",
      "Ulcère de l'estomac en évolution",
      "Allergie à l'ambroxol",
    ],
    sideEffects: ["Nausées, brûlures d'estomac", "Rares réactions allergiques"],
    storage:
      "À l'abri de la chaleur. Respectez le délai d'utilisation après ouverture.",
    warning:
      "Ne l'associez pas à un médicament qui calme la toux (antitussif).",
  },

  // ---------- Allergie ----------
  {
    id: "m35",
    name: "Cétirizine 10mg",
    genericName: "Cétirizine",
    description:
      "Antihistaminique contre les allergies : rhinite, urticaire, démangeaisons.",
    imageEmoji: "💊",
    activeIngredient: "cétirizine",
    category: "Allergie",
    form: "comprimé",
    prescription: "none",
    isGeneric: true,
    brandNames: ["Zyrtec"],
    dosage:
      "Adulte et enfant de plus de 12 ans : 1 comprimé par jour, de préférence le soir.",
    contraindications: [
      "Insuffisance rénale sévère",
      "Allergie à la cétirizine ou à l'hydroxyzine",
    ],
    sideEffects: ["Somnolence, fatigue", "Bouche sèche, maux de tête"],
    storage: STORAGE_DEFAULT,
    warning:
      "Soyez prudent si vous conduisez ou si vous travaillez sur une machine.",
  },
];

export const CATEGORIES = [
  "Tous",
  "Antalgiques",
  "Antibiotiques",
  "Antipaludéens",
  "Antiparasitaires",
  "Allergie",
  "Antiseptiques",
  "Cardio",
  "Dermatologie",
  "Diabète",
  "Digestif",
  "Respiratoire",
  "Vitamines",
];
