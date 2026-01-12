import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { observations, accounts } from "src/db/schema"; // eventually change back to data-schema
import { eq } from "drizzle-orm";
import NewObservation from "src/db/types";

// TODO: Have one db connection, instead of spawning new ones
const db = drizzle(process.env.DATABASE_URL!);

// TODO: move this somewhere common/shared
interface Observation {
  authorId?: number;
  observationText: string;
  observationTitle?: string;
}

/**
 * Gets or creates an account ID to use for observations
 */
async function getOrCreateAccountId(): Promise<number> {
  try {
    // Try to get the first existing account
    const existingAccounts = await db.select().from(accounts).limit(1);

    if (existingAccounts.length > 0) {
      return existingAccounts[0].accountId;
    }

    // If no accounts exist, create a default one
    await db.insert(accounts).values({
      email: "default@example.com",
      permissionLevel: 1,
    });

    // Get the newly created account
    const newAccounts = await db
      .select()
      .from(accounts)
      .where(eq(accounts.email, "default@example.com"))
      .limit(1);

    if (newAccounts.length > 0) {
      return newAccounts[0].accountId;
    }

    throw new Error("Failed to create default account");
  } catch (error) {
    console.error("Error in getOrCreateAccountId:", error);
    throw error;
  }
}

export default async function insertObservation(observation: Observation) {
  try {
    // Get or create an account ID (use provided one if valid, otherwise get/create one)
    let authorId = observation.authorId;

    if (!authorId) {
      authorId = await getOrCreateAccountId();
    } else {
      // Verify the provided authorId exists
      const accountCheck = await db
        .select()
        .from(accounts)
        .where(eq(accounts.accountId, authorId))
        .limit(1);

      if (accountCheck.length === 0) {
        // Provided ID doesn't exist, get/create one instead
        authorId = await getOrCreateAccountId();
      }
    }

    // Format timestamp as YYYY-MM-DD for date type (MySQL DATE format)
    // If the database column is actually DATETIME, this will still work (MySQL accepts date strings)
    const now = new Date();
    const timestamp = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Store title with text if provided (prepend title with separator)
    // Format: "TITLE: [title]\n\n[text]" or just "[text]" if no title
    let observationText = observation.observationText;
    if (observation.observationTitle && observation.observationTitle.trim()) {
      observationText = `TITLE: ${observation.observationTitle.trim()}\n\n${observation.observationText}`;
    }

    const observation_object: NewObservation = {
      authorId: authorId,
      observationText: observationText,
      timestamp: timestamp,
    };

    const result = await db.insert(observations).values(observation_object);

    return result;
  } catch (error) {
    console.log("Failed to insert observation:", error);
    throw error; // Re-throw so the API route can handle it
  }
}
