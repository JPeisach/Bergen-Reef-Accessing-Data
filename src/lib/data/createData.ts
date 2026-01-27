import { db } from "src/db/drizzle";
import { coralData } from "src/db/schema";

export default async function createData(
  data: Array<Record<string, any>>,
  date: Date,
) {
  // Construct row of the current data node with all its attributes
  const entry: typeof coralData.$inferInsert = {
    datetime: date,
    name: data[0].name,
    unit: data[0].unit,
    value: data[0].value,

    // FIXME: date = now??
    updatedAt: date,
  };

  // Insert row into the database
  try {
    await db.insert(coralData).values(entry);
  } catch (error) {
    console.error("Error inserting data:", error);
    throw new Error(`Error inserting data: ${error}`);
  }
}
