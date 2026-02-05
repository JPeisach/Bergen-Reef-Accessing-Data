import { db } from "src/db/drizzle";
import "dotenv/config";
import { observations } from "src/db/schema"; // eventually change back to data-schema
import NewObservation from "src/db/types";

// TODO: move this somewhere common/shared
interface Observation {
  authorId: string;
  datetime: Date;
  observationDatetimeStart: Date;
  observationDatetimeEnd: Date;
  observationTagsArray: string[];
  observationText: string;
  observationTitle: string;
  tankNumber: number;
}

export default async function insertObservation(observation: Observation) {
  try {
    const authorId = observation.authorId;

    const observationText = observation.observationText;
    const observationTitle = observation.observationTitle.trim();

    const observation_object: NewObservation = {
      authorId: authorId,
      tankNumber: observation.tankNumber,
      datetime: observation.datetime,
      observationDatetimeStart: observation.observationDatetimeStart,
      observationDatetimeEnd: observation.observationDatetimeEnd,
      observationTagsArray: observation.observationTagsArray,
      observationText: observationText,
      observationTitle: observationTitle,
    };

    const result = await db.insert(observations).values(observation_object);

    return result;
  } catch (error) {
    console.log("Failed to insert observation:", error);
    throw error; // Re-throw so the API route can handle it
  }
}
