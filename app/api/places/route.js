
import { NextResponse } from "next/server";

const GOOGLE_API_URL =
  "https://places.googleapis.com/v1/places:searchNearby";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!category || !lat || !lng) {
      return NextResponse.json(
        { error: "Missing category, lat or lng" },
        { status: 400 }
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
          "places.photos"
        ].join(",")
      },
      body: JSON.stringify({
        includedTypes: [category],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: Number(lat),
              longitude: Number(lng)
            },
            radius: 5000
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GOOGLE NEARBY ERROR:", data);

      return NextResponse.json(
        { error: "Google Places API error", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("PLACES API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to get places" },
      { status: 500 }
    );
  }
}
