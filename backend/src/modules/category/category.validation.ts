import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be minimum 2 characters"),
  displayOrder: z.number("Display order must be a number"),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type updateCategoryInput = z.infer<typeof updateCategorySchema>;
