import { z } from "zod";

const restaurantObjectSchema = z.object({
  name: z.string().min(2, "Restaurant name should be minimum 2 characters"),
  logoImage: z.url("logoImage is not a valid url"),
  phone: z.string().length(10, "Its not a valid mobile number"),
  address: z.string(),
  maxTables: z.int("maxTables is not a valid number"),
});

export const createRestaurantSchema = restaurantObjectSchema.transform(
  (data) => ({
    ...data,
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }),
);

export const updateRestaurantSchema = restaurantObjectSchema
  .partial()
  .transform((data) => ({
    ...data,
    ...(data.name && {
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    }),
  }));

export type createRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type updateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
