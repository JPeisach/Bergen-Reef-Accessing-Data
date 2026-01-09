import { db } from "src/db/drizzle";
import { and, between, inArray } from "drizzle-orm";
import { coralData } from "src/db/schema";

export default async function searchDataByDateType(
  datetimeStart: Date,
  datetimeEnd: Date,
  types: string[],
) {
  try {
    const result = await db
      .select()
      .from(coralData)
      .where(
        and(
          between(
            coralData.datetime,
            datetimeStart.toISOString(),
            datetimeEnd.toISOString(),
          ),
          // dataTable.name has the more accurate types to filter by (multiple different names can have the same type of data)
          inArray(coralData.name, types),
        ),
      )
      .orderBy(coralData.datetime); // Order by datetime

    console.log(
      `Successfully filtered for data of types ${types} between ${datetimeStart} and ${datetimeEnd}.`,
    );

    return result;
  } catch (error) {
    console.error("Error searching for data: ", error);
    throw new Error("Failed to filter types in the database.");
  }
}
