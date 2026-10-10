export interface ICategoryRowProps {
  label: string;
  percentText: string;
  amountText: string;
  onPress?: () => void;
  tone?: "default" | "muted" | "warning";
}
