import "server-only";

import { requireUser } from "@/data/user/verify-user";
import { TransactionCreate, TransactionUpdate } from "@/schemas/transaction";
import { MutationResult } from "@/types/results";
import prisma from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";

export async function createTransaction(
  data: TransactionCreate
): Promise<MutationResult> {
  const user = await requireUser();

  try {
    await prisma.transaction.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return { ok: true, data: undefined };
  } catch (error) {
    console.error(error);
    return { ok: false, errorCode: "INTERNAL_ERROR" };
  }
}

export async function updateTransaction(
  data: TransactionUpdate
): Promise<MutationResult> {
  const user = await requireUser();

  const { id, ...newData } = data;

  try {
    await prisma.transaction.update({
      where: {
        id: id,
        // Ensure the user owns this transaction
        userId: user.id,
      },

      data: newData,
    });

    return { ok: true, data: undefined };
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { ok: false, errorCode: "NOT_FOUND" };
    }

    return { ok: false, errorCode: "INTERNAL_ERROR" };
  }
}
