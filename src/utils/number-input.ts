export const sanitizeDecimalInput = (text: string, maxDecimals = 2) => {
  const cleaned = text.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  const [whole, ...rest] = cleaned.split(".");

  if (rest.length === 0) {
    return whole;
  }

  return `${whole}.${rest.join("").slice(0, maxDecimals)}`;
};

export const parsePositiveNumber = (text: string) => {
  const value = parseFloat(text);

  return Number.isFinite(value) && value > 0 ? value : 0;
};
