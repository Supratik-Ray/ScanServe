import { hash, compare } from "bcryptjs";
import { SignupUserInput, LoginUserInput } from "./auth.validation.js";
import { InsertUser, userTable } from "@/db/index.js";
import { db } from "@/config/db.js";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { ApiError } from "@/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

export async function createUser(input: SignupUserInput) {
  const existing = await db.query.userTable.findFirst({
    where: eq(userTable.email, input.email),
  });

  if (existing) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "User with this email already exists",
    );
  }

  const saltRound = 10;
  const passwordHash = await hash(input.password, saltRound);

  const newUser: InsertUser = {
    name: input.name,
    email: input.email,
    passwordHash,
  };

  const [createdUser] = await db.insert(userTable).values(newUser).returning({
    id: userTable.id,
    name: userTable.name,
    email: userTable.email,
  });

  if (!createdUser)
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Coudln't create new user",
    );

  return createdUser;
}

export function createToken(userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  return token;
}

export async function validateUserCredentials(input: LoginUserInput) {
  const user = await db.query.userTable.findFirst({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
    where: eq(userTable.email, input.email),
  });

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const { passwordHash, ...restUser } = user;

  const isMatch = await compare(input.password, passwordHash);

  if (!isMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  return restUser;
}
