import { TransactionType } from "@/lib/generated/prisma/enums";
import z from "zod";

const transactionCreateBaseSchema = z.object({
  type: z.enum(TransactionType),
  name: z.string().min(1, "Transaktionen måste ha ett namn"),
  date: z.date(),
  categoryId: z.cuid2("Ange en kategori"),
});

export const transactionCreateFormSchema = transactionCreateBaseSchema.extend({
  amount: z
    .string()
    .min(1, "Ange ett belopp")
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) return -1; // Force it to fail the positive check if it's not a number
      return parsed;
    })
    .pipe(z.number().positive("Ange ett positivt belopp")),
});

export const transactionCreateSchema = transactionCreateBaseSchema.extend({
  amountInCents: z.int().positive(),
});

export type TransactionCreateForm = z.infer<typeof transactionCreateFormSchema>;
export type TransactionCreate = z.infer<typeof transactionCreateSchema>;
