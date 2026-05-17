import { db } from "src/db/drizzle";
import { infoPageImages } from "src/db/schema";
import { eq } from "drizzle-orm";

export default async function getImage(
  tankNumber: number
) {
  try {
    const result = await db
      .select()
      .from(infoPageImages)
      .where(eq(infoPageImages.tankNumber, tankNumber));

    return result[0];
  } catch (error) {
    console.log("Failed to get image:", error);
    throw error;
  }
}