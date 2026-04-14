import prisma from "@/lib/db";
import { TransactionType } from "@/lib/generated/prisma/enums";
import { requireUser } from "../user/verify-user";
import { User } from "better-auth";

const defaultCategories: { name: string; type: TransactionType }[] = [
  {
    name: "Mat & hushåll",
    type: "EXPENSE",
  },
  {
    name: "Hyra",
    type: "EXPENSE",
  },
  {
    name: "Försäkring",
    type: "EXPENSE",
  },
  {
    name: "Bil & transport",
    type: "EXPENSE",
  },
  {
    name: "Fondsparande",
    type: "SAVING",
  },
  {
    name: "Buffertsparande",
    type: "SAVING",
  },
  {
    name: "Lön",
    type: "INCOME",
  },
  {
    name: "CSN",
    type: "INCOME",
  },
];

export async function createDefaultCategories(user: User) {
  try {
    await prisma.category.createMany({
      data: defaultCategories.map((c) => ({ ...c, userId: user.id })),
    });
  } catch (error) {
    // If creation of default categories fails, delete user to trigger database hook on re-register
    await prisma.user.delete({ where: { id: user.id } });

    throw new Error(
      `Failed to create default categories for user ID: ${user.id}`,
      {
        cause: error instanceof Error ? error : new Error(String(error)),
      }
    );
  }
}
