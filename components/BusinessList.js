
"use client";

import { useState, useEffect, useContext } from "react";

import { SelectedBusinessContext } from "../app/context/SelectedBusinessContext";
import { FavoriteContext } from "../app/context/FavoriteContext";

export default function BusinessList({ places = [], loading }) {
  const [page, setPage] = useState(0);

  const { selectedBusiness, setSelectedBusiness } =
    useContext(SelectedBusinessContext);

  const { addFavorite, removeFavorite, favorites } =
    useContext(FavoriteContext);

  const pageSize = 5;

  // Reset pagination when search results change
  useEffect(() => {
    setPage(0);
  }, [places]);

  const start = page * pageSize;
  const visiblePlaces = places.slice(start, start + pageSize);

  const totalPages = Math.ceil(places.length / pageSize);

  const showPrev = page > 0;
  const showNext = page < totalPages - 1;

  // Check whether a place is already in favorites
  const isFavorite = (place) =>
    favorites.some((item) => item.id === place.id);

  // Show loading skeletons
  if (loading) {
    return (
      <div className="mt-5 space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 rounded-xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Show message when no places are found
  if (!places.length) {
    return (
      <p className="mt-5 text-gray-500">
        No places found
      </p>
    );
  }

  return (
    <div className="mt-5 space-y-3">
      {visiblePlaces.map((place) => {
        const favorite = isFavorite(place);
        const selected = selectedBusiness?.id === place.id;
        const photoName = place.photos?.[0]?.name;

        const photoUrl = photoName
          ? `/api/photo?name=${encodeURIComponent(photoName)}`
          : "/businessItem.jpg";

        return (
          <div
            key={place.id}
            onClick={() => setSelectedBusiness(place)}
            className={`flex gap-3 p-3 border rounded-xl cursor-pointer transition ${
              selected
                ? "border-purple-500 bg-purple-50"
                : "hover:bg-purple-50"
            }`}
          >
            <img
              src={photoUrl}
              alt={place.displayName?.text || "Place"}
              loading="lazy"
              className="w-20 h-20 shrink-0 rounded-lg object-cover"
              onError={(event) => {
                const fallback = "/businessItem.jpg";

                if (!event.currentTarget.src.endsWith(fallback)) {
                  event.currentTarget.src = fallback;
                }
              }}
            />

            <div className="flex-1 min-w-0">
              <h3 className="font-bold">
                {place.displayName?.text || "Unnamed place"}
              </h3>

              <p className="text-sm text-gray-500">
                {place.formattedAddress || "Address unavailable"}
              </p>

              {typeof place.rating === "number" && (
                <p className="mt-1 text-sm">
                  ⭐ {place.rating}
                  {place.userRatingCount
                    ? ` (${place.userRatingCount} reviews)`
                    : ""}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                if (favorite) {
                  removeFavorite(place.id);
                } else {
                  addFavorite(place);
                }
              }}
              className="text-xl self-start"
              aria-label={
                favorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              {favorite ? "❤️" : "🤍"}
            </button>
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-3">
          <button
            type="button"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={!showPrev}
            className="px-4 py-2 rounded-lg border disabled:opacity-30"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {page + 1} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!showNext}
            className="px-4 py-2 rounded-lg border disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
