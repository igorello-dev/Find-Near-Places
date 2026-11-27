
"use client";

import { useState } from "react";

import Data from "../Shared/Data";
import CategoryItem from "./CategoryItem";

function CategoryList({ setSelectedCategory }) {
  const [activeCategory, setActiveCategory] = useState("gas_station");

  const categories = Data.CategoryListData;

  // Handle category selection
  const handleCategoryClick = (value) => {
    console.log("SELECT CATEGORY:", value);

    setActiveCategory(value);
    setSelectedCategory(value);
  };

  return (
    <div>
      <h2 className="text-[20px] mt-3 font-bold mb-3">
        Select Your Category
      </h2>

      <div className="flex gap-6 mb-6">
        {categories.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCategoryClick(item.value)}
          >
            <CategoryItem
              category={item}
              active={activeCategory === item.value}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
