import "server-only";

import prisma from "@/lib/db";
import { requireUser } from "../user/verify-user";
import { Category } from "@/lib/generated/prisma/client";

export async function fetchAllCategories(): Promise<Category[]> {
  const user = await requireUser();

  try {
    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    });

    return categories;
  } catch (error) {
    throw new Error(`Failed to fetch categories for user ID: ${user.id}`, {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export async function fetchAllCategoryIds(): Promise<string[]> {
  const user = await requireUser();

  try {
    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      select: { id: true },
    });

    return categories.map((cat) => cat.id);
  } catch (error) {
    throw new Error(`Failed to fetch category ID:s for user ID: ${user.id}`, {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
