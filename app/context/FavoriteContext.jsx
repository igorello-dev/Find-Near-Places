
"use client";

import { createContext, useEffect, useState } from "react";

export const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favorites");

      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);

        // Support old and new Google Places IDs
        const normalizedFavorites = parsedFavorites.map((place) => ({
          ...place,
          id: place.id || place.place_id,
        }));

        setFavorites(normalizedFavorites);
      }
    } catch (error) {
      console.error("FAVORITES LOAD ERROR:", error);
    }
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Add favorite
  const addFavorite = (place) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (item) => item.id === place.id
      );

      if (exists) {
        return prev;
      }

      return [...prev, place];
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
