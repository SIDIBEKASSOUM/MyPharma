import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "@/constants/colors";

interface InfoSectionProps {
  title: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  /** Plain text, or a list rendered as bullet points. */
  content: string | string[];
  defaultOpen?: boolean;
}

export default function InfoSection({ title, icon, content, defaultOpen = false }: InfoSectionProps) {
  const C = Colors.light;
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View style={[styles.card, { backgroundColor: C.surface }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setOpen((o) => !o)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <Feather name={icon} size={18} color={C.primary} />
        <Text style={[styles.title, { color: C.text, fontFamily: "Inter_600SemiBold" }]}>{title}</Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={18} color={C.textMuted} />
      </TouchableOpacity>

      {open && (
        <View style={styles.body}>
          {Array.isArray(content) ? (
            content.map((line) => (
              <View key={line} style={styles.bulletRow}>
                <Text style={[styles.bullet, { color: C.textMuted }]}>•</Text>
                <Text style={[styles.text, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  {line}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.text, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {content}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, marginBottom: 8, overflow: "hidden" },
  header: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14 },
  title: { flex: 1, fontSize: 15 },
  body: { paddingHorizontal: 14, paddingBottom: 14, gap: 6 },
  bulletRow: { flexDirection: "row", gap: 8 },
  bullet: { fontSize: 14, lineHeight: 21 },
  text: { flex: 1, fontSize: 14, lineHeight: 21 },
});
