import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "./category.controller.js";
const router = Router();

router
  .route("/restaurants/:slug/categories")
  .get(getAllCategories)
  .post(createCategory);

router.route("/categories/:id").patch(updateCategory).delete(deleteCategory);

export default router;
