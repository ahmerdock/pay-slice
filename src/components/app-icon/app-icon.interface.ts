import type { IAppIcon } from "@/assets/icon/icon.interface";

export interface IAppIconProps {
  icon: IAppIcon;
  size: number;
  color: string;
  strokeWidth?: number;
}
