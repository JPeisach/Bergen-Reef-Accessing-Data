import { db } from "src/db/drizzle";
import { observations } from "src/db/schema"; // eventually change back to data-schema

// TODO: Get a specific observation based on a certain filter
export default async function getObservations() {
  try {
    const data = await db.select().from(observations);

    return data;
  } catch (error) {
    console.log("Failed to get observations:", error);
  }
}
