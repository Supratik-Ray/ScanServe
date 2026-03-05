import { db } from "@server/config/db.js";
import {
  InsertOrder,
  InsertOrderItem,
  orderItemTable,
  orderTable,
  restaurantTable,
} from "@server/db/index.js";
import { OrderStatus } from "@shared/types/orders.types.js";
import { ApiError } from "@server/utils/ApiError.js";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import { CreateOrderInput } from "@shared/schema/order.schema.js";

export async function getAllRestaurantOrders(slug: string) {
  const restaurant = await db.query.restaurantTable.findFirst({
    where: eq(restaurantTable.slug, slug),
  });

  if (!restaurant)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Restaurant with this slug not found",
    );

  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.restaurantId, restaurant.id),
    with: {
      orderItems: {
        with: { menuItem: true },
      },
    },
  });

  return orders;
}

export async function createOrder(input: CreateOrderInput, slug: string) {
  const restaurant = await db.query.restaurantTable.findFirst({
    where: eq(restaurantTable.slug, slug),
  });

  if (!restaurant)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Restaurant with this slug not found",
    );

  const { menuItems, ...restInput } = input;

  const newOrderData: InsertOrder = {
    ...restInput,
    restaurantId: restaurant.id,
  };

  const [newOrder] = await db
    .insert(orderTable)
    .values(newOrderData)
    .returning();

  if (!newOrder)
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Couldn't create order",
    );

  const orderItemsData: InsertOrderItem[] = menuItems.map((item) => {
    const { id, ...rest } = item;
    return { ...rest, menuItemId: id, orderId: newOrder.id };
  });

  await db.insert(orderItemTable).values(orderItemsData);

  return newOrder;
}

export async function getAllCustomerOrders(sessionId: string) {
  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.sessionId, sessionId),
    with: {
      orderItems: {
        with: { menuItem: true },
      },
    },
  });

  return orders;
}

export async function updateOrderStatus(status: OrderStatus, id: string) {
  const [updatedOrder] = await db
    .update(orderTable)
    .set({ status })
    .where(eq(orderTable.id, id))
    .returning();

  if (!updatedOrder)
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error changing status",
    );

  return updatedOrder;
}
