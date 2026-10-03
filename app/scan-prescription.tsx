import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useCart } from "@/context/CartContext";
import { Medicine, formatPrice } from "@/data/mockData";
import { matchMedicine, rankPharmacies, strengthMismatch } from "@/lib/prescription";
import { ScanResult, ScannedMedication, scanPrescription } from "@/lib/scanApi";
import { showAlert } from "@/lib/alert";

type Line = {
  key: string;
  scanned: ScannedMedication;
  medicine?: Medicine;
  quantity: number;
  selected: boolean;
};

const MAX_QUANTITY = 10;

const LEGIBILITY_LABELS = {
  good: null,
  partial: "Lecture partielle : vérifiez chaque médicament avec soin.",
  poor: "Ordonnance difficile à lire : reprenez la photo si possible.",
} as const;

export default function ScanPrescriptionScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items: cartItems, addItem, clearCart } = useCart();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [pharmacyId, setPharmacyId] = useState<string | null>(null);

  const chosen = useMemo(
    () =>
      lines
        .filter((l) => l.selected && l.medicine)
        .map((l) => ({ medicine: l.medicine as Medicine, quantity: l.quantity })),
    [lines]
  );
  const options = useMemo(() => rankPharmacies(chosen), [chosen]);
  const option = options.find((o) => o.pharmacy.id === pharmacyId) ?? options[0];

  const analyze = async (asset: ImagePicker.ImagePickerAsset) => {
    if (!asset.base64) {
      setError("Impossible de lire la photo. Réessayez.");
      return;
    }
    setPhotoUri(asset.uri);
    setResult(null);
    setError(null);
    setAnalyzing(true);
    try {
      const scan = await scanPrescription(asset.base64, asset.mimeType ?? "image/jpeg");
      setResult(scan);
      setLines(
        scan.medications.map((scanned, i) => {
          const medicine = matchMedicine(scanned);
          return {
            key: `${i}-${scanned.name}`,
            scanned,
            medicine,
            quantity: Math.min(Math.max(scanned.quantity || 1, 1), MAX_QUANTITY),
            selected: !!medicine,
          };
        })
      );
      setPharmacyId(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'analyse a échoué.");
    } finally {
      setAnalyzing(false);
    }
  };

  const pick = async (source: "camera" | "library") => {    if (source === "camera") {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        setError("L'accès à l'appareil photo est refusé. Choisissez une photo dans votre galerie.");
        return;
      }
    }
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      quality: 0.6,
      base64: true,
    };
    const picked =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    if (!picked.canceled && picked.assets[0]) analyze(picked.assets[0]);
  };

  const update = (key: string, patch: Partial<Line>) =>
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  const addToCart = () => {
    if (!option) return;
    const pharmacy = option.pharmacy;
    const add = () => {
      for (const { medicine, quantity } of chosen) {
        const stock = option.available.find((a) => a.medicineId === medicine.id)?.stock;
        if (!stock) continue;
        addItem({
          medicineId: medicine.id,
          medicineName: medicine.name,
          pharmacyId: pharmacy.id,
          pharmacyName: pharmacy.name,
          price: stock.price,
          quantity,
          unit: stock.unit,
        });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/orders");
    };

    const current = cartItems[0];
    if (current && current.pharmacyId !== pharmacy.id) {
      showAlert(
        "Changer de pharmacie ?",
        `Votre panier contient des articles de ${current.pharmacyName}. Voulez-vous le vider pour commander chez ${pharmacy.name} ?`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Vider le panier",
            style: "destructive",
            onPress: () => {
              clearCart();
              add();
            },
          },
        ]
      );
      return;
    }
    add();
  };

  const reset = () => {
    setPhotoUri(null);
    setResult(null);
    setLines([]);
    setError(null);
    setPharmacyId(null);
  };

  const legibilityNote = result ? LEGIBILITY_LABELS[result.legibility] : null;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: C.surface }]}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Retour">
          <Feather name="arrow-left" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text, fontFamily: "Inter_700Bold" }]}>
          Scanner une ordonnance
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 120 : 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {photoUri ? (
          <View style={styles.photoRow}>
            <Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" />
            <TouchableOpacity onPress={reset} disabled={analyzing} style={styles.retake}>
              <Feather name="refresh-cw" size={16} color={C.primary} />
              <Text style={[styles.retakeText, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}>
                Autre photo
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: C.surface }]}>
            <View style={[styles.heroIcon, { backgroundColor: C.primaryLight }]}>
              <Feather name="file-text" size={28} color={C.primaryDark} />
            </View>
            <Text style={[styles.heroTitle, { color: C.text, fontFamily: "Inter_700Bold" }]}>
              Photographiez votre ordonnance
            </Text>
            <Text style={[styles.heroText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Posez-la à plat, bien éclairée, avec tout le texte visible. Nous retrouvons les médicaments
              et les pharmacies qui les ont en stock.
            </Text>
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: C.primary }]}
              onPress={() => pick("camera")}
            >
              <Feather name="camera" size={18} color="#FFF" />
              <Text style={[styles.primaryText, { fontFamily: "Inter_700Bold" }]}>Prendre une photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryBtn, { backgroundColor: C.primaryLight }]}
              onPress={() => pick("library")}
            >
              <Feather name="image" size={18} color={C.primaryDark} />
              <Text style={[styles.secondaryText, { color: C.primaryDark, fontFamily: "Inter_600SemiBold" }]}>
                Choisir dans la galerie
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {analyzing && (
          <View style={[styles.card, styles.center, { backgroundColor: C.surface }]}>
            <ActivityIndicator color={C.primary} />
            <Text style={[styles.heroText, { color: C.textSecondary, fontFamily: "Inter_500Medium" }]}>
              Lecture de l'ordonnance…
            </Text>
          </View>
        )}

        {error && (
          <View style={[styles.notice, { backgroundColor: C.dangerLight }]}>
            <Feather name="alert-circle" size={16} color={C.danger} />
            <Text style={[styles.noticeText, { color: "#991B1B", fontFamily: "Inter_400Regular" }]}>
              {error}
            </Text>
          </View>
        )}

        {result && !result.is_prescription && (
          <View style={[styles.notice, { backgroundColor: C.warningLight }]}>
            <Feather name="alert-circle" size={16} color={C.warning} />
            <Text style={[styles.noticeText, { color: "#92400E", fontFamily: "Inter_400Regular" }]}>
              Cette image ne ressemble pas à une ordonnance. Reprenez la photo.
            </Text>
          </View>
        )}

        {result?.is_prescription && (
          <>
            <View style={[styles.notice, { backgroundColor: C.warningLight }]}>
              <Feather name="info" size={16} color={C.warning} />
              <Text style={[styles.noticeText, { color: "#92400E", fontFamily: "Inter_400Regular" }]}>
                Lecture automatique : vérifiez chaque médicament et son dosage. Le pharmacien a le dernier mot.
                {legibilityNote ? `\n${legibilityNote}` : ""}
              </Text>
            </View>

            <Text style={[styles.sectionLabel, { color: C.text, fontFamily: "Inter_700Bold" }]}>
              Médicaments détectés ({lines.length})
            </Text>

            {lines.length === 0 && (
              <Text style={[styles.heroText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                Aucun médicament n'a pu être lu.
              </Text>
            )}

            {lines.map((line) => {
              const mismatch = line.medicine ? strengthMismatch(line.scanned, line.medicine) : false;
              return (
                <View key={line.key} style={[styles.card, styles.lineCard, { backgroundColor: C.surface }]}>
                  <TouchableOpacity
                    disabled={!line.medicine}
                    onPress={() => update(line.key, { selected: !line.selected })}
                    style={[
                      styles.check,
                      {
                        borderColor: line.selected ? C.primary : C.border,
                        backgroundColor: line.selected ? C.primary : "transparent",
                        opacity: line.medicine ? 1 : 0.4,
                      },
                    ]}
                    accessibilityLabel={`Sélectionner ${line.scanned.name}`}
                  >
                    {line.selected && <Feather name="check" size={14} color="#FFF" />}
                  </TouchableOpacity>

                  <View style={styles.lineBody}>
                    <Text style={[styles.lineName, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                      {line.scanned.name}
                      {line.scanned.strength ? ` ${line.scanned.strength}` : ""}
                    </Text>
                    {line.scanned.instructions ? (
                      <Text style={[styles.lineSub, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                        {line.scanned.instructions}
                      </Text>
                    ) : null}
                    {line.medicine ? (
                      <Text style={[styles.lineMatch, { color: C.primaryDark, fontFamily: "Inter_500Medium" }]}>
                        Catalogue : {line.medicine.name}
                      </Text>
                    ) : (
                      <Text style={[styles.lineMatch, { color: C.warning, fontFamily: "Inter_500Medium" }]}>
                        Introuvable dans le catalogue
                      </Text>
                    )}
                    {mismatch && (
                      <Text style={[styles.lineMatch, { color: C.danger, fontFamily: "Inter_500Medium" }]}>
                        Dosage différent de l'ordonnance : demandez conseil au pharmacien.
                      </Text>
                    )}
                  </View>

                  {line.medicine && (
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        onPress={() => update(line.key, { quantity: Math.max(1, line.quantity - 1) })}
                        accessibilityLabel="Diminuer la quantité"
                      >
                        <Feather name="minus" size={16} color={C.text} />
                      </TouchableOpacity>
                      <Text style={[styles.qty, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                        {line.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => update(line.key, { quantity: Math.min(MAX_QUANTITY, line.quantity + 1) })}
                        accessibilityLabel="Augmenter la quantité"
                      >
                        <Feather name="plus" size={16} color={C.text} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}

            {chosen.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { color: C.text, fontFamily: "Inter_700Bold" }]}>
                  Choisir une pharmacie
                </Text>
                {options.length === 0 && (
                  <Text style={[styles.heroText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    Aucune pharmacie n'a ces médicaments en stock.
                  </Text>
                )}
                {options.map((o) => {
                  const active = o.pharmacy.id === option?.pharmacy.id;
                  return (
                    <TouchableOpacity
                      key={o.pharmacy.id}
                      style={[
                        styles.card,
                        styles.pharmacyCard,
                        { backgroundColor: C.surface, borderColor: active ? C.primary : "transparent" },
                      ]}
                      onPress={() => setPharmacyId(o.pharmacy.id)}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.lineName, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                          {o.pharmacy.name}
                        </Text>
                        <Text style={[styles.lineSub, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                          {o.available.length}/{chosen.length} médicaments · {o.pharmacy.district}
                        </Text>
                        {o.missing.length > 0 && (
                          <Text style={[styles.lineMatch, { color: C.warning, fontFamily: "Inter_500Medium" }]}>
                            Manque : {o.missing.join(", ")}
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.price, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
                        {formatPrice(o.total)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {option && (
                  <TouchableOpacity
                    style={[styles.primaryBtn, { backgroundColor: C.primary }]}
                    onPress={addToCart}
                  >
                    <Feather name="shopping-cart" size={18} color="#FFF" />
                    <Text style={[styles.primaryText, { fontFamily: "Inter_700Bold" }]}>
                      Ajouter {option.available.length} article{option.available.length > 1 ? "s" : ""} au panier
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: { fontSize: 18 },
  content: { padding: 16, gap: 12 },
  card: { borderRadius: 16, padding: 16, gap: 10 },
  center: { alignItems: "center" },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  heroTitle: { fontSize: 18, textAlign: "center" },
  heroText: { fontSize: 14, lineHeight: 20, textAlign: "center" },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 4,
  },
  primaryText: { color: "#FFF", fontSize: 16 },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 14,
  },
  secondaryText: { fontSize: 15 },
  photoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  photo: { width: 72, height: 96, borderRadius: 12, backgroundColor: "#E5E7EB" },
  retake: { flexDirection: "row", alignItems: "center", gap: 6 },
  retakeText: { fontSize: 14 },
  notice: { flexDirection: "row", gap: 10, padding: 12, borderRadius: 12, alignItems: "flex-start" },
  noticeText: { flex: 1, fontSize: 13, lineHeight: 18 },
  sectionLabel: { fontSize: 16, marginTop: 8 },
  lineCard: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  lineBody: { flex: 1, gap: 2 },
  lineName: { fontSize: 15 },
  lineSub: { fontSize: 13 },
  lineMatch: { fontSize: 13 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2 },
  qty: { fontSize: 15, minWidth: 18, textAlign: "center" },
  pharmacyCard: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 2 },
  price: { fontSize: 15 },
});
