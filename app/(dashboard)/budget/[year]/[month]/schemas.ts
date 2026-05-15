import z from "zod";

export const paramsSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
});
