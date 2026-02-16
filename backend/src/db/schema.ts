import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .$onUpdate(() => new Date())
    .notNull(),
});

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

export const orderStatusEnum = pgEnum("orderStatus", [
  "pending",
  "ready",
  "served",
  "cancelled",
]);

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
