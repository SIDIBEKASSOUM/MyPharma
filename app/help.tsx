import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import InfoSection from "@/components/InfoSection";
import SimpleScreen from "@/components/SimpleScreen";
import Colors from "@/constants/colors";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/constants/appInfo";

const FAQ: Array<{ question: string; answer: string }> = [
  {
    question: "Comment commander ?",
    answer:
      "Cherchez un médicament (ou scannez votre ordonnance), choisissez une pharmacie qui l'a en stock et ajoutez-le au panier. Dans l'onglet Commandes, appuyez sur « Commander », choisissez retrait ou livraison, puis confirmez.",
  },
  {
    question: "Pourquoi une ordonnance m'est-elle demandée ?",
    answer:
      "Certains médicaments ne sont délivrés que sur ordonnance. Vous pouvez les commander, mais vous devrez présenter l'ordonnance originale à la pharmacie, au retrait ou à la livraison.",
  },
  {
    question: "Puis-je commander dans plusieurs pharmacies à la fois ?",
    answer:
      "Non : une commande concerne une seule pharmacie. Si vous ajoutez un article d'une autre pharmacie, l'application vous propose de vider le panier.",
  },
  {
    question: "Comment annuler une commande ?",
    answer:
      "Ouvrez la commande depuis l'onglet Commandes, puis appuyez sur « Annuler la commande ». C'est possible tant que la pharmacie ne l'a pas préparée.",
  },
  {
    question: "Que fait le scan d'ordonnance ?",
    answer:
      "L'application lit la photo de votre ordonnance et retrouve les médicaments dans le catalogue. La lecture automatique peut se tromper : vérifiez chaque médicament et son dosage. Le pharmacien a toujours le dernier mot.",
  },
  {
    question: "Le paiement est-il réel ?",
    answer:
      "Dans cette version de démonstration, le paiement est simulé : aucun argent n'est prélevé.",
  },
  {
    question: "Que faire en cas d'urgence ?",
    answer:
      "Appuyez sur « Urgence » sur l'écran d'accueil pour appeler le SAMU ou les pompiers, ou pour trouver une pharmacie de garde. Ne passez pas par l'application en cas de danger vital.",
  },
];

export default function HelpScreen() {
  const C = Colors.light;
  const router = useRouter();

  return (
    <SimpleScreen title="Aide et support">
      <Text style={[styles.heading, { color: C.text, fontFamily: "Inter_700Bold" }]}>
        Questions fréquentes
      </Text>
      {FAQ.map((item) => (
        <InfoSection key={item.question} title={item.question} icon="help-circle" content={item.answer} />
      ))}

      <View style={[styles.notice, { backgroundColor: C.dangerLight }]}>
        <Feather name="alert-circle" size={18} color={C.danger} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.noticeText, { color: "#991B1B", fontFamily: "Inter_600SemiBold" }]}>
            Un problème de santé ?
          </Text>
          <Text style={[styles.noticeText, { color: "#991B1B", fontFamily: "Inter_400Regular" }]}>
            Cette application ne remplace pas un médecin. En cas de doute ou d'urgence, appelez le 185 (SAMU).
          </Text>
          <TouchableOpacity onPress={() => router.push("/emergency")} style={styles.link}>
            <Text style={[styles.linkText, { color: C.danger, fontFamily: "Inter_600SemiBold" }]}>
              Ouvrir l'écran Urgence
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {(SUPPORT_EMAIL || SUPPORT_PHONE) && (
        <>
          <Text style={[styles.heading, { color: C.text, fontFamily: "Inter_700Bold" }]}>
            Nous contacter
          </Text>
          {SUPPORT_EMAIL ? (
            <TouchableOpacity
              style={[styles.contactBtn, { backgroundColor: C.primaryLight }]}
              onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
            >
              <Feather name="mail" size={18} color={C.primaryDark} />
              <Text style={[styles.contactText, { color: C.primaryDark, fontFamily: "Inter_600SemiBold" }]}>
                {SUPPORT_EMAIL}
              </Text>
            </TouchableOpacity>
          ) : null}
          {SUPPORT_PHONE ? (
            <TouchableOpacity
              style={[styles.contactBtn, { backgroundColor: C.primaryLight }]}
              onPress={() => Linking.openURL(`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`)}
            >
              <Feather name="phone" size={18} color={C.primaryDark} />
              <Text style={[styles.contactText, { color: C.primaryDark, fontFamily: "Inter_600SemiBold" }]}>
                {SUPPORT_PHONE}
              </Text>
            </TouchableOpacity>
          ) : null}
        </>
      )}
    </SimpleScreen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 16, marginTop: 4 },
  notice: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 14, marginTop: 8 },
  noticeText: { fontSize: 13, lineHeight: 19 },
  link: { marginTop: 8 },
  linkText: { fontSize: 14 },
  contactBtn: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 14 },
  contactText: { fontSize: 15 },
});
