import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BUDGETS, PRODUCTS } from "./data/catalogue";
import type { Enquiry, Product } from "./data/catalogue";
import { BottomTabs, MobileHeader } from "./components/AppControls";
import { EnquiryList } from "./components/EnquiryList";
import { DiscoverScreen } from "./screens/DiscoverScreen";
import { EnquiryFormScreen } from "./screens/EnquiryFormScreen";
import { ProductDetailScreen } from "./screens/ProductDetailScreen";
import { ThankYouScreen } from "./screens/ThankYouScreen";
import { C, styles } from "./theme";

type Tab = "Discover" | "My gifts";
const KEY = "tribe-green-mobile-enquiries-v1";
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/+$/, "");
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
    [giftMessage, setGiftMessage] = useState(""),
    [pickedProducts, setPickedProducts] = useState<string[]>([]),
    [pickedOccasion, setPickedOccasion] = useState(""),
    [pickedBudget, setPickedBudget] = useState(""),
    [pickedCustom, setPickedCustom] = useState<string[]>([]),
    [error, setError] = useState(""),
    [isSubmitting, setIsSubmitting] = useState(false);
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
    setPickedProducts(p ? [p.name] : []);
    setPickedOccasion(p?.occasions[0] || "");
    setPickedBudget("");
    setPickedCustom([]);
    setError("");
    setForm(true);
    setThanks(false);
  }
  async function send() {
    if (isSubmitting) return;
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
      products: pickedProducts,
      customisations: pickedCustom,
      giftMessage,
      source: "Mobile app",
      status: "New",
      createdAt: new Date().toISOString(),
    };
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
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
    } finally {
      setIsSubmitting(false);
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
      <MobileHeader />
      {thanks ? (
        <ThankYouScreen firstName={name.split(" ")[0]} onReset={reset} />
      ) : form ? (
        <EnquiryFormScreen
          product={product}
          name={name}
          company={company}
          phone={phone}
          email={email}
          units={units}
          giftMessage={giftMessage}
          pickedProducts={pickedProducts}
          pickedOccasion={pickedOccasion}
          pickedBudget={pickedBudget}
          pickedCustom={pickedCustom}
          isSubmitting={isSubmitting}
          error={error}
          onNameChange={setName}
          onCompanyChange={setCompany}
          onPhoneChange={setPhone}
          onEmailChange={setEmail}
          onUnitsChange={setUnits}
          onGiftMessageChange={setGiftMessage}
          onProductToggle={(value) =>
            setPickedProducts((current) =>
              current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
            )
          }
          onOccasionChange={setPickedOccasion}
          onBudgetChange={setPickedBudget}
          onCustomToggle={(value) =>
            setPickedCustom((current) =>
              current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
            )
          }
          onBack={() => setForm(false)}
          onSubmit={send}
        />
      ) : product ? (
        <ProductDetailScreen
          product={product}
          onBack={() => setProduct(null)}
          onEnquire={() => startEnquiry(product)}
        />
      ) : (
        <>
          {tab === "Discover" ? (
            <DiscoverScreen
              products={filtered}
              category={category}
              occasion={occasion}
              budget={budget}
              query={query}
              onCategoryChange={setCategory}
              onOccasionChange={setOccasion}
              onBudgetChange={setBudget}
              onQueryChange={setQuery}
              onProductSelect={setProduct}
              onStartEnquiry={() => startEnquiry(null)}
            />
          ) : (
            <EnquiryList
              enquiries={enquiries}
              onExplore={() => setTab("Discover")}
            />
          )}
          <BottomTabs
            selected={tab}
            enquiryCount={enquiries.length}
            onSelect={(nextTab) => {
              setTab(nextTab);
              setProduct(null);
              setForm(false);
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
}
