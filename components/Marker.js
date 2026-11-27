
"use client";

import { MarkerF } from "@react-google-maps/api";

// Marker for user's current GPS location
export default function UserLocationMarker({ userLocation }) {
  // Check if GPS coordinates are available
  if (
    !userLocation ||
    !Number.isFinite(userLocation.lat) ||
    !Number.isFinite(userLocation.lng)
  ) {
    return null;
  }

  return (
    <MarkerF
      // Current user position
      position={userLocation}
      icon={{
        // Image from public folder
        url: "/placeholder.png",

        // Marker size
        scaledSize: new window.google.maps.Size(50, 50),
      }}
    />
  );
}
