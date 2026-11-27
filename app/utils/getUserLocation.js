
"use client";

// Get current user GPS location
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    // Check browser geolocation support
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    // Request current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log("GPS COORDINATES:", coords);

        resolve(coords);
      },

      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("User denied location permission"));
            break;

          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information unavailable"));
            break;

          case error.TIMEOUT:
            reject(new Error("Location request timed out"));
            break;

          default:
            reject(new Error("Unknown location error"));
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};
