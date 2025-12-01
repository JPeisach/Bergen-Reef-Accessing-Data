import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, desc, inArray } from "drizzle-orm";
import { coralData } from "src/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

export default async function getMostRecentData(type: string) {
  // TODO: Map type argument to a list of columns we want to select, or replace this endpoint
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
