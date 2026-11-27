
"use client";

import { useState, useEffect, useCallback } from "react";
import { UserLocationContext } from "./UserLocationContext";
import { getUserLocation } from "../utils/getUserLocation";

export default function UserLocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  // Get user's GPS location
  const updateUserLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);

    try {
      const coords = await getUserLocation();

      if (
        !Number.isFinite(coords?.lat) ||
        !Number.isFinite(coords?.lng) ||
        coords.lat < -90 ||
        coords.lat > 90 ||
        coords.lng < -180 ||
        coords.lng > 180
      ) {
        throw new Error("Invalid GPS coordinates");
      }

      console.log("USER LOCATION:", coords);

      setUserLocation(coords);
    } catch (error) {
      console.error("LOCATION ERROR:", error);
      setLocationError(error.message || "Unable to get your location");
    } finally {
      setLocationLoading(false);
    }
  }, []);

  // Get location when application starts
  useEffect(() => {
    updateUserLocation();
  }, [updateUserLocation]);

  return (
    <UserLocationContext.Provider
      value={{
        userLocation,
        setUserLocation,
        locationLoading,
        locationError,
        updateUserLocation,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
}
