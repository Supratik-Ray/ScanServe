import { Router } from "express";
import {
  createOrder,
  getAllCustomerOrders,
  getAllRestaurantOrders,
  updateOrderStatus,
} from "./order.controller.js";
const router = Router();

router.route("/restaurants/:slug/orders").get(getAllRestaurantOrders);
router.route("/orders/me").get(getAllCustomerOrders);
router.route("/orders").post(createOrder);
router.route("/orders/:id").patch(updateOrderStatus);

export default router;
