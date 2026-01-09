import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { observations } from "src/db/schema"; // eventually change back to data-schema

// TODO: Have one db connection, instead of spawning new ones
const db = drizzle(process.env.DATABASE_URL!);

// TODO: Get a specific observation based on a certain filter
export default async function getObservations() {
  try {
    const data = await db.select().from(observations);

    return data;
  } catch (error) {
    console.log("Failed to get observations:", error);
  }
}
