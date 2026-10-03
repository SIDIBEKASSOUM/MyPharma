import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CategoryFilter from "@/components/CategoryFilter";
import MedicineCard from "@/components/MedicineCard";
import SearchBar from "@/components/SearchBar";
import SymptomCard from "@/components/SymptomCard";
import Colors from "@/constants/colors";
import {
  CATEGORIES,
  MEDICINES,
  Medicine,
  PHARMACIES,
  searchMedicines,
  searchSymptoms,
  getPharmaciesForMedicine,
} from "@/data/mockData";
// Popular products shown on the home screen (a mix of categories).
const FEATURED_IDS = ["m1", "m2", "m3", "m29", "m35", "m5"];

const QUICK_ACTIONS = [
  { id: "search", label: "Rechercher", icon: "search" as const, color: "#10B981", bg: "#D1FAE5" },
  { id: "guard", label: "De garde", icon: "moon" as const, color: "#6366F1", bg: "#EDE9FE" },
  { id: "scan", label: "Scanner", icon: "camera" as const, color: "#F59E0B", bg: "#FEF3C7" },
  { id: "emergency", label: "Urgence", icon: "alert-circle" as const, color: "#EF4444", bg: "#FEE2E2" },
];

export default function HomeScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [isSearching, setIsSearching] = useState(false);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const searchResults = useMemo(
    () =>
      isSearching || selectedCategory !== "Tous"
        ? searchMedicines(searchQuery, selectedCategory)
        : [],
    [searchQuery, selectedCategory, isSearching]
  );

  // Symptoms ("fièvre", "toux"…) get advice cards, shown only when no category filter is active.
  const symptomResults = useMemo(
    () => (selectedCategory === "Tous" ? searchSymptoms(searchQuery) : []),
    [searchQuery, selectedCategory]
  );

  const featuredMedicines = useMemo(
    () => FEATURED_IDS.map((id) => MEDICINES.find((m) => m.id === id)).filter((m): m is Medicine => !!m),
    []
  );

  const handleSearchFocus = () => setIsSearching(true);
  const handleClear = () => {
    setSearchQuery("");
    if (selectedCategory === "Tous") setIsSearching(false);
  };

  const guardPharmacies = PHARMACIES.filter((p) => p.isGuard);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={isSearching ? [1] : []}
      >
        <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: C.primary }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: "rgba(255,255,255,0.8)", fontFamily: "Inter_400Regular" }]}>
                Bonjour 👋
              </Text>
              <Text style={[styles.tagline, { color: "#FFF", fontFamily: "Inter_700Bold" }]}>
                Trouvez vos médicaments
              </Text>
            </View>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => router.push("/notifications")}
            >
              <Feather name="bell" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={(t) => {
                setSearchQuery(t);
                if (t.length > 0) setIsSearching(true);
              }}
              onClear={handleClear}
              placeholder="Médicament ou symptôme (fièvre, toux…)"
              autoFocus={false}
            />
          </View>
        </View>

        <View style={[styles.categoryWrapper, { backgroundColor: C.background }]}>
          <CategoryFilter
            categories={CATEGORIES}
            selected={selectedCategory}
            onSelect={(cat) => {
              setSelectedCategory(cat);
              setIsSearching(cat !== "Tous" || searchQuery.length > 0);
            }}
          />
        </View>

        {isSearching ? (
          <View style={styles.section}>
            {symptomResults.map((symptom) => (
              <SymptomCard key={symptom.id} symptom={symptom} />
            ))}
            {searchResults.length === 0 && symptomResults.length === 0 ? (
              <View style={styles.empty}>
                <Feather name="search" size={40} color={C.textMuted} />
                <Text style={[styles.emptyTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                  Aucun résultat
                </Text>
                <Text style={[styles.emptyText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  Essayez un autre nom de médicament
                </Text>
              </View>
            ) : (
              searchResults.map((med) => {
                const pharmacyCount = getPharmaciesForMedicine(med.id).filter(p => p.stock.available).length;
                return (
                  <MedicineCard
                    key={med.id}
                    medicine={med}
                    availableAt={pharmacyCount}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push(`/medicine/${med.id}`);
                    }}
                  />
                );
              })
            )}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Inter_700Bold" }]}>
                Accès rapide
              </Text>
              <View style={styles.quickGrid}>
                {QUICK_ACTIONS.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[styles.quickBtn, { backgroundColor: action.bg }]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      if (action.id === "guard") router.push("/guard-pharmacies");
                      else if (action.id === "search") setIsSearching(true);
                      else if (action.id === "emergency") router.push("/emergency");
                      else if (action.id === "scan") router.push("/scan-prescription");
                    }}
                    activeOpacity={0.7}
                  >
                    <Feather name={action.icon} size={24} color={action.color} />
                    <Text style={[styles.quickLabel, { color: action.color, fontFamily: "Inter_600SemiBold" }]}>
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Inter_700Bold" }]}>
                  Médicaments populaires
                </Text>
                <TouchableOpacity onPress={() => setIsSearching(true)}>
                  <Text style={[styles.seeAll, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
                    Voir tout
                  </Text>
                </TouchableOpacity>
              </View>
              {featuredMedicines.map((med) => {
                const pharmacyCount = getPharmaciesForMedicine(med.id).filter(p => p.stock.available).length;
                return (
                  <MedicineCard
                    key={med.id}
                    medicine={med}
                    availableAt={pharmacyCount}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push(`/medicine/${med.id}`);
                    }}
                  />
                );
              })}
            </View>

            <View style={[styles.section, { paddingBottom: Platform.OS === "web" ? 100 : 20 }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Inter_700Bold" }]}>
                  Pharmacies de garde
                </Text>
                <TouchableOpacity onPress={() => router.push("/guard-pharmacies")}>
                  <Text style={[styles.seeAll, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
                    Voir tout
                  </Text>
                </TouchableOpacity>
              </View>
              {guardPharmacies.map((pharmacy) => (
                <TouchableOpacity
                  key={pharmacy.id}
                  style={[styles.guardCard, { backgroundColor: C.surface }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/pharmacy/${pharmacy.id}`);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.guardIcon, { backgroundColor: "#FEF3C7" }]}>
                    <Feather name="moon" size={20} color="#F59E0B" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.guardName, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                      {pharmacy.name}
                    </Text>
                    <Text style={[styles.guardAddr, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                      {pharmacy.address}
                    </Text>
                  </View>
                  <View style={[styles.openBadge, { backgroundColor: C.successLight }]}>
                    <Text style={[styles.openText, { color: C.success, fontFamily: "Inter_600SemiBold" }]}>
                      Ouvert
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  greeting: { fontSize: 13, marginBottom: 2 },
  tagline: { fontSize: 22 },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: { marginTop: 4 },
  categoryWrapper: { zIndex: 10 },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18 },
  seeAll: { fontSize: 14 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 4 },
  quickBtn: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  quickLabel: { fontSize: 13 },
  guardCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  guardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  guardName: { fontSize: 14, marginBottom: 2 },
  guardAddr: { fontSize: 12 },
  openBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  openText: { fontSize: 11 },
  empty: { alignItems: "center", paddingVertical: 48, gap: 8 },
  emptyTitle: { fontSize: 18 },
  emptyText: { fontSize: 14, textAlign: "center" },
});
