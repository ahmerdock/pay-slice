import { Text, TouchableOpacity, View } from "react-native";
import Card from "../card";
import { ICategoryRowProps } from "./category-row.interface";
import { categoryRowStyles } from "./category-row.styles";

export default function CategoryRow(props: ICategoryRowProps) {
  const { label, percentText, amountText, onPress, tone = "default" } = props;

  const content = (
    <Card>
      <View style={categoryRowStyles.textWrap}>
        <Text style={categoryRowStyles.label(tone)}>{label}</Text>
        <Text style={categoryRowStyles.percent}>{percentText}</Text>
      </View>

      <Text style={categoryRowStyles.amount(tone === "warning")}>
        {amountText}
      </Text>
    </Card>
  );

  if (!onPress) {
    return content;
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Edit ${label}, ${percentText}`}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {content}
    </TouchableOpacity>
  );
}
