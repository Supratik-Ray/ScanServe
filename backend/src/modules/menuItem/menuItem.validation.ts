import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().min(2, "MenuItem name must be minimum 2 characters"),
  price: z
    .number("price must be a valid number")
    .min(0, "price cannot be negative"),
  image: z.url("it must be a valid image url"),
  description: z.string(),
  categoryId: z.uuid("categoryId must be valid Id format"),
  isAvailable: z.boolean("isAvailable field must be a boolean").optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
