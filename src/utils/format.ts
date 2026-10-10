export const formatAmount = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

export const formatPercent = (value: number) => `${formatAmount(value)}%`;
