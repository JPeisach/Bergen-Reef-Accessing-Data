import { db } from "src/db/drizzle";
import { observations } from "src/db/schema"; // eventually change back to data-schema
import NewObservation from "src/db/types";

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
