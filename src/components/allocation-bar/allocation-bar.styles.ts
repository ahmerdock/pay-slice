import { StyleSheet } from "react-native-unistyles";

export const allocationBarStyles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: theme.gap(3),
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: theme.colors.backgroundSecondary,
  },
  fill: (percent: number, isOver: boolean) => ({
    width: `${Math.min(Math.max(percent, 0), 100)}%`,
    height: "100%",
    borderRadius: 5,
    backgroundColor: isOver ? theme.colors.warning : theme.colors.primary,
  }),
  caption: (isOver: boolean) => ({
    marginTop: theme.gap(1),
    fontSize: 14,
    fontFamily: theme.typography.body.medium,
    color: isOver ? theme.colors.warning : theme.colors.textSecondary,
  }),
}));
