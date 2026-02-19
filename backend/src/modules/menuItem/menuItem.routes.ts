import { Router } from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  updateMenuItem,
} from "./menuItem.controller.js";
const router = Router();

router
  .route("/restaurants/:slug/menuItems")
  .get(getAllMenuItems)
  .post(createMenuItem);

router.route("/menuItems/:id").patch(updateMenuItem).delete(deleteMenuItem);

export default router;
