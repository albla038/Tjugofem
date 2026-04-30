"use server";

import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/data/transaction/mutations";
import { requireUser } from "@/data/user/verify-user";
import {
  TransactionCreate,
  transactionCreateSchema,
  TransactionUpdate,
  transactionUpdateSchema,
} from "@/schemas/transaction";
import { ActionResponse } from "@/types/results";
import { revalidatePath } from "next/cache";
import z from "zod";

// Local schemas
const idSchema = z.cuid2();

export async function createTransactionAction(
  data: TransactionCreate
): Promise<ActionResponse> {
  // Authenticate user
  await requireUser();

  // Validate input data
  const validated = transactionCreateSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Call DAL mutation
  const mutationRes = await createTransaction(validated.data);

  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Revalidate cache
  revalidatePath("/transactions");

  return { success: true, data: undefined };
}

export async function updateTransactionAction(
  data: TransactionUpdate
): Promise<ActionResponse> {
  // Authenticate user
  await requireUser();

  // Validate input data
  const validated = transactionUpdateSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Call DAL mutation
  const mutationRes = await updateTransaction(validated.data);

  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Revalidate cache
  revalidatePath("/transactions");

  return { success: true, data: undefined };
}

export async function deleteTransactionAction(
  id: string
): Promise<ActionResponse> {
  // Authenticate user
  await requireUser();

  // Validate input data
  const validated = idSchema.safeParse(id);

  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Call DAL mutation
  const mutationRes = await deleteTransaction(validated.data);

  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Revalidate cache
  revalidatePath("/transactions");

  return { success: true, data: undefined };
}
