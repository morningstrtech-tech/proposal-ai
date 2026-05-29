import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// For use in serverless environments (Next.js API routes)
const client = postgres(connectionString, { prepare: false, ssl: 'require' });

export const db = drizzle(client, { schema });
