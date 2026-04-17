import { pgTable, index, foreignKey, pgPolicy, check, uuid, text, bigint, integer, timestamp, unique, boolean, jsonb, doublePrecision, numeric, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { pgSchema } from "drizzle-orm/pg-core";






export const authSchema = pgSchema("auth");
export const users = authSchema.table("users", { id: uuid("id").primaryKey() });
