import { sendResponse } from "@/utils/response.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createUser } from "./user.service.js";

export async function createUserController(req: Request, res: Response) {
  const user = await createUser(req.body);
  sendResponse(res, StatusCodes.CREATED, "Successfully created user!", user);
}
