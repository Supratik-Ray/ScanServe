import { categoryTable, InsertCategory, restaurantTable } from "@/db/index.js";
import {
  CreateCategoryInput,
  updateCategoryInput,
} from "./category.validation.js";
import { db } from "@/config/db.js";
import { eq } from "drizzle-orm";
import { ApiError } from "@/utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

export async function getAllCategories(slug: string) {
  const restaurant = await db.query.restaurantTable.findFirst({
    where: eq(restaurantTable.slug, slug),
  });

  if (!restaurant) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Restaurant with this slug doesn't exist",
    );
  }

  const categories = await db.query.categoryTable.findMany({
    where: eq(categoryTable.restaurantId, restaurant.id),
  });

  return categories;
}
export async function createCategory(input: CreateCategoryInput, slug: string) {
  const restaurant = await db.query.restaurantTable.findFirst({
    where: eq(restaurantTable.slug, slug),
  });

  if (!restaurant) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Restaurant with this slug doesn't exist",
    );
  }

  const newCategory: InsertCategory = { ...input, restaurantId: restaurant.id };

  const [insertedCategory] = await db
    .insert(categoryTable)
    .values(newCategory)
    .returning();

  if (!insertedCategory) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error creating category!",
    );
  }
  return insertedCategory;
}
export async function updateCategory(
  input: updateCategoryInput,
  categoryId: string,
) {
  const filteredInput = Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  );
  const [updatedCategory] = await db
    .update(categoryTable)
    .set(filteredInput)
    .where(eq(categoryTable.id, categoryId))
    .returning();

  if (!updatedCategory) {
    throw new ApiError(StatusCodes.OK, "category with this id doesn't exist");
  }

  return updatedCategory;
}
export async function deleteCategory(categoryId: string) {
  const [deletedCategory] = await db
    .delete(categoryTable)
    .where(eq(categoryTable.id, categoryId))
    .returning();

  if (!deletedCategory) {
    throw new ApiError(StatusCodes.OK, "category with this id doesn't exist");
  }

  return deletedCategory;
}
