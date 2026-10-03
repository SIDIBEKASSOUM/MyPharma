import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
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

const NOTIFICATIONS = [
  {
    id: "n1",
    type: "order",
    title: "Commande confirmée",
    body: "Votre commande #ORD2 a été confirmée par Pharmacie Cocody Centre",
    time: "Il y a 2h",
    read: false,
    icon: "check-circle" as const,
    color: "#10B981",
    bg: "#D1FAE5",
  },
  {
    id: "n2",
    type: "promo",
    title: "Promotion",
    body: "Paracétamol 500mg à -20% chez Pharmacie du Plateau ce weekend",
    time: "Il y a 5h",
    read: false,
    icon: "tag" as const,
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    id: "n3",
    type: "alert",
    title: "Médicament disponible",
    body: "Artémether-Luméfantrine est maintenant disponible chez Pharmacie Yopougon Express",
    time: "Hier",
    read: true,
    icon: "bell" as const,
    color: "#6366F1",
    bg: "#EDE9FE",
  },
  {
    id: "n4",
    type: "order",
    title: "Commande terminée",
    body: "Votre commande #ORD1 chez Pharmacie du Plateau est prête à être récupérée",
    time: "Il y a 7 jours",
    read: true,
    icon: "package" as const,
    color: "#6B7280",
    bg: "#F3F4F6",
  },
];

export default function NotificationsScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: C.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text, fontFamily: "Inter_700Bold" }]}>
          Notifications
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
        {NOTIFICATIONS.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={[
              styles.notifCard,
              {
                backgroundColor: notif.read ? C.surface : C.primaryLight,
              },
            ]}
            activeOpacity={0.7}
          >
            {!notif.read && (
              <View style={[styles.unreadDot, { backgroundColor: C.primary }]} />
            )}
            <View style={[styles.iconBox, { backgroundColor: notif.bg }]}>
              <Feather name={notif.icon} size={20} color={notif.color} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.notifHeader}>
                <Text style={[styles.notifTitle, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>
                  {notif.title}
                </Text>
                <Text style={[styles.notifTime, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
                  {notif.time}
                </Text>
              </View>
              <Text style={[styles.notifBody, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]} numberOfLines={2}>
                {notif.body}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
  content: { padding: 16, gap: 10 },
  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    padding: 14,
    position: "relative",
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
  unreadDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notifHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  notifTitle: { fontSize: 14, flex: 1, marginRight: 8 },
  notifTime: { fontSize: 11 },
  notifBody: { fontSize: 13, lineHeight: 18 },
});
