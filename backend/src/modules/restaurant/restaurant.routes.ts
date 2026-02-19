import { Router } from "express";
import {
  createRestaurantController,
  deleteRestaurantController,
  getOwnerRestaurantsController,
  getRestaurantInfoController,
  updateRestaurantInfoController,
} from "./restaurant.controller.js";
import { validate } from "@/middleware/validation.middleware.js";
import {
  createRestaurantSchema,
  updateRestaurantSchema,
} from "./restaurant.validation.js";

const router = Router();

router
  .route("/")
  .post(validate(createRestaurantSchema), createRestaurantController);
router.route("/me").get(getOwnerRestaurantsController);
router
  .route("/:slug")
  .get(getRestaurantInfoController)
  .patch(validate(updateRestaurantSchema), updateRestaurantInfoController)
  .delete(deleteRestaurantController);

export default router;
