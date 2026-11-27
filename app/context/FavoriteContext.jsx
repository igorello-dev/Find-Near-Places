
"use client";

import { createContext, useEffect, useState } from "react";

export const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favorites");

      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);

        if (Array.isArray(parsedFavorites)) {
          const normalizedFavorites = parsedFavorites
            .filter((place) => place && typeof place === "object")
            .map((place) => ({
              ...place,
              id: place.id || place.place_id,
            }))
            .filter((place) => place.id);

          setFavorites(normalizedFavorites);
        }
      }
    } catch (error) {
      console.error("FAVORITES LOAD ERROR:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error("FAVORITES SAVE ERROR:", error);
    }
  }, [favorites, isLoaded]);

  // Add favorite
  const addFavorite = (place) => {
    if (!place || !(place.id || place.place_id)) return;

    const normalizedPlace = {
      ...place,
      id: place.id || place.place_id,
    };

    setFavorites((prev) => {
      const exists = prev.some(
        (item) => item.id === normalizedPlace.id
      );

      if (exists) return prev;

      return [...prev, normalizedPlace];
    });
  };

  // Remove favorite
  const removeFavorite = (placeId) => {
    setFavorites((prev) =>
      prev.filter((item) => item.id !== placeId)
    );
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}
