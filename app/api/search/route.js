import { NextResponse } from "next/server";

const GOOGLE_API_URL = "https://places.googleapis.com/v1/places:searchText";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is missing" },
        { status: 400 },
      );
    }

    const response = await fetch(GOOGLE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
        "X-Goog-FieldMask": [
          "places.id",
          "places.displayName",
          "places.formattedAddress",
          "places.location",
          "places.rating",
          "places.userRatingCount",
          "places.types",
          "places.photos",
        ].join(","),
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 20,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GOOGLE SEARCH ERROR:", data);

      return NextResponse.json(
        { error: "Google Places API error", details: data },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("SEARCH API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to search places" },
      { status: 500 },
    );
  }
}
