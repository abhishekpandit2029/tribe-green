import { ImageBackground, Text, View, ScrollView } from "react-native";
import type { Product } from "../data/catalogue";
import { ActionButton, BackButton, Pill } from "../components/AppControls";
import { styles } from "../theme";

export function ProductDetailScreen({
  product,
  onBack,
  onEnquire,
}: {
  product: Product;
  onBack: () => void;
  onEnquire: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.detailPage}>
      <BackButton label="Back to the collection" onPress={onBack} />
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
        ₹{product.priceMin.toLocaleString("en-IN")} – ₹
        {product.priceMax.toLocaleString("en-IN")}{" "}
        <Text style={styles.perUnit}>/ unit</Text>
      </Text>
      <Text style={styles.fieldTitle}>JUST RIGHT FOR</Text>
      <View style={styles.wrapPills}>
        {product.occasions.map((occasion) => (
          <Pill key={occasion} label={occasion} active onPress={() => {}} />
        ))}
      </View>
      <Text style={styles.fieldTitle}>MAKE IT YOURS</Text>
      <View style={styles.wrapPills}>
        {product.customisations.map((customisation) => (
          <Pill key={customisation} label={customisation} onPress={() => {}} />
        ))}
      </View>
      <ActionButton label="Enquire about this gift" onPress={onEnquire} />
    </ScrollView>
  );
}
