import { StyleSheet } from "react-native-unistyles";

export const categorySheetStyles = StyleSheet.create((theme) => ({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: theme.gap(3),
    paddingBottom: theme.gap(4),
  },
  title: {
    fontFamily: theme.typography.heading.regular,
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: theme.gap(2),
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: theme.typography.body.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.gap(1),
  },
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(1.5),
    fontSize: 16,
    fontFamily: theme.typography.body.regular,
    color: theme.colors.text,
    marginBottom: theme.gap(2),
  },
  percentInput: {
    fontFamily: theme.typography.mono.regular,
  },
  warning: {
    fontSize: 14,
    fontFamily: theme.typography.body.medium,
    color: theme.colors.warning,
    marginBottom: theme.gap(2),
  },
  actions: {
    flexDirection: "row",
    gap: theme.gap(1.5),
  },
  button: (variant: "primary" | "secondary", disabled: boolean) => ({
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.gap(1.5),
    borderRadius: 12,
    backgroundColor:
      variant === "primary"
        ? theme.colors.primary
        : theme.colors.backgroundSecondary,
    opacity: disabled ? 0.5 : 1,
  }),
  buttonText: (variant: "primary" | "secondary") => ({
    fontSize: 16,
    fontFamily: theme.typography.body.bold,
    color: variant === "primary" ? theme.colors.onPrimary : theme.colors.text,
  }),
  deleteText: {
    fontSize: 16,
    fontFamily: theme.typography.body.bold,
    color: theme.colors.warning,
  },
  deleteButton: {
    alignItems: "center",
    paddingVertical: theme.gap(2),
  },
}));
