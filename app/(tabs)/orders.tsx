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

import OrderCard from "@/components/OrderCard";
import Colors from "@/constants/colors";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { formatPrice } from "@/data/mockData";

export default function OrdersScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orders } = useOrders();
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();
  const [tab, setTab] = useState<"cart" | "history">("cart");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: C.surface }]}>
        <Text style={[styles.title, { color: C.text, fontFamily: "Inter_700Bold" }]}>
          Mes commandes
        </Text>
        <View style={[styles.tabs, { backgroundColor: C.background }]}>
          <TouchableOpacity
            style={[styles.tab, tab === "cart" && { backgroundColor: C.primary }]}
            onPress={() => setTab("cart")}
          >
            <Text
              style={[
                styles.tabLabel,
                { color: tab === "cart" ? "#FFF" : C.textSecondary, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              Panier {totalItems > 0 ? `(${totalItems})` : ""}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === "history" && { backgroundColor: C.primary }]}
            onPress={() => setTab("history")}
          >
            <Text
              style={[
                styles.tabLabel,
                { color: tab === "history" ? "#FFF" : C.textSecondary, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              Historique
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {tab === "cart" ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Platform.OS === "web" ? 120 : 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {items.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="shopping-cart" size={48} color={C.textMuted} />
              <Text style={[styles.emptyTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                Panier vide
              </Text>
              <Text style={[styles.emptyText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                Recherchez des médicaments et ajoutez-les à votre panier
              </Text>
              <TouchableOpacity
                style={[styles.shopBtn, { backgroundColor: C.primary }]}
                onPress={() => router.push("/")}
              >
                <Text style={[styles.shopBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                  Rechercher
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {items.map((item) => (
                <View key={item.id} style={[styles.cartItem, { backgroundColor: C.surface }]}>
                  <View style={styles.cartItemTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cartMedName, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                        {item.medicineName}
                      </Text>
                      <Text style={[styles.cartPharmName, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                        {item.pharmacyName}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        removeItem(item.id);
                      }}
                    >
                      <Feather name="trash-2" size={18} color={C.danger} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cartItemBottom}>
                    <View style={[styles.qtyRow, { borderColor: C.border }]}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Feather name="minus" size={16} color={C.textSecondary} />
                      </TouchableOpacity>
                      <Text style={[styles.qty, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Feather name="plus" size={16} color={C.textSecondary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.cartPrice, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={[styles.totalCard, { backgroundColor: C.surface }]}>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                    Sous-total
                  </Text>
                  <Text style={[styles.totalValue, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                    {formatPrice(totalPrice)}
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: C.border }]} />
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: C.text, fontFamily: "Inter_700Bold" }]}>
                    Total
                  </Text>
                  <Text style={[styles.grandTotal, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
                    {formatPrice(totalPrice)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.orderBtn, { backgroundColor: C.primary }]}
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    router.push("/checkout");
                  }}
                >
                  <Text style={[styles.orderBtnText, { fontFamily: "Inter_700Bold" }]}>
                    Commander
                  </Text>
                  <Feather name="arrow-right" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Platform.OS === "web" ? 120 : 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {orders.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="package" size={48} color={C.textMuted} />
              <Text style={[styles.emptyTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                Aucune commande
              </Text>
              <Text style={[styles.emptyText, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                Votre historique de commandes apparaîtra ici
              </Text>
            </View>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/order/${order.id}`);
                }}
              />
            ))
          )}
        </ScrollView>
      )}
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
  tabs: { flexDirection: "row", borderRadius: 12, padding: 4, gap: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  tabLabel: { fontSize: 14 },
  content: { padding: 16 },
  empty: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 20 },
  emptyText: { fontSize: 14, textAlign: "center", paddingHorizontal: 32 },
  shopBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  shopBtnText: { color: "#FFF", fontSize: 15 },
  cartItem: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  cartItemTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  cartMedName: { fontSize: 15, marginBottom: 2 },
  cartPharmName: { fontSize: 12 },
  cartItemBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  qtyBtn: { padding: 8, paddingHorizontal: 12 },
  qty: { paddingHorizontal: 12, fontSize: 15 },
  cartPrice: { fontSize: 16 },
  totalCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 14 },
  grandTotal: { fontSize: 20 },
  divider: { height: 1, marginVertical: 12 },
  orderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 14,
    gap: 8,
  },
  orderBtnText: { color: "#FFF", fontSize: 17 },
});
