import { TransactionType } from "@/lib/generated/prisma/enums";
import z from "zod";

const transactionBaseSchema = z.object({
  type: z.enum(TransactionType),
  name: z.string().min(1, "Transaktionen måste ha ett namn"),
  date: z.date(),
  categoryId: z.cuid2("Ange en kategori"),
});

export const transactionFormSchema = transactionBaseSchema.extend({
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

export const transactionCreateSchema = transactionBaseSchema.extend({
  amountInCents: z.int().positive(),
});

export const transactionUpdateSchema = transactionBaseSchema.extend({
  id: z.cuid2(),
  amountInCents: z.int().positive(),
});

export type TransactionForm = z.infer<typeof transactionFormSchema>;
export type TransactionFormInput = z.input<typeof transactionFormSchema>;
export type TransactionCreate = z.infer<typeof transactionCreateSchema>;
export type TransactionUpdate = z.infer<typeof transactionUpdateSchema>;
