import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import InfoSection from "@/components/InfoSection";
import SimpleScreen from "@/components/SimpleScreen";
import Colors from "@/constants/colors";

// Describes what the app does today. DRAFT: have it reviewed legally before release.
const SECTIONS: Array<{ title: string; icon: React.ComponentProps<typeof Feather>["name"]; content: string[] }> = [
  {
    title: "Ce qui reste sur votre téléphone",
    icon: "smartphone",
    content: [
      "Votre profil, votre panier, vos commandes et vos médicaments favoris sont enregistrés sur votre téléphone.",
      "Dans cette version, ils ne sont envoyés à aucun serveur de compte. Se déconnecter supprime votre profil de l'appareil.",
    ],
  },
  {
    title: "Photos d'ordonnance",
    icon: "camera",
    content: [
      "L'appareil photo et la galerie ne sont utilisés que lorsque vous choisissez de scanner une ordonnance.",
      "La photo est envoyée au service d'analyse de l'application, puis à un prestataire d'intelligence artificielle (Anthropic) uniquement pour en lire les médicaments.",
      "Le service d'analyse ne conserve pas la photo. Choisissez des ordonnances dont vous acceptez le traitement de cette manière.",
    ],
  },
  {
    title: "Ce que nous ne faisons pas",
    icon: "slash",
    content: [
      "Nous ne vendons pas vos données et n'affichons pas de publicité.",
      "Nous ne suivons pas votre position.",
    ],
  },
  {
    title: "Vos droits",
    icon: "user-check",
    content: [
      "Vous pouvez supprimer à tout moment vos données locales en désinstallant l'application. La déconnexion supprime votre profil, mais pas l'historique de vos commandes.",
    ],
  },
];

export default function PrivacyScreen() {
  const C = Colors.light;

  return (
    <SimpleScreen title="Confidentialité">
      <View style={[styles.notice, { backgroundColor: C.warningLight }]}>
        <Feather name="info" size={18} color={C.warning} />
        <Text style={[styles.noticeText, { color: "#92400E", fontFamily: "Inter_400Regular" }]}>
          Résumé en langage simple. Les informations de santé sont sensibles : ce texte provisoire doit être
          validé juridiquement avant la publication de l'application.
        </Text>
      </View>
      {SECTIONS.map((section, i) => (
        <InfoSection
          key={section.title}
          title={section.title}
          icon={section.icon}
          content={section.content}
          defaultOpen={i === 0}
        />
      ))}
    </SimpleScreen>
  );
}

const styles = StyleSheet.create({
  notice: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 14 },
  noticeText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
