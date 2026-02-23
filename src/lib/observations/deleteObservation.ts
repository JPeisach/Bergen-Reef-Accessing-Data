import { db } from "src/db/drizzle";
import { observations } from "src/db/schema";
import { eq } from "drizzle-orm";

export default async function deleteObservation(id: number) {
  try {
    const result = await db
      .delete(observations)
      .where(eq(observations.observationId, id));

    return result;
  } catch (error) {
    console.log("Failed to delete observation:", error);
    throw error;
  }
}