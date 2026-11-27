
"use client";

import { useState } from "react";

function SearchBar({ onSearch }) {
  // Store current search input value
  const [searchText, setSearchText] = useState("");

  // Start search
  const handleSearch = () => {
    const query = searchText.trim();

    if (!query) return;

    onSearch(query);
  };

  // Handle Enter key
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-3 bg-purple-100 p-3 rounded-xl">
      {/* Search button */}
      <button
        type="button"
        onClick={handleSearch}
        aria-label="Search places"
        className="text-purple-500 hover:text-purple-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search place..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        onKeyDown={handleKeyDown}
        className="
          outline-none
          w-full
          text-[17px]
          placeholder-purple-400
          bg-transparent
        "
      />
    </div>
  );
}

export default SearchBar;
