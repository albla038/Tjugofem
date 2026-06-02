import z from "zod";

export const budgetFormSchema = z.object({
  startDate: z
    .string()
    .min(1, "Ange ett startdatum")
    .transform((val) => new Date(val))
    .pipe(z.date("Ange ett giltigt startdatum")),
});

export const budgetCreateSchema = z.object({
  year: z.number().int().positive(),
  monthIndex: z.number().int().min(0).max(11),
  startDate: z.date(),
  copyPrevMonth: z.boolean().default(false),
});

export type BudgetCreateForm = z.infer<typeof budgetFormSchema>;
export type BudgetCreate = z.infer<typeof budgetCreateSchema>;

export const budgetItemLimitUpdateFormSchema = z.object({
  newLimitInCents: z
    .string()
    .min(1, "Ange ett belopp")
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) return -1; // Force it to fail the positive check if it's not a number
      return parsed;
    })
    .pipe(z.number().nonnegative("Ange ett positivt belopp")),
});

export const budgetItemLimitUpdateSchema = z.object({
  budgetItemId: z.cuid2(),
  newLimitInCents: z.number().int().nonnegative(),
});

export type BudgetItemLimitUpdateForm = z.infer<
  typeof budgetItemLimitUpdateFormSchema
>;
export type BudgetItemLimitUpdate = z.infer<typeof budgetItemLimitUpdateSchema>;

export const budgetOpeningBalanceUpdateFormSchema = z.object({
  newOpeningBalance: z
    .string()
    .min(1, "Ange ett belopp")
    .transform((val) => {
      const parsed = Number(val);
      if (isNaN(parsed)) return 0;
      return parsed;
    }),
});

export const budgetOpeningBalanceUpdateSchema = z.object({
  budgetId: z.cuid2(),
  newOpeningBalanceInCents: z.number().int(),
});

export type BudgetOpeningBalanceUpdateForm = z.infer<
  typeof budgetOpeningBalanceUpdateFormSchema
>;
export type BudgetOpeningBalanceUpdate = z.infer<
  typeof budgetOpeningBalanceUpdateSchema
>;
