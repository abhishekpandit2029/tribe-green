import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { Enquiry } from "../data/catalogue";
import { ActionButton, EnquiryCard } from "./AppControls";
import { C, styles } from "../theme";

export function EnquiryList({
  enquiries,
  onExplore,
}: {
  enquiries: Enquiry[];
  onExplore: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.eyebrow}>YOUR THOUGHTFUL THINGS</Text>
      <Text style={styles.sectionTitle}>
        My <Text style={styles.italic}>enquiries.</Text>
      </Text>
      <Text style={styles.formIntro}>
        Saved on this device for easy follow-up.
      </Text>
      {enquiries.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="sparkles-outline" size={23} color={C.lime} />
          <Text style={styles.emptyTitle}>Your story starts here.</Text>
          <Text style={styles.bodyCenter}>
            Gifts you enquire about will be saved here.
          </Text>
          <ActionButton label="Explore the collection" onPress={onExplore} />
        </View>
      ) : (
        enquiries.map((enquiry) => (
          <EnquirySummary key={enquiry.id} enquiry={enquiry} />
        ))
      )}
    </ScrollView>
  );
}

function EnquirySummary({ enquiry }: { enquiry: Enquiry }) {
  return (
    <EnquiryCard>
      <View style={styles.enquiryTop}>
        <Text style={styles.enquiryId}>{enquiry.id}</Text>
        <Text style={styles.source}>{enquiry.status}</Text>
      </View>
      <Text style={styles.cardTitle}>
        {enquiry.products.join(", ") || "Gift ideas welcome"}
      </Text>
      <Text style={styles.bodyText}>
        {enquiry.occasion} · {enquiry.units} gifts
      </Text>
      <Text style={styles.bodyText}>
        {new Date(enquiry.createdAt).toLocaleDateString()}
      </Text>
    </EnquiryCard>
  );
}
