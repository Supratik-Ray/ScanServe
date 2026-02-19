import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { restaurantTable } from "./restaurant.table.js";

export const categoryTable = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    restaurantId: uuid("restaurantId")
      .references(() => restaurantTable.id, { onDelete: "cascade" })
      .notNull(),
    displayOrder: integer("displayOrder").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index().on(table.restaurantId),
    unique().on(table.restaurantId, table.displayOrder),
    check("notNegative", sql`${table.displayOrder} > 0`),
  ],
);

export type InsertCategory = typeof categoryTable.$inferInsert;
export type SelectCategory = typeof categoryTable.$inferSelect;
