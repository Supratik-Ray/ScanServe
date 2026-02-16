CREATE TYPE "public"."orderStatus" AS ENUM('pending', 'ready', 'served', 'cancelled');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"restaurantId" uuid NOT NULL,
	"displayOrder" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "categories_restaurantId_displayOrder_unique" UNIQUE("restaurantId","displayOrder"),
	CONSTRAINT "notNegative" CHECK ("categories"."displayOrder" > 0)
);
--> statement-breakpoint
CREATE TABLE "menuItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" integer NOT NULL,
	"image" varchar(255) NOT NULL,
	"description" varchar(255),
	"isAvailable" boolean DEFAULT true NOT NULL,
	"categoryId" uuid NOT NULL,
	"restaurantId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orderItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nameSnapshot" varchar(255) NOT NULL,
	"priceSnapshot" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"orderId" uuid NOT NULL,
	"menuItemId" uuid NOT NULL,
	CONSTRAINT "notNegative" CHECK ("orderItems"."quantity" > 0),
	CONSTRAINT "notNegativePrice" CHECK ("orderItems"."priceSnapshot" > 0)
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tableNumber" integer NOT NULL,
	"status" "orderStatus" DEFAULT 'pending' NOT NULL,
	"totalAmount" integer NOT NULL,
	"customerName" varchar(255) NOT NULL,
	"customerPhone" varchar(20),
	"customerNote" varchar(255),
	"sessionId" uuid NOT NULL,
	"restaurantId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "notNegative" CHECK ("orders"."tableNumber" > 0),
	CONSTRAINT "notNegativeAmount" CHECK ("orders"."totalAmount" > 0)
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"logoImage" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"maxTables" integer NOT NULL,
	"slug" varchar(255) NOT NULL,
	"ownerId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "restaurants_slug_unique" UNIQUE("slug"),
	CONSTRAINT "notNegative" CHECK ("restaurants"."maxTables" > 0)
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updatedAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_restaurantId_restaurants_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menuItems" ADD CONSTRAINT "menuItems_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menuItems" ADD CONSTRAINT "menuItems_restaurantId_restaurants_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_menuItemId_menuItems_id_fk" FOREIGN KEY ("menuItemId") REFERENCES "public"."menuItems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurantId_restaurants_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_restaurantId_index" ON "categories" USING btree ("restaurantId");--> statement-breakpoint
CREATE INDEX "menuItems_restaurantId_index" ON "menuItems" USING btree ("restaurantId");--> statement-breakpoint
CREATE INDEX "orderItems_orderId_index" ON "orderItems" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX "orderItems_menuItemId_index" ON "orderItems" USING btree ("menuItemId");--> statement-breakpoint
CREATE INDEX "orders_restaurantId_createdAt_index" ON "orders" USING btree ("restaurantId","createdAt");--> statement-breakpoint
CREATE INDEX "restaurants_ownerId_index" ON "restaurants" USING btree ("ownerId");