import { db } from "src/db/drizzle";
import { eq, sql } from "drizzle-orm";
import { coralData } from "src/db/schema"; // eventually change back to data-schema

export default async function updateValue(id: number, value: number) {
  try {
    await db
      .update(coralData)
      .set({ value: sql`${value}` })
      .where(eq(coralData.id, id));

    console.log(`Value updated successfully for ID: ${id}`);
  } catch (error) {
    console.error("Error updating value:", error);
    throw new Error("Failed to update value in the database.");
  }
}
