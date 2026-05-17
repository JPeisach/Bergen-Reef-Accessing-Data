import { NextResponse } from "next/server";
import uploadImage from "src/lib/infoPageImages/uploadImage";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("image") as File;

    const tankNumber = Number(
      formData.get("tankNumber")
    );

    if (!file || !tankNumber) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    await uploadImage(
      tankNumber,
      buffer,
      file.type
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}