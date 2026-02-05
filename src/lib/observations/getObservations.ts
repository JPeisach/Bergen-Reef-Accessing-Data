import { db } from "src/db/drizzle";
import "dotenv/config";
import { desc } from "drizzle-orm";
import { observations } from "src/db/schema"; // eventually change back to data-schema
import { getUserById } from "../auth0";

// TODO: Get a specific observation based on a certain filter
export default async function getObservations(limit?: number) {
  try {
    const query = db
      .select()
      .from(observations)
      .orderBy(desc(observations.datetime));

    if (limit) {
      const data = await query.limit(limit);

      // Hacky work around for getting the author.
      // We can't use the same variable for the data
      // returned from Drizzle because that is a different
      // type. Here we return the author and add it accordingly.
      const ret = [];

      for (const obs of data) {
        const author = await getUserById(obs.authorId);
        ret.push({ ...obs, author: author.name });
      }

      return ret;
    }

    // Don't return author names so we don't get EVERYTHING
    // and send n number of auth0 requests.
    const data = await query;
    return data;
  } catch (error) {
    console.log("Failed to get observations:", error);
    throw error;
  }
}
