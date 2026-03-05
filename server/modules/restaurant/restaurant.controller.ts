import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
  createRestaurant,
  deleteRestaurant,
  getOwnerRestaurants,
  getRestaurantInfo,
  updateRestaurant,
} from "./restaurant.service.js";
import { sendResponse } from "@server/utils/response.js";
import { StatusCodes } from "http-status-codes";

export async function createRestaurantController(req: Request, res: Response) {
  const restaurant = await createRestaurant(
    req.body,
    (req.user as JwtPayload).id,
  );
  sendResponse(
    res,
    StatusCodes.CREATED,
    "Successfully created restaurant!",
    restaurant,
  );
}

export async function getOwnerRestaurantsController(
  req: Request,
  res: Response,
) {
  const restaurants = await getOwnerRestaurants((req.user as JwtPayload).id);

  sendResponse(res, StatusCodes.OK, null, restaurants);
}

export async function getRestaurantInfoController(req: Request, res: Response) {
  const restaurantInfo = await getRestaurantInfo(req.params.slug as string);
  sendResponse(res, StatusCodes.OK, null, restaurantInfo);
}

export async function updateRestaurantInfoController(
  req: Request,
  res: Response,
) {
  const updatedRestaurant = await updateRestaurant(
    req.body,
    req.params.slug as string,
  );
  sendResponse(res, StatusCodes.OK, null, updatedRestaurant);
}

export async function deleteRestaurantController(req: Request, res: Response) {
  const deletedRestaurant = await deleteRestaurant(req.params.slug as string);
  sendResponse(
    res,
    StatusCodes.OK,
    "Restaurant deleted successfully!",
    deletedRestaurant,
  );
}
