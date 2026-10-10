import { sanitizeDecimalInput } from "@/utils/number-input";
import { IBreakdown, IBudget, ICategory } from "./home.interface";

const EMPTY_BUDGET: IBudget = { income: "", categories: [] };

// Money is computed in whole cents and percents in hundredths of a percent,
// so the totals never pick up floating point drift.
export const computeBreakdown = (
  income: number,
  categories: ICategory[],
): IBreakdown => {
  const incomeCents = Math.round(income * 100);
  let totalBasisPoints = 0;
  let allocatedCents = 0;

  const rows = categories.map((category) => {
    const basisPoints = Math.round(category.percent * 100);
    const cents = Math.round((incomeCents * basisPoints) / 10000);

    totalBasisPoints += basisPoints;
    allocatedCents += cents;

    return { ...category, amount: cents / 100 };
  });

  return {
    rows,
    totalPercent: totalBasisPoints / 100,
    remainingPercent: (10000 - totalBasisPoints) / 100,
    remainingAmount: (incomeCents - allocatedCents) / 100,
    isOver: totalBasisPoints > 10000,
  };
};

const isCategory = (value: unknown): value is ICategory => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const { id, label, percent } = value as Record<string, unknown>;

  return (
    typeof id === "string" &&
    typeof label === "string" &&
    typeof percent === "number" &&
    Number.isFinite(percent) &&
    percent > 0
  );
};

export const parseStoredBudget = (raw: string | undefined): IBudget => {
  if (!raw) {
    return EMPTY_BUDGET;
  }

  try {
    const data: unknown = JSON.parse(raw);

    if (typeof data !== "object" || data === null) {
      return EMPTY_BUDGET;
    }

    const { income, categories } = data as Record<string, unknown>;

    return {
      income: typeof income === "string" ? sanitizeDecimalInput(income) : "",
      categories: Array.isArray(categories)
        ? categories.filter(isCategory)
        : [],
    };
  } catch {
    return EMPTY_BUDGET;
  }
};

export const createCategoryId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
