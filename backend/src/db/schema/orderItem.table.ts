import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { menuItemTable } from "./menuItem.table";
import { orderTable } from "./oder.table";

export const orderItemTable = pgTable(
  "orderItems",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nameSnapshot: varchar("nameSnapshot", { length: 255 }).notNull(),
    priceSnapshot: integer("priceSnapshot").notNull(),
    quantity: integer("quantity").default(1).notNull(),
    orderId: uuid("orderId")
      .references(() => orderTable.id, { onDelete: "cascade" })
      .notNull(),
    menuItemId: uuid("menuItemId")
      .references(() => menuItemTable.id)
      .notNull(),
  },
  (table) => [
    index().on(table.orderId),
    index().on(table.menuItemId),
    check("notNegative", sql`${table.quantity} > 0`),
    check("notNegativePrice", sql`${table.priceSnapshot} > 0`),
  ],
);
