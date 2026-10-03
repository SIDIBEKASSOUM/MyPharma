export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  imageEmoji: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  lat: number;
  lng: number;
  isOpen: boolean;
  isGuard: boolean;
  rating: number;
  openHours: string;
  distance?: number;
}

export interface StockItem {
  pharmacyId: string;
  medicineId: string;
  price: number;
  quantity: number;
  available: boolean;
  unit: string;
}

export const CATEGORIES = [
  "Tous",
  "Antibiotiques",
  "Antalgiques",
  "Antipaludéens",
  "Vitamines",
  "Cardio",
  "Diabète",
  "Dermatologie",
];

export const MEDICINES: Medicine[] = [
  {
    id: "m1",
    name: "Paracétamol 500mg",
    genericName: "Paracétamol",
    category: "Antalgiques",
    description: "Médicament antalgique et antipyrétique pour soulager les douleurs légères à modérées et faire baisser la fièvre.",
    imageEmoji: "💊",
  },
  {
    id: "m2",
    name: "Amoxicilline 500mg",
    genericName: "Amoxicilline",
    category: "Antibiotiques",
    description: "Antibiotique à large spectre utilisé pour traiter diverses infections bactériennes.",
    imageEmoji: "💊",
  },
  {
    id: "m3",
    name: "Artémether-Luméfantrine",
    genericName: "Coartem",
    category: "Antipaludéens",
    description: "Traitement combiné de première intention pour le paludisme non compliqué.",
    imageEmoji: "💊",
  },
  {
    id: "m4",
    name: "Ibuprofène 400mg",
    genericName: "Ibuprofène",
    category: "Antalgiques",
    description: "Anti-inflammatoire non stéroïdien (AINS) pour douleurs et inflammations.",
    imageEmoji: "💊",
  },
  {
    id: "m5",
    name: "Vitamine C 500mg",
    genericName: "Acide Ascorbique",
    category: "Vitamines",
    description: "Complément vitaminique essentiel pour renforcer l'immunité.",
    imageEmoji: "🍊",
  },
  {
    id: "m6",
    name: "Métformine 500mg",
    genericName: "Metformin",
    category: "Diabète",
    description: "Médicament antidiabétique oral pour le traitement du diabète de type 2.",
    imageEmoji: "💊",
  },
  {
    id: "m7",
    name: "Amlodipine 5mg",
    genericName: "Amlodipine",
    category: "Cardio",
    description: "Antihypertenseur pour le traitement de l'hypertension et angine de poitrine.",
    imageEmoji: "❤️",
  },
  {
    id: "m8",
    name: "Clotrimazole crème",
    genericName: "Clotrimazole",
    category: "Dermatologie",
    description: "Antifongique topique pour traiter les infections cutanées fongiques.",
    imageEmoji: "🧴",
  },
  {
    id: "m9",
    name: "Cotrimoxazole 480mg",
    genericName: "Sulfaméthoxazole-Triméthoprime",
    category: "Antibiotiques",
    description: "Antibiotique utilisé pour traiter les infections urinaires et respiratoires.",
    imageEmoji: "💊",
  },
  {
    id: "m10",
    name: "Quinine 300mg",
    genericName: "Quinine",
    category: "Antipaludéens",
    description: "Traitement du paludisme sévère, utilisation en deuxième intention.",
    imageEmoji: "💊",
  },
];

export const PHARMACIES: Pharmacy[] = [
  {
    id: "p1",
    name: "Pharmacie du Plateau",
    address: "Avenue Houphouët-Boigny, Plateau",
    district: "Plateau",
    phone: "+225 20 21 22 23",
    lat: 5.3364,
    lng: -4.0267,
    isOpen: true,
    isGuard: false,
    rating: 4.5,
    openHours: "07h30 - 22h00",
  },
  {
    id: "p2",
    name: "Pharmacie Cocody Centre",
    address: "Rue des Jardins, Cocody",
    district: "Cocody",
    phone: "+225 22 44 55 66",
    lat: 5.3547,
    lng: -3.9961,
    isOpen: true,
    isGuard: true,
    rating: 4.2,
    openHours: "24h/24",
  },
  {
    id: "p3",
    name: "Pharmacie Adjamé",
    address: "Boulevard de la République, Adjamé",
    district: "Adjamé",
    phone: "+225 20 37 45 00",
    lat: 5.3628,
    lng: -4.0194,
    isOpen: false,
    isGuard: false,
    rating: 3.9,
    openHours: "08h00 - 20h00",
  },
  {
    id: "p4",
    name: "Pharmacie Yopougon Express",
    address: "Avenue Eboué, Yopougon",
    district: "Yopougon",
    phone: "+225 23 45 67 89",
    lat: 5.3244,
    lng: -4.0802,
    isOpen: true,
    isGuard: false,
    rating: 4.0,
    openHours: "08h00 - 21h00",
  },
  {
    id: "p5",
    name: "Pharmacie Marcory",
    address: "Zone 4, Marcory",
    district: "Marcory",
    phone: "+225 21 34 56 78",
    lat: 5.2981,
    lng: -3.9947,
    isOpen: true,
    isGuard: false,
    rating: 4.3,
    openHours: "07h30 - 21h30",
  },
  {
    id: "p6",
    name: "Pharmacie Abobo de Garde",
    address: "Rue Principale, Abobo",
    district: "Abobo",
    phone: "+225 27 89 01 23",
    lat: 5.4067,
    lng: -4.0289,
    isOpen: true,
    isGuard: true,
    rating: 4.1,
    openHours: "24h/24",
  },
];

export const STOCK: StockItem[] = [
  { pharmacyId: "p1", medicineId: "m1", price: 500, quantity: 150, available: true, unit: "boîte" },
  { pharmacyId: "p1", medicineId: "m2", price: 2500, quantity: 50, available: true, unit: "boîte" },
  { pharmacyId: "p1", medicineId: "m3", price: 3500, quantity: 30, available: true, unit: "boîte" },
  { pharmacyId: "p1", medicineId: "m4", price: 800, quantity: 80, available: true, unit: "boîte" },
  { pharmacyId: "p1", medicineId: "m7", price: 5000, quantity: 25, available: true, unit: "boîte" },
  { pharmacyId: "p2", medicineId: "m1", price: 450, quantity: 200, available: true, unit: "boîte" },
  { pharmacyId: "p2", medicineId: "m3", price: 3800, quantity: 15, available: true, unit: "boîte" },
  { pharmacyId: "p2", medicineId: "m5", price: 1200, quantity: 60, available: true, unit: "boîte" },
  { pharmacyId: "p2", medicineId: "m6", price: 4500, quantity: 40, available: true, unit: "boîte" },
  { pharmacyId: "p2", medicineId: "m8", price: 2000, quantity: 35, available: true, unit: "tube" },
  { pharmacyId: "p2", medicineId: "m9", price: 1800, quantity: 20, available: true, unit: "boîte" },
  { pharmacyId: "p3", medicineId: "m1", price: 500, quantity: 0, available: false, unit: "boîte" },
  { pharmacyId: "p3", medicineId: "m2", price: 2200, quantity: 45, available: true, unit: "boîte" },
  { pharmacyId: "p3", medicineId: "m10", price: 1500, quantity: 30, available: true, unit: "boîte" },
  { pharmacyId: "p4", medicineId: "m1", price: 480, quantity: 120, available: true, unit: "boîte" },
  { pharmacyId: "p4", medicineId: "m4", price: 750, quantity: 100, available: true, unit: "boîte" },
  { pharmacyId: "p4", medicineId: "m5", price: 1000, quantity: 80, available: true, unit: "boîte" },
  { pharmacyId: "p4", medicineId: "m3", price: 3200, quantity: 0, available: false, unit: "boîte" },
  { pharmacyId: "p5", medicineId: "m1", price: 500, quantity: 90, available: true, unit: "boîte" },
  { pharmacyId: "p5", medicineId: "m2", price: 2400, quantity: 55, available: true, unit: "boîte" },
  { pharmacyId: "p5", medicineId: "m6", price: 4200, quantity: 30, available: true, unit: "boîte" },
  { pharmacyId: "p5", medicineId: "m7", price: 4800, quantity: 20, available: true, unit: "boîte" },
  { pharmacyId: "p5", medicineId: "m8", price: 1900, quantity: 40, available: true, unit: "tube" },
  { pharmacyId: "p6", medicineId: "m1", price: 520, quantity: 180, available: true, unit: "boîte" },
  { pharmacyId: "p6", medicineId: "m3", price: 3600, quantity: 50, available: true, unit: "boîte" },
  { pharmacyId: "p6", medicineId: "m10", price: 1600, quantity: 25, available: true, unit: "boîte" },
  { pharmacyId: "p6", medicineId: "m9", price: 1700, quantity: 35, available: true, unit: "boîte" },
];

export function searchMedicines(query: string, category?: string): Medicine[] {
  let results = MEDICINES;
  if (category && category !== "Tous") {
    results = results.filter((m) => m.category === category);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }
  return results;
}

export function getPharmaciesForMedicine(medicineId: string): Array<Pharmacy & { stock: StockItem }> {
  const stocks = STOCK.filter((s) => s.medicineId === medicineId);
  return stocks
    .map((stock) => {
      const pharmacy = PHARMACIES.find((p) => p.id === stock.pharmacyId);
      if (!pharmacy) return null;
      return { ...pharmacy, stock };
    })
    .filter(Boolean) as Array<Pharmacy & { stock: StockItem }>;
}

export function getStockForPharmacy(pharmacyId: string): Array<Medicine & { stock: StockItem }> {
  const stocks = STOCK.filter((s) => s.pharmacyId === pharmacyId && s.available);
  return stocks
    .map((stock) => {
      const medicine = MEDICINES.find((m) => m.id === stock.medicineId);
      if (!medicine) return null;
      return { ...medicine, stock };
    })
    .filter(Boolean) as Array<Medicine & { stock: StockItem }>;
}

export function getGuardPharmacies(): Pharmacy[] {
  return PHARMACIES.filter((p) => p.isGuard);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("fr-FR") + " FCFA";
}
