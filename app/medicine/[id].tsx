import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InfoSection from "@/components/InfoSection";
import MedicineCard from "@/components/MedicineCard";
import PharmacyCard from "@/components/PharmacyCard";
import Colors from "@/constants/colors";
import { useAddToCart } from "@/context/CartContext";
import {
  MEDICINES,
  countAvailablePharmacies,
  formatPrice,
  getAlternatives,
  getMinPrice,
  getPharmaciesForMedicine,
} from "@/data/mockData";

export default function MedicineDetailScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const addItem = useAddToCart();

  const medicine = useMemo(() => MEDICINES.find((m) => m.id === id), [id]);
  const pharmacyData = useMemo(
    () => (id ? getPharmaciesForMedicine(id) : []),
    [id]
  );

  const available = pharmacyData
    .filter((p) => p.stock.available)
    .sort((a, b) => a.stock.price - b.stock.price);
  const unavailable = pharmacyData.filter((p) => !p.stock.available);
  const alternatives = useMemo(() => (medicine ? getAlternatives(medicine) : []), [medicine]);
  const needsPrescription = medicine?.prescription === "required";

  if (!medicine) {
    return (
      <View style={[styles.center, { backgroundColor: C.background }]}>
        <Text style={{ color: C.text, fontFamily: "Inter_400Regular" }}>
          Médicament introuvable
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 40 }}
      >
        <View style={[styles.heroSection, { backgroundColor: C.primary }]}>
          <View
            style={[
              styles.backBtn,
              { top: Platform.OS === "web" ? 67 + 16 : insets.top + 16 },
            ]}
          >
            <TouchableOpacity
              style={[styles.backCircle, { backgroundColor: "rgba(255,255,255,0.3)" }]}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={[styles.emojiCircle, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
            <Text style={styles.heroEmoji}>{medicine.imageEmoji}</Text>
          </View>
          <View style={[styles.catPill, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
            <Text style={[styles.catPillText, { fontFamily: "Inter_600SemiBold" }]}>
              {medicine.category}
            </Text>
          </View>
          <Text style={[styles.heroName, { fontFamily: "Inter_700Bold" }]}>
            {medicine.name}
          </Text>
          <Text style={[styles.heroGeneric, { fontFamily: "Inter_400Regular" }]}>
            {medicine.genericName}
          </Text>
          <View style={styles.chipRow}>
            <View style={[styles.chip, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Text style={[styles.chipText, { fontFamily: "Inter_500Medium" }]}>
                {medicine.isGeneric ? "Générique" : "Marque"}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Text style={[styles.chipText, { fontFamily: "Inter_500Medium" }]}>{medicine.form}</Text>
            </View>
          </View>
          {medicine.brandNames.length > 0 && (
            <Text style={[styles.brands, { fontFamily: "Inter_400Regular" }]}>
              Aussi connu sous : {medicine.brandNames.join(", ")}
            </Text>
          )}
        </View>

        <View style={styles.content}>
          <View
            style={[
              styles.rxBanner,
              { backgroundColor: needsPrescription ? C.warningLight : C.successLight },
            ]}
          >
            <Feather
              name={needsPrescription ? "file-text" : "check-circle"}
              size={18}
              color={needsPrescription ? C.warning : C.primaryDark}
            />
            <Text
              style={[
                styles.rxText,
                { color: needsPrescription ? "#92400E" : C.primaryDark, fontFamily: "Inter_500Medium" },
              ]}
            >
              {needsPrescription
                ? "Délivré sur ordonnance. Vous devrez la présenter à la pharmacie."
                : "Disponible sans ordonnance. Demandez conseil à votre pharmacien."}
            </Text>
          </View>

          {medicine.warning && (
            <View style={[styles.rxBanner, { backgroundColor: C.dangerLight }]}>
              <Feather name="alert-triangle" size={18} color={C.danger} />
              <Text style={[styles.rxText, { color: "#991B1B", fontFamily: "Inter_500Medium" }]}>
                {medicine.warning}
              </Text>
            </View>
          )}

          <View style={[styles.descCard, { backgroundColor: C.surface }]}>
            <Text style={[styles.descTitle, { color: C.text, fontFamily: "Inter_700Bold" }]}>
              Description
            </Text>
            <Text style={[styles.descText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {medicine.description}
            </Text>
          </View>

          <InfoSection title="Posologie générale" icon="clock" content={medicine.dosage} defaultOpen />
          <InfoSection title="Contre-indications" icon="slash" content={medicine.contraindications} />
          <InfoSection title="Effets indésirables" icon="activity" content={medicine.sideEffects} />
          <InfoSection title="Conservation" icon="thermometer" content={medicine.storage} />
          <Text style={[styles.disclaimer, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
            Informations générales, non personnalisées. Suivez toujours votre ordonnance et les conseils de
            votre médecin ou de votre pharmacien.
          </Text>

          <View style={[styles.statsRow]}>
            <View style={[styles.statCard, { backgroundColor: C.primaryLight }]}>
              <Text style={[styles.statNum, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
                {available.length}
              </Text>
              <Text style={[styles.statLabel, { color: C.primary, fontFamily: "Inter_400Regular" }]}>
                Disponibles
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: C.background }]}>
              <Text style={[styles.statNum, { color: C.text, fontFamily: "Inter_700Bold" }]}>
                {available.length > 0
                  ? available[0].stock.price.toLocaleString("fr-FR")
                  : "—"}
              </Text>
              <Text style={[styles.statLabel, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                FCFA min.
              </Text>
            </View>
          </View>

          {available.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Inter_700Bold" }]}>
                En stock ({available.length})
              </Text>
              {available.map((p) => (
                <View key={p.id}>
                  <PharmacyCard
                    pharmacy={p}
                    price={p.stock.price}
                    available={true}
                    unit={p.stock.unit}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push(`/pharmacy/${p.id}`);
                    }}
                  />
                  <TouchableOpacity
                    style={[styles.addBtn, { backgroundColor: C.primary }]}
                    onPress={() => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      addItem(
                        {
                          medicineId: medicine.id,
                          medicineName: medicine.name,
                          pharmacyId: p.id,
                          pharmacyName: p.name,
                          price: p.stock.price,
                          quantity: 1,
                          unit: p.stock.unit,
                          prescription: needsPrescription,
                        },
                        () => router.push("/(tabs)/orders")
                      );
                    }}
                  >
                    <Feather name="shopping-cart" size={16} color="#FFF" />
                    <Text style={[styles.addBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                      Ajouter au panier
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          {unavailable.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: C.textMuted, fontFamily: "Inter_700Bold" }]}>
                En rupture ({unavailable.length})
              </Text>
              {unavailable.map((p) => (
                <PharmacyCard
                  key={p.id}
                  pharmacy={p}
                  price={p.stock.price}
                  available={false}
                  unit={p.stock.unit}
                  onPress={() => router.push(`/pharmacy/${p.id}`)}
                />
              ))}
            </>
          )}

          {alternatives.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Inter_700Bold" }]}>
                {medicine.isGeneric ? "Version de marque" : "Alternative générique"}
              </Text>
              {alternatives.map((alt) => {
                const price = getMinPrice(alt.id);
                const current = getMinPrice(medicine.id);
                return (
                  <View key={alt.id}>
                    <MedicineCard
                      medicine={alt}
                      availableAt={countAvailablePharmacies(alt.id)}
                      onPress={() => router.push(`/medicine/${alt.id}`)}
                    />
                    {price !== null && current !== null && price !== current && (
                      <Text style={[styles.altPrice, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                        À partir de {formatPrice(price)}
                        {price < current ? ` (${formatPrice(current - price)} de moins)` : ""}
                      </Text>
                    )}
                  </View>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  heroSection: {
    paddingTop: 100,
    paddingBottom: 32,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  backBtn: { position: "absolute", left: 16 },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroEmoji: { fontSize: 40 },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  catPillText: { color: "#FFF", fontSize: 12 },
  heroName: { color: "#FFF", fontSize: 22, textAlign: "center", marginBottom: 4 },
  heroGeneric: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
  chipRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  chip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  chipText: { color: "#FFF", fontSize: 12 },
  brands: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 8, textAlign: "center" },
  rxBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  rxText: { flex: 1, fontSize: 13, lineHeight: 19 },
  disclaimer: { fontSize: 12, lineHeight: 17, marginBottom: 16, marginTop: 2 },
  altPrice: { fontSize: 12, marginTop: -4, marginBottom: 10, marginLeft: 6 },
  content: { padding: 16 },
  descCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  descTitle: { fontSize: 16, marginBottom: 8 },
  descText: { fontSize: 14, lineHeight: 22 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  statNum: { fontSize: 24, marginBottom: 4 },
  statLabel: { fontSize: 12 },
  sectionTitle: { fontSize: 17, marginBottom: 10, marginTop: 4 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: -2,
    marginBottom: 12,
  },
  addBtnText: { color: "#FFF", fontSize: 14 },
});
