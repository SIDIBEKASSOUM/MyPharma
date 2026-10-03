import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { showAlert } from "@/lib/alert";

export default function ProfileScreen() {
  const C = Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("kofi@example.com");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setError("");
    const ok = await signIn(email, password);
    setLoading(false);
    if (!ok) {
      setError("Email ou mot de passe incorrect");
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !phone || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setError("");
    await signUp(name, email, phone, password);
    setLoading(false);
  };

  const handleSignOut = () => {
    showAlert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          signOut();
        },
      },
    ]);
  };

  const MENU_ITEMS = [
    { icon: "package" as const, label: "Mes commandes", onPress: () => router.push("/(tabs)/orders?tab=history") },
    { icon: "heart" as const, label: "Médicaments favoris", onPress: () => router.push("/favorites") },
    { icon: "bell" as const, label: "Notifications", onPress: () => router.push("/notifications") },
    { icon: "shield" as const, label: "Confidentialité", onPress: () => router.push("/privacy") },
    { icon: "help-circle" as const, label: "Aide & Support", onPress: () => router.push("/help") },
    { icon: "info" as const, label: "À propos", onPress: () => router.push("/about") },
  ];

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: C.background }]}>
        <ScrollView
          contentContainerStyle={[styles.authContent, { paddingTop: topPadding + 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.logoBox, { backgroundColor: C.primaryLight }]}>
            <Text style={styles.logoEmoji}>💊</Text>
          </View>
          <Text style={[styles.authTitle, { color: C.text, fontFamily: "Inter_700Bold" }]}>
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </Text>
          <Text style={[styles.authSubtitle, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {mode === "login"
              ? "Connectez-vous pour accéder à votre compte"
              : "Rejoignez MyPharma gratuitement"}
          </Text>

          {mode === "register" && (
            <View style={[styles.inputWrapper, { borderColor: C.border, backgroundColor: C.surface }]}>
              <Feather name="user" size={18} color={C.textMuted} />
              <TextInput
                style={[styles.input, { color: C.text, fontFamily: "Inter_400Regular" }]}
                placeholder="Nom complet"
                placeholderTextColor={C.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={[styles.inputWrapper, { borderColor: C.border, backgroundColor: C.surface }]}>
            <Feather name="mail" size={18} color={C.textMuted} />
            <TextInput
              style={[styles.input, { color: C.text, fontFamily: "Inter_400Regular" }]}
              placeholder="Email"
              placeholderTextColor={C.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {mode === "register" && (
            <View style={[styles.inputWrapper, { borderColor: C.border, backgroundColor: C.surface }]}>
              <Feather name="phone" size={18} color={C.textMuted} />
              <TextInput
                style={[styles.input, { color: C.text, fontFamily: "Inter_400Regular" }]}
                placeholder="Téléphone"
                placeholderTextColor={C.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          )}

          <View style={[styles.inputWrapper, { borderColor: C.border, backgroundColor: C.surface }]}>
            <Feather name="lock" size={18} color={C.textMuted} />
            <TextInput
              style={[styles.input, { color: C.text, fontFamily: "Inter_400Regular" }]}
              placeholder="Mot de passe"
              placeholderTextColor={C.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: C.dangerLight }]}>
              <Text style={[styles.errorText, { color: C.danger, fontFamily: "Inter_400Regular" }]}>
                {error}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: loading ? C.textMuted : C.primary }]}
            onPress={mode === "login" ? handleSignIn : handleSignUp}
            disabled={loading}
          >
            <Text style={[styles.submitText, { fontFamily: "Inter_700Bold" }]}>
              {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer le compte"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            <Text style={[styles.switchText, { color: C.primary, fontFamily: "Inter_500Medium" }]}>
              {mode === "login"
                ? "Pas de compte ? S'inscrire"
                : "Déjà inscrit ? Se connecter"}
            </Text>
          </TouchableOpacity>

          {mode === "login" && (
            <View style={[styles.demoBox, { backgroundColor: C.primaryLight }]}>
              <Feather name="info" size={14} color={C.primary} />
              <Text style={[styles.demoText, { color: C.primary, fontFamily: "Inter_400Regular" }]}>
                Demo: kofi@example.com / password123
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.profileContent,
          { paddingTop: topPadding + 16, paddingBottom: Platform.OS === "web" ? 120 : 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: C.surface }]}>
          <View style={[styles.avatar, { backgroundColor: C.primaryLight }]}>
            <Text style={[styles.avatarInitial, { color: C.primary, fontFamily: "Inter_700Bold" }]}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.profileName, { color: C.text, fontFamily: "Inter_700Bold" }]}>
            {user.name}
          </Text>
          <Text style={[styles.profileEmail, { color: C.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {user.email}
          </Text>
          <Text style={[styles.profilePhone, { color: C.textMuted, fontFamily: "Inter_400Regular" }]}>
            {user.phone}
          </Text>
        </View>

        <View style={[styles.menuCard, { backgroundColor: C.surface }]}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                i < MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border },
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: C.primaryLight }]}>
                <Feather name={item.icon} size={18} color={C.primary} />
              </View>
              <Text style={[styles.menuLabel, { color: C.text, fontFamily: "Inter_500Medium" }]}>
                {item.label}
              </Text>
              <Feather name="chevron-right" size={16} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.signOutBtn, { backgroundColor: C.dangerLight }]}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={18} color={C.danger} />
          <Text style={[styles.signOutText, { color: C.danger, fontFamily: "Inter_600SemiBold" }]}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  authContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
    alignItems: "center",
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoEmoji: { fontSize: 36 },
  authTitle: { fontSize: 26, marginBottom: 8, textAlign: "center" },
  authSubtitle: { fontSize: 14, textAlign: "center", marginBottom: 28 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    width: "100%",
    marginBottom: 12,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, height: "100%" },
  errorBox: {
    padding: 12,
    borderRadius: 10,
    width: "100%",
    marginBottom: 12,
  },
  errorText: { fontSize: 13, textAlign: "center" },
  submitBtn: {
    width: "100%",
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  submitText: { color: "#FFF", fontSize: 16 },
  switchText: { fontSize: 14 },
  demoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  demoText: { fontSize: 12 },
  profileContent: { paddingHorizontal: 16 },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarInitial: { fontSize: 28 },
  profileName: { fontSize: 20, marginBottom: 4 },
  profileEmail: { fontSize: 14, marginBottom: 2 },
  profilePhone: { fontSize: 13 },
  menuCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: 15 },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 14,
  },
  signOutText: { fontSize: 16 },
});
