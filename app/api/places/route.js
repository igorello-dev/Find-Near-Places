
import { NextResponse } from "next/server";

const GOOGLE_API_URL =
  "https://places.googleapis.com/v1/places:searchNearby";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    // Check required parameters
    if (!category || lat === null || lng === null) {
      return NextResponse.json(
        { error: "Missing category, lat or lng" },
        { status: 400 }
      );
    }

    // Convert coordinates to numbers
    const latitude = Number(lat);
    const longitude = Number(lng);

    // Validate coordinates
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    // Check Google API key
    if (!process.env.GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY is missing");

      return NextResponse.json(
        { error: "Google API key is not configured" },
        { status: 500 }
      );
    }

    // Send request to Google Places API
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
              latitude,
              longitude
            },
            radius: 5000
          }
        }
      })
    });

    const data = await response.json();

    // Handle Google API errors
    if (!response.ok) {
      console.error("GOOGLE NEARBY ERROR:", data);

      return NextResponse.json(
        {
          error: "Google Places API error",
          details: data
        },
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
