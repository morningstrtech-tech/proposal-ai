import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { prepare: false, ssl: 'require' });

async function main() {
  console.log("Creating transactions table...");
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "transaction" (
        "order_id" text PRIMARY KEY,
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "plan" "plan" NOT NULL,
        "gross_amount" integer NOT NULL,
        "status" text DEFAULT 'pending' NOT NULL,
        "snap_token" text,
        "snap_redirect_url" text,
        "payment_type" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `;
    console.log("Success!");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    await sql.end();
  }
}

main();
