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

import Colors from "@/constants/colors";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { formatPrice } from "@/data/mockData";
import { showAlert } from "@/lib/alert";

const PAYMENT_METHODS = [
  { id: "orange", label: "Orange Money", icon: "smartphone" as const, color: "#F97316" },
  { id: "mtn", label: "MTN Money", icon: "smartphone" as const, color: "#EAB308" },
  { id: "moov", label: "Moov Money", icon: "smartphone" as const, color: "#3B82F6" },
  { id: "cash", label: "Paiement à la livraison", icon: "truck" as const, color: "#6B7280" },
];

const DELIVERY_OPTIONS = [
  { id: "pickup", label: "Retrait en pharmacie", icon: "map-pin" as const, extra: "Gratuit" },
  { id: "delivery", label: "Livraison à domicile", icon: "truck" as const, extra: "1 000 FCFA" },
];

export default function CheckoutScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [payment, setPayment] = useState("orange");
  const [delivery, setDelivery] = useState("pickup");
  const [loading, setLoading] = useState(false);

  const deliveryCost = delivery === "delivery" ? 1000 : 0;
  const grandTotal = totalPrice + deliveryCost;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const pharmacyId = items[0]?.pharmacyId ?? "";
  const pharmacyName = items[0]?.pharmacyName ?? "";

  const prescriptionItems = items.filter((i) => i.prescription);
  const [prescriptionConfirmed, setPrescriptionConfirmed] = useState(false);
  const blockedByPrescription = prescriptionItems.length > 0 && !prescriptionConfirmed;

  const handleOrder = async () => {
    if (items.length === 0 || blockedByPrescription) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const order = placeOrder(pharmacyId, pharmacyName, items, grandTotal);
    clearCart();
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showAlert(
      "Commande confirmée !",
      `Votre commande #${order.id.slice(-6).toUpperCase()} a été passée avec succès.`,
      [{ text: "Voir mes commandes", onPress: () => router.replace("/(tabs)/orders") }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: C.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text, fontFamily: "Inter_700Bold" }]}>
          Commander
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === "web" ? 120 : 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: C.text, fontFamily: "Inter_700Bold" }]}>
          Récapitulatif
        </Text>
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={[styles.itemName, { color: C.text, fontFamily: "Inter_500Medium" }]} numberOfLines={1}>
                {item.medicineName}
              </Text>
              <Text style={[styles.itemQty, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                x{item.quantity}
              </Text>
              <Text style={[styles.itemPrice, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: C.text, fontFamily: "Inter_700Bold" }]}>
          Mode de livraison
        </Text>
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          {DELIVERY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={styles.optionRow}
              onPress={() => setDelivery(opt.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.radio, { borderColor: delivery === opt.id ? C.primary : C.border }]}>
                {delivery === opt.id && (
                  <View style={[styles.radioDot, { backgroundColor: C.primary }]} />
                )}
              </View>
              <Feather name={opt.icon} size={18} color={delivery === opt.id ? C.primary : C.textMuted} />
              <Text style={[styles.optionLabel, { color: C.text, fontFamily: "Inter_500Medium" }]}>
                {opt.label}
              </Text>
              <Text style={[styles.optionExtra, { color: delivery === opt.id ? C.primary : C.textMuted, fontFamily: "Inter_600SemiBold" }]}>
                {opt.extra}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: C.text, fontFamily: "Inter_700Bold" }]}>
          Paiement
        </Text>
        <View style={[styles.card, { backgroundColor: C.surface }]}>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.optionRow}
              onPress={() => setPayment(method.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.radio, { borderColor: payment === method.id ? C.primary : C.border }]}>
                {payment === method.id && (
                  <View style={[styles.radioDot, { backgroundColor: C.primary }]} />
                )}
              </View>
              <Feather name={method.icon} size={18} color={method.color} />
              <Text style={[styles.optionLabel, { color: C.text, fontFamily: "Inter_500Medium" }]}>
                {method.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.totalCard, { backgroundColor: C.surface }]}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Sous-total
            </Text>
            <Text style={[styles.totalValue, { color: C.text, fontFamily: "Inter_500Medium" }]}>
              {formatPrice(totalPrice)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Livraison
            </Text>
            <Text style={[styles.totalValue, { color: C.text, fontFamily: "Inter_500Medium" }]}>
              {deliveryCost === 0 ? "Gratuit" : formatPrice(deliveryCost)}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: C.border }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.grandLabel, { color: C.text, fontFamily: "Inter_700Bold" }]}>
              Total
            </Text>
            <Text style={[styles.grandValue, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
              {formatPrice(grandTotal)}
            </Text>
          </View>
        </View>

        {prescriptionItems.length > 0 && (
          <TouchableOpacity
            style={[styles.rxBox, { backgroundColor: C.warningLight }]}
            onPress={() => setPrescriptionConfirmed((v) => !v)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: prescriptionConfirmed }}
          >
            <View
              style={[
                styles.rxCheck,
                {
                  borderColor: prescriptionConfirmed ? C.primary : C.warning,
                  backgroundColor: prescriptionConfirmed ? C.primary : "transparent",
                },
              ]}
            >
              {prescriptionConfirmed && <Feather name="check" size={14} color="#FFF" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rxTitle, { fontFamily: "Inter_600SemiBold" }]}>
                Ordonnance requise
              </Text>
              <Text style={[styles.rxText, { fontFamily: "Inter_400Regular" }]}>
                Délivrés uniquement sur ordonnance : {prescriptionItems.map((i) => i.medicineName).join(", ")}.
                Je présenterai l'ordonnance originale à la pharmacie au moment du retrait ou de la livraison.
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.confirmBtn,
            { backgroundColor: loading || blockedByPrescription ? C.textMuted : C.primary },
          ]}
          onPress={handleOrder}
          disabled={loading || blockedByPrescription}
        >
          <Feather name="check-circle" size={20} color="#FFF" />
          <Text style={[styles.confirmText, { fontFamily: "Inter_700Bold" }]}>
            {loading ? "Traitement..." : "Confirmer la commande"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  content: { padding: 16, gap: 8 },
  sectionLabel: { fontSize: 16, marginTop: 8, marginBottom: 4 },
  card: {
    borderRadius: 16,
    padding: 12,
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
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 8 },
  itemName: { flex: 1, fontSize: 14 },
  itemQty: { fontSize: 13 },
  itemPrice: { fontSize: 14 },
  optionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  optionLabel: { flex: 1, fontSize: 14 },
  optionExtra: { fontSize: 13 },
  totalCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
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
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 14 },
  divider: { height: 1, marginVertical: 8 },
  grandLabel: { fontSize: 16 },
  grandValue: { fontSize: 20 },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  confirmText: { color: "#FFF", fontSize: 17 },
  rxBox: { flexDirection: "row", gap: 12, padding: 14, borderRadius: 14, marginTop: 8 },
  rxCheck: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  rxTitle: { color: "#92400E", fontSize: 14, marginBottom: 2 },
  rxText: { color: "#92400E", fontSize: 13, lineHeight: 19 },
});
