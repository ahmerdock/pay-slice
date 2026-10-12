import type { ReactNode } from "react";
import type { IAppIcon } from "@/assets/icon/icon.interface";

export interface IActionCardProps {
  label: string;
  description: string;
  icon: IAppIcon;
  onPress?: () => void;
  disabled?: boolean;
  trailing?: ReactNode;
}
