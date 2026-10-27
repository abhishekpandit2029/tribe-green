import React, { useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BUDGETS,
  CATEGORIES,
  CUSTOMISATIONS,
  Enquiry,
  OCCASIONS,
  PRODUCTS,
  Product,
} from "./data/catalogue";

type Tab = "Discover" | "My gifts";
const KEY = "tribe-green-mobile-enquiries-v1";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000";
const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
function Pill({
  label,
  active,
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
export default function App() {
  const [tab, setTab] = useState<Tab>("Discover"),
    [category, setCategory] = useState("All gifts"),
    [occasion, setOccasion] = useState(""),
    [budget, setBudget] = useState(""),
    [query, setQuery] = useState(""),
    [product, setProduct] = useState<Product | null>(null),
    [form, setForm] = useState(false),
    [thanks, setThanks] = useState(false),
    [enquiries, setEnquiries] = useState<Enquiry[]>([]),
    [name, setName] = useState(""),
    [company, setCompany] = useState(""),
    [phone, setPhone] = useState(""),
    [email, setEmail] = useState(""),
    [units, setUnits] = useState(""),
    [deliveryDate, setDeliveryDate] = useState(""),
    [message, setMessage] = useState(""),
    [pickedOccasion, setPickedOccasion] = useState(""),
    [pickedBudget, setPickedBudget] = useState(""),
    [pickedCustom, setPickedCustom] = useState<string[]>([]),
    [error, setError] = useState("");
  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((value) => value && setEnquiries(JSON.parse(value)))
      .catch(() => {});
  }, []);
  const filtered = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (category === "All gifts" || p.category === category) &&
          (!occasion || p.occasions.includes(occasion)) &&
          (!budget ||
            (budget === BUDGETS[0]
              ? p.priceMin < 500
              : budget === BUDGETS[1]
                ? p.priceMax >= 500 && p.priceMin <= 1500
                : budget === BUDGETS[2]
                  ? p.priceMax >= 1500 && p.priceMin <= 3000
                  : p.priceMax > 3000)) &&
          p.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [category, occasion, budget, query],
  );
  function startEnquiry(p: Product | null) {
    setProduct(p);
    setPickedOccasion(p?.occasions[0] || "");
    setPickedBudget("");
    setPickedCustom([]);
    setError("");
    setForm(true);
    setThanks(false);
  }
  async function send() {
    const digits = phone.replace(/\D/g, "");
    if (!name.trim() || !company.trim()) {
      setError("Please add your name and company.");
      return;
    }
    if (digits.length < 10 || digits.length > 15) {
      setError("Enter a valid phone number.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!Number.isInteger(Number(units)) || Number(units) < 1) {
      setError("Quantity should be at least 1.");
      return;
    }
    if (!pickedOccasion || !pickedBudget) {
      setError("Choose an occasion and budget.");
      return;
    }
    const item: Enquiry = {
      id: `TG-${Date.now().toString(36).toUpperCase()}`,
      name,
      company,
      phone,
      email,
      occasion: pickedOccasion,
      units: Number(units),
      budget: pickedBudget,
      deliveryDate,
      products: product ? [product.name] : [],
      customisations: pickedCustom,
      message,
      source: "Mobile app",
      status: "New",
      createdAt: new Date().toISOString(),
    };
    try {
      const response = await fetch(API_BASE_URL + "/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not save your enquiry.");
        return;
      }
      const next = [result as Enquiry, ...enquiries];
      setEnquiries(next);
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
      setThanks(true);
    } catch {
      setError(
        "Cannot reach the enquiry service. Check your connection and try again.",
      );
    }
  }
  const reset = () => {
    setProduct(null);
    setForm(false);
    setThanks(false);
    setTab("Discover");
  };
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.paper} />
      <View style={styles.topbar}>
        <View>
          <Text style={styles.brand}>tribe green</Text>
          <Text style={styles.brandSub}>GIFTS THAT BRING US CLOSER</Text>
        </View>
        <Text style={styles.sun}>✳</Text>
      </View>
      {thanks ? (
        <View style={styles.center}>
          <Text style={styles.thanksMark}>✓</Text>
          <Text style={styles.serifTitle}>
            Thank you, {name.split(" ")[0]}.
          </Text>
          <Text style={styles.bodyCenter}>
            Your gifting idea is in good hands. Our team will be in touch
            shortly.
          </Text>
          <Pressable style={styles.darkButton} onPress={reset}>
            <Text style={styles.darkButtonText}>Back to the collection ↗</Text>
          </Pressable>
        </View>
      ) : form ? (
        <ScrollView
          contentContainerStyle={styles.formPage}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={() => setForm(false)}>
            <Text style={styles.back}>
              ← Back to {product?.name || "the collection"}
            </Text>
          </Pressable>
          <Text style={styles.eyebrow}>A GOOD THING STARTS HERE</Text>
          <Text style={styles.formTitle}>
            Let’s make it{"\n"}
            <Text style={styles.italic}>personal.</Text>
          </Text>
          <Text style={styles.formIntro}>
            Tell us a little about the gift you have in mind.
          </Text>
          <Text style={styles.fieldTitle}>YOUR DETAILS</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name *"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Company *"
            value={company}
            onChangeText={setCompany}
          />
          <TextInput
            style={styles.input}
            placeholder="Email address *"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone number *"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Text style={styles.fieldTitle}>OCCASION *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontal}
          >
            {OCCASIONS.map((x) => (
              <Pill
                key={x}
                label={x}
                active={pickedOccasion === x}
                onPress={() => setPickedOccasion(x)}
              />
            ))}
          </ScrollView>
          <Text style={styles.fieldTitle}>BUDGET PER GIFT *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontal}
          >
            {BUDGETS.map((x) => (
              <Pill
                key={x}
                label={x}
                active={pickedBudget === x}
                onPress={() => setPickedBudget(x)}
              />
            ))}
          </ScrollView>
          <TextInput
            style={styles.input}
            placeholder="Number of gifts *"
            keyboardType="number-pad"
            value={units}
            onChangeText={setUnits}
          />
          <TextInput
            style={styles.input}
            placeholder="Ideal delivery date (YYYY-MM-DD)"
            value={deliveryDate}
            onChangeText={setDeliveryDate}
          />
          <Text style={styles.fieldTitle}>MAKE IT YOURS</Text>
          <View style={styles.wrapPills}>
            {CUSTOMISATIONS.map((x) => (
              <Pill
                key={x}
                label={x}
                active={pickedCustom.includes(x)}
                onPress={() =>
                  setPickedCustom((v) =>
                    v.includes(x) ? v.filter((a) => a !== x) : [...v, x],
                  )
                }
              />
            ))}
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Anything else we should know?"
            multiline
            value={message}
            onChangeText={setMessage}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable style={styles.darkButton} onPress={send}>
            <Text style={styles.darkButtonText}>Send your enquiry ↗</Text>
          </Pressable>
        </ScrollView>
      ) : product ? (
        <ScrollView contentContainerStyle={styles.detailPage}>
          <Pressable onPress={() => setProduct(null)}>
            <Text style={styles.back}>← Back to the collection</Text>
          </Pressable>
          <ImageBackground
            source={{ uri: product.image }}
            style={styles.detailImage}
            imageStyle={{ resizeMode: "cover" }}
          >
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>
                {product.category.toUpperCase()}
              </Text>
            </View>
          </ImageBackground>
          <Text style={styles.eyebrow}>THE GOOD STUFF</Text>
          <Text style={styles.detailTitle}>{product.name}</Text>
          <Text style={styles.detailDesc}>{product.description}</Text>
          <Text style={styles.detailPrice}>
            {money(product.priceMin)} – {money(product.priceMax)}{" "}
            <Text style={styles.perUnit}>/ unit</Text>
          </Text>
          <Text style={styles.fieldTitle}>JUST RIGHT FOR</Text>
          <View style={styles.wrapPills}>
            {product.occasions.map((x) => (
              <Pill key={x} label={x} active onPress={() => {}} />
            ))}
          </View>
          <Text style={styles.fieldTitle}>MAKE IT YOURS</Text>
          <View style={styles.wrapPills}>
            {product.customisations.map((x) => (
              <Pill key={x} label={x} onPress={() => {}} />
            ))}
          </View>
          <Pressable
            style={styles.darkButton}
            onPress={() => startEnquiry(product)}
          >
            <Text style={styles.darkButtonText}>Enquire about this gift ↗</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <>
          {tab === "Discover" ? (
            <ScrollView contentContainerStyle={styles.page}>
              <View style={styles.hero}>
                <Text style={styles.eyebrow}>
                  THOUGHTFUL GIFTS. STRONGER CONNECTIONS.
                </Text>
                <Text style={styles.heroTitle}>
                  Good things{"\n"}are meant to{"\n"}
                  <Text style={styles.italic}>be shared.</Text>
                </Text>
                <Text style={styles.heroText}>
                  Gifting that says “we see you.” Thoughtfully made, beautifully
                  personal, and a little unexpected.
                </Text>
                <Pressable
                  style={styles.darkButton}
                  onPress={() => setQuery("")}
                >
                  <Text style={styles.darkButtonText}>
                    Find your kind of gift ↓
                  </Text>
                </Pressable>
              </View>
              <View style={styles.sectionHead}>
                <Text style={styles.eyebrow}>THE GOOD STUFF</Text>
                <Text style={styles.sectionTitle}>
                  Made to make{"\n"}
                  <Text style={styles.italic}>someone’s day.</Text>
                </Text>
              </View>
              <TextInput
                style={styles.search}
                placeholder="⌕   Find a gift..."
                value={query}
                onChangeText={setQuery}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontal}
              >
                {["All gifts", ...CATEGORIES].map((x) => (
                  <Pill
                    key={x}
                    label={x}
                    active={category === x}
                    onPress={() => setCategory(x)}
                  />
                ))}
              </ScrollView>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontal}
              >
                {OCCASIONS.map((x) => (
                  <Pill
                    key={x}
                    label={x}
                    active={occasion === x}
                    onPress={() => setOccasion(occasion === x ? "" : x)}
                  />
                ))}
              </ScrollView>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontal}
              >
                {BUDGETS.map((x) => (
                  <Pill
                    key={x}
                    label={x}
                    active={budget === x}
                    onPress={() => setBudget(budget === x ? "" : x)}
                  />
                ))}
              </ScrollView>
              <View style={styles.cards}>
                {filtered.map((p, i) => (
                  <Pressable
                    key={p.id}
                    style={styles.card}
                    onPress={() => setProduct(p)}
                  >
                    <ImageBackground
                      source={{ uri: p.image }}
                      style={styles.cardImage}
                      imageStyle={{ resizeMode: "cover" }}
                    >
                      <Text style={styles.cardNumber}>0{i + 1}</Text>
                      <Text style={styles.cardArrow}>↗</Text>
                    </ImageBackground>
                    <Text style={styles.cardCategory}>
                      {p.category.toUpperCase()}
                    </Text>
                    <Text style={styles.cardTitle}>{p.name}</Text>
                    <Text style={styles.cardPrice}>
                      {money(p.priceMin)} – {money(p.priceMax)}{" "}
                      <Text style={styles.perUnit}>/ unit</Text>
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.closing}>
                <Text style={styles.eyebrow}>HAVE SOMETHING IN MIND?</Text>
                <Text style={styles.sectionTitle}>
                  Let’s make a little{"\n"}
                  <Text style={styles.italic}>magic happen.</Text>
                </Text>
                <Pressable
                  style={styles.darkButton}
                  onPress={() => startEnquiry(null)}
                >
                  <Text style={styles.darkButtonText}>
                    Tell us what you’re thinking ↗
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          ) : (
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
                  <Text style={styles.sun}>✳</Text>
                  <Text style={styles.emptyTitle}>Your story starts here.</Text>
                  <Text style={styles.bodyCenter}>
                    Gifts you enquire about will be saved here.
                  </Text>
                  <Pressable
                    style={styles.darkButton}
                    onPress={() => setTab("Discover")}
                  >
                    <Text style={styles.darkButtonText}>
                      Explore the collection ↗
                    </Text>
                  </Pressable>
                </View>
              ) : (
                enquiries.map((item) => (
                  <View style={styles.enquiryCard} key={item.id}>
                    <View style={styles.enquiryTop}>
                      <Text style={styles.enquiryId}>{item.id}</Text>
                      <Text style={styles.source}>{item.status}</Text>
                    </View>
                    <Text style={styles.cardTitle}>
                      {item.products.join(", ") || "Gift ideas welcome"}
                    </Text>
                    <Text style={styles.bodyText}>
                      {item.occasion} · {item.units} gifts
                    </Text>
                    <Text style={styles.bodyText}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          )}
          <View style={styles.tabbar}>
            <Pressable
              onPress={() => {
                setTab("Discover");
                setProduct(null);
                setForm(false);
              }}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.tabIcon,
                  tab === "Discover" && styles.tabSelected,
                ]}
              >
                ⌂
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  tab === "Discover" && styles.tabSelected,
                ]}
              >
                Discover
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setTab("My gifts");
                setProduct(null);
                setForm(false);
              }}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.tabIcon,
                  tab === "My gifts" && styles.tabSelected,
                ]}
              >
                ♡
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  tab === "My gifts" && styles.tabSelected,
                ]}
              >
                My enquiries
                {enquiries.length > 0 ? ` · ${enquiries.length}` : ""}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const C = {
  paper: "#f8f6f0",
  green: "#294d32",
  ink: "#243b2a",
  muted: "#76796e",
  line: "#deddd4",
  lime: "#849253",
  white: "#fff",
  pale: "#efeee6",
};
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper },
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
  sun: { fontSize: 23, color: C.lime },
  page: { paddingHorizontal: 20, paddingBottom: 32 },
  hero: {
    paddingTop: 33,
    paddingBottom: 38,
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  eyebrow: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.45,
    color: "#73825a",
  },
  heroTitle: {
    fontFamily: "Georgia",
    fontSize: 43,
    lineHeight: 47,
    color: C.ink,
    marginTop: 19,
    marginBottom: 13,
    letterSpacing: -1.5,
  },
  italic: { fontStyle: "italic", color: C.lime },
  heroText: {
    fontSize: 12,
    lineHeight: 19,
    color: C.muted,
    maxWidth: 310,
    marginBottom: 20,
  },
  darkButton: {
    backgroundColor: C.green,
    paddingHorizontal: 16,
    height: 47,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  darkButtonText: {
    color: C.white,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.15,
  },
  sectionHead: { paddingTop: 34, paddingBottom: 13 },
  sectionTitle: {
    fontFamily: "Georgia",
    fontSize: 33,
    lineHeight: 38,
    color: C.ink,
    marginTop: 12,
    letterSpacing: -1,
  },
  search: {
    height: 42,
    borderWidth: 1,
    borderColor: C.line,
    paddingHorizontal: 12,
    fontSize: 11,
    color: C.ink,
    marginTop: 6,
    marginBottom: 11,
  },
  horizontal: { flexGrow: 0, marginBottom: 9 },
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
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  card: { width: "48.5%", marginBottom: 19 },
  cardImage: {
    height: 155,
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 9,
    backgroundColor: C.pale,
  },
  cardNumber: {
    backgroundColor: C.paper,
    paddingHorizontal: 7,
    paddingVertical: 5,
    fontSize: 8,
    color: C.ink,
  },
  cardArrow: {
    alignSelf: "flex-end",
    backgroundColor: C.paper,
    width: 25,
    height: 25,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 13,
    color: C.ink,
    fontSize: 13,
  },
  cardCategory: {
    fontSize: 7,
    letterSpacing: 1,
    color: "#85897c",
    marginTop: 10,
  },
  cardTitle: {
    fontFamily: "Georgia",
    fontSize: 16,
    color: C.ink,
    marginTop: 4,
  },
  cardPrice: { fontSize: 9, color: C.ink, marginTop: 6 },
  perUnit: { fontSize: 8, color: "#85887d" },
  closing: {
    marginTop: 15,
    paddingTop: 26,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: C.line,
  },
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
  tabIcon: { fontSize: 20, color: "#929588", lineHeight: 23 },
  tabLabel: { fontSize: 8, color: "#929588", marginTop: 1 },
  tabSelected: { color: C.green },
  detailPage: { paddingHorizontal: 20, paddingBottom: 35 },
  back: { fontSize: 10, color: C.muted, marginVertical: 14 },
  detailImage: {
    height: 310,
    backgroundColor: C.pale,
    marginBottom: 23,
    justifyContent: "flex-end",
  },
  imageBadge: {
    backgroundColor: C.paper,
    alignSelf: "flex-start",
    padding: 11,
  },
  imageBadgeText: { fontSize: 8, letterSpacing: 1.1, color: C.ink },
  detailTitle: {
    fontFamily: "Georgia",
    fontSize: 34,
    color: C.ink,
    marginTop: 12,
  },
  detailDesc: { fontSize: 12, color: C.muted, lineHeight: 19, marginTop: 8 },
  detailPrice: { fontSize: 18, color: C.ink, marginTop: 18, marginBottom: 21 },
  fieldTitle: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.3,
    color: "#73825a",
    marginTop: 21,
    marginBottom: 11,
  },
  wrapPills: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  formPage: { paddingHorizontal: 20, paddingBottom: 35 },
  formTitle: {
    fontFamily: "Georgia",
    fontSize: 41,
    lineHeight: 46,
    color: C.ink,
    marginTop: 14,
  },
  formIntro: { fontSize: 11, color: C.muted, marginTop: 6, marginBottom: 20 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    paddingHorizontal: 12,
    fontSize: 11,
    color: C.ink,
    marginBottom: 9,
  },
  textArea: {
    height: 84,
    textAlignVertical: "top",
    paddingTop: 12,
    marginTop: 15,
  },
  error: { fontSize: 10, color: "#a43c31", marginVertical: 4 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },
  thanksMark: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#e8ebd9",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 25,
    color: C.lime,
    overflow: "hidden",
    marginBottom: 20,
  },
  serifTitle: {
    fontFamily: "Georgia",
    fontSize: 30,
    color: C.ink,
    textAlign: "center",
  },
  bodyCenter: {
    fontSize: 11,
    color: C.muted,
    textAlign: "center",
    lineHeight: 19,
    marginVertical: 12,
    maxWidth: 280,
  },
  empty: { alignItems: "center", paddingTop: 70 },
  emptyTitle: {
    fontFamily: "Georgia",
    fontSize: 23,
    color: C.ink,
    marginTop: 13,
  },
  bodyText: { fontSize: 10, color: C.muted, marginTop: 6 },
  enquiryCard: {
    backgroundColor: C.white,
    padding: 15,
    marginTop: 13,
    borderWidth: 1,
    borderColor: C.line,
  },
  enquiryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  enquiryId: { fontSize: 8, color: C.muted },
  source: { fontSize: 8, color: C.lime, fontWeight: "700" },
});
