import { NextResponse } from "next/server";
import getMostRecentElements from "src/lib/data/getMostRecentElements";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tankName = searchParams.get("tankName");

    const data = await getMostRecentElements(tankName);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
