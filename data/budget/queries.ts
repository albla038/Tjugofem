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

      // Otherwise, determine the end date based on the next month's budget
      // or default to the 1st of the next month
    } else {
      let nextMonthYear = year;
      let nextMonthIndex = monthIndex + 1;
      // If next month index exceeds December, roll over to January of the next year
      if (nextMonthIndex > 11) {
        nextMonthYear += 1;
        nextMonthIndex = 0;
      }

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
