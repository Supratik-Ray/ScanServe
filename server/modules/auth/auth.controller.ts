import { sendResponse } from "@server/utils/response.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createToken,
  createUser,
  validateUserCredentials,
} from "./auth.service.js";

export async function signupUser(req: Request, res: Response) {
  const user = await createUser(req.body);
  const token = createToken(user.id);
  sendResponse(res, StatusCodes.CREATED, "Successfully created user!", {
    user,
    token,
  });
}

export async function loginUser(req: Request, res: Response) {
  const user = await validateUserCredentials(req.body);
  const token = createToken(user.id);
  sendResponse(res, StatusCodes.OK, "Successfully logged in!", { user, token });
}
