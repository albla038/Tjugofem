import { Budget, Prisma, TransactionType } from "@/lib/generated/prisma/client";

export type BudgetSummary = Budget & {
  plannedClosingBalanceInCents: number;
  currentBalanceInCents: number;
  current: {
    incomeSumInCents: number;
    expenseSumInCents: number;
    savingsSumInCents: number;
  };
  planned: {
    incomeSumInCents: number;
    expenseSumInCents: number;
    savingsSumInCents: number;
  };
  budgetItems: Record<TransactionType, BudgetItemWithCategoryAndSum[]>;
};

export type BudgetItemWithCategoryAndSum = Prisma.BudgetItemGetPayload<{
  include: {
    category: true;
  };
}> & {
  sumInCents: number;
};
