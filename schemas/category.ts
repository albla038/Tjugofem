import { CATEGORY_ICON_MAP } from "@/lib/category-icon-map";
import { TransactionType } from "@/lib/generated/prisma/enums";
import z from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Kategorin måste ha ett namn"),
  icon: z
    .string()
    .refine((val) => val in CATEGORY_ICON_MAP, { error: "Ogiltig ikon" })
    .optional(),
  color: z.string().optional(),
  type: z.enum(TransactionType),
});

export type CategoryCreate = z.infer<typeof categoryCreateSchema>;
