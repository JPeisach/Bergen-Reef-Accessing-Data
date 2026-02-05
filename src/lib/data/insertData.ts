import { db } from "src/db/drizzle";
import { coralData } from "src/db/schema";

export default async function insertData(
  data: Array<Record<string, any>>,
  date: string,
) {
  // Iterate over all pieces of data (nodes) in the array from the JSON
  for (let i = 0; i < data.length; i++) {
    // Check name of the current data node to determine its corresponding name
    let name = "";
    if (data[i].name === "Salt") {
      name = "Salinity";
    } else if (data[i].name === "Tmp") {
      name = "Temperature";
    } else if (data[i].name.startsWith("Alkx")) {
      name = "Alkalinity";
    } else if (data[i].name.startsWith("Cax")) {
      name = "Calcium";
    } else if (data[i].name.startsWith("Mgx")) {
      name = "Magnesium";
    } else {
      name = data[i].name;
    }

    // Check type / name of the current data node to determine its type
    let unit = "";
    if (data[i].type === "Cond") {
      unit = "ppt";
    } else if (data[i].type === "Temp") {
      unit = "°F";
    } else if (data[i].type === "alk") {
      unit = "dkH";
    } else if (data[i].type === "ca" || data[i].type === "mg") {
      unit = "ppm";
    } else if (data[i].name === "LLS") {
      unit = "in";
    } else if (data[i].name === "Volt_2") {
      unit = "Volts";
    } else if (data[i].name.slice(data[i].name.length - 1) === "A") {
      unit = "Amps";
    } else if (data[i].name.slice(data[i].name.length - 1) === "W") {
      unit = "Watts";
    } else {
      unit = data[i].type;
    }

    // Construct row of the current data node with all its attributes
    const entry: typeof coralData.$inferInsert = {
      // FIXME: why not pass Date object directly?
      datetime: new Date(date),
      name: name,
      unit: unit,
      value: data[i].value,

      // FIXME: updatedAt = now?
      updatedAt: new Date(date),
    };

    // Insert row into the database
    try {
      await db.insert(coralData).values(entry);
      console.log("Insertion successful:", entry);
    } catch (error) {
      console.error("Database Insertion Error:", error);
    }
  }
}
