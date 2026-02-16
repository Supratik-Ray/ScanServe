import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { userTable } from "./user.table.js";

export const restaurantTable = pgTable(
  "restaurants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    logoImage: varchar("logoImage", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 255 }).notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    maxTables: integer("maxTables").notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    ownerId: uuid("ownerId")
      .references(() => userTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index().on(table.ownerId),
    check("notNegative", sql`${table.maxTables} > 0`),
  ],
);
