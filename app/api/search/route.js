
import { NextResponse } from "next/server";

const GOOGLE_API_URL =
  "https://places.googleapis.com/v1/places:searchText";

const SEARCH_RADIUS = 5000;

// Calculate distance between two GPS coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371000;

  const toRadians = (degrees) => degrees * Math.PI / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return earthRadius * 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query")?.trim();
    const latValue = searchParams.get("lat");
    const lngValue = searchParams.get("lng");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is missing" },
        { status: 400 }
      );
    }

    if (query.length > 200) {
      return NextResponse.json(
        { error: "Search query is too long" },
        { status: 400 }
      );
    }

    if (latValue === null || lngValue === null) {
      return NextResponse.json(
        { error: "User coordinates are required" },
        { status: 400 }
      );
    }

    const lat = Number(latValue);
    const lng = Number(lngValue);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 || lat > 90 ||
      lng < -180 || lng > 180
    ) {
      return NextResponse.json(
        { error: "Invalid GPS coordinates" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Google API key is not configured" },
        { status: 500 }
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
        textQuery: query,
        maxResultCount: 20,
        locationBias: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng
            },
            radius: SEARCH_RADIUS
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GOOGLE SEARCH ERROR:", data);

      return NextResponse.json(
        { error: "Google Places API error", details: data },
        { status: response.status }
      );
    }

    // Filter results by actual distance
    const places = (data.places || [])
      .filter((place) => {
        const location = place.location;

        if (
          !Number.isFinite(location?.latitude) ||
          !Number.isFinite(location?.longitude)
        ) {
          return false;
        }

        const distance = calculateDistance(
          lat,
          lng,
          location.latitude,
          location.longitude
        );

        return distance <= SEARCH_RADIUS;
      })
      .map((place) => ({
        ...place,
        distance: Math.round(
          calculateDistance(
            lat,
            lng,
            place.location.latitude,
            place.location.longitude
          )
        )
      }))
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json({
      places,
      totalResults: places.length
    });

  } catch (error) {
    console.error("SEARCH API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to search places" },
      { status: 500 }
    );
  }
}
