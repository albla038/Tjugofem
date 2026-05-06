"use server";

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/data/category/mutations";
import { requireUser } from "@/data/user/verify-user";
import {
  CategoryCreate,
  categoryCreateSchema,
  CategoryUpdate,
  categoryUpdateSchema,
} from "@/schemas/category";
import { ActionResponse } from "@/types/results";
import { revalidatePath } from "next/cache";
import z from "zod";

const idSchema = z.cuid2();

export async function createCategoryAction(
  data: CategoryCreate
): Promise<ActionResponse> {
  // Authenticate user
  await requireUser();

  // Validate input data
  const validated = categoryCreateSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Call DAL mutation
  const mutationRes = await createCategory(validated.data);

  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Revalidate cache
  revalidatePath("/", "layout");

  // Return response
  return { success: true, data: undefined };
}

export async function updateCategoryAction(
  data: CategoryUpdate
): Promise<ActionResponse> {
  await requireUser();

  // Validate input data
  const validated = categoryUpdateSchema.safeParse(data);

  // Return early if data is invalid
  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Call DAL mutation
  const mutationRes = await updateCategory(validated.data);

  // Return early if unsuccessful
  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Reload cache
  revalidatePath("/", "layout");

  return { success: true, data: undefined };
}

export async function deleteCategoryAction(
  id: string
): Promise<ActionResponse> {
  // Authenticate user
  await requireUser();

  // Validate input data
  const validated = idSchema.safeParse(id);

  // Return early if data is invalid
  if (!validated.success) {
    return { success: false, errorCode: "VALIDATION_FAILED" };
  }

  // Call DAL mutation
  const mutationRes = await deleteCategory(validated.data);

  if (!mutationRes.ok) {
    return { success: false, errorCode: mutationRes.errorCode };
  }

  // Validate cache
  revalidatePath("/", "layout");

  return { success: true, data: undefined };
}
