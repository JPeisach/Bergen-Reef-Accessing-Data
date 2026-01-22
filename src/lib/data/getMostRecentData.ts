import { eq, desc } from "drizzle-orm";
import { coralData } from "src/db/schema";

import { db } from "src/db/drizzle";

export default async function getMostRecentData(type: string) {
  try {
    const result = await db
      .select()
      .from(coralData)
      .where(eq(coralData.name, type)) // Filter by types
      .orderBy(desc(coralData.datetime)) // Order by most recent first
      .limit(240); // Get only the most recent per type

    //console.log(`Fetched most recent values for types: ${type}.`);

    return result;
  } catch (error) {
    console.error("Error fetching most recent data:", error);
    throw new Error("Failed to fetch most recent data.");
  }
}
