import { NextResponse } from "next/server";
import xml2js from "xml2js";
import insertData from "src/lib/insertData";

export async function POST(request: Request) {
  try {
    // Get the XML file within the request
    const raw_xml = await request.text();
    console.log("Raw XML:", raw_xml);

    // Use xml2js package to convert XML into JSON
    const parser = new xml2js.Parser({ explicitArray: false });
    const parsed_xml = await parser.parseStringPromise(raw_xml);

    console.log("Parsed XML:", parsed_xml);
    await insertData(parsed_xml.status.probes, parsed_xml.status.date);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 400 });
  }
}
