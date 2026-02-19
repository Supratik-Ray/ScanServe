import express from "express";
import "dotenv/config";
import authRouter from "./modules/auth/auth.routes.js";
import restaurantRouter from "./modules/restaurant/restaurant.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { requireAuth } from "./middleware/auth.middleware.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/restaurants", requireAuth, restaurantRouter);
app.use("/", categoryRouter);

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use(errorMiddleware);

export default app;
