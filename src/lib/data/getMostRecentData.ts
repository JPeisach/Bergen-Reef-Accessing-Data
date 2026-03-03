import { eq, desc, and } from "drizzle-orm";
import { coralData } from "src/db/schema";

import { db } from "src/db/drizzle";

export default async function getMostRecentData(
  type: string,
  tankName: string,
) {
  try {
    const result = await db
      .select()
      .from(coralData)
      .where(and(eq(coralData.name, type), eq(coralData.tankName, tankName))) // Filter by types
      .orderBy(desc(coralData.datetime)) // Order by most recent first
      .limit(240); // Get only the most recent per type

    //console.log(`Fetched most recent values for types: ${type}.`);

    return result;
  } catch (error) {
    console.error("Error fetching most recent data:", error);
    throw new Error("Failed to fetch most recent data.");
  }
}
