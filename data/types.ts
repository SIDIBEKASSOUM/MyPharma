export type Prescription = "required" | "none";

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  imageEmoji: string;
  /** Active ingredient, used to find alternatives (same ingredient and form). */
  activeIngredient: string;
  form: string;
  prescription: Prescription;
  /** true for a generic, false for a brand-name product (princeps). */
  isGeneric: boolean;
  /** Trade names people use for this product, so search finds them. */
  brandNames: string[];
  /** General dosage information. Always subordinate to the prescription. */
  dosage: string;
  contraindications: string[];
  sideEffects: string[];
  storage: string;
  warning?: string;
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
  services: string[];
  insurances: string[];
  payments: string[];
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
