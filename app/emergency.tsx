import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

const EMERGENCY_NUMBERS = [
  { id: "samu", label: "SAMU", description: "Urgences médicales", number: "185", icon: "activity" as const },
  { id: "pompiers", label: "Sapeurs-pompiers", description: "Incendie, secours", number: "180", icon: "shield" as const },
];

export default function EmergencyScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: C.danger }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.badge}>
            <Feather name="alert-circle" size={24} color="#FFF" />
          </View>
          <Text style={[styles.title, { fontFamily: "Inter_700Bold" }]}>Urgence</Text>
          <Text style={[styles.subtitle, { fontFamily: "Inter_400Regular" }]}>
            En cas de danger vital, appelez immédiatement
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === "web" ? 100 : 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {EMERGENCY_NUMBERS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.callCard, { backgroundColor: C.surface }]}
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Linking.openURL(`tel:${item.number}`);
            }}
          >
            <View style={[styles.callIcon, { backgroundColor: C.dangerLight }]}>
              <Feather name={item.icon} size={22} color={C.danger} />
            </View>
            <View style={styles.callText}>
              <Text style={[styles.callLabel, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                {item.label}
              </Text>
              <Text style={[styles.callDesc, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                {item.description}
              </Text>
            </View>
            <View style={[styles.callBtn, { backgroundColor: C.danger }]}>
              <Feather name="phone" size={16} color="#FFF" />
              <Text style={[styles.callNumber, { fontFamily: "Inter_700Bold" }]}>{item.number}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.guardBtn, { backgroundColor: C.primaryLight }]}
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/guard-pharmacies");
          }}
        >
          <Feather name="moon" size={20} color={C.primaryDark} />
          <Text style={[styles.guardText, { color: C.primaryDark, fontFamily: "Inter_600SemiBold" }]}>
            Voir les pharmacies de garde
          </Text>
          <Feather name="chevron-right" size={20} color={C.primaryDark} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 24 },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerContent: { alignItems: "center" },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  title: { color: "#FFF", fontSize: 22, marginBottom: 4 },
  subtitle: { color: "rgba(255,255,255,0.85)", fontSize: 14, textAlign: "center" },
  list: { padding: 16, gap: 12 },
  callCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
  },
  callIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  callText: { flex: 1 },
  callLabel: { fontSize: 16 },
  callDesc: { fontSize: 13, marginTop: 2 },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  callNumber: { color: "#FFF", fontSize: 16 },
  guardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 16,
    marginTop: 4,
  },
  guardText: { flex: 1, fontSize: 15 },
});
