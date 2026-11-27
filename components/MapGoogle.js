
"use client";

import { useContext, useState } from "react";

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
  selectedCategory,
}) {
  const [map, setMap] = useState(null);

  const { selectedBusiness, setSelectedBusiness } = useContext(
    SelectedBusinessContext
  );

  // Select marker icon
  const getMarkerIcon = () => {
    switch (selectedCategory) {
      case "gas_station":
        return "/petrol-station.png";
      case "restaurant":
        return "/restaurant.png";
      case "hotel":
        return "/hotel.png";
      default:
        return "/placeholder.png";
    }
  };

  // Get coordinates from Google Places API
  const getPlacePosition = (place) => {
    const latitude = Number(place?.location?.latitude);
    const longitude = Number(place?.location?.longitude);

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
            onLoad={(mapInstance) => {
              setMap(mapInstance);
            }}
            onUnmount={() => {
              setMap(null);
            }}
          >
            {/* User GPS location */}
            <UserLocationMarker userLocation={userLocation} />

            {/* Nearby places */}
            {places.map((place) => {
              const position = getPlacePosition(place);

              if (!position) return null;

              return (
                <MarkerF
                  key={place.id}
                  position={position}
                  icon={{
                    url: getMarkerIcon(),
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  onClick={() => {
                    setSelectedBusiness(place);
                  }}
                />
              );
            })}

            {/* Selected place information */}
            {selectedBusiness && selectedPosition && (
              <InfoWindow
                position={selectedPosition}
                onCloseClick={() => {
                  setSelectedBusiness(null);
                }}
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

          {/* Return to my location button */}
          <button
            type="button"
            onClick={goToMyLocation}
            className="
              absolute
              left-4
              bottom-4
              bg-white
              shadow-lg
              rounded-full
              w-12
              h-12
              flex
              items-center
              justify-center
              hover:bg-purple-100
              transition
            "
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
                d="
                  M12 21
                  a9 9 0 1 0 0 -18
                  a9 9 0 0 0 0 18
                  z
                  M12 15
                  a3 3 0 1 0 0 -6
                  a3 3 0 0 0 0 6
                  z
                "
              />
            </svg>
          </button>
        </div>
      )}
    </LoadScript>
  );
}
