import z from "zod";

export const budgetFormSchema = z.object({
  openingBalance: z
    .string()
    .min(1, "Ange ett belopp")
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) return -1; // Force it to fail the positive check if it's not a number
      return parsed;
    })
    .pipe(z.number().positive("Ange ett positivt belopp")),
  startDay: z
    .string()
    .min(1, "Ange ett startdatum")
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) return -1; // Force it to fail the positive check if it's not a number
      return parsed;
    })
    .pipe(z.number().int().positive("Ange ett positivt heltal som startdag")),
});

export const budgetCreateSchema = z.object({
  year: z.number().int().positive(),
  monthIndex: z.number().int().positive(),
  openingBalanceInCents: z.number().int().positive(),
  startDay: z.number().int().positive(),
  copyPrevMonth: z.boolean().default(false),
});

export type BudgetCreateForm = z.infer<typeof budgetFormSchema>;
export type BudgetCreate = z.infer<typeof budgetCreateSchema>;
