import { Suspense } from "react";

import { SearchHero } from "./_components/search-hero";
import { CategoryCarasel } from "./_components/category-carousel";
import { ReferenceSection } from "./_components/reference-sections";
import { ApplicationSection } from "./_components/application-section";

const Page = () => {
  return (
    <main className="grid [grid-template-columns:minmax(96px,1fr)_minmax(auto,1248px)_minmax(96px,1fr)] w-full overflow-auto relative">
      <div className="col-start-2 mt-1">
        <SearchHero />
      </div>
      <div className="col-start-2 flex flex-col gap-5">
        <Suspense>
          <CategoryCarasel />
          <ApplicationSection />
        </Suspense>
        <ReferenceSection />
      </div>
    </main>
  );  
}

export default Page;