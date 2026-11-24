
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const photoName = searchParams.get("name");

    if (
      !photoName ||
      !/^places\/[^/]+\/photos\/[^/]+$/.test(photoName)
    ) {
      return NextResponse.json(
        { error: "Invalid photo name" },
        { status: 400 }
      );
    }

    const url =
      `https://places.googleapis.com/v1/${photoName}/media` +
      `?maxWidthPx=400&key=${process.env.GOOGLE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("PHOTO API ERROR:", await response.text());

      return NextResponse.json(
        { error: "Failed to load photo" },
        { status: response.status }
      );
    }

    const image = await response.arrayBuffer();

    return new Response(image, {
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400"
      }
    });
  } catch (error) {
    console.error("PHOTO ERROR:", error);

    return NextResponse.json(
      { error: "Photo loading failed" },
      { status: 500 }
    );
  }
}
