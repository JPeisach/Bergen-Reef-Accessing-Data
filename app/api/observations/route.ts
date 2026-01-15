import { NextResponse } from "next/server";
import getObservations from "src/lib/observations/getObservations";
import insertObservation from "src/lib/observations/insertObservation";

interface Observation {
  authorId: string;
  datetime: Date;
  observationText: string;
  observationTitle: string;
}

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const limitNum = limit ? parseInt(limit, 10) : undefined;

    const observations = await getObservations(limitNum);

    return NextResponse.json(observations);
  } catch (error) {
    console.log("API: Observations GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch observations" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const observation: Observation = await request.json();

    if (observation.authorId == null) {
      return NextResponse.json({
        status: 400,
        message: "Missing account ID",
      });
    }

    if (observation.observationText == null) {
      return NextResponse.json({
        status: 400,
        message: "Missing observation text",
      });
    }

    if (observation.observationTitle == null) {
      return NextResponse.json({
        status: 400,
        message: "Invalid observation title (does not exist or is too large)",
      });
    }

    const result = await insertObservation(observation);

    return NextResponse.json({
      status: 200,
      message: "Observation saved successfully",
      result,
    });
  } catch (error) {
    console.log("API: Observations POST error:", error);
    return NextResponse.json(
      { status: 500, error: "Failed to save observation" },
      { status: 500 },
    );
  }
};
