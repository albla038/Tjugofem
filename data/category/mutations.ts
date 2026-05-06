import prisma from "@/lib/db";
import { CategoryCreate, CategoryUpdate } from "@/schemas/category";
import { User } from "better-auth";
import { requireUser } from "../user/verify-user";
import { MutationResult } from "@/types/results";
import { Prisma } from "@/lib/generated/prisma/client";

const defaultCategories: Omit<Prisma.CategoryCreateManyInput, "userId">[] = [
  // Expenses
  {
    name: "Mat & hushåll",
    type: "EXPENSE",
    color: "#86efac", // Green
    icon: "ShoppingCart",
  },
  {
    name: "Hyra",
    type: "EXPENSE",
    color: "#fcd34d", // Yellow
    icon: "Home",
  },
  {
    name: "Bolån",
    type: "EXPENSE",
    color: "#fcd34d", // Yellow
    icon: "Home",
  },
  {
    name: "El, vatten & energi",
    type: "EXPENSE",
    color: "#fcd34d", // Yellow
    icon: "Zap",
  },
  {
    name: "Telefoni",
    type: "EXPENSE",
    color: "#fcd34d", // Yellow
    icon: "Wifi",
  },
  {
    name: "Bil & transport",
    type: "EXPENSE",
    color: "#c4cfc8", // Olive
    icon: "Car",
  },
  {
    name: "Försäkring",
    type: "EXPENSE",
    color: "#5eead4", // Teal
    icon: "ShieldCheck",
  },
  {
    name: "Nöjen",
    type: "EXPENSE",
    color: "#d8b4fe", // Purple
    icon: "Gift",
  },
  {
    name: "Resor",
    type: "EXPENSE",
    color: "#d8b4fe", // Purple
    icon: "Plane",
  },
  {
    name: "Kläder & shopping",
    type: "EXPENSE",
    color: "#fca5a5", // Red
    icon: "ShoppingBag",
  },
  {
    name: "Abonnemang & prenumerationer",
    type: "EXPENSE",
    color: "#c4b5fd", // Violet
    icon: "CalendarSync",
  },
  {
    name: "Hälsa & träning",
    type: "EXPENSE",
    color: "#f9a8d4", // Pink
    icon: "Activity",
  },
  {
    name: "Kurslitteratur",
    type: "EXPENSE",
    color: "#bef264", // Lime
    icon: "BookOpenText",
  },

  // Savings
  {
    name: "Sparande",
    type: "SAVING",
    color: "#7dd3fc", // Sky Blue
    icon: "PiggyBank",
  },
  {
    name: "Investeringar",
    type: "SAVING",
    color: "#a5b4fc", // Indigo
    icon: "Banknote",
  },

  // Income
  {
    name: "Lön",
    type: "INCOME",
    color: "#6ee7b7", // Emerald
    icon: "Coins",
  },
  {
    name: "CSN",
    type: "INCOME",
    color: "#6ee7b7", // Emerald
    icon: "GraduationCap",
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

export async function createCategory(
  data: CategoryCreate
): Promise<MutationResult> {
  const user = await requireUser();

  try {
    await prisma.category.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return { ok: true, data: undefined };
  } catch (error) {
    console.log(error);
    return { ok: false, errorCode: "INTERNAL_ERROR" };
  }
}

export async function updateCategory(
  data: CategoryUpdate
): Promise<MutationResult> {
  const user = await requireUser();

  const { id, ...newData } = data;

  try {
    await prisma.category.update({
      where: {
        id: id,
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

export async function deleteCategory(id: string): Promise<MutationResult> {
  const user = await requireUser();

  try {
    await prisma.category.delete({
      where: {
        id,
        userId: user.id,
      },
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
