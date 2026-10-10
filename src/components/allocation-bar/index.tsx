import { Text, View } from "react-native";
import { formatPercent } from "@/utils/format";
import { IAllocationBarProps } from "./allocation-bar.interface";
import { allocationBarStyles } from "./allocation-bar.styles";

export default function AllocationBar(props: IAllocationBarProps) {
  const { totalPercent, remainingPercent } = props;
  const isOver = remainingPercent < 0;

  const caption = isOver
    ? `Over by ${formatPercent(-remainingPercent)}`
    : `${formatPercent(totalPercent)} allocated`;

  return (
    <View style={allocationBarStyles.container}>
      <View style={allocationBarStyles.track}>
        <View style={allocationBarStyles.fill(totalPercent, isOver)} />
      </View>
      <Text style={allocationBarStyles.caption(isOver)}>{caption}</Text>
    </View>
  );
}
