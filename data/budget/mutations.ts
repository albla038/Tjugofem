import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { BudgetItemCreateManyBudgetInput } from "@/lib/generated/prisma/models";
import { BudgetCreate } from "@/schemas/budget";
import { MutationResult } from "@/types/results";
import { fetchAllCategoryIds } from "@/data/category/queries";
import { safeQuery } from "@/lib/safe-query";
import { fetchBudgetWithItems } from "@/data/budget/queries";

export async function createBudget(
  data: BudgetCreate
): Promise<MutationResult> {
  const user = await requireUser();

  // Fetch category IDs to create budget items for,
  // either from previous month or as new with 0 limits
  let budgetItemsToCreate: BudgetItemCreateManyBudgetInput[] = [];
  if (data.copyPrevMonth) {
    const queryRes = await safeQuery(() =>
      fetchBudgetWithItems(data.year, data.monthIndex)
    );

    // Return early if the query failed
    if (!queryRes.ok) {
      return { ok: false, errorCode: "INTERNAL_ERROR" };
    }

    if (!queryRes.data) {
      // If there's no previous month budget, we can't copy items
      return { ok: false, errorCode: "NOT_FOUND" };
    }

    budgetItemsToCreate = queryRes.data.budgetItems.map((item) => item);
  } else {
    const queryRes = await safeQuery(fetchAllCategoryIds);

    if (!queryRes.ok) {
      return { ok: false, errorCode: "INTERNAL_ERROR" };
    }

    budgetItemsToCreate = queryRes.data.map((categoryId) => ({
      categoryId,
      limitInCents: 0,
    }));
  }

  try {
    await prisma.budget.create({
      data: {
        ...data,
        userId: user.id,

        budgetItems: {
          createMany: {
            data: budgetItemsToCreate,
          },
        },
      },
    });

    return { ok: true, data: undefined };
  } catch {
    return { ok: false, errorCode: "INTERNAL_ERROR" };
  }
}
