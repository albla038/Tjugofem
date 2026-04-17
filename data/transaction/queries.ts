import "server-only";

import { requireUser } from "@/data/user/verify-user";
import prisma from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";

const transactionWithCategoryInclude = {
  category: {
    select: {
      id: true,
      name: true,
      icon: true,
    },
  },
} satisfies Prisma.TransactionInclude;

// TODO: Check if this should be moved to a type def file
export type TransactionWithCategory = Prisma.TransactionGetPayload<{
  include: typeof transactionWithCategoryInclude;
}>;

export async function fetchTransactions(): Promise<TransactionWithCategory[]> {
  const user = await requireUser();

  try {
    const data = await prisma.transaction.findMany({
      where: { userId: user.id }, // Assert that the transactions belong to the user
      include: transactionWithCategoryInclude,
      orderBy: { date: "desc" },
    });

    return data;
  } catch (error) {
    throw new Error(`Failed to fetch transactions for user ID: ${user.id}`, {
      cause: error instanceof Error ? error : new Error(String(error)),
    });
  }
}
