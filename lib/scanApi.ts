import Constants from "expo-constants";
import { Platform } from "react-native";

export interface ScannedMedication {
  name: string;
  strength: string | null;
  quantity: number;
  instructions: string | null;
}

export interface ScanResult {
  is_prescription: boolean;
  legibility: "good" | "partial" | "poor";
  medications: ScannedMedication[];
  notes: string | null;
}

const SCAN_TIMEOUT_MS = 90_000;

/** Where the scan API (server/scan-api.js) runs: env override, else the dev machine. */
export function getScanApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_SCAN_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `http://${window.location.hostname}:3001`;
  }
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  return `http://${host ?? "localhost"}:3001`;
}

export async function scanPrescription(imageBase64: string, mediaType: string): Promise<ScanResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SCAN_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${getScanApiUrl()}/api/scan-prescription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageBase64, mediaType }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("L'analyse a pris trop de temps. Réessayez avec une photo plus nette.");
    }
    throw new Error("Impossible de joindre le service d'analyse. Vérifiez que le serveur de scan est lancé.");
  } finally {
    clearTimeout(timer);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? "L'analyse de l'ordonnance a échoué.");
  }
  return data as ScanResult;
}
