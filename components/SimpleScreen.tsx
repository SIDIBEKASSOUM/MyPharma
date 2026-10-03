import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

interface SimpleScreenProps {
  title: string;
  children: React.ReactNode;
}

/** Standard stacked screen: back button, centred title, scrolling content. */
export default function SimpleScreen({ title, children }: SimpleScreenProps) {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16, backgroundColor: C.surface }]}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Retour">
          <Feather name="arrow-left" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text, fontFamily: "Inter_700Bold" }]}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 120 : 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
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
  },
  title: { fontSize: 18 },
  content: { padding: 16, gap: 12 },
});
