import { Text, TextInput } from "react-native";
import Plus from "lucide-react-native/icons/plus";
import { useUnistyles } from "react-native-unistyles";
import {
  ActionCard,
  AllocationBar,
  CategoryRow,
  CategorySheet,
  ShortHeading,
} from "@/components";
import { PAGE_TITLES } from "@/constants/routes";
import { TabsLayout } from "@/layouts";
import { formatAmount, formatPercent } from "@/utils/format";
import { homeStyles } from "./home.styles";
import useHome from "./use-home";

export default function Home() {
  const { theme } = useUnistyles();
  const {
    breakdown,
    incomeText,
    hasCategories,
    isSheetVisible,
    sheetKey,
    isEditing,
    sheetInitialLabel,
    sheetInitialPercent,
    otherPercent,
    changeIncome,
    focusIncome,
    blurIncome,
    openSheet,
    closeSheet,
    saveCategory,
    deleteCategory,
  } = useHome();

  const { rows, totalPercent, remainingPercent, remainingAmount, isOver } =
    breakdown;

  return (
    <TabsLayout titleProps={{ title: PAGE_TITLES.HOME }}>
      <ShortHeading heading="MONTHLY INCOME" />

      <TextInput
        accessibilityLabel="Monthly income"
        value={incomeText}
        onChangeText={changeIncome}
        onFocus={focusIncome}
        onBlur={blurIncome}
        placeholder="0"
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="decimal-pad"
        maxLength={15}
        style={homeStyles.incomeInput}
      />

      {hasCategories ? (
        <AllocationBar
          totalPercent={totalPercent}
          remainingPercent={remainingPercent}
        />
      ) : null}

      <ShortHeading heading="CATEGORIES" />

      {hasCategories ? null : (
        <Text style={homeStyles.emptyText}>
          No categories yet. Add one to split your income by percentage.
        </Text>
      )}

      {rows.map((row) => (
        <CategoryRow
          key={row.id}
          label={row.label}
          percentText={formatPercent(row.percent)}
          amountText={formatAmount(row.amount)}
          onPress={() => openSheet(row.id)}
        />
      ))}

      {remainingPercent !== 0 ? (
        <CategoryRow
          label={isOver ? "Over by" : "Unallocated"}
          percentText={formatPercent(Math.abs(remainingPercent))}
          amountText={formatAmount(Math.abs(remainingAmount))}
          tone={isOver ? "warning" : "muted"}
        />
      ) : null}

      <ActionCard
        label="Add category"
        description="Split your income by percentage"
        icon={Plus}
        onPress={() => openSheet(null)}
      />

      <CategorySheet
        key={sheetKey}
        visible={isSheetVisible}
        isEdit={isEditing}
        initialLabel={sheetInitialLabel}
        initialPercent={sheetInitialPercent}
        otherPercent={otherPercent}
        onSave={saveCategory}
        onDelete={deleteCategory}
        onClose={closeSheet}
      />
    </TabsLayout>
  );
}
