import { Request, Response } from "express";
import {
  createOrder,
  getAllCustomerOrders,
  getAllRestaurantOrders,
  updateOrderStatus,
} from "./order.service.js";
import { sendResponse } from "@/utils/response.js";
import { StatusCodes } from "http-status-codes";

export async function getAllRestaurantOrdersController(
  req: Request,
  res: Response,
) {
  const orders = await getAllRestaurantOrders(req.params.slug as string);
  sendResponse(res, StatusCodes.OK, null, orders);
}

export async function getAllCustomerOrdersController(
  req: Request,
  res: Response,
) {
  const orders = await getAllCustomerOrders(req.body.sessionId);
  sendResponse(res, StatusCodes.OK, null, orders);
}

export async function createOrderController(req: Request, res: Response) {
  const newOrder = await createOrder(req.body, req.params.slug as string);
  sendResponse(
    res,
    StatusCodes.CREATED,
    "Order created Successfully!",
    newOrder,
  );
}

export async function updateOrderStatusController(req: Request, res: Response) {
  const updatedOrder = await updateOrderStatus(req.body.status, req.body.id);
  sendResponse(res, StatusCodes.OK, "Order status updated!", updateOrderStatus);
}
