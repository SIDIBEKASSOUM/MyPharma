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

import Colors from "@/constants/colors";
import { useCart } from "@/context/CartContext";
import { PHARMACIES, getStockForPharmacy, formatPrice } from "@/data/mockData";

export default function PharmacyDetailScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCart();

  const pharmacy = useMemo(() => PHARMACIES.find((p) => p.id === id), [id]);
  const stock = useMemo(
    () => (id ? getStockForPharmacy(id) : []),
    [id]
  );

  if (!pharmacy) {
    return (
      <View style={[styles.center, { backgroundColor: C.background }]}>
        <Text style={{ color: C.text, fontFamily: "Inter_400Regular" }}>
          Pharmacie introuvable
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
        <View
          style={[
            styles.hero,
            { backgroundColor: pharmacy.isOpen ? C.primary : "#6B7280" },
          ]}
        >
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
          <View style={[styles.iconCircle, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name="map-pin" size={36} color="#FFF" />
          </View>
          <Text style={[styles.heroName, { fontFamily: "Inter_700Bold" }]}>
            {pharmacy.name}
          </Text>
          <Text style={[styles.heroAddr, { fontFamily: "Inter_400Regular" }]}>
            {pharmacy.address}
          </Text>
          <View style={styles.heroMeta}>
            <View style={[styles.statusPill, { backgroundColor: pharmacy.isOpen ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }]}>
              <View style={[styles.dot, { backgroundColor: pharmacy.isOpen ? "#4ADE80" : "#FCA5A5" }]} />
              <Text style={[styles.statusText, { fontFamily: "Inter_600SemiBold" }]}>
                {pharmacy.isOpen ? "Ouvert" : "Fermé"}
              </Text>
            </View>
            {pharmacy.isGuard && (
              <View style={[styles.guardPill, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Feather name="moon" size={12} color="#FFF" />
                <Text style={[styles.guardText, { fontFamily: "Inter_600SemiBold" }]}>
                  De garde
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={[styles.infoCard, { backgroundColor: C.surface }]}>
            <View style={styles.infoRow}>
              <Feather name="clock" size={16} color={C.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                  Horaires
                </Text>
                <Text style={[styles.infoValue, { color: C.text, fontFamily: "Inter_500Medium" }]}>
                  {pharmacy.openHours}
                </Text>
              </View>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: C.border }]} />
            <View style={styles.infoRow}>
              <Feather name="phone" size={16} color={C.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                  Téléphone
                </Text>
                <Text style={[styles.infoValue, { color: C.text, fontFamily: "Inter_500Medium" }]}>
                  {pharmacy.phone}
                </Text>
              </View>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: C.border }]} />
            <View style={styles.infoRow}>
              <Feather name="star" size={16} color={C.warning} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                  Note
                </Text>
                <Text style={[styles.infoValue, { color: C.text, fontFamily: "Inter_500Medium" }]}>
                  {pharmacy.rating} / 5
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.dirBtn, { backgroundColor: C.primaryLight }]}
            activeOpacity={0.7}
          >
            <Feather name="navigation" size={18} color={C.primary} />
            <Text style={[styles.dirBtnText, { color: C.primary, fontFamily: "Inter_600SemiBold" }]}>
              Obtenir l'itinéraire
            </Text>
          </TouchableOpacity>

          {stock.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Inter_700Bold" }]}>
                Médicaments disponibles ({stock.length})
              </Text>
              {stock.map((item) => (
                <View key={item.id} style={[styles.stockCard, { backgroundColor: C.surface }]}>
                  <View style={[styles.stockEmoji, { backgroundColor: C.primaryLight }]}>
                    <Text style={{ fontSize: 20 }}>{item.imageEmoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.stockName, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.stockCat, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                      {item.category}
                    </Text>
                  </View>
                  <View style={styles.stockRight}>
                    <Text style={[styles.stockPrice, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
                      {formatPrice(item.stock.price)}
                    </Text>
                    <TouchableOpacity
                      style={[styles.addBtn, { backgroundColor: C.primary }]}
                      onPress={() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        addItem({
                          medicineId: item.id,
                          medicineName: item.name,
                          pharmacyId: pharmacy.id,
                          pharmacyName: pharmacy.name,
                          price: item.stock.price,
                          quantity: 1,
                          unit: item.stock.unit,
                        });
                      }}
                    >
                      <Feather name="plus" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
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
  hero: {
    paddingTop: 100,
    paddingBottom: 28,
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
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroName: { color: "#FFF", fontSize: 20, textAlign: "center", marginBottom: 4 },
  heroAddr: { color: "rgba(255,255,255,0.75)", fontSize: 13, textAlign: "center", marginBottom: 12 },
  heroMeta: { flexDirection: "row", gap: 8 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { color: "#FFF", fontSize: 13 },
  guardPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  guardText: { color: "#FFF", fontSize: 13 },
  content: { padding: 16 },
  infoCard: {
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
      android: { elevation: 3 },
    }),
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoLabel: { fontSize: 11, marginBottom: 2 },
  infoValue: { fontSize: 14 },
  infoDivider: { height: 1, marginVertical: 12 },
  dirBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 20,
  },
  dirBtnText: { fontSize: 15 },
  sectionTitle: { fontSize: 17, marginBottom: 12 },
  stockCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  stockEmoji: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  stockName: { fontSize: 14, marginBottom: 2 },
  stockCat: { fontSize: 11 },
  stockRight: { alignItems: "flex-end", gap: 6 },
  stockPrice: { fontSize: 13 },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
