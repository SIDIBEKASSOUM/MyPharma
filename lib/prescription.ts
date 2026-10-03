import {
  Medicine,
  MEDICINES,
  Pharmacy,
  StockItem,
  getPharmaciesForMedicine,
} from "@/data/mockData";
import { ScannedMedication } from "@/lib/scanApi";
import { normalizeText as normalize } from "@/lib/text";

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

interface NameKey {
  key: string;
  /** From the product's own or generic name, as opposed to a trade name it is also known by. */
  own: boolean;
}

function nameKeys(medicine: Medicine): NameKey[] {
  const withoutStrength = normalize(medicine.name.replace(/\d+(?:[.,]\d+)?\s*(mg|g|ml|mcg|µg)/gi, ""));
  return [
    { key: normalize(medicine.genericName), own: true },
    { key: withoutStrength, own: true },
    ...medicine.brandNames.map((b) => ({ key: normalize(b), own: false })),
  ].filter((k) => k.key.length >= 3);
}

/**
 * Finds the catalogue medicine a prescribed name refers to. The closest name wins:
 * an exact match beats a name contained in the written text, which beats a longer
 * catalogue name that merely contains what was written (so "Paracétamol" is not
 * resolved to "Paracétamol sirop" or "Amoxicilline" to "Amoxicilline + clavulanate").
 */
export function matchMedicine(scanned: ScannedMedication): Medicine | undefined {
  const written = normalize(scanned.name);
  if (written.length < 3) return undefined;

  let best: { medicine: Medicine; score: number } | undefined;
  for (const medicine of MEDICINES) {
    for (const { key, own } of nameKeys(medicine)) {
      let score: number;
      if (written === key) score = 100 + key.length;
      else if (key.length >= 4 && written.includes(key)) score = key.length;
      else if (key.length >= 4 && written.length >= 5 && key.includes(written)) score = written.length - 1;
      else continue;

      if (own) score += 1;
      // A written form ("sirop", "crème"…) breaks ties between presentations of one ingredient.
      if (written.includes(normalize(medicine.form))) score += 5;
      if (!best || score > best.score) best = { medicine, score };
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
