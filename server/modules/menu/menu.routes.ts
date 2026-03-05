import { Router } from "express";
import { getMenuController } from "./menu.controller.js";
const router = Router();

router.route("/restaurants/:slug/menu").get(getMenuController);

export default router;
