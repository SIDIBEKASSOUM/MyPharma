import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import SimpleScreen from "@/components/SimpleScreen";
import Colors from "@/constants/colors";

export default function AboutScreen() {
  const C = Colors.light;
  const router = useRouter();
  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <SimpleScreen title="À propos">
      <View style={[styles.card, styles.center, { backgroundColor: C.surface }]}>
        <View style={[styles.logo, { backgroundColor: C.primaryLight }]}>
          <Feather name="plus-square" size={32} color={C.primaryDark} />
        </View>
        <Text style={[styles.name, { color: C.text, fontFamily: "Inter_700Bold" }]}>MyPharma</Text>
        <Text style={[styles.version, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
          Version {version}
        </Text>
        <Text style={[styles.text, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
          Trouvez vos médicaments, comparez les prix et commandez auprès des pharmacies près de chez vous.
        </Text>
      </View>

      <View style={[styles.notice, { backgroundColor: C.warningLight }]}>
        <Feather name="info" size={18} color={C.warning} />
        <Text style={[styles.noticeText, { color: "#92400E", fontFamily: "Inter_400Regular" }]}>
          Version de démonstration : les pharmacies, les prix et les stocks sont fictifs, et le paiement est
          simulé. Les informations sur les médicaments sont générales et ne remplacent pas l'avis d'un
          médecin ou d'un pharmacien.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.row, { backgroundColor: C.surface }]}
        onPress={() => router.push("/privacy")}
        activeOpacity={0.7}
      >
        <Feather name="shield" size={18} color={C.primary} />
        <Text style={[styles.rowText, { color: C.text, fontFamily: "Inter_500Medium" }]}>
          Politique de confidentialité
        </Text>
        <Feather name="chevron-right" size={16} color={C.textMuted} />
      </TouchableOpacity>
    </SimpleScreen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 20, gap: 6 },
  center: { alignItems: "center" },
  logo: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 22, marginTop: 6 },
  version: { fontSize: 13 },
  text: { fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 6 },
  notice: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 14 },
  noticeText: { flex: 1, fontSize: 13, lineHeight: 19 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 14 },
  rowText: { flex: 1, fontSize: 15 },
});
