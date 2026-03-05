import { orderStatusEnum } from "@server/db/index.js";

export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
