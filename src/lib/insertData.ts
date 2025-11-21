import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { coralData } from "src/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

export default async function insertData(
  data: Array<Record<string, any>>,
  date: string,
) {
  const getProbeValue = (probeName: string) => {
    console.log(probeName);
    const val = data["probe"].find((probe: any) => probe.name === probeName);

    // FIXME: Some values may not be reported under the same name
    return val == null ? null : val.value;
  };

  const entry = {
    // FIXME: When we work with multiple tanks, report correctly
    tankNumber: 1,
    datetime: date,

    // FIXME: ts2353
    // @ts-ignore
    temperature: getProbeValue("Tmp"),
    ph: getProbeValue("pH"),
    orp: getProbeValue("ORP"),
    lls: getProbeValue("LLS"),

    sumpReturnA: getProbeValue("SUMPRETURNA"),
    sumpReturnW: getProbeValue("SUMPRETURNW"),

    skimmerA: getProbeValue("SKIMMERA"),
    skimmerW: getProbeValue("SKIMMERW"),

    uvA: getProbeValue("UVA"),
    uvW: getProbeValue("UVW"),

    heaterA: getProbeValue("HeaterA"),
    heaterW: getProbeValue("HeaterW"),

    ledLampA: getProbeValue("LEDLampA"),
    ledLampW: getProbeValue("LEDLampW"),

    emptyA: getProbeValue("EMPTYA"),
    emptyW: getProbeValue("EMPTYW"),

    atkPowerA: getProbeValue("ATKpowerA"),
    atkPowerW: getProbeValue("ATKpowerW"),

    wavePumpA: getProbeValue("WavepumpA"),
    wavePumpW: getProbeValue("WavepumpW"),

    // TODO: what is "Tmpx4" and is it worth reporting?
    salt: getProbeValue("SALT"),
    alkalinity: getProbeValue("Alkx5"),
    calcium: getProbeValue("Cax5"),
    magnesium: getProbeValue("Mgx5"),

    volt2: getProbeValue("Volt_2"),
  };

  // Insert row into the database
  try {
    await db.insert(coralData).values(entry);
    console.log("Insertion successful:", entry);
  } catch (error) {
    console.error("Database Insertion Error:", error);
  }
}
