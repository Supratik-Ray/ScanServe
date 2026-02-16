import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/index.ts";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema, logger: true });
