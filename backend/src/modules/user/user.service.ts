import { hash } from "bcryptjs";
import { CreateUserInput } from "./user.validation.js";
import { InsertUser, userTable } from "@/db/index.js";
import { db } from "@/config/db.js";

export async function createUser(createUserInput: CreateUserInput) {
  const saltRound = 10;
  const passwordHash = await hash(createUserInput.password, saltRound);

  const newUser: InsertUser = {
    name: createUserInput.name,
    email: createUserInput.email,
    passwordHash,
  };

  const [createdUser] = await db
    .insert(userTable)
    .values(newUser)
    .returning({ name: userTable.name, email: userTable.email });

  return createdUser;
}
