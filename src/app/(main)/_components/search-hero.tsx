"use client";

import { GoSearch } from "react-icons/go";

import { authClient } from "@/lib/auth-client";

import { useSearch } from "@/hooks/use-search";

import { APP_CATEGORIES } from "@/constants";

export const SearchHero = () => {
  const { data: session, isPending } = authClient.useSession();
  const { search, setSearch, selectedCategory, setSelectedCategory } = useSearch();

  if (isPending || !session) return null;
  
  // const name = session!.user.name.slice(3).split(" ")[0];
  
  return (
    <section className="border-border border-b-[1.25px] py-12">
      <div className="max-w-[800px] mx-auto text-center">
        <h1 className="text-balance font-bold text-[34px] leading-8 text-primary">
          Hi, how can we help you?
        </h1>

        <div className="my-6 h-10">
          <div className="relative flex flex-row items-center bg-[#f6f5f4] box-border rounded-sm border-[1.25px] border-border h-10 p-4">
            <span className="size-5">
              <GoSearch className="size-full shrink-0 text-foreground" />
            </span>
            <input 
              placeholder="Search for anything..."
              className="px-2 focus:outline-none w-full placeholder:text-foreground text-tertiary text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="inline mt-7.5">
          <div className="flex flex-row items-center justify-center gap-1">
            {APP_CATEGORIES.map((cat, idx) => (
              <button 
                key={idx} 
                className="inline-block text-xs text-black rounded-full py-1 px-3 border-[1.25px] hover:opacity-50 transition-all"
                style={{
                  backgroundColor: cat.color.background,
                  borderColor: cat.color.border,
                }}
                onClick={() => setSelectedCategory(selectedCategory === cat.title ? "" : cat.title)}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
