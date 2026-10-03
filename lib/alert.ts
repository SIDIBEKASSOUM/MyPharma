import { Alert, AlertButton, Platform } from "react-native";

/**
 * Alert.alert is a no-op on react-native-web, so fall back to the browser's
 * native dialogs there. Two or more buttons are treated as a confirmation:
 * the first "cancel" button dismisses, any other button confirms.
 */
export function showAlert(
  title: string,
  message?: string,
  buttons: AlertButton[] = [{ text: "OK" }]
) {
  if (Platform.OS !== "web") {
    Alert.alert(title, message, buttons);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;
  const actions = buttons.filter((b) => b.style !== "cancel");

  if (buttons.length > 1) {
    if (window.confirm(text)) actions[0]?.onPress?.();
    else buttons.find((b) => b.style === "cancel")?.onPress?.();
    return;
  }

  window.alert(text);
  buttons[0]?.onPress?.();
}
