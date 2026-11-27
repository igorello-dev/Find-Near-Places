
"use client";

import { useContext } from "react";

import { FavoriteContext } from "../app/context/FavoriteContext";
import { SelectedBusinessContext } from "../app/context/SelectedBusinessContext";

export default function FavoriteList() {
  const { favorites, removeFavorite } = useContext(FavoriteContext);
  const { setSelectedBusiness } = useContext(SelectedBusinessContext);

  if (!favorites || favorites.length === 0) {
    return (
      <p className="text-gray-500 mt-5">
        No favorites yet
      </p>
    );
  }

  return (
    <div className="mt-5 space-y-3">
      <h2 className="font-bold text-xl">
        My Favorites ❤️
      </h2>

      {favorites.map((place) => {
        const photoName = place.photos?.[0]?.name;

        const photoUrl = photoName
          ? `/api/photo?name=${encodeURIComponent(photoName)}`
          : "/businessItem.jpg";

        return (
          <div
            key={place.id}
            onClick={() => setSelectedBusiness(place)}
            className="flex gap-3 p-3 border rounded-xl cursor-pointer hover:bg-purple-100 transition"
          >
            <img
              src={photoUrl}
              alt={place.displayName?.text || "Place"}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = "/businessItem.jpg";
              }}
              className="w-16 h-16 shrink-0 rounded-lg object-cover"
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
              type="button"
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
        );
      })}
    </div>
  );
}
