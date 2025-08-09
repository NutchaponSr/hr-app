"use client";

import { LayoutGridIcon } from "lucide-react";

import { APP_CATEGORIES } from "@/constants";

import { useSearch } from "@/hooks/use-search";

import { ApplicationCard } from "./application-card";

export const ApplicationSection = () => {
  const { selectedCategory } = useSearch();

  return (
    <section className="relative flex-col items-start w-full">
      <div className="flex items-center justify-between w-full h-11 px-2">
        <div className="flex items-center gap-2">
          <LayoutGridIcon className="text-secondary size-3.5 shrink-0 stroke-[2.1]" />
          <h4 className="text-xs font-medium text-secondary">
            Applications
          </h4>
        </div>
      </div>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
        {APP_CATEGORIES
          .filter((f) => !selectedCategory || selectedCategory === "" || f.title === selectedCategory)
          .flatMap((app) =>
            app.items.map((item) => (
              <ApplicationCard
                key={item.title}
                appIcon={item.icon}
                title={item.title}
                href={item.href}
                description={item.description}
                border={app.border}
                background={app.background}
                icon={app.icon}
              />
            ))
          )}
      </div>
    </section>
  );
};