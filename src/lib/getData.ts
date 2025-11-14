import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm/expressions";
import { coralData } from "src/db/schema";

export default async function getData() {
  const db = drizzle(process.env.DATABASE_URL!);
  const data = await db.select().from(coralData);
  return data;
}
