import { StyleSheet } from "react-native-unistyles";

export const homeStyles = StyleSheet.create((theme) => ({
  incomeInput: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(1.5),
    marginBottom: theme.gap(3),
    fontSize: 28,
    fontFamily: theme.typography.mono.medium,
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: theme.typography.body.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.gap(2),
  },
}));
