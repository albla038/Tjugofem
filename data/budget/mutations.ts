import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { BudgetItemCreateManyBudgetInput } from "@/lib/generated/prisma/models";
import { BudgetCreate } from "@/schemas/budget";
import { MutationResult } from "@/types/results";
import { fetchAllCategoryIds } from "@/data/category/queries";
import { safeQuery } from "@/lib/safe-query";
import {
  calculateBudgetClosingBalance,
  fetchBudgetWithItems,
} from "@/data/budget/queries";

export async function createBudget(
  data: BudgetCreate
): Promise<MutationResult> {
  const user = await requireUser();

  const { copyPrevMonth, ...budgetData } = data;

  // Calculate the previous month and year properly
  let prevMonthIndex = data.monthIndex - 1;
  let prevYear = data.year;
  if (prevMonthIndex < 0) {
    prevMonthIndex = 11;
    prevYear -= 1;
  }

  // Get the closing balance from the previous month to set as opening balance for the new budget
  const queryRes = await safeQuery(() =>
    calculateBudgetClosingBalance({
      year: prevYear,
      monthIndex: prevMonthIndex,
      providedEndDate: data.startDate,
    })
  );

  // Return early if the query failed
  if (!queryRes.ok) {
    return { ok: false, errorCode: "INTERNAL_ERROR" };
  }

  const prevClosingBalanceInCents = queryRes.data;

  // Fetch category IDs to create budget items for,
  // either from previous month or as new with 0 limits
  let budgetItemsToCreate: BudgetItemCreateManyBudgetInput[] = [];
  if (copyPrevMonth) {
    const queryRes = await safeQuery(() =>
      fetchBudgetWithItems(prevYear, prevMonthIndex)
    );

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
        userId: user.id,
        ...budgetData,
        openingBalanceInCents: prevClosingBalanceInCents ?? 0,

        budgetItems: {
          createMany: {
            data: budgetItemsToCreate,
          },
        },
      },
    });

    return { ok: true, data: undefined };
  } catch (error) {
    console.error(
      `Failed to create new budget for user ${user.id} and month ${data.monthIndex + 1}/${data.year}`,
      error
    );
    return { ok: false, errorCode: "INTERNAL_ERROR" };
  }
}
