import { Router } from "express";
import { getMenu } from "./menu.controller.js";
const router = Router();

router.route("/restaurants/:slug/menu").get(getMenu);

export default router;
