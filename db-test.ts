import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./src/lib/db/schema";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
console.log("Connecting to", connectionString);
const client = postgres(connectionString, { prepare: false, ssl: 'require' });
const db = drizzle(client, { schema });

async function main() {
  try {
    const res = await db.select().from(schema.users).limit(1);
    console.log("Query successful", res);
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    process.exit(0);
  }
}

main();
