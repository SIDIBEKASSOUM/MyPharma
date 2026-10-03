import {
  Medicine,
  MEDICINES,
  Pharmacy,
  StockItem,
  getPharmaciesForMedicine,
} from "@/data/mockData";
import { ScannedMedication } from "@/lib/scanApi";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Strength in milligrams ("500 mg" -> 500, "1 g" -> 1000), or null if none is written. */
export function parseStrengthMg(text: string | null | undefined): number | null {
  if (!text) return null;
  const m = text.toLowerCase().replace(",", ".").match(/(\d+(?:\.\d+)?)\s*(mg|g|mcg|µg)\b/);
  if (!m) return null;
  const value = parseFloat(m[1]);
  if (m[2] === "g") return value * 1000;
  if (m[2] === "mg") return value;
  return value / 1000;
}

function nameKeys(medicine: Medicine): string[] {
  const withoutStrength = normalize(medicine.name.replace(/\d+(?:[.,]\d+)?\s*(mg|g|ml|mcg)/gi, ""));
  return [normalize(medicine.genericName), withoutStrength].filter((k) => k.length >= 4);
}

/** Finds the catalogue medicine a prescribed name refers to (longest matching name wins). */
export function matchMedicine(scanned: ScannedMedication): Medicine | undefined {
  const written = normalize(scanned.name);
  if (written.length < 4) return undefined;

  let best: { medicine: Medicine; score: number } | undefined;
  for (const medicine of MEDICINES) {
    for (const key of nameKeys(medicine)) {
      if (written.includes(key) || (written.length >= 5 && key.includes(written))) {
        if (!best || key.length > best.score) best = { medicine, score: key.length };
      }
    }
  }
  return best?.medicine;
}

/** Strength written on the prescription differs from the catalogue product's. */
export function strengthMismatch(scanned: ScannedMedication, medicine: Medicine): boolean {
  const prescribed = parseStrengthMg(scanned.strength) ?? parseStrengthMg(scanned.name);
  const offered = parseStrengthMg(medicine.name);
  return prescribed !== null && offered !== null && Math.abs(prescribed - offered) > 0.001;
}

export interface PharmacyOption {
  pharmacy: Pharmacy;
  available: Array<{ medicineId: string; stock: StockItem }>;
  missing: string[];
  total: number;
}

/** Pharmacies that stock the wanted medicines, best coverage first, then cheapest. */
export function rankPharmacies(wanted: Array<{ medicine: Medicine; quantity: number }>): PharmacyOption[] {
  const byPharmacy = new Map<string, PharmacyOption>();

  for (const { medicine, quantity } of wanted) {
    for (const entry of getPharmaciesForMedicine(medicine.id)) {
      if (!entry.stock.available) continue;
      let option = byPharmacy.get(entry.id);
      if (!option) {
        const { stock: _stock, ...pharmacy } = entry;
        option = { pharmacy, available: [], missing: [], total: 0 };
        byPharmacy.set(entry.id, option);
      }
      option.available.push({ medicineId: medicine.id, stock: entry.stock });
      option.total += entry.stock.price * quantity;
    }
  }

  for (const option of byPharmacy.values()) {
    const have = new Set(option.available.map((a) => a.medicineId));
    option.missing = wanted.filter((w) => !have.has(w.medicine.id)).map((w) => w.medicine.name);
  }

  return [...byPharmacy.values()].sort(
    (a, b) => b.available.length - a.available.length || a.total - b.total
  );
}
