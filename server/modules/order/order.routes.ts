import { Router } from "express";
import {
  createOrderController,
  getAllCustomerOrdersController,
  getAllRestaurantOrdersController,
  updateOrderStatusController,
} from "./order.controller.js";
import { validate } from "@server/middleware/validation.middleware.js";
import { createOrderSchema } from "@shared/schema/order.schema.js";
const router = Router();

router
  .route("/restaurants/:slug/orders")
  .get(getAllRestaurantOrdersController)
  .post(validate(createOrderSchema), createOrderController);
router.route("/orders/me").get(getAllCustomerOrdersController);
router.route("/orders/:id").patch(updateOrderStatusController);

export default router;
