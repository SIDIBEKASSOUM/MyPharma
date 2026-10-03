import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import SearchBar from "@/components/SearchBar";
import Colors from "@/constants/colors";
import { PHARMACIES } from "@/data/mockData";

type Filter = "all" | "open" | "guard";

export default function PharmaciesScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const filtered = PHARMACIES.filter((p) => {
    const matchQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.district.toLowerCase().includes(query.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "open" && p.isOpen) ||
      (filter === "guard" && p.isGuard);
    return matchQuery && matchFilter;
  });

  const FILTERS: { key: Filter; label: string; icon: any }[] = [
    { key: "all", label: "Toutes", icon: "map-pin" },
    { key: "open", label: "Ouvertes", icon: "check-circle" },
    { key: "guard", label: "De garde", icon: "moon" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPadding + 16, backgroundColor: C.surface },
        ]}
      >
        <Text style={[styles.title, { color: C.text, fontFamily: "Inter_700Bold" }]}>
          Pharmacies
        </Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery("")}
          placeholder="Rechercher une pharmacie..."
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === f.key ? C.primary : C.background,
                  borderColor: filter === f.key ? C.primary : C.border,
                },
              ]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.7}
            >
              <Feather
                name={f.icon}
                size={13}
                color={filter === f.key ? "#FFF" : C.textSecondary}
              />
              <Text
                style={[
                  styles.filterLabel,
                  {
                    color: filter === f.key ? "#FFF" : C.textSecondary,
                    fontFamily: filter === f.key ? "Inter_600SemiBold" : "Inter_400Regular",
                  },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 100 : 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="map-pin" size={40} color={C.textMuted} />
            <Text style={[styles.emptyTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
              Aucune pharmacie
            </Text>
            <Text style={[styles.emptyText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Modifiez vos filtres de recherche
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.count, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
              {filtered.length} pharmacie{filtered.length > 1 ? "s" : ""}
            </Text>
            {filtered.map((pharmacy) => (
              <PharmacyCard
                key={pharmacy.id}
                pharmacy={pharmacy}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/pharmacy/${pharmacy.id}`);
                }}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  title: { fontSize: 28, marginBottom: 12 },
  filterRow: { paddingVertical: 10, gap: 8 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterLabel: { fontSize: 13 },
  list: { padding: 16 },
  count: { fontSize: 13, marginBottom: 8 },
  empty: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 18 },
  emptyText: { fontSize: 14, textAlign: "center" },
});
