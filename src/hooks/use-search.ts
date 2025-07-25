"use client";

import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { APP_CATEGORIES } from "@/constants";

export const useSearch = () => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });

  const [selectedCategory, setSelectedCategory] = useQueryState("category", {
    defaultValue: "",
  });

  // Get all items from all categories
  const allItems = useMemo(() => {
    return APP_CATEGORIES.flatMap(category => 
      category.items.map(item => ({
        ...item,
        category: category.title,
        categoryColor: category.color
      }))
    );
  }, []);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    let items = allItems;

    // Filter by category if selected
    if (selectedCategory) {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      );
    }

    return items;
  }, [allItems, search, selectedCategory]);

  const clearSearch = () => {
    setSearch("");
    setSelectedCategory("");
  };

  return {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    filteredItems,
    allItems,
    clearSearch,
    hasActiveFilters: search.trim() !== "" || selectedCategory !== ""
  };
};