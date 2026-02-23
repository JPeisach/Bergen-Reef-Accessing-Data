import { db } from "src/db/drizzle";
import { observations } from "src/db/schema";
import { eq } from "drizzle-orm";


export default async function updateObservation(
 id: number,
 updates: Partial<{
   observationText: string;
   observationTitle: string;
   observationTagsArray: string[];
   tankNumber: number;
 }>
) {
 try {
   const result = await db
     .update(observations)
     .set(updates)
     .where(eq(observations.observationId, id));


   return result;
 } catch (error) {
   console.log("Failed to update observation:", error);
   throw error;
 }
}

