import { relations } from "drizzle-orm";
import { userTable } from "./schema/user.table.js";
import { restaurantTable } from "./schema/restaurant.table.js";
import { categoryTable } from "./schema/category.table.js";
import { menuItemTable } from "./schema/menuItem.table.js";
import { orderTable } from "./schema/oder.table.js";
import { orderItemTable } from "./schema/orderItem.table.js";

//relations
export const userRelations = relations(userTable, ({ one, many }) => {
  return {
    restaurants: many(restaurantTable),
  };
});

export const restaurantRelations = relations(
  restaurantTable,
  ({ one, many }) => {
    return {
      owner: one(userTable, {
        fields: [restaurantTable.ownerId],
        references: [userTable.id],
      }),
      categories: many(categoryTable),
      menuItems: many(menuItemTable),
      orders: many(orderTable),
    };
  },
);

export const categoryRelations = relations(categoryTable, ({ one, many }) => {
  return {
    restaurant: one(restaurantTable, {
      fields: [categoryTable.restaurantId],
      references: [restaurantTable.id],
    }),
    menuItems: many(menuItemTable),
  };
});

export const menuItemRelations = relations(menuItemTable, ({ one, many }) => {
  return {
    restaurant: one(restaurantTable, {
      fields: [menuItemTable.restaurantId],
      references: [restaurantTable.id],
    }),
    category: one(categoryTable, {
      fields: [menuItemTable.categoryId],
      references: [categoryTable.id],
    }),
    orderItems: many(orderItemTable),
  };
});

export const orderRelations = relations(orderTable, ({ one, many }) => {
  return {
    restaurant: one(restaurantTable, {
      fields: [orderTable.restaurantId],
      references: [restaurantTable.id],
    }),
    orderItems: many(orderItemTable),
  };
});

export const orderItemRelations = relations(orderItemTable, ({ one, many }) => {
  return {
    order: one(orderTable, {
      fields: [orderItemTable.orderId],
      references: [orderTable.id],
    }),
    menuItem: one(menuItemTable, {
      fields: [orderItemTable.menuItemId],
      references: [menuItemTable.id],
    }),
  };
});
