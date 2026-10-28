import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TextInput, View } from "react-native";
import { BUDGETS, CATEGORIES, OCCASIONS } from "../data/catalogue";
import type { Product } from "../data/catalogue";
import { ActionButton, Pill } from "../components/AppControls";
import { ProductCard } from "../components/ProductCard";
import { styles } from "../theme";

type Props = {
  products: Product[];
  category: string;
  occasion: string;
  budget: string;
  query: string;
  onCategoryChange: (value: string) => void;
  onOccasionChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onProductSelect: (product: Product) => void;
  onStartEnquiry: () => void;
};

export function DiscoverScreen({
  products,
  category,
  occasion,
  budget,
  query,
  onCategoryChange,
  onOccasionChange,
  onBudgetChange,
  onQueryChange,
  onProductSelect,
  onStartEnquiry,
}: Props) {
  return (
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
        <ActionButton
          label="Find your kind of gift"
          icon="arrow-down"
          onPress={() => onQueryChange("")}
        />
      </View>
      <View style={styles.sectionHead}>
        <Text style={styles.eyebrow}>THE GOOD STUFF</Text>
        <Text style={styles.sectionTitle}>
          Made to make{"\n"}
          <Text style={styles.italic}>someone’s day.</Text>
        </Text>
      </View>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={16} color="#76796e" />
        <TextInput
          style={styles.search}
          placeholder="Find a gift..."
          value={query}
          onChangeText={onQueryChange}
        />
      </View>
      <FilterPills
        values={["All gifts", ...CATEGORIES]}
        selected={category}
        onSelect={onCategoryChange}
      />
      <FilterPills
        values={OCCASIONS}
        selected={occasion}
        onSelect={(value) => onOccasionChange(occasion === value ? "" : value)}
      />
      <FilterPills
        values={BUDGETS}
        selected={budget}
        onSelect={(value) => onBudgetChange(budget === value ? "" : value)}
      />
      <View style={styles.cards}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onPress={() => onProductSelect(product)}
          />
        ))}
      </View>
      <View style={styles.closing}>
        <Text style={styles.eyebrow}>HAVE SOMETHING IN MIND?</Text>
        <Text style={styles.sectionTitle}>
          Let’s make a little{"\n"}
          <Text style={styles.italic}>magic happen.</Text>
        </Text>
        <ActionButton
          label="Tell us what you’re thinking"
          onPress={onStartEnquiry}
        />
      </View>
    </ScrollView>
  );
}

function FilterPills({
  values,
  selected,
  onSelect,
}: {
  values: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.horizontal}
    >
      {values.map((value) => (
        <Pill
          key={value}
          label={value}
          active={selected === value}
          onPress={() => onSelect(value)}
        />
      ))}
    </ScrollView>
  );
}
