import { z } from "zod";

export const createOrderSchema = z.object({
  totalAmount: z.number().int().nonnegative(),
  tableNumber: z.number().int().nonnegative(),
  menuItems: z.array(
    z.object({
      id: z.uuid(),
      nameSnapshot: z.string().min(2),
      priceSnapshot: z.number().int().nonnegative(),
      quantity: z.number().int().nonnegative(),
    }),
  ),
  customerName: z.string().min(2, "customerName must be minimum 2 characters"),
  customerPhone: z.string().length(10, "Invalid phone number"),
  customerNote: z
    .string()
    .min(5, "customerNote must be minimum 5 characters")
    .optional(),
  sessionId: z.uuid("Invalid user session Id format"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
