import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle({ client: queryClient, schema: schema });
