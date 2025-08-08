import { SearchHero } from "./_components/search-hero";
import { TopicSection } from "./_components/topic-section";
import { ExploreSection } from "./_components/explore-section";

const Page = () => {
  return (
    <>
      <SearchHero />
      <TopicSection />
      <hr className="h-px mx-auto w-full border-t-[1.25px] border-border" />
      <ExploreSection />
    </>
  );  
}

export default Page;