import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, Pressable, Text, View } from "react-native";
import type { Product } from "../data/catalogue";
import { C, styles } from "../theme";

export function ProductCard({
  product,
  index,
  onPress,
}: {
  product: Product;
  index: number;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <ImageBackground
        source={{ uri: product.image }}
        style={styles.cardImage}
        imageStyle={{ resizeMode: "cover" }}
      >
        <Text style={styles.cardNumber}>0{index + 1}</Text>
        <View style={styles.cardArrow}>
          <Ionicons name="open-outline" size={14} color={C.ink} />
        </View>
      </ImageBackground>
      <Text style={styles.cardCategory}>{product.category.toUpperCase()}</Text>
      <Text style={styles.cardTitle}>{product.name}</Text>
      <Text style={styles.cardPrice}>
        ₹{product.priceMin.toLocaleString("en-IN")} – ₹
        {product.priceMax.toLocaleString("en-IN")}{" "}
        <Text style={styles.perUnit}>/ unit</Text>
      </Text>
    </Pressable>
  );
}
