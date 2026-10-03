// DRAFT CONTENT — general self-care advice, to be reviewed and validated by a
// pharmacist or physician before release. It never replaces a consultation.

export interface Symptom {
  id: string;
  label: string;
  /** Words people type; matched without accents or case. */
  keywords: string[];
  advice: string;
  /** Warning signs: when to see a doctor instead of self-treating. */
  seeDoctor: string[];
  /** Catalogue medicines commonly used for this problem. */
  medicineIds: string[];
}

export const SYMPTOMS: Symptom[] = [
  {
    id: "fever",
    label: "Fièvre",
    keywords: ["fièvre", "température", "fiévreux"],
    advice:
      "Buvez régulièrement, reposez-vous et restez légèrement vêtu. Le paracétamol est le premier choix pour faire baisser la fièvre. Dans une région où le paludisme existe, toute fièvre peut en être un signe : faites un test rapide avant de traiter.",
    seeDoctor: [
      "Fièvre chez un nourrisson de moins de 3 mois",
      "Fièvre qui dure plus de 3 jours ou qui revient après une amélioration",
      "Raideur de la nuque, convulsions, confusion ou difficulté à respirer",
      "Éruption cutanée, vomissements répétés ou douleur intense",
      "Femme enceinte ou personne fragile",
    ],
    medicineIds: ["m1", "m36", "m19", "m4"],
  },
  {
    id: "malaria",
    label: "Paludisme (palu)",
    keywords: ["paludisme", "palu", "malaria", "accès palustre"],
    advice:
      "Les signes courants sont la fièvre, les frissons, les maux de tête et les courbatures. Un test rapide (TDR), disponible en pharmacie ou en centre de santé, confirme le diagnostic. Ne prenez pas d'antipaludéen sans test ni ordonnance.",
    seeDoctor: [
      "Enfant de moins de 5 ans, femme enceinte ou personne fragile",
      "Vomissements qui empêchent de garder le traitement",
      "Convulsions, confusion, grande faiblesse, urines très foncées ou yeux jaunes",
      "Fièvre qui persiste après 2 jours de traitement",
    ],
    medicineIds: ["m3", "m17"],
  },
  {
    id: "pain",
    label: "Douleur, maux de tête",
    keywords: ["douleur", "mal de tête", "maux de tête", "migraine", "courbature", "mal aux dents", "mal de dos"],
    advice:
      "Commencez par le paracétamol. L'ibuprofène et l'aspirine se prennent pendant un repas et sont déconseillés pendant la grossesse. Ne cumulez pas plusieurs anti-inflammatoires.",
    seeDoctor: [
      "Mal de tête brutal et très violent, ou avec fièvre et raideur de la nuque",
      "Douleur dans la poitrine ou difficulté à respirer",
      "Douleur qui dure plus de 3 jours ou qui s'aggrave",
      "Faiblesse d'un côté du corps, trouble de la parole ou de la vue",
    ],
    medicineIds: ["m1", "m36", "m4", "m39", "m11"],
  },
  {
    id: "cough",
    label: "Toux, rhume",
    keywords: ["toux", "tousser", "rhume", "bronchite"],
    advice:
      "Buvez beaucoup d'eau tiède et aérez la pièce. Pour une toux grasse (avec crachats), un fluidifiant peut aider. N'associez pas un fluidifiant à un médicament qui calme la toux.",
    seeDoctor: [
      "Toux de plus de 3 semaines",
      "Difficulté à respirer, respiration sifflante ou douleur dans la poitrine",
      "Crachats avec du sang",
      "Fièvre élevée qui dure, ou enfant de moins de 2 ans",
      "Toux avec amaigrissement ou sueurs la nuit (penser à la tuberculose)",
    ],
    medicineIds: ["m34"],
  },
  {
    id: "diarrhea",
    label: "Diarrhée",
    keywords: ["diarrhée", "selles liquides", "gastro"],
    advice:
      "Le plus important est de remplacer l'eau perdue : buvez des sels de réhydratation (SRO) à petites gorgées. Chez l'enfant, ajoutez le zinc pendant 10 jours. Le lopéramide est réservé à l'adulte et ne remplace pas l'hydratation.",
    seeDoctor: [
      "Sang dans les selles ou forte fièvre",
      "Enfant ou nourrisson qui refuse de boire, très fatigué, aux yeux creux ou qui n'urine plus",
      "Vomissements qui empêchent de boire",
      "Diarrhée de plus de 2 jours",
    ],
    medicineIds: ["m29", "m21", "m32"],
  },
  {
    id: "allergy",
    label: "Allergie, démangeaisons",
    keywords: ["allergie", "démangeaison", "démangeaisons", "urticaire", "éternuement", "rhinite"],
    advice:
      "Un antihistaminique soulage la rhinite, l'urticaire et les démangeaisons. Évitez ce qui déclenche la réaction (poussière, aliment, produit). Il peut provoquer de la somnolence.",
    seeDoctor: [
      "Gonflement du visage, des lèvres ou de la gorge, ou difficulté à respirer : urgence, appelez le 185",
      "Éruption qui s'étend rapidement ou qui s'accompagne de fièvre",
      "Symptômes qui durent plus d'une semaine",
    ],
    medicineIds: ["m35"],
  },
  {
    id: "stomach",
    label: "Brûlures d'estomac",
    keywords: ["estomac", "brûlure d'estomac", "reflux", "acidité", "aigreur"],
    advice:
      "Évitez les repas copieux, gras ou très épicés, l'alcool et le tabac, et ne vous couchez pas juste après avoir mangé. Un traitement qui réduit l'acidité est délivré sur ordonnance.",
    seeDoctor: [
      "Vomissements de sang ou selles noires",
      "Douleur dans la poitrine, le bras ou la mâchoire",
      "Difficulté à avaler ou perte de poids sans raison",
      "Symptômes qui durent plus de 2 semaines",
    ],
    medicineIds: ["m30"],
  },
  {
    id: "wound",
    label: "Plaie, coupure",
    keywords: ["plaie", "coupure", "blessure", "écorchure", "égratignure", "désinfecter", "antiseptique"],
    advice:
      "Lavez-vous les mains, nettoyez la plaie à l'eau propre et au savon, puis désinfectez-la et protégez-la avec un pansement propre. Changez le pansement chaque jour.",
    seeDoctor: [
      "Plaie profonde, qui saigne beaucoup ou qui ne s'arrête pas de saigner",
      "Morsure, ou plaie souillée de terre ou rouillée (vérifiez le vaccin antitétanique)",
      "Rougeur qui s'étend, pus, chaleur ou fièvre",
    ],
    medicineIds: ["m27", "m28"],
  },
  {
    id: "fungal",
    label: "Mycose de la peau",
    keywords: ["mycose", "champignon", "pied d'athlète", "teigne"],
    advice:
      "Lavez et séchez bien la zone, évitez les vêtements serrés et ne partagez ni serviettes ni chaussures. Appliquez la crème régulièrement, même quand cela va mieux, pendant la durée indiquée.",
    seeDoctor: [
      "Cuir chevelu ou ongles touchés",
      "Pas d'amélioration après 2 semaines",
      "Diabète ou défenses immunitaires affaiblies",
    ],
    medicineIds: ["m8"],
  },
  {
    id: "worms",
    label: "Vers intestinaux",
    keywords: ["vers", "ver intestinal", "ascaris", "oxyure", "parasite"],
    advice:
      "Lavez-vous les mains avant de manger et après les toilettes, et lavez bien les fruits et légumes. Un vermifuge en prise unique traite la plupart des vers ; l'entourage doit parfois être traité aussi, selon l'avis du pharmacien.",
    seeDoctor: [
      "Femme enceinte ou enfant de moins de 2 ans",
      "Douleurs abdominales intenses, vomissements de vers ou sang dans les selles",
      "Amaigrissement ou anémie",
    ],
    medicineIds: ["m31"],
  },
  {
    id: "fatigue",
    label: "Fatigue, anémie",
    keywords: ["fatigue", "anémie", "pâle", "faiblesse"],
    advice:
      "La fatigue a de nombreuses causes. Une alimentation variée et du repos aident ; le fer peut aider en cas d'anémie par manque de fer, fréquente pendant la grossesse. Un avis médical permet d'en trouver la cause.",
    seeDoctor: [
      "Essoufflement, palpitations, vertiges ou pâleur marquée",
      "Fatigue intense qui dure plus de 2 semaines",
      "Femme enceinte (suivi prénatal)",
      "Fatigue avec fièvre ou perte de poids",
    ],
    medicineIds: ["m20", "m5"],
  },
];
