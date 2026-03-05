import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "./category.controller.js";
import { validate } from "@server/middleware/validation.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@shared/schema/category.schema.js";
const router = Router();

router
  .route("/restaurants/:slug/categories")
  .get(getAllCategoriesController)
  .post(validate(createCategorySchema), createCategoryController);

router
  .route("/categories/:id")
  .patch(validate(updateCategorySchema), updateCategoryController)
  .delete(deleteCategoryController);

export default router;
