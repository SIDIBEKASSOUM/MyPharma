import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import MedicineCard from "@/components/MedicineCard";
import Colors from "@/constants/colors";
import { MEDICINES, Symptom, countAvailablePharmacies } from "@/data/mockData";

interface SymptomCardProps {
  symptom: Symptom;
}

/** Self-care advice for a symptom, warning signs, and the catalogue products usually used. */
export default function SymptomCard({ symptom }: SymptomCardProps) {
  const C = Colors.light;
  const router = useRouter();
  const medicines = symptom.medicineIds
    .map((id) => MEDICINES.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => !!m);

  return (
    <View style={[styles.card, { backgroundColor: C.surface }]}>
      <View style={styles.titleRow}>
        <View style={[styles.icon, { backgroundColor: C.primaryLight }]}>
          <Feather name="thermometer" size={18} color={C.primaryDark} />
        </View>
        <Text style={[styles.title, { color: C.text, fontFamily: "Inter_700Bold" }]}>{symptom.label}</Text>
      </View>

      <Text style={[styles.advice, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
        {symptom.advice}
      </Text>

      <View style={[styles.warning, { backgroundColor: C.dangerLight }]}>
        <View style={styles.warningTitleRow}>
          <Feather name="alert-triangle" size={15} color={C.danger} />
          <Text style={[styles.warningTitle, { color: "#991B1B", fontFamily: "Inter_600SemiBold" }]}>
            Consultez un médecin si :
          </Text>
        </View>
        {symptom.seeDoctor.map((line) => (
          <View key={line} style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: "#991B1B" }]}>•</Text>
            <Text style={[styles.warningText, { color: "#991B1B", fontFamily: "Inter_400Regular" }]}>{line}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.subtitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
        Produits souvent utilisés
      </Text>
      {medicines.map((medicine) => (
        <MedicineCard
          key={medicine.id}
          medicine={medicine}
          availableAt={countAvailablePharmacies(medicine.id)}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/medicine/${medicine.id}`);
          }}
        />
      ))}
      <Text style={[styles.disclaimer, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
        Conseils généraux : demandez l'avis d'un pharmacien avant de vous soigner.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, marginBottom: 14 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  icon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, fontSize: 18 },
  advice: { fontSize: 14, lineHeight: 21, marginBottom: 12 },
  warning: { borderRadius: 12, padding: 12, marginBottom: 14, gap: 4 },
  warningTitleRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
  warningTitle: { fontSize: 14 },
  bulletRow: { flexDirection: "row", gap: 8 },
  bullet: { fontSize: 13, lineHeight: 19 },
  warningText: { flex: 1, fontSize: 13, lineHeight: 19 },
  subtitle: { fontSize: 15, marginBottom: 8 },
  disclaimer: { fontSize: 12, marginTop: 2 },
});
