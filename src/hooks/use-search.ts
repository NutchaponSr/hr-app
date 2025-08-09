"use client";

import { useQueryState } from "nuqs";

export const useSearch = () => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });

  const [selectedCategory, setSelectedCategory] = useQueryState("category", {
    defaultValue: "",
  });

  const clearSearch = () => {
    setSearch("");
    setSelectedCategory("");
  };

  return {
    search,
    selectedCategory,
    setSearch,
    setSelectedCategory,
    clearSearch,
  };
};