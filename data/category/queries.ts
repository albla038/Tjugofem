import "server-only";

import prisma from "@/lib/db";
import { requireUser } from "../user/verify-user";
import { Category } from "@/lib/generated/prisma/client";

export async function fetchAllCategories(): Promise<Category[]> {
  const user = await requireUser();

  try {
    const categories = await prisma.category.findMany({
      where: { userId: user.id },
    });

    return categories;
  } catch (error) {
    throw new Error(`Failed to fetch categories for user ID: ${user.id}`, {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
