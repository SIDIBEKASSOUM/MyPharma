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
import { Pharmacy } from "@/data/mockData";

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  price?: number;
  available?: boolean;
  onPress: () => void;
  unit?: string;
}

export default function PharmacyCard({
  pharmacy,
  price,
  available,
  onPress,
  unit,
}: PharmacyCardProps) {
  const C = Colors.light;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: pharmacy.isOpen ? C.primaryLight : "#F3F4F6" },
          ]}
        >
          <Feather
            name="map-pin"
            size={20}
            color={pharmacy.isOpen ? C.primary : C.textMuted}
          />
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: C.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={1}>
              {pharmacy.name}
            </Text>
            {pharmacy.isGuard && (
              <View style={[styles.guardBadge, { backgroundColor: C.warningLight }]}>
                <Text style={[styles.guardText, { color: C.warning, fontFamily: "Inter_600SemiBold" }]}>
                  Garde
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.address, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
            {pharmacy.address}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={11} color={C.textMuted} />
              <Text style={[styles.metaText, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                {pharmacy.openHours}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="star" size={11} color={C.warning} />
              <Text style={[styles.metaText, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                {pharmacy.rating}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.right}>
          {price !== undefined && (
            <Text style={[styles.price, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
              {price.toLocaleString("fr-FR")}
            </Text>
          )}
          {price !== undefined && (
            <Text style={[styles.fcfa, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
              FCFA/{unit}
            </Text>
          )}
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  available !== undefined
                    ? available
                      ? C.success
                      : C.danger
                    : pharmacy.isOpen
                    ? C.success
                    : C.danger,
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  row: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
  name: { fontSize: 14, flex: 1 },
  guardBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  guardText: { fontSize: 10 },
  address: { fontSize: 12, marginBottom: 4 },
  metaRow: { flexDirection: "row", gap: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: 11 },
  right: { alignItems: "flex-end", gap: 2, marginLeft: 8 },
  price: { fontSize: 16 },
  fcfa: { fontSize: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
});
