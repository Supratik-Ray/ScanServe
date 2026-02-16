import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be atleast 2 characters long"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be minimum 6 characters long"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
