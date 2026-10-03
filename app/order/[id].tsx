import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { canCancel, useOrders } from "@/context/OrdersContext";
import { formatPrice } from "@/data/mockData";
import { showAlert } from "@/lib/alert";

const STATUS_STEPS = ["pending", "confirmed", "ready", "completed"];
const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  ready: "Prête",
  completed: "Terminée",
  cancelled: "Annulée",
};

export default function OrderDetailScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, cancelOrder } = useOrders();

  const order = useMemo(() => orders.find((o) => o.id === id), [orders, id]);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  if (!order) {
    return (
      <View style={[styles.center, { backgroundColor: C.background }]}>
        <Text style={{ color: C.text, fontFamily: "Inter_400Regular" }}>Commande introuvable</Text>
      </View>
    );
  }

  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = order.totalPrice - subtotal;
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: C.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text, fontFamily: "Inter_700Bold" }]}>
          Commande
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === "web" ? 100 : 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          <Text style={[styles.orderId, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
            #{order.id.slice(-6).toUpperCase()}
          </Text>
          <Text style={[styles.pharmName, { color: C.text, fontFamily: "Inter_700Bold" }]}>
            {order.pharmacyName}
          </Text>
          <Text style={[styles.date, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
            {new Date(order.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        {!isCancelled && (
          <View style={[styles.card, { backgroundColor: C.surface }]}>
            <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Inter_700Bold" }]}>
              Statut de la commande
            </Text>
            <View style={styles.stepsContainer}>
              {STATUS_STEPS.map((step, i) => {
                const active = i <= currentStep;
                const isLast = i === STATUS_STEPS.length - 1;
                return (
                  <View key={step} style={styles.stepItem}>
                    <View style={styles.stepLeft}>
                      <View
                        style={[
                          styles.stepCircle,
                          {
                            backgroundColor: active ? C.primary : C.border,
                            borderColor: active ? C.primary : C.border,
                          },
                        ]}
                      >
                        {active && <Feather name="check" size={12} color="#FFF" />}
                      </View>
                      {!isLast && (
                        <View
                          style={[
                            styles.stepLine,
                            { backgroundColor: i < currentStep ? C.primary : C.border },
                          ]}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        {
                          color: active ? C.text : C.textMuted,
                          fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular",
                        },
                      ]}
                    >
                      {STATUS_LABELS[step]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: C.surface }]}>
          <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Inter_700Bold" }]}>
            Articles
          </Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { color: C.text, fontFamily: "Inter_500Medium" }]}>
                  {item.medicineName}
                </Text>
                <Text style={[styles.itemQty, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                  {item.quantity} × {formatPrice(item.price)}
                </Text>
              </View>
              <Text style={[styles.itemTotal, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          {deliveryFee > 0 && (
            <>
              <View style={styles.feeRow}>
                <Text style={[styles.feeLabel, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  Sous-total
                </Text>
                <Text style={[styles.feeValue, { color: C.text, fontFamily: "Inter_500Medium" }]}>
                  {formatPrice(subtotal)}
                </Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={[styles.feeLabel, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  Livraison
                </Text>
                <Text style={[styles.feeValue, { color: C.text, fontFamily: "Inter_500Medium" }]}>
                  {formatPrice(deliveryFee)}
                </Text>
              </View>
            </>
          )}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: C.text, fontFamily: "Inter_700Bold" }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
              {formatPrice(order.totalPrice)}
            </Text>
          </View>
        </View>

        {isCancelled && (
          <View style={[styles.cancelledBanner, { backgroundColor: C.dangerLight }]}>
            <Feather name="x-circle" size={18} color={C.danger} />
            <Text style={[styles.cancelledText, { color: "#991B1B", fontFamily: "Inter_500Medium" }]}>
              Cette commande a été annulée.
            </Text>
          </View>
        )}

        {canCancel(order) && (
          <TouchableOpacity
            style={[styles.cancelBtn, { backgroundColor: C.dangerLight }]}
            activeOpacity={0.7}
            onPress={() =>
              showAlert(
                "Annuler la commande ?",
                `La commande #${order.id.slice(-6).toUpperCase()} chez ${order.pharmacyName} sera annulée.`,
                [
                  { text: "Garder la commande", style: "cancel" },
                  {
                    text: "Annuler la commande",
                    style: "destructive",
                    onPress: () => {
                      cancelOrder(order.id);
                    },
                  },
                ]
              )
            }
          >
            <Feather name="x" size={18} color={C.danger} />
            <Text style={[styles.cancelText, { color: C.danger, fontFamily: "Inter_600SemiBold" }]}>
              Annuler la commande
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  title: { fontSize: 18 },
  content: { padding: 16, gap: 12 },
  card: {
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  orderId: { fontSize: 12, marginBottom: 4 },
  pharmName: { fontSize: 18, marginBottom: 4 },
  date: { fontSize: 13 },
  sectionTitle: { fontSize: 16, marginBottom: 14 },
  stepsContainer: { gap: 0 },
  stepItem: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  stepLeft: { alignItems: "center" },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLine: { width: 2, height: 28, marginTop: 2 },
  stepLabel: { fontSize: 14, paddingVertical: 4, paddingTop: 2 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  itemName: { fontSize: 14, marginBottom: 2 },
  itemQty: { fontSize: 12 },
  itemTotal: { fontSize: 14 },
  divider: { height: 1, marginVertical: 10 },
  cancelledBanner: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 14 },
  cancelledText: { flex: 1, fontSize: 14 },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 14,
  },
  cancelText: { fontSize: 15 },
  feeRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  feeLabel: { fontSize: 14 },
  feeValue: { fontSize: 14 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  totalLabel: { fontSize: 16 },
  totalValue: { fontSize: 18 },
});
