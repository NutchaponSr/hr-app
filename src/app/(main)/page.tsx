"use client";

import { Suspense } from "react";
import { usePaths } from "@/hooks/use-paths";

import { Header } from "@/components/header";

import { SearchHero } from "./_components/search-hero";
import { CategoryCarasel } from "./_components/category-carousel";
import { ReferenceSection } from "./_components/reference-sections";
import { ApplicationSection } from "./_components/application-section";

const Page = () => {
  const paths = usePaths();

  return (
    <>
      <Header paths={paths} />
      <main className="grid grid-cols-[96px_1fr_96px] w-full overflow-auto relative">
        <div className="col-start-2 mt-1">
          <SearchHero />
        </div>
        <div className="col-start-2 flex flex-col gap-5">
          <Suspense fallback={<div>Loading...</div>}>
            <CategoryCarasel />
            <ApplicationSection />
          </Suspense>
          <ReferenceSection />
        </div>
      </main>
    </>
  );  
}

export default Page;