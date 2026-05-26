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
  monthIndex: z.number().int().positive(),
  startDate: z.date(),
  copyPrevMonth: z.boolean().default(false),
});

export type BudgetCreateForm = z.infer<typeof budgetFormSchema>;
export type BudgetCreate = z.infer<typeof budgetCreateSchema>;
