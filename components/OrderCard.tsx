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
import { Order } from "@/context/OrdersContext";
import { formatPrice } from "@/data/mockData";

const STATUS_CONFIG = {
  pending: { label: "En attente", color: "#F59E0B", bg: "#FEF3C7", icon: "clock" as const },
  confirmed: { label: "Confirmée", color: "#3B82F6", bg: "#DBEAFE", icon: "check-circle" as const },
  ready: { label: "Prête", color: "#10B981", bg: "#D1FAE5", icon: "package" as const },
  completed: { label: "Terminée", color: "#6B7280", bg: "#F3F4F6", icon: "check" as const },
  cancelled: { label: "Annulée", color: "#EF4444", bg: "#FEE2E2", icon: "x-circle" as const },
};

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const C = Colors.light;
  const status = STATUS_CONFIG[order.status];
  const date = new Date(order.createdAt);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.id, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
            Commande #{order.id.slice(-6).toUpperCase()}
          </Text>
          <Text style={[styles.pharmacy, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
            {order.pharmacyName}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Feather name={status.icon} size={11} color={status.color} />
          <Text style={[styles.statusText, { color: status.color, fontFamily: "Inter_600SemiBold" }]}>
            {status.label}
          </Text>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: C.border }]} />
      <View style={styles.footer}>
        <Text style={[styles.items, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
          {order.items.length} article{order.items.length > 1 ? "s" : ""}
        </Text>
        <Text style={[styles.date, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
          {date.toLocaleDateString("fr-FR")}
        </Text>
        <Text style={[styles.total, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
          {formatPrice(order.totalPrice)}
        </Text>
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  id: { fontSize: 11, marginBottom: 2 },
  pharmacy: { fontSize: 14 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 11 },
  divider: { height: 1, marginVertical: 10 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  items: { fontSize: 13 },
  date: { fontSize: 12 },
  total: { fontSize: 14 },
});
