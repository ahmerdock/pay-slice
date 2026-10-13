export interface ICategory {
  id: string;
  label: string;
  percent: number;
}

export interface IBudget {
  income: string;
  categories: ICategory[];
}

interface IBreakdownRow extends ICategory {
  amount: number;
}

export interface IBreakdown {
  rows: IBreakdownRow[];
  totalPercent: number;
  remainingPercent: number;
  remainingAmount: number;
  isOver: boolean;
}
