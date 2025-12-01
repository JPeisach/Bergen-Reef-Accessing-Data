import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { coralData } from "src/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

export default async function createData(
  data: Array<Record<string, any>>,
  date: Date,
) {
  // Construct row of the current data node with all its attributes
  const entry: typeof coralData.$inferInsert = {
    datetime: date.toString(),
    name: data[0].name,
    unit: data[0].unit,
    value: data[0].value,
    updatedAt: date.toString(),
  };

  // Insert row into the database
  try {
    await db.insert(coralData).values(entry);
  } catch (error) {
    console.error("Error inserting data:", error);
    throw new Error(`Error inserting data: ${error}`);
  }
}
