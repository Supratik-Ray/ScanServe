import { InsertMenuItem, menuItemTable, restaurantTable } from "@/db/index.js";
import {
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from "./menuItem.validation.js";
import { db } from "@/config/db.js";
import { eq } from "drizzle-orm";
import { ApiError } from "@/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

export async function getAllMenuItems(slug: string) {
  const restaurant = await db.query.restaurantTable.findFirst({
    where: eq(restaurantTable.slug, slug),
  });

  if (!restaurant) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Restaurant with this slug doesn't exist",
    );
  }

  const menuItems = await db.query.menuItemTable.findMany({
    where: eq(menuItemTable.restaurantId, restaurant.id),
    with: {
      category: { columns: { name: true } },
    },
  });

  return menuItems;
}
export async function createMenuItem(input: CreateMenuItemInput, slug: string) {
  const restaurant = await db.query.restaurantTable.findFirst({
    where: eq(restaurantTable.slug, slug),
  });

  if (!restaurant) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Restaurant with this slug doesn't exist",
    );
  }

  const newMenuItem: InsertMenuItem = { ...input, restaurantId: restaurant.id };

  const [insertedMenuItem] = await db
    .insert(menuItemTable)
    .values(newMenuItem)
    .returning();

  if (!insertedMenuItem) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error creating menuItem!",
    );
  }
  return insertedMenuItem;
}
export async function updateMenuItem(
  input: UpdateMenuItemInput,
  menuItemId: string,
) {
  const filteredInput = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  );
  const [updatedMenuItem] = await db
    .update(menuItemTable)
    .set(filteredInput)
    .where(eq(menuItemTable.id, menuItemId))
    .returning();

  if (!updatedMenuItem) {
    throw new ApiError(StatusCodes.OK, "MenuItem with this id doesn't exist");
  }

  return updatedMenuItem;
}
export async function deleteMenuItem(menuItemId: string) {
  const [deletedMenuItem] = await db
    .delete(menuItemTable)
    .where(eq(menuItemTable.id, menuItemId))
    .returning();

  if (!deletedMenuItem) {
    throw new ApiError(StatusCodes.OK, "menuItem with this id doesn't exist");
  }

  return deletedMenuItem;
}
