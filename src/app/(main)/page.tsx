import { Suspense } from "react";

import { SearchHero } from "./_components/search-hero";
import { CategoryCarasel } from "./_components/category-carousel";
import { ReferenceSection } from "./_components/reference-sections";
import { ApplicationSection } from "./_components/application-section";

const Page = () => {
  return (
    <>
      <SearchHero />
      <div className="flex flex-col gap-8 mt-4">
        <Suspense>
          <CategoryCarasel />
        </Suspense>
        <Suspense>
          <ApplicationSection />
        </Suspense>
        <ReferenceSection />
      </div>
    </>
  );  
}

export default Page;