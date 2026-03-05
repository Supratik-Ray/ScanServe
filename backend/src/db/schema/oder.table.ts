import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { restaurantTable } from "./restaurant.table.js";

export const orderStatusEnum = pgEnum("orderStatus", [
  "pending",
  "ready",
  "served",
  "cancelled",
]);

export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];

export const orderTable = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tableNumber: integer("tableNumber").notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),
    totalAmount: integer("totalAmount").notNull(),
    customerName: varchar("customerName", { length: 255 }).notNull(),
    customerPhone: varchar("customerPhone", { length: 20 }),
    customerNote: varchar("customerNote", { length: 255 }),
    sessionId: uuid("sessionId").notNull(),
    restaurantId: uuid("restaurantId")
      .references(() => restaurantTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index().on(table.restaurantId, table.createdAt),
    check("notNegative", sql`${table.tableNumber} > 0`),
    check("notNegativeAmount", sql`${table.totalAmount} > 0`),
  ],
);

export type InsertOrder = typeof orderTable.$inferInsert;
export type SelectOrder = typeof orderTable.$inferSelect;
