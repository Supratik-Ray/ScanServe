import { Router } from "express";
import {
  createOrderController,
  getAllCustomerOrdersController,
  getAllRestaurantOrdersController,
  updateOrderStatusController,
} from "./order.controller.js";
import { validate } from "@/middleware/validation.middleware.js";
import { createOrderSchema } from "./order.validation.js";
const router = Router();

router
  .route("/restaurants/:slug/orders")
  .get(getAllRestaurantOrdersController)
  .post(validate(createOrderSchema), createOrderController);
router.route("/orders/me").get(getAllCustomerOrdersController);
router.route("/orders/:id").patch(updateOrderStatusController);

export default router;
