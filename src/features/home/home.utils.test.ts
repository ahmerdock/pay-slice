import { computeBreakdown, parseStoredBudget } from "./home.utils";

const category = (id: string, percent: number) => ({
  id,
  label: id,
  percent,
});

describe("computeBreakdown", () => {
  it("splits income by percent and reports what is left", () => {
    const result = computeBreakdown(5000, [
      category("savings", 14),
      category("rent", 35),
    ]);

    expect(result.rows.map((row) => row.amount)).toEqual([700, 1750]);
    expect(result.totalPercent).toBe(49);
    expect(result.remainingPercent).toBe(51);
    expect(result.remainingAmount).toBe(2550);
    expect(result.isOver).toBe(false);
  });

  it("flags totals over 100 and reports a negative remainder", () => {
    const result = computeBreakdown(1000, [
      category("a", 60),
      category("b", 50),
    ]);

    expect(result.isOver).toBe(true);
    expect(result.remainingPercent).toBe(-10);
    expect(result.remainingAmount).toBe(-100);
  });

  it("makes the rows and the remainder add up to the income", () => {
    const result = computeBreakdown(100, [
      category("a", 33.33),
      category("b", 33.33),
    ]);
    const sum =
      result.rows.reduce((total, row) => total + row.amount, 0) +
      result.remainingAmount;

    expect(Math.round(sum * 100)).toBe(10000);
  });

  it("handles zero income and no categories", () => {
    expect(computeBreakdown(0, [category("a", 10)]).rows[0].amount).toBe(0);

    const empty = computeBreakdown(500, []);
    expect(empty.rows).toEqual([]);
    expect(empty.remainingPercent).toBe(100);
    expect(empty.remainingAmount).toBe(500);
  });

  it("avoids floating point drift in the percent total", () => {
    const result = computeBreakdown(100, [
      category("a", 0.1),
      category("b", 0.2),
    ]);

    expect(result.totalPercent).toBe(0.3);
  });
});

describe("parseStoredBudget", () => {
  it("falls back to an empty budget for missing or broken data", () => {
    const empty = { income: "", categories: [] };

    expect(parseStoredBudget(undefined)).toEqual(empty);
    expect(parseStoredBudget("not json")).toEqual(empty);
    expect(parseStoredBudget('"text"')).toEqual(empty);
  });

  it("keeps valid data and drops invalid categories", () => {
    const stored = JSON.stringify({
      income: "5000",
      categories: [
        { id: "1", label: "Savings", percent: 14 },
        { id: "2", label: "Bad", percent: "x" },
        { label: "No id", percent: 5 },
      ],
    });

    expect(parseStoredBudget(stored)).toEqual({
      income: "5000",
      categories: [{ id: "1", label: "Savings", percent: 14 }],
    });
  });
});
