import { MEDICINES } from "./medicines";
import { PHARMACIES } from "./pharmacies";
import { StockItem } from "./types";

// DEMO DATA — prices and availability are fictional.

// Hand-written stock for the original catalogue (includes deliberate stock-outs).
const BASE_STOCK: StockItem[] = [
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

// Reference price (FCFA) and selling unit for every medicine; per-pharmacy prices
// are derived from it.
const REFERENCE: Record<string, { price: number; unit: string }> = {
  m1: { price: 500, unit: "boîte" },
  m2: { price: 2500, unit: "boîte" },
  m3: { price: 3500, unit: "boîte" },
  m4: { price: 800, unit: "boîte" },
  m5: { price: 1200, unit: "boîte" },
  m6: { price: 4500, unit: "boîte" },
  m7: { price: 5000, unit: "boîte" },
  m8: { price: 2000, unit: "tube" },
  m9: { price: 1800, unit: "boîte" },
  m10: { price: 1500, unit: "boîte" },
  m11: { price: 700, unit: "boîte" },
  m12: { price: 1500, unit: "boîte" },
  m13: { price: 3500, unit: "boîte" },
  m14: { price: 3000, unit: "boîte" },
  m15: { price: 1500, unit: "boîte" },
  m16: { price: 2000, unit: "boîte" },
  m17: { price: 2500, unit: "boîte" },
  m18: { price: 1500, unit: "boîte" },
  m19: { price: 1500, unit: "flacon" },
  m20: { price: 1500, unit: "boîte" },
  m21: { price: 1000, unit: "boîte" },
  m22: { price: 3000, unit: "boîte" },
  m23: { price: 2000, unit: "boîte" },
  m24: { price: 6000, unit: "boîte" },
  m25: { price: 1800, unit: "boîte" },
  m26: { price: 2200, unit: "tube" },
  m27: { price: 1200, unit: "flacon" },
  m28: { price: 1000, unit: "flacon" },
  m29: { price: 300, unit: "sachet" },
  m30: { price: 3000, unit: "boîte" },
  m31: { price: 800, unit: "boîte" },
  m32: { price: 1200, unit: "boîte" },
  m33: { price: 3500, unit: "inhalateur" },
  m34: { price: 2000, unit: "flacon" },
  m35: { price: 1500, unit: "boîte" },
  m36: { price: 900, unit: "boîte" },
  m37: { price: 6500, unit: "boîte" },
  m38: { price: 3500, unit: "boîte" },
  m39: { price: 1800, unit: "boîte" },
};

/** Deterministic pseudo-random number in [0, 1) so the demo data never changes between runs. */
function seeded(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

function generateStock(): StockItem[] {
  const existing = new Set(BASE_STOCK.map((s) => `${s.pharmacyId}:${s.medicineId}`));
  const generated: StockItem[] = [];

  for (const pharmacy of PHARMACIES) {
    // The two largest pharmacies carry almost everything.
    const coverage = pharmacy.id === "p1" || pharmacy.id === "p2" ? 0.9 : 0.6;

    for (const medicine of MEDICINES) {
      const key = `${pharmacy.id}:${medicine.id}`;
      if (existing.has(key)) continue;
      if (seeded(`${key}:stocked`) >= coverage) continue;

      const reference = REFERENCE[medicine.id];
      if (!reference) continue;

      const price = Math.round((reference.price * (0.9 + seeded(`${key}:price`) * 0.25)) / 50) * 50;
      const available = seeded(`${key}:available`) > 0.12;
      generated.push({
        pharmacyId: pharmacy.id,
        medicineId: medicine.id,
        price: Math.max(price, 50),
        quantity: available ? 5 + Math.floor(seeded(`${key}:qty`) * 195) : 0,
        available,
        unit: reference.unit,
      });
    }
  }

  // Every medicine must be findable: top up to at least 3 pharmacies in stock.
  const all = [...BASE_STOCK, ...generated];
  for (const medicine of MEDICINES) {
    const reference = REFERENCE[medicine.id];
    if (!reference) continue;
    const stocking = new Set(all.filter((s) => s.medicineId === medicine.id).map((s) => s.pharmacyId));
    let inStock = all.filter((s) => s.medicineId === medicine.id && s.available).length;

    const candidates = PHARMACIES.filter((p) => !stocking.has(p.id)).sort(
      (a, b) => seeded(`${medicine.id}:${a.id}:topup`) - seeded(`${medicine.id}:${b.id}:topup`)
    );
    for (const pharmacy of candidates) {
      if (inStock >= 3) break;
      const key = `${pharmacy.id}:${medicine.id}`;
      generated.push({
        pharmacyId: pharmacy.id,
        medicineId: medicine.id,
        price: Math.max(Math.round((reference.price * (0.9 + seeded(`${key}:price`) * 0.25)) / 50) * 50, 50),
        quantity: 5 + Math.floor(seeded(`${key}:qty`) * 195),
        available: true,
        unit: reference.unit,
      });
      inStock++;
    }
  }
  return generated;
}

export const STOCK: StockItem[] = [...BASE_STOCK, ...generateStock()];
