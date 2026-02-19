import { Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "./category.service.js";
import { sendResponse } from "@/utils/response.js";
import { StatusCodes } from "http-status-codes";
import { SelectCategory } from "@/db/index.js";

export async function createCategoryController(req: Request, res: Response) {
  const category: SelectCategory = await createCategory(
    req.body,
    req.params.slug as string,
  );
  sendResponse(
    res,
    StatusCodes.CREATED,
    "Successfully created category!",
    category,
  );
}

export async function getAllCategoriesController(req: Request, res: Response) {
  const categories: SelectCategory[] = await getAllCategories(
    req.params.slug as string,
  );
  sendResponse(res, StatusCodes.OK, null, categories);
}

export async function updateCategoryController(req: Request, res: Response) {
  const updatedCategory: SelectCategory = await updateCategory(
    req.body,
    req.params.id as string,
  );
  sendResponse(
    res,
    StatusCodes.OK,
    "Successfully updated category!",
    updatedCategory,
  );
}

export async function deleteCategoryController(req: Request, res: Response) {
  const deletedCategory: SelectCategory = await deleteCategory(
    req.params.id as string,
  );

  sendResponse(
    res,
    StatusCodes.OK,
    "Successfully deleted category!",
    deletedCategory,
  );
}
