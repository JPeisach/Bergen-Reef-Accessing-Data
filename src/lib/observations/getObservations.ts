import { db } from "src/db/drizzle";
import "dotenv/config";
import { desc } from "drizzle-orm";
import { observations } from "src/db/schema"; // eventually change back to data-schema

// TODO: Get a specific observation based on a certain filter
export default async function getObservations(limit?: number) {
  try {
    const query = db
      .select()
      .from(observations)
      .orderBy(desc(observations.datetime));

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
