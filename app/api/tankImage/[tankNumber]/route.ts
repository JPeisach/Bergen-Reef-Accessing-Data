import getImage from "src/lib/infoPageImages/getImage";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      tankNumber: string;
    }>;
  }
) {
  const params = await context.params;

  const image = await getImage(
    Number(params.tankNumber)
  );

  if (!image) {
    return new Response("No image found", {
      status: 404,
    });
  }

    const buffer = Buffer.isBuffer(image.images)
      ? image.images
      : Buffer.from(image.images as any);

return new Response(buffer, {
  headers: {
    "Content-Type": image.mimeType,
  },
});
}
