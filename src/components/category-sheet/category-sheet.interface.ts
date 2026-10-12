export interface ICategorySheetProps {
  visible: boolean;
  isEdit: boolean;
  initialLabel: string;
  initialPercent: string;
  otherPercent: number;
  onSave: (label: string, percent: number) => void;
  onDelete: () => void;
  onClose: () => void;
}

export type IUseCategorySheetProps = Pick<
  ICategorySheetProps,
  "initialLabel" | "initialPercent" | "otherPercent" | "onSave"
>;
