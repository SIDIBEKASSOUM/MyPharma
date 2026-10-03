import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PharmacyCard from "@/components/PharmacyCard";
import Colors from "@/constants/colors";
import { getGuardPharmacies } from "@/data/mockData";

export default function GuardPharmaciesScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const guardPharmacies = getGuardPharmacies();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: "#1E1B4B" }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.moonBadge, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Feather name="moon" size={20} color="#FFF" />
          </View>
          <Text style={[styles.title, { fontFamily: "Inter_700Bold" }]}>
            Pharmacies de garde
          </Text>
          <Text style={[styles.subtitle, { fontFamily: "Inter_400Regular" }]}>
            Ouvertes 24h/24 pour vous servir
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 100 : 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.alertBox, { backgroundColor: "#FEF3C7" }]}>
          <Feather name="alert-circle" size={16} color="#F59E0B" />
          <Text style={[styles.alertText, { color: "#92400E", fontFamily: "Inter_400Regular" }]}>
            Ces pharmacies sont disponibles en dehors des heures d'ouverture habituelles
          </Text>
        </View>

        {guardPharmacies.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="moon" size={40} color={C.textMuted} />
            <Text style={[styles.emptyTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
              Aucune pharmacie de garde
            </Text>
            <Text style={[styles.emptyText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Aucune pharmacie de garde disponible pour l'instant
            </Text>
          </View>
        ) : (
          guardPharmacies.map((pharmacy) => (
            <PharmacyCard
              key={pharmacy.id}
              pharmacy={pharmacy}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(`/pharmacy/${pharmacy.id}`);
              }}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerContent: { alignItems: "center" },
  moonBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: { color: "#FFF", fontSize: 22, marginBottom: 4 },
  subtitle: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
  list: { padding: 16 },
  alertBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  alertText: { flex: 1, fontSize: 13, lineHeight: 18 },
  empty: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 18 },
  emptyText: { fontSize: 14, textAlign: "center" },
});
