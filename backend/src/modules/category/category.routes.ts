import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "./category.controller.js";
const router = Router();

router
  .route("/restaurants/:slug/categories")
  .get(getAllCategoriesController)
  .post(createCategoryController);

router
  .route("/categories/:id")
  .patch(updateCategoryController)
  .delete(deleteCategoryController);

export default router;
