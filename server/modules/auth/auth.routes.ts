import { validate } from "@server/middleware/validation.middleware.js";
import express from "express";
import {
  loginUserSchema,
  signupUserSchema,
} from "@shared/schema/auth.schema.js";
import { loginUser, signupUser } from "./auth.controller.js";

const router = express.Router();

router.post("/signup", validate(signupUserSchema), signupUser);
router.post("/login", validate(loginUserSchema), loginUser);

export default router;
