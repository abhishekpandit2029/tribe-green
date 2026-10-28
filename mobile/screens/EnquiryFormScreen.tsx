import { ScrollView, Text, TextInput, View } from "react-native";
import { BUDGETS, CUSTOMISATIONS, OCCASIONS } from "../data/catalogue";
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
  deliveryDate: string;
  message: string;
  pickedOccasion: string;
  pickedBudget: string;
  pickedCustom: string[];
  error: string;
  onNameChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onUnitsChange: (value: string) => void;
  onDeliveryDateChange: (value: string) => void;
  onMessageChange: (value: string) => void;
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
      <Text style={styles.fieldTitle}>YOUR DETAILS</Text>
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
        title="OCCASION *"
        values={OCCASIONS}
        selected={props.pickedOccasion}
        onSelect={props.onOccasionChange}
      />
      <PillGroup
        title="BUDGET PER GIFT *"
        values={BUDGETS}
        selected={props.pickedBudget}
        onSelect={props.onBudgetChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of gifts *"
        keyboardType="number-pad"
        value={props.units}
        onChangeText={props.onUnitsChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Ideal delivery date (YYYY-MM-DD)"
        value={props.deliveryDate}
        onChangeText={props.onDeliveryDateChange}
      />
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
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Anything else we should know?"
        multiline
        value={props.message}
        onChangeText={props.onMessageChange}
      />
      {props.error ? <Text style={styles.error}>{props.error}</Text> : null}
      <ActionButton label="Send your enquiry" onPress={props.onSubmit} />
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
