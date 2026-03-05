import { InsertRestaurant, restaurantTable } from "@server/db/index.js";
import {
  createRestaurantInput,
  updateRestaurantInput,
} from "@shared/schema/restaurant.schema.js";
import { db } from "@server/config/db.js";
import { ApiError } from "@server/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";

export async function createRestaurant(
  input: createRestaurantInput,
  userId: string,
) {
  const newRestaurant: InsertRestaurant = { ...input, ownerId: userId };
  const [insertedRestaurant] = await db
    .insert(restaurantTable)
    .values(newRestaurant)
    .returning();

  if (!insertedRestaurant)
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "error creating new Restaurant",
    );

  return insertedRestaurant;
}

export async function getOwnerRestaurants(userId: string) {
  const restaurants = await db.query.restaurantTable.findMany({
    where: eq(restaurantTable.ownerId, userId),
  });

  return restaurants;
}

export async function getRestaurantInfo(slug: string) {
  const restaurant = await db.query.restaurantTable.findFirst({
    where: eq(restaurantTable.slug, slug),
  });

  if (!restaurant)
    throw new ApiError(StatusCodes.NOT_FOUND, "Restaurant not found");

  return restaurant;
}

export async function updateRestaurant(
  input: updateRestaurantInput,
  slug: string,
) {
  const filteredInput = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  );

  const updatedRestaurants = await db
    .update(restaurantTable)
    .set(filteredInput)
    .where(eq(restaurantTable.slug, slug))
    .returning();

  if (updatedRestaurants.length === 0) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Restaurant with this slug not found!",
    );
  }

  return updatedRestaurants[0];
}

export async function deleteRestaurant(slug: string) {
  const deletedRestaurants = await db
    .delete(restaurantTable)
    .where(eq(restaurantTable.slug, slug))
    .returning();

  if (deletedRestaurants.length === 0) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "restaurant with this slug not found!",
    );
  }

  return deletedRestaurants[0];
}
