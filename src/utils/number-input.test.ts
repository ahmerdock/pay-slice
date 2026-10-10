import { parsePositiveNumber, sanitizeDecimalInput } from "./number-input";

describe("sanitizeDecimalInput", () => {
  it("keeps digits and a single dot", () => {
    expect(sanitizeDecimalInput("1a2.3.4")).toBe("12.34");
  });

  it("treats a comma as the decimal separator", () => {
    expect(sanitizeDecimalInput("12,5")).toBe("12.5");
  });

  it("limits the decimals", () => {
    expect(sanitizeDecimalInput("1.2345")).toBe("1.23");
  });

  it("returns an empty string for non-numeric input", () => {
    expect(sanitizeDecimalInput("abc")).toBe("");
  });
});

describe("parsePositiveNumber", () => {
  it("parses a number", () => {
    expect(parsePositiveNumber("5000.5")).toBe(5000.5);
  });

  it("returns 0 for empty, lone-dot or non-positive input", () => {
    expect(parsePositiveNumber("")).toBe(0);
    expect(parsePositiveNumber(".")).toBe(0);
    expect(parsePositiveNumber("0")).toBe(0);
  });
});
