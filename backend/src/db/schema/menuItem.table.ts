import {
  boolean,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { restaurantTable } from "./restaurant.table";
import { categoryTable } from "./category.table";

export const menuItemTable = pgTable(
  "menuItems",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    price: integer("price").notNull(),
    image: varchar("image", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    isAvailable: boolean("isAvailable").default(true).notNull(),
    categoryId: uuid("categoryId")
      .references(() => categoryTable.id)
      .notNull(),
    restaurantId: uuid("restaurantId")
      .references(() => restaurantTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index().on(table.restaurantId)],
);
