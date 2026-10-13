import { useRef, useState } from "react";
import type { TextInput } from "react-native";
import { formatPercent } from "@/utils/format";
import {
  parsePositiveNumber,
  sanitizeDecimalInput,
} from "@/utils/number-input";
import { IUseCategorySheetProps } from "./category-sheet.interface";

export default function useCategorySheet(props: IUseCategorySheetProps) {
  const { initialLabel, initialPercent, otherPercent, onSave } = props;

  const percentInputRef = useRef<TextInput>(null);

  const [label, setLabel] = useState(initialLabel);
  const [percentText, setPercentText] = useState(initialPercent);

  const percent = parsePositiveNumber(percentText);
  const trimmedLabel = label.trim();
  const canSave = trimmedLabel.length > 0 && percent > 0;

  const projectedTotal = otherPercent + percent;
  const overBy = Math.round((projectedTotal - 100) * 100) / 100;
  const warning =
    overBy > 0
      ? `Total will be ${formatPercent(projectedTotal)}, ${formatPercent(overBy)} over`
      : null;

  const save = () => {
    if (canSave) {
      onSave(trimmedLabel, percent);
    }
  };

  const focusPercentInput = () => percentInputRef.current?.focus();

  return {
    percentInputRef,
    focusPercentInput,
    label,
    percentText,
    canSave,
    warning,
    setLabel,
    setPercentText: (text: string) =>
      setPercentText(sanitizeDecimalInput(text)),
    save,
  };
}
