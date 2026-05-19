import "server-only";

import prisma from "@/lib/db";
import { requireUser } from "@/data/user/verify-user";
import { Prisma } from "@/lib/generated/prisma/client";

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

export async function calculateBudgetClosingBalance(
  year: number,
  monthIndex: number,
  endDay?: number
): Promise<number | null> {
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
      select: { openingBalanceInCents: true, startDay: true },
    });

    if (!budget) {
      // No budget for this month, so we return null as the closing balance
      return null;
    }

    // Calculate the start and end dates for the current budget period
    let startDate = new Date(year, monthIndex - 1, budget.startDay);
    if (budget.startDay === 1) {
      startDate = new Date(year, monthIndex, 1);
    }

    let nextYear = year;
    let nextMonthIndex = monthIndex + 1;

    // If next month index exceeds December, roll over to January of the next year
    if (nextMonthIndex > 11) {
      nextYear += 1;
      nextMonthIndex = 0;
    }

    // Get the next month's start day if it exists
    const nextMonthBudget = await prisma.budget.findUnique({
      where: {
        year_monthIndex_userId: {
          userId: user.id,
          year: nextYear,
          monthIndex: nextMonthIndex,
        },
      },
    });

    let endDate = new Date(nextYear, nextMonthIndex, 1); // Default end date is the first day of the next month

    // If the next month budget exists and has a start day, use it as the end date
    if (nextMonthBudget) {
      if (nextMonthBudget.startDay === 1) {
        endDate = new Date(nextYear, nextMonthIndex, 1);
      } else {
        endDate = new Date(year, monthIndex, nextMonthBudget.startDay);
      }
    }

    // If an end day is provided, use it as the end date
    if (endDay) {
      endDate = new Date(year, monthIndex, endDay);
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
