import { db } from "src/db/drizzle";
import { infoPageImages } from "src/db/schema";
import { eq } from "drizzle-orm";
export const runtime = "nodejs";

export default async function uploadImage(
  tankNumber: number,
  imageBuffer: Buffer,
  mimeType: string
) {
  try {
    const existing = await db
      .select()
      .from(infoPageImages)
      .where(eq(infoPageImages.tankNumber, tankNumber));

    if (existing.length > 0) {
      await db
        .update(infoPageImages)
        .set({
          images: imageBuffer,
          mimeType,
        })
        .where(eq(infoPageImages.tankNumber, tankNumber));
    } else {
      await db.insert(infoPageImages).values({
        tankNumber,
        images: imageBuffer,
        mimeType,
      });
    }
  } catch (error) {
    console.log("Failed to upload image:", error);
    throw error;
  }
}