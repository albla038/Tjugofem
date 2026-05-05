"use server";

import { createCategory } from "@/data/category/mutations";
import { requireUser } from "@/data/user/verify-user";
import { CategoryCreate, categoryCreateSchema } from "@/schemas/category";
import { ActionResponse } from "@/types/results";
import { revalidatePath } from "next/cache";

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
