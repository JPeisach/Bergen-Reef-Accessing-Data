import { db } from "src/db/drizzle";
import { sql } from "drizzle-orm";
import { coralData } from "src/db/schema";

export default async function getData() {
  const data = await db
    .select()
    .from(coralData)
    .where(sql`deleted = 1`);
  return data;
}
