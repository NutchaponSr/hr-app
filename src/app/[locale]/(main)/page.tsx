import { SearchHero } from "./_components/search-hero";
import { TopicSection } from "./_components/topic-section";
import { ExploreSection } from "./_components/explore-section";

const Page = () => {
  return (
    <div className="order-2 content col-span-12 lg:col-span-9">
      <SearchHero />
      <TopicSection />
      <hr className="h-px mx-auto w-full border-t-[1.25px] border-border" />
      <ExploreSection />
    </div>
  );  
}

export default Page;