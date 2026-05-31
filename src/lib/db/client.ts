import "server-only";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

declare global {
  var __pgClient: ReturnType<typeof postgres> | undefined;
}

const sql = global.__pgClient ?? postgres(databaseUrl, { max: 10 });

if (process.env.NODE_ENV !== "production") {
  global.__pgClient = sql;
}

export const db = drizzle(sql, { schema });

export { schema };
