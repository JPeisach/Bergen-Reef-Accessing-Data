import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { coralData } from "src/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

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
