import { db } from "src/db/drizzle";
import { eq, desc } from "drizzle-orm";
import { coralData } from "src/db/schema";

export default async function getMostRecentElements() {
  try {
    const elements = [
      "pH",
      "Salinity",
      "Temperature",
      "ORP",
      "Alkalinity",
      "Calcium",
    ];
    const values = [];

    for (let i = 0; i < elements.length; i++) {
      const result = await db
        .select()
        .from(coralData)
        .where(eq(coralData.name, elements[i]))
        .orderBy(desc(coralData.datetime))
        .limit(1);

      values.push(result[0]);
    }

    return values;
  } catch (error) {
    console.error("Error fetching most recent elements:", error);
    throw new Error("Failed to fetch most recent elements.");
  }
}
