import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { desc } from "drizzle-orm";
import { observations } from "src/db/schema"; // eventually change back to data-schema

// TODO: Have one db connection, instead of spawning new ones
const db = drizzle(process.env.DATABASE_URL!);

// TODO: Get a specific observation based on a certain filter
export default async function getObservations(limit?: number) {
  try {
    const query = db
      .select()
      .from(observations)
      .orderBy(desc(observations.timestamp));

    if (limit) {
      const data = await query.limit(limit);
      return data;
    }

    const data = await query;
    return data;
  } catch (error) {
    console.log("Failed to get observations:", error);
    throw error;
  }
}
