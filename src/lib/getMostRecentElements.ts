import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, desc } from "drizzle-orm";
import { coralData } from "src/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

export default async function getMostRecentElements() {
  try {
    const result = await db.select().from(coralData).orderBy(desc(coralData.datetime)).limit(1);

    return result;
  } catch (error) {
    console.error("Error fetching most recent elements:", error);
    throw new Error("Failed to fetch most recent elements.");
  }
}
