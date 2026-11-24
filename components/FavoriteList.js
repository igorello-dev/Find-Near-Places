
"use client";

import { useContext } from "react";

import { FavoriteContext } from "../app/context/FavoriteContext";
import { SelectedBusinessContext } from "../app/context/SelectedBusinessContext";

export default function FavoriteList() {
  const { favorites, removeFavorite } = useContext(FavoriteContext);
  const { setSelectedBusiness } = useContext(SelectedBusinessContext);

  if (favorites.length === 0) {
    return <p className="text-gray-500 mt-5">No favorites yet</p>;
  }

  return (
    <div className="mt-5 space-y-3">
      <h2 className="font-bold text-xl">My Favorites ❤️</h2>

      {favorites.map((place) => (
        <div
          key={place.id}
          onClick={() => setSelectedBusiness(place)}
          className="flex gap-3 p-3 border rounded-xl cursor-pointer hover:bg-purple-100 transition"
        >
          <img
            src={
              place.photos?.[0]?.name
                ? `/api/photo?name=${encodeURIComponent(place.photos[0].name)}`
                : "/businessItem.jpg"
            }
            alt={place.displayName?.text || "Place"}
            className="w-16 h-16 rounded-lg object-cover"
          />

          <div className="flex-1 min-w-0">
            <h3 className="font-bold">
              {place.displayName?.text || "Unnamed place"}
            </h3>
            <p className="text-sm text-gray-500">
              {place.formattedAddress || "Address unavailable"}
            </p>
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              removeFavorite(place.id);
            }}
            className="self-start text-xl"
            aria-label="Remove from favorites"
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
}
