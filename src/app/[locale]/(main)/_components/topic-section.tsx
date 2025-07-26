"use client";

import Link from "next/link";
import Image from "next/image";

import { APP_CATEGORIES } from "@/constants";
import { useSearch } from "@/hooks/use-search";

export const TopicSection = () => {
  const { filteredItems, hasActiveFilters, search, selectedCategory } = useSearch();

  const displayItems = hasActiveFilters ? filteredItems : APP_CATEGORIES.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.title,
      categoryColor: category.color
    }))
  );

  const getTitle = () => {
    if (search && selectedCategory) {
      return `Search results "${search}" in "${selectedCategory}"`;
    } else if (search) {
      return `Search results "${search}"`;
    } else if (selectedCategory) {
      return `Applications in category "${selectedCategory}"`;
    }
    return "Applications";
  };

  return (
    <section className="md:pt-10 md:pb-20 max-w-[1200px] mx-auto">
      <h2 className="text-2xl text-balance font-bold text-primary">
        {getTitle()}
      </h2>

      {displayItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-tertiary text-lg">No application be found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 md:mt-8">
          {displayItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-start cursor-pointer rounded group"
            >
              <div className="pb-1 md:pb-2">
                <Image 
                  src={item.image ?? ""}
                  alt="AppLogo"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="text-primary group-hover:text-neutral font-medium text-sm leading-7.5 pb-2">
                {item.title} →
              </h3>
              <p className="text-xs text-tertiary">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}