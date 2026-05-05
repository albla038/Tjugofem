import "server-only";

import { requireUser } from "@/data/user/verify-user";
import { TransactionCreate } from "@/schemas/transaction";
import { MutationResult } from "@/types/results";
import prisma from "@/lib/db";

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
