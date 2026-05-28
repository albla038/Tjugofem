import "server-only";

import prisma from "@/lib/db";
import { requireUser } from "@/data/user/verify-user";
import { Prisma, TransactionType } from "@/lib/generated/prisma/client";
import { getNextMonth } from "@/lib/utils";
import { BudgetItemWithCategoryAndSum, BudgetSummary } from "@/types/budget";

const budgetWithBudgetItemInclude = {
  budgetItems: {
    select: {
      categoryId: true,
      limitInCents: true,
    },
  },
} satisfies Prisma.BudgetInclude;

export type BudgetWithBudgetItems = Prisma.BudgetGetPayload<{
  include: typeof budgetWithBudgetItemInclude;
}>;

export async function fetchBudgetWithItems(
  year: number,
  monthIndex: number
): Promise<BudgetWithBudgetItems | null> {
  const user = await requireUser();

  try {
    const budget = await prisma.budget.findUnique({
      where: {
        year_monthIndex_userId: {
          userId: user.id,
          year,
          monthIndex,
        },
      },
      include: budgetWithBudgetItemInclude,
    });

    return budget;
  } catch (error) {
    throw new Error(
      `Failed to fetch budget for ${year}-${monthIndex} for user ID: ${user.id}`,
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      }
    );
  }
}

export async function checkIfBudgetExists(
  year: number,
  monthIndex: number
): Promise<boolean> {
  const user = await requireUser();

  try {
    const budget = await prisma.budget.findUnique({
      where: {
        year_monthIndex_userId: {
          userId: user.id,
          year,
          monthIndex,
        },
      },
      select: { id: true },
    });

    return !!budget;
  } catch (error) {
    throw new Error(
      `Failed to fetch budget for ${year}-${monthIndex} for user ID: ${user.id}`,
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      }
    );
  }
}

async function getBudgetEndDate(
  year: number,
  monthIndex: number
): Promise<Date> {
  const user = await requireUser();

  let endDate: Date;

  const { year: nextMonthYear, monthIndex: nextMonthIndex } = getNextMonth(
    year,
    monthIndex
  );

  // Get the next month's start day if it exists
  const nextMonthBudget = await prisma.budget.findUnique({
    where: {
      year_monthIndex_userId: {
        userId: user.id,
        year: nextMonthYear,
        monthIndex: nextMonthIndex,
      },
    },
    select: { startDate: true },
  });

  if (nextMonthBudget) {
    endDate = nextMonthBudget.startDate;
  } else {
    // Next budget doesn't exist, set end date to the 1st of the next month
    // (to capture everything up to 23:59:59.999 of the last day of the current month)
    endDate = new Date(nextMonthYear, nextMonthIndex, 1);
  }

  return endDate;
}

export async function calculateBudgetClosingBalance({
  year,
  monthIndex,
  providedEndDate,
}: {
  year: number;
  monthIndex: number;
  providedEndDate?: Date;
}): Promise<number | null> {
  const user = await requireUser();

  try {
    // Get the opening balance for the specified month
    const budget = await prisma.budget.findUnique({
      where: {
        year_monthIndex_userId: {
          userId: user.id,
          year,
          monthIndex,
        },
      },
      select: { openingBalanceInCents: true, startDate: true },
    });

    if (!budget) {
      // No budget for this month, so we return null as the closing balance
      return null;
    }

    const startDate = budget.startDate;
    let endDate: Date;

    // If an end date override is provided, use it
    if (providedEndDate) {
      endDate = providedEndDate;
    } else {
      // Otherwise, determine the end date based on the next month's budget
      // or default to the 1st of the next month
      endDate = await getBudgetEndDate(year, monthIndex);
    }

    // Sum all transactions for the user within the budget period, grouped by type
    const transactionGroups = await prisma.transaction.groupBy({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      by: ["type"],
      _sum: { amountInCents: true },
    });

    let closingBalanceInCents = budget.openingBalanceInCents;

    // Add sum of income and subtract sum of expenses
    for (const group of transactionGroups) {
      if (group.type === "INCOME") {
        closingBalanceInCents += group._sum.amountInCents ?? 0;
      } else {
        closingBalanceInCents -= group._sum.amountInCents ?? 0;
      }
    }

    return closingBalanceInCents;
  } catch (error) {
    throw new Error(
      `Failed to calculate budget closing balance for ${year}-${monthIndex} for user ID: ${user.id}`,
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      }
    );
  }
}

export async function calculateBudgetSummary(
  year: number,
  monthIndex: number
): Promise<BudgetSummary | null> {
  const user = await requireUser();

  try {
    // Get the opening balance for the specified month
    const budget = await prisma.budget.findUnique({
      where: {
        year_monthIndex_userId: {
          userId: user.id,
          year,
          monthIndex,
        },
      },
      include: {
        budgetItems: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!budget) {
      // No budget for this month, so we return null as the closing balance
      return null;
    }

    const startDate = budget.startDate;
    const endDate = await getBudgetEndDate(year, monthIndex);

    // Sum all transactions for the user within the budget period, grouped by type
    const transactionGroups = await prisma.transaction.groupBy({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      by: ["type", "categoryId"],
      _sum: { amountInCents: true },
    });

    const budgetItemMap = new Map<string, BudgetItemWithCategoryAndSum>(
      budget.budgetItems.map((item) => [
        item.categoryId,
        { ...item, sumInCents: 0 },
      ])
    );

    const current = {
      incomeSumInCents: 0,
      expenseSumInCents: 0,
      savingsSumInCents: 0,
    };

    // Update the sumInCents for each budget item based on the transaction groups
    for (const group of transactionGroups) {
      const amount = group._sum.amountInCents ?? 0;

      // Get the corresponding budget item for this transaction group based on the category ID
      if (group.categoryId) {
        const budgetItem = budgetItemMap.get(group.categoryId);
        if (!budgetItem) {
          console.warn(
            `Transaction sum with category ID ${group.categoryId} does not have a corresponding budget item.`
          );
        } else {
          budgetItem.sumInCents += amount;
        }
      }

      // Update the current income/expense/saving totals based on the transaction type
      switch (group.type) {
        case "INCOME":
          current.incomeSumInCents += amount;
          break;
        case "EXPENSE":
          current.expenseSumInCents += amount;
          break;
        case "SAVING":
          current.savingsSumInCents += amount;
          break;
      }
    }

    const planned = {
      incomeSumInCents: 0,
      expenseSumInCents: 0,
      savingsSumInCents: 0,
    };

    // Aggregate planned income/expense/saving totals from the budget items
    for (const budgetItem of budget.budgetItems) {
      const amount = budgetItem.limitInCents;
      const type = budgetItem.category.type;

      switch (type) {
        case "INCOME":
          planned.incomeSumInCents += amount;
          break;
        case "EXPENSE":
          planned.expenseSumInCents += amount;
          break;
        case "SAVING":
          planned.savingsSumInCents += amount;
          break;
      }
    }

    const groupedBudgetItems: Record<
      TransactionType,
      BudgetItemWithCategoryAndSum[]
    > = {
      INCOME: [],
      EXPENSE: [],
      SAVING: [],
    };

    // Group budget items by their category type
    Array.from(budgetItemMap.values()).forEach((item) => {
      groupedBudgetItems[item.category.type].push(item);
    });

    const plannedClosingBalance =
      budget.openingBalanceInCents +
      planned.incomeSumInCents -
      planned.expenseSumInCents -
      planned.savingsSumInCents;

    const currentBalance =
      budget.openingBalanceInCents +
      current.incomeSumInCents -
      current.expenseSumInCents -
      current.savingsSumInCents;

    return {
      ...budget,
      plannedClosingBalanceInCents: plannedClosingBalance,
      currentBalanceInCents: currentBalance,
      current,
      planned,
      budgetItems: groupedBudgetItems,
    };
  } catch (error) {
    throw new Error(
      `Failed to calculate budget summary closing balance for ${year}-${monthIndex} for user ID: ${user.id}`,
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      }
    );
  }
}
