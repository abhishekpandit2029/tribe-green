import type { ComponentProps, ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

const C = {
  paper: "#f8f6f0",
  green: "#294d32",
  ink: "#243b2a",
  muted: "#76796e",
  line: "#deddd4",
  lime: "#849253",
  white: "#fff",
};

export function Pill({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ActionButton({
  label,
  icon = "open-outline",
  onPress,
}: {
  label: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.darkButton} onPress={onPress}>
      <View style={styles.buttonContent}>
        <Text style={styles.darkButtonText}>{label}</Text>
        <Ionicons name={icon} size={14} color={C.white} />
      </View>
    </Pressable>
  );
}

export function MobileHeader() {
  return (
    <View style={styles.topbar}>
      <View>
        <Text style={styles.brand}>tribe green</Text>
        <Text style={styles.brandSub}>GIFTS THAT BRING US CLOSER</Text>
      </View>
      <Ionicons name="sparkles-outline" size={23} color={C.lime} />
    </View>
  );
}

export function BackButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.backContent}>
        <Ionicons name="arrow-back" size={13} color={C.muted} />
        <Text style={styles.back}>{label}</Text>
      </View>
    </Pressable>
  );
}

export function BottomTabs({
  selected,
  onSelect,
  enquiryCount,
}: {
  selected: "Discover" | "My gifts";
  onSelect: (tab: "Discover" | "My gifts") => void;
  enquiryCount: number;
}) {
  return (
    <View style={styles.tabbar}>
      <TabButton
        label="Discover"
        icon="home-outline"
        active={selected === "Discover"}
        onPress={() => onSelect("Discover")}
      />
      <TabButton
        label={`My enquiries${enquiryCount > 0 ? ` · ${enquiryCount}` : ""}`}
        icon="heart-outline"
        active={selected === "My gifts"}
        onPress={() => onSelect("My gifts")}
      />
    </View>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tab}>
      <Ionicons name={icon} size={20} color={active ? C.green : "#929588"} />
      <Text style={[styles.tabLabel, active && styles.tabSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function EnquiryCard({ children }: { children: ReactNode }) {
  return <View style={styles.enquiryCard}>{children}</View>;
}

const styles = StyleSheet.create({
  topbar: {
    height: 60,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    backgroundColor: C.paper,
  },
  brand: { fontSize: 17, fontWeight: "700", letterSpacing: -0.5, color: C.ink },
  brandSub: { fontSize: 7, letterSpacing: 1.4, color: C.muted, marginTop: 3 },
  pill: {
    borderWidth: 1,
    borderColor: C.line,
    paddingVertical: 8,
    paddingHorizontal: 11,
    marginRight: 6,
    borderRadius: 20,
  },
  pillActive: { backgroundColor: C.green, borderColor: C.green },
  pillText: { fontSize: 9, color: "#60665b" },
  pillTextActive: { color: C.white },
  darkButton: {
    backgroundColor: C.green,
    paddingHorizontal: 16,
    height: 47,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  buttonContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  darkButtonText: {
    color: C.white,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.15,
  },
  backContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 14,
  },
  back: { fontSize: 10, color: C.muted },
  tabbar: {
    height: 62,
    backgroundColor: C.paper,
    borderTopWidth: 1,
    borderColor: C.line,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: { alignItems: "center", minWidth: 100 },
  tabLabel: { fontSize: 8, color: "#929588", marginTop: 1 },
  tabSelected: { color: C.green },
  enquiryCard: {
    backgroundColor: C.white,
    padding: 15,
    marginTop: 13,
    borderWidth: 1,
    borderColor: C.line,
  },
});
