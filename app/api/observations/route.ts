import { NextResponse } from "next/server";
import getObservations from "src/lib/observations/getObservations";
import insertObservation from "src/lib/observations/insertObservation";

interface Observation {
  authorId: number;
  observationText: string;
}

export const GET = async () => {
  try {
    // TODO: Querying specific observations
    const observations = await getObservations();

    return NextResponse.json(observations);
  } catch (error) {
    console.log("API: Observations GET error:", error);
  }
};

// Putting here for reference.
// DO NOT OPEN THIS ROUTE!!!
// In React components, call insertObservation from there.
//
// export const POST = async (request: Request) => {
//   try {
//     const observation: Observation = await request.json();

//     const result = await insertObservation(observation);

//     return NextResponse.json(result);
//   } catch (error) {
//     console.log("API: Observations GET error:", error);
//   }
// };
