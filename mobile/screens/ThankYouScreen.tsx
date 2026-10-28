import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { ActionButton } from "../components/AppControls";
import { C, styles } from "../theme";

export function ThankYouScreen({
  firstName,
  onReset,
}: {
  firstName: string;
  onReset: () => void;
}) {
  return (
    <View style={styles.center}>
      <View style={styles.thanksMark}>
        <Ionicons name="checkmark" size={28} color={C.lime} />
      </View>
      <Text style={styles.serifTitle}>Thank you, {firstName}.</Text>
      <Text style={styles.bodyCenter}>
        Your gifting idea is in good hands. Our team will be in touch shortly.
      </Text>
      <ActionButton label="Back to the collection" onPress={onReset} />
    </View>
  );
}
