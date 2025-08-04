import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { SearchHero } from "./_components/search-hero";
import { TopicSection } from "./_components/topic-section";
import { ExploreSection } from "./_components/explore-section";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <SearchHero />
      <TopicSection />
      <hr className="h-px mx-auto w-full border-t-[1.25px] border-border" />
      <ExploreSection />
      {/* <pre className="text-primary text-xs">
        {JSON.stringify(session, null, 2)}
      </pre> */}
    </>
  );  
}

export default Page;