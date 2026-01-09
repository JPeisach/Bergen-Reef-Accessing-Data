import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { observations } from "src/db/schema"; // eventually change back to data-schema
import NewObservation from "src/db/types";

// TODO: Have one db connection, instead of spawning new ones
const db = drizzle(process.env.DATABASE_URL!);

// TODO: move this somewhere common/shared
interface Observation {
  authorId: number;
  observationText: string;
}

export default async function insertObservation(observation: Observation) {
  try {
    const observation_object: NewObservation = {
      authorId: 1, // FIXME: implement proper IDs (use auth0 user id?)
      observationText: observation.observationText,
      timestamp: Date.now().toString(), // TODO: enable timestamp date mode
    };

    const result = await db.insert(observations).values(observation_object);

    return result;
  } catch (error) {
    console.log("Failed to insert observation:", error);
  }
}
