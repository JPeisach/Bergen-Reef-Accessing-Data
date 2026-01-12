import { db } from "src/db/drizzle";
import { eq } from "drizzle-orm";
import { coralData } from "src/db/schema";

export default async function getData() {
  const data = await db
    .select()
    .from(coralData)
    .where(eq(coralData.deleted, 1));
  return data;
}
