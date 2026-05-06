import { CATEGORY_ICON_MAP } from "@/lib/category-icon-map";
import { TransactionType } from "@/lib/generated/prisma/enums";
import z from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Kategorin måste ha ett namn"),
  icon: z
    .string()
    .refine((val) => val in CATEGORY_ICON_MAP, { error: "Ogiltig ikon" }),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  type: z.enum(TransactionType),
});

export const categoryUpdateSchema = categoryCreateSchema.extend({
  id: z.cuid2(),
});

export type CategoryCreate = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;
