import { Request, Response } from "express";
import { getMenu } from "./menu.service.js";
import { sendResponse } from "@/utils/response.js";
import { StatusCodes } from "http-status-codes";

export async function getMenuController(req: Request, res: Response) {
  const slug = req.params.slug;
  const menu = await getMenu(slug as string);
  sendResponse(res, StatusCodes.OK, null, menu);
}
