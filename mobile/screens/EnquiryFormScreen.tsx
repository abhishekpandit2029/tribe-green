import { ScrollView, Text, TextInput, View } from "react-native";
import {
  BUDGETS,
  CUSTOMISATIONS,
  OCCASIONS,
  PRODUCTS,
} from "../data/catalogue";
import type { Product } from "../data/catalogue";
import { ActionButton, BackButton, Pill } from "../components/AppControls";
import { styles } from "../theme";

type Props = {
  product: Product | null;
  name: string;
  company: string;
  phone: string;
  email: string;
  units: string;
  giftMessage: string;
  pickedProducts: string[];
  pickedOccasion: string;
  pickedBudget: string;
  pickedCustom: string[];
  error: string;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onUnitsChange: (value: string) => void;
  onGiftMessageChange: (value: string) => void;
  onProductToggle: (value: string) => void;
  onOccasionChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onCustomToggle: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
};

export function EnquiryFormScreen(props: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.formPage}
      keyboardShouldPersistTaps="handled"
    >
      <BackButton
        label={`Back to ${props.product?.name || "the collection"}`}
        onPress={props.onBack}
      />
      <Text style={styles.eyebrow}>A GOOD THING STARTS HERE</Text>
      <Text style={styles.formTitle}>
        Let’s make it{"\n"}
        <Text style={styles.italic}>personal.</Text>
      </Text>
      <Text style={styles.formIntro}>
        Tell us a little about the gift you have in mind.
      </Text>
      <Text style={styles.fieldTitle}>THE DETAILS</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name *"
        value={props.name}
        onChangeText={props.onNameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Company *"
        value={props.company}
        onChangeText={props.onCompanyChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Email address *"
        keyboardType="email-address"
        autoCapitalize="none"
        value={props.email}
        onChangeText={props.onEmailChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone number *"
        keyboardType="phone-pad"
        value={props.phone}
        onChangeText={props.onPhoneChange}
      />
      <PillGroup
        title="WHAT ARE WE CELEBRATING? *"
        values={OCCASIONS}
        selected={props.pickedOccasion}
        onSelect={props.onOccasionChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of gifts *"
        keyboardType="number-pad"
        value={props.units}
        onChangeText={props.onUnitsChange}
      />
      <PillGroup
        title="BUDGET PER GIFT *"
        values={BUDGETS}
        selected={props.pickedBudget}
        onSelect={props.onBudgetChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Write a note to include with the gifts"
        value={props.giftMessage}
        onChangeText={props.onGiftMessageChange}
      />
      <Text style={styles.fieldTitle}>ANYTHING CAUGHT YOUR EYE?</Text>
      <View style={styles.wrapPills}>
        {PRODUCTS.map((item) => (
          <Pill
            key={item.id}
            label={item.name}
            active={props.pickedProducts.includes(item.name)}
            onPress={() => props.onProductToggle(item.name)}
          />
        ))}
      </View>
      <Text style={styles.fieldTitle}>MAKE IT YOURS</Text>
      <View style={styles.wrapPills}>
        {CUSTOMISATIONS.map((customisation) => (
          <Pill
            key={customisation}
            label={customisation}
            active={props.pickedCustom.includes(customisation)}
            onPress={() => props.onCustomToggle(customisation)}
          />
        ))}
      </View>
      {props.error ? <Text style={styles.error}>{props.error}</Text> : null}
      <ActionButton
        label="Send your enquiry"
        loading={props.isSubmitting}
        onPress={props.onSubmit}
      />
    </ScrollView>
  );
}

function PillGroup({
  title,
  values,
  selected,
  onSelect,
}: {
  title: string;
  values: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <>
      <Text style={styles.fieldTitle}>{title}</Text>
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
    </>
  );
}
