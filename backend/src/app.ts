import express from "express";
import "dotenv/config";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use(errorMiddleware);

export default app;
