import { db } from "src/db/drizzle";
import { eq } from "drizzle-orm";
import { coralData } from "src/db/schema";

export default async function deleteData(ids: number[], date: Date) {
  try {
    // Iterate over all pieces of data (ids) in the array
    for (let i = 0; i < ids.length; i++) {
      // Mark each row from the database as deleted corresponding to the id
      await db
        .update(coralData as any)
        .set({ deleted: 0, updated_at: date })
        .where(eq(coralData.id, ids[i]));
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    throw new Error(`Error deleting data: ${error}`);
  }
}
