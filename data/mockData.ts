import { normalizeText } from "@/lib/text";

import { MEDICINES } from "./medicines";
import { PHARMACIES } from "./pharmacies";
import { STOCK } from "./stock";
import { SYMPTOMS, type Symptom } from "./symptoms";
import type { Medicine, Pharmacy, StockItem } from "./types";

export type { Medicine, Pharmacy, Prescription, StockItem } from "./types";
export { CATEGORIES, MEDICINES } from "./medicines";
export { PHARMACIES } from "./pharmacies";
export { STOCK } from "./stock";
export { SYMPTOMS, type Symptom } from "./symptoms";

export function searchMedicines(query: string, category?: string): Medicine[] {
  let results = MEDICINES;
  if (category && category !== "Tous") {
    results = results.filter((m) => m.category === category);
  }
  const q = normalizeText(query);
  if (q) {
    results = results.filter((m) =>
      [m.name, m.genericName, m.category, m.activeIngredient, ...m.brandNames].some((field) =>
        normalizeText(field).includes(q)
      )
    );
  }
  return results;
}

/** Symptoms matching what the user typed ("fievre", "mal de tete", "palu"…). */
export function searchSymptoms(query: string): Symptom[] {
  const q = normalizeText(query);
  if (q.length < 3) return [];
  return SYMPTOMS.filter((symptom) =>
    [symptom.label, ...symptom.keywords].some((term) => {
      const t = normalizeText(term);
      return t.includes(q) || (t.length >= 4 && q.includes(t));
    })
  );
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

/** Lowest price among pharmacies that have the medicine in stock, or null if none. */
export function getMinPrice(medicineId: string): number | null {
  const prices = STOCK.filter((s) => s.medicineId === medicineId && s.available).map((s) => s.price);
  return prices.length ? Math.min(...prices) : null;
}

/** Number of pharmacies that currently have the medicine in stock. */
export function countAvailablePharmacies(medicineId: string): number {
  return STOCK.filter((s) => s.medicineId === medicineId && s.available).length;
}

/** Other products with the same active ingredient and form (generic or brand), cheapest first. */
export function getAlternatives(medicine: Medicine): Medicine[] {
  return MEDICINES.filter(
    (m) =>
      m.id !== medicine.id &&
      m.activeIngredient === medicine.activeIngredient &&
      m.form === medicine.form
  ).sort((a, b) => (getMinPrice(a.id) ?? Infinity) - (getMinPrice(b.id) ?? Infinity));
}

export function getGuardPharmacies(): Pharmacy[] {
  return PHARMACIES.filter((p) => p.isGuard);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("fr-FR") + " FCFA";
}
