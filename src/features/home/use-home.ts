import { useState } from "react";
import { Alert } from "react-native";
import { mmkvStorage } from "@/theme/unistyles";
import { formatAmount } from "@/utils/format";
import {
  parsePositiveNumber,
  sanitizeDecimalInput,
} from "@/utils/number-input";
import { BUDGET_STORAGE_KEY } from "./home.data";
import { IBudget } from "./home.interface";
import {
  computeBreakdown,
  createCategoryId,
  parseStoredBudget,
} from "./home.utils";

const saveBudget = (budget: IBudget) => {
  mmkvStorage.set(BUDGET_STORAGE_KEY, JSON.stringify(budget));
};

const getInitialPercent = (
  editingPercent: number | undefined,
  remainingPercent: number,
) => {
  if (editingPercent !== undefined) {
    return String(editingPercent);
  }

  return remainingPercent > 0 ? String(remainingPercent) : "";
};

export default function useHome() {
  const [budget, setBudget] = useState<IBudget>(() =>
    parseStoredBudget(mmkvStorage.getString(BUDGET_STORAGE_KEY)),
  );
  const [isIncomeFocused, setIsIncomeFocused] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  const income = parsePositiveNumber(budget.income);
  const breakdown = computeBreakdown(income, budget.categories);

  const editingCategory = budget.categories.find(
    (category) => category.id === editingId,
  );
  const otherPercent = breakdown.totalPercent - (editingCategory?.percent ?? 0);

  const update = (next: IBudget) => {
    setBudget(next);
    saveBudget(next);
  };

  const changeIncome = (text: string) => {
    const sanitized = sanitizeDecimalInput(text);

    if (sanitized !== budget.income) {
      update({ ...budget, income: sanitized });
    }
  };

  const incomeText =
    isIncomeFocused || budget.income === ""
      ? budget.income
      : formatAmount(income);

  const openSheet = (id: string | null) => {
    setEditingId(id);
    setSheetKey((key) => key + 1);
    setIsSheetVisible(true);
  };

  const closeSheet = () => setIsSheetVisible(false);

  const saveCategory = (label: string, percent: number) => {
    if (!isSheetVisible) {
      return;
    }

    const categories = editingCategory
      ? budget.categories.map((category) =>
          category.id === editingCategory.id
            ? { ...category, label, percent }
            : category,
        )
      : [...budget.categories, { id: createCategoryId(), label, percent }];

    update({ ...budget, categories });
    closeSheet();
  };

  const deleteCategory = () => {
    if (!isSheetVisible || !editingCategory) {
      return;
    }

    Alert.alert("Delete category", `Delete "${editingCategory.label}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          update({
            ...budget,
            categories: budget.categories.filter(
              (category) => category.id !== editingCategory.id,
            ),
          });
          closeSheet();
        },
      },
    ]);
  };

  return {
    breakdown,
    incomeText,
    hasCategories: budget.categories.length > 0,
    isSheetVisible,
    sheetKey,
    isEditing: !!editingCategory,
    sheetInitialLabel: editingCategory?.label ?? "",
    sheetInitialPercent: getInitialPercent(
      editingCategory?.percent,
      breakdown.remainingPercent,
    ),
    otherPercent,
    changeIncome,
    focusIncome: () => setIsIncomeFocused(true),
    blurIncome: () => setIsIncomeFocused(false),
    openSheet,
    closeSheet,
    saveCategory,
    deleteCategory,
  };
}
