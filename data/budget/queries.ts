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
