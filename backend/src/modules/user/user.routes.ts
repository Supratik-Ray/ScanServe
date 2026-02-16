import { validate } from "@/middleware/validation.middleware.js";
import express from "express";
import { createUserSchema } from "./user.validation.js";
import { createUserController } from "./user.controller.js";

const router = express.Router();

router.post("/signup", validate(createUserSchema), createUserController);
