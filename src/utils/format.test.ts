import { formatAmount, formatPercent } from "./format";

describe("formatting", () => {
  it("adds thousands separators and trims trailing zeros", () => {
    expect(formatAmount(1234567)).toBe("1,234,567");
    expect(formatAmount(1234.5)).toBe("1,234.5");
  });

  it("formats percents without trailing zeros", () => {
    expect(formatPercent(14)).toBe("14%");
    expect(formatPercent(12.5)).toBe("12.5%");
  });
});
