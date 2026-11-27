
"use client";

import { useContext, useEffect, useState } from "react";

import {
  GoogleMap,
  LoadScript,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";

import UserLocationMarker from "./Marker";

import { SelectedBusinessContext } from "../app/context/SelectedBusinessContext";

export default function MapGoogle({
  userLocation,
  places = [],
}) {
  const [map, setMap] = useState(null);

  const { selectedBusiness, setSelectedBusiness } = useContext(
    SelectedBusinessContext
  );

  // Get coordinates from Google Places API
  const getPlacePosition = (place) => {
    const lat = place?.location?.latitude;
    const lng = place?.location?.longitude;

    if (lat == null || lng == null) return null;

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return null;
    }

    return {
      lat: latitude,
      lng: longitude,
    };
  };

  // Automatically adjust map to show all places
  useEffect(() => {
    if (!map || !window.google || places.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    let validPlaces = 0;

    places.forEach((place) => {
      const position = getPlacePosition(place);

      if (position) {
        bounds.extend(position);
        validPlaces++;
      }
    });

    if (validPlaces === 1) {
      map.panTo(bounds.getCenter());
      map.setZoom(15);
    } else if (validPlaces > 1) {
      map.fitBounds(bounds);
    }
  }, [map, places]);

  // Return to user's location
  const goToMyLocation = () => {
    if (!map || !userLocation) return;

    map.panTo(userLocation);
    map.setZoom(15);
  };

  const selectedPosition = getPlacePosition(selectedBusiness);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""}
    >
      {userLocation && (
        <div className="relative">
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "400px",
              borderRadius: "20px",
            }}
            center={userLocation}
            zoom={14}
            onLoad={setMap}
            onUnmount={() => setMap(null)}
          >
            {/* User GPS location */}
            <UserLocationMarker userLocation={userLocation} />

            {/* Place markers */}
            {places.map((place) => {
              const position = getPlacePosition(place);

              if (!position) return null;

              return (
                <MarkerF
                  key={place.id}
                  position={position}
                  onClick={() => setSelectedBusiness(place)}
                />
              );
            })}

            {/* Selected place information */}
            {selectedBusiness && selectedPosition && (
              <InfoWindow
                position={selectedPosition}
                onCloseClick={() => setSelectedBusiness(null)}
              >
                <div>
                  <h3 className="font-bold">
                    {selectedBusiness.displayName?.text || "Selected place"}
                  </h3>

                  <p>
                    {selectedBusiness.formattedAddress ||
                      "Address unavailable"}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          {/* Return to user's location button */}
          <button
            type="button"
            onClick={goToMyLocation}
            className="absolute left-4 bottom-4 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-purple-100 transition"
            aria-label="Go to my location"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-7 h-7 text-purple-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
              />
            </svg>
          </button>
        </div>
      )}
    </LoadScript>
  );
}
