import { config } from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { articles, categories } from "../src/lib/db/schema";

config({ path: ".env.local" });

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const query = db
  .select({
    id: categories.id,
    count: sql<number>`(SELECT count(*)::int FROM ${articles} WHERE ${articles.categoryId} = ${categories.id})`,
  })
  .from(categories)
  .toSQL();

console.log("SQL :", query.sql);
console.log("params :", JSON.stringify(query.params));
process.exit(0);
