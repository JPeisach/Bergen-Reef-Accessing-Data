import { NextResponse } from "next/server";
import getObservations from "src/lib/observations/getObservations";
import insertObservation from "src/lib/observations/insertObservation";
import updateObservation from "src/lib/observations/updateObservation";
import deleteObservation from "src/lib/observations/deleteObservation";

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


    // surely there is a better way to validate this..

    if (
      !observation.authorId ||
      observation.tankNumber == null ||
      !observation.observationText ||
      !observation.observationTitle ||
      !observation.observationTagsArray
    ) {
      return NextResponse.json(
        { error: "Invalid observation payload" },
        { status: 400 },
      );
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
      { error: "Failed to save observation" },
      { status: 500 },
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing observation id" },
        { status: 400 },
      );
    }

    await updateObservation(id, updates);

    return NextResponse.json({
      status: 200,
      message: "Observation updated",
    });
  } catch (error) {
    console.log("API: Observations PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update observation" },
      { status: 500 },
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing observation id" },
        { status: 400 },
      );
    }

    await deleteObservation(Number(id));

    return NextResponse.json({
      status: 200,
      message: "Observation deleted",
    });
  } catch (error) {
    console.log("API: Observations DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete observation" },
      { status: 500 },
    );
  }
};