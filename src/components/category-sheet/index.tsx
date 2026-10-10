import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { ICategorySheetProps } from "./category-sheet.interface";
import { categorySheetStyles } from "./category-sheet.styles";
import useCategorySheet from "./use-category-sheet";

export default function CategorySheet(props: ICategorySheetProps) {
  const { visible, isEdit, onDelete, onClose } = props;

  const { theme } = useUnistyles();
  const {
    label,
    percentText,
    canSave,
    warning,
    setLabel,
    setPercentText,
    save,
  } = useCategorySheet(props);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={categorySheetStyles.backdrop}
      >
        <Pressable
          accessibilityLabel="Close"
          style={categorySheetStyles.dismissArea}
          onPress={onClose}
        />

        <View style={categorySheetStyles.sheet}>
          <Text style={categorySheetStyles.title}>
            {isEdit ? "EDIT CATEGORY" : "NEW CATEGORY"}
          </Text>

          <Text style={categorySheetStyles.fieldLabel}>Label</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="Savings"
            placeholderTextColor={theme.colors.textSecondary}
            maxLength={40}
            returnKeyType="next"
            style={categorySheetStyles.input}
          />

          <Text style={categorySheetStyles.fieldLabel}>Percentage</Text>
          <TextInput
            value={percentText}
            onChangeText={setPercentText}
            placeholder="14"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="decimal-pad"
            maxLength={6}
            style={[
              categorySheetStyles.input,
              categorySheetStyles.percentInput,
            ]}
          />

          {warning ? (
            <Text style={categorySheetStyles.warning}>{warning}</Text>
          ) : null}

          <View style={categorySheetStyles.actions}>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.7}
              onPress={onClose}
              style={categorySheetStyles.button("secondary", false)}
            >
              <Text style={categorySheetStyles.buttonText("secondary")}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.7}
              disabled={!canSave}
              onPress={save}
              style={categorySheetStyles.button("primary", !canSave)}
            >
              <Text style={categorySheetStyles.buttonText("primary")}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          {isEdit ? (
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.7}
              onPress={onDelete}
              style={categorySheetStyles.deleteButton}
            >
              <Text style={categorySheetStyles.deleteText}>
                Delete category
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
