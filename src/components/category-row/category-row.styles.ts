import { StyleSheet } from "react-native-unistyles";

export const categoryRowStyles = StyleSheet.create((theme) => ({
  textWrap: {
    flex: 1,
  },
  label: (tone: "default" | "muted" | "warning") => ({
    fontSize: 16,
    fontFamily: theme.typography.body.bold,
    color: {
      default: theme.colors.text,
      muted: theme.colors.textSecondary,
      warning: theme.colors.warning,
    }[tone],
  }),
  percent: {
    marginTop: 2,
    fontSize: 14,
    fontFamily: theme.typography.mono.regular,
    color: theme.colors.textSecondary,
  },
  amount: (isWarning: boolean) => ({
    fontSize: 16,
    fontFamily: theme.typography.mono.medium,
    color: isWarning ? theme.colors.warning : theme.colors.text,
  }),
}));
