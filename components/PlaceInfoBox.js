
"use client";

import { useContext } from "react";

import { SelectedBusinessContext } from "../app/context/SelectedBusinessContext";

export default function PlaceInfoBox({ userLocation }) {
  const { selectedBusiness } = useContext(
    SelectedBusinessContext
  );

  if (!selectedBusiness || !userLocation) {
    return null;
  }

  // Get coordinates from Google Places API
  const placeLat = Number(selectedBusiness.location?.latitude);
  const placeLng = Number(selectedBusiness.location?.longitude);

  const userLat = Number(userLocation.lat);
  const userLng = Number(userLocation.lng);

  // Validate coordinates
  if (
    !Number.isFinite(placeLat) ||
    !Number.isFinite(placeLng) ||
    !Number.isFinite(userLat) ||
    !Number.isFinite(userLng) ||
    placeLat < -90 ||
    placeLat > 90 ||
    placeLng < -180 ||
    placeLng > 180 ||
    userLat < -90 ||
    userLat > 90 ||
    userLng < -180 ||
    userLng > 180
  ) {
    return null;
  }

  // Calculate distance
  const distance = calculateDistance(
    userLat,
    userLng,
    placeLat,
    placeLng
  );

  // Open Google Maps directions
  const openRoute = () => {
    const url = new URL("https://www.google.com/maps/dir/");

    url.searchParams.set(
      "api",
      "1"
    );

    url.searchParams.set(
      "origin",
      `${userLat},${userLng}`
    );

    url.searchParams.set(
      "destination",
      `${placeLat},${placeLng}`
    );

    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-5 rounded-xl border bg-white p-5 shadow-lg">
      <h2 className="text-xl font-bold">
        {selectedBusiness.displayName?.text || "Selected place"}
      </h2>

      <p className="mt-2 text-gray-600">
        {selectedBusiness.formattedAddress || "Address unavailable"}
      </p>

      {typeof selectedBusiness.rating === "number" && (
        <p className="mt-2">
          ⭐ {selectedBusiness.rating}
          {selectedBusiness.userRatingCount
            ? ` (${selectedBusiness.userRatingCount} reviews)`
            : ""}
        </p>
      )}

      <p className="mt-2">
        📍 Distance:
        <strong> {distance.toFixed(2)} km</strong>
      </p>

      <button
        type="button"
        onClick={openRoute}
        className="
          mt-4
          rounded-lg
          bg-blue-600
          px-5
          py-2
          text-white
          hover:bg-blue-700
        "
      >
        🚗 Get Directions
      </button>
    </div>
  );
}

// Calculate distance using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}
