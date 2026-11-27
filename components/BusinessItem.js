
"use client";

export default function BusinessItem({ place }) {
  const name = place?.displayName?.text || "Unnamed place";

  const address =
    place?.formattedAddress || "Address unavailable";

  const rating =
    typeof place?.rating === "number"
      ? place.rating.toFixed(1)
      : "N/A";

  const reviews = place?.userRatingCount;

  return (
    <div className="flex gap-3 p-3 border rounded-xl">
      <img
        src="/businessItem.jpg"
        alt={name}
        loading="lazy"
        className="w-20 h-20 rounded-lg object-cover"
      />

      <div className="min-w-0">
        <h3 className="font-bold">
          {name}
        </h3>

        <p className="text-sm text-gray-500">
          {address}
        </p>

        <p className="mt-1 text-sm">
          ⭐ {rating}
          {reviews ? ` (${reviews} reviews)` : ""}
        </p>
      </div>
    </div>
  );
}
