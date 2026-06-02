"use server";

import {
  createBudget,
  deleteBudget,
  updateBudgetItemLimit,
  updateBudgetOpeningBalance,
} from "@/data/budget/mutations";
import { requireUser } from "@/data/user/verify-user";
import {
  BudgetCreate,
  budgetCreateSchema,
  BudgetItemLimitUpdate,
  budgetItemLimitUpdateSchema,
  BudgetOpeningBalanceUpdate,
  budgetOpeningBalanceUpdateSchema,
} from "@/schemas/budget";
import { ActionResponse } from "@/types/results";
import { revalidatePath } from "next/cache";
import z from "zod";

// Local schemas
const idSchema = z.cuid2();

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
  revalidatePath("/budget/[year]/[month]", "page");

  return { success: true, data: undefined };
}

export async function updateBudgetOpeningBalanceAction(
  data: BudgetOpeningBalanceUpdate
): Promise<ActionResponse> {
  // Authenticate user
  await requireUser();

  // Validate input data
  const validated = budgetOpeningBalanceUpdateSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Call DAL mutation
  const mutationRes = await updateBudgetOpeningBalance(validated.data);

  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Revalidate cache
  revalidatePath("/budget/[year]/[month]", "page");

  return { success: true, data: undefined };
}

export async function deleteBudgetAction(id: string): Promise<ActionResponse> {
  // Authenticate user
  await requireUser();

  // Validate input data
  const validated = idSchema.safeParse(id);

  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Call DAL mutation
  const mutationRes = await deleteBudget(validated.data);

  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Revalidate cache
  revalidatePath("/budget/[year]/[month]", "page");

  return { success: true, data: undefined };
}
