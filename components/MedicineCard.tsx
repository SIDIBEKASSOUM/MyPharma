import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import { Medicine } from "@/data/mockData";

interface MedicineCardProps {
  medicine: Medicine;
  availableAt?: number;
  onPress: () => void;
}

export default function MedicineCard({
  medicine,
  availableAt,
  onPress,
}: MedicineCardProps) {
  const C = Colors.light;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.emojiBox, { backgroundColor: C.primaryLight }]}>
        <Text style={styles.emoji}>{medicine.imageEmoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: C.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={1}>
          {medicine.name}
        </Text>
        <Text style={[styles.generic, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
          {medicine.genericName}
        </Text>
        <View style={styles.row}>
          <View style={[styles.catBadge, { backgroundColor: C.primaryLight }]}>
            <Text style={[styles.catText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
              {medicine.category}
            </Text>
          </View>
          {availableAt !== undefined && (
            <Text style={[styles.avail, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
              {availableAt} pharmacie{availableAt > 1 ? "s" : ""}
            </Text>
          )}
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={C.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  emojiBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  name: { fontSize: 15, marginBottom: 2 },
  generic: { fontSize: 12, marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catText: { fontSize: 11 },
  avail: { fontSize: 12 },
});
