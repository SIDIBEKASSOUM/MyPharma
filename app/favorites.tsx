import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import MedicineCard from "@/components/MedicineCard";
import SimpleScreen from "@/components/SimpleScreen";
import Colors from "@/constants/colors";
import { useFavorites } from "@/context/FavoritesContext";
import { MEDICINES, countAvailablePharmacies } from "@/data/mockData";

export default function FavoritesScreen() {
  const C = Colors.light;
  const router = useRouter();
  const { favoriteIds } = useFavorites();

  const favorites = favoriteIds
    .map((id) => MEDICINES.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => !!m);

  return (
    <SimpleScreen title="Médicaments favoris">
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="heart" size={40} color={C.textMuted} />
          <Text style={[styles.emptyTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
            Aucun favori pour l'instant
          </Text>
          <Text style={[styles.emptyText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Touchez le cœur sur la fiche d'un médicament pour le retrouver ici.
          </Text>
        </View>
      ) : (
        favorites.map((medicine) => (
          <MedicineCard
            key={medicine.id}
            medicine={medicine}
            availableAt={countAvailablePharmacies(medicine.id)}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/medicine/${medicine.id}`);
            }}
          />
        ))
      )}
    </SimpleScreen>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 18 },
  emptyText: { fontSize: 14, textAlign: "center", paddingHorizontal: 24 },
});
