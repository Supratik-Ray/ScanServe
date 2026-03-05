import { Router } from "express";
import {
  createMenuItemController,
  deleteMenuItemController,
  getAllMenuItemsController,
  updateMenuItemController,
} from "./menuItem.controller.js";
const router = Router();

router
  .route("/restaurants/:slug/menuItems")
  .get(getAllMenuItemsController)
  .post(createMenuItemController);

router
  .route("/menuItems/:id")
  .patch(updateMenuItemController)
  .delete(deleteMenuItemController);

export default router;
