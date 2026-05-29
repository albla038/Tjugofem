"use server";

import { createBudget, updateBudgetItemLimit } from "@/data/budget/mutations";
import { requireUser } from "@/data/user/verify-user";
import {
  BudgetCreate,
  budgetCreateSchema,
  BudgetItemLimitUpdate,
  budgetItemLimitUpdateSchema,
} from "@/schemas/budget";
import { ActionResponse } from "@/types/results";
import { revalidatePath } from "next/cache";

export async function createBudgetAction(
  data: BudgetCreate
): Promise<ActionResponse> {
  // Authenticate user
  await requireUser();

  // Validate input data
  const validated = budgetCreateSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Call DAL mutation
  const mutationRes = await createBudget(validated.data);

  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Purge cache
  revalidatePath(`/budget/${data.year}/${data.monthIndex + 1}`);

  return { success: true, data: undefined };
}

export async function updateBudgetItemLimitAction(
  data: BudgetItemLimitUpdate
): Promise<ActionResponse> {
  // Authenticate user
  await requireUser();

  // Validate input data
  const validated = budgetItemLimitUpdateSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Call DAL mutation
  const mutationRes = await updateBudgetItemLimit(validated.data);

  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Revalidate cache
  revalidatePath("/budget/[year]/[month]");

  return { success: true, data: undefined };
}
