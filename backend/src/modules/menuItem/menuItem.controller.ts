import { Request, Response } from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  updateMenuItem,
} from "./menuItem.service.js";
import { sendResponse } from "@/utils/response.js";
import { StatusCodes } from "http-status-codes";
import { SelectMenuItem } from "@/db/index.js";

export async function createMenuItemController(req: Request, res: Response) {
  const menuItem: SelectMenuItem = await createMenuItem(
    req.body,
    req.params.slug as string,
  );
  sendResponse(
    res,
    StatusCodes.CREATED,
    "Successfully created menuItem!",
    menuItem,
  );
}

export async function getAllMenuItemsController(req: Request, res: Response) {
  const menuItems: SelectMenuItem[] = await getAllMenuItems(
    req.params.slug as string,
  );
  sendResponse(res, StatusCodes.OK, null, menuItems);
}

export async function updateMenuItemController(req: Request, res: Response) {
  const updatedMenuItem: SelectMenuItem = await updateMenuItem(
    req.body,
    req.params.id as string,
  );
  sendResponse(
    res,
    StatusCodes.OK,
    "Successfully updated menuItem!",
    updateMenuItem,
  );
}

export async function deleteMenuItemController(req: Request, res: Response) {
  const deletedMenuItem: SelectMenuItem = await deleteMenuItem(
    req.params.id as string,
  );

  sendResponse(
    res,
    StatusCodes.OK,
    "Successfully deleted menuItem!",
    deleteMenuItem,
  );
}
