export const runtime = "nodejs";
import getImage from "src/lib/infoPageImages/getImage";

export async function GET(
    req: Request,
    {
        params,
    }: {
        params: {
            tankNumber: string;
        };
    }
) {
    const image = await getImage(
        Number(params.tankNumber)
    );

    if (!image) {
        return new Response("No image found", {
            status: 404,
        });
    }

    return new Response(new Uint8Array(image.images), {
        headers: {
            "Content-Type": image.mimeType,
        },
    });
}