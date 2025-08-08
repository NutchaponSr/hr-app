import { BsArrowUpSquareFill } from "react-icons/bs";

import { getQueryClient, trpc } from "@/trpc/server";

import { Tasks } from "@/modules/performance/ui/components/tasks";
import { BonusScreen } from "@/modules/performance/ui/components/bonus-screen";
import { MeritScreen } from "@/modules/performance/ui/components/merit-screen";

import { Hero } from "../_components/hero";

const Page = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.greeting.queryOptions({ name: "Pondpopza" }));

  return (
    <>
      <Hero 
        title="Performance" 
        description="Track and manage employee performance reviews and goals"
        icon={BsArrowUpSquareFill} 
      />
      <hr className="h-[1.25px] w-full border-t-[1.25px] border-border" />
      <div className="my-10">
        <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <BonusScreen />
          <MeritScreen />
          <Tasks />
        </section>
      </div>
    </>
  );
}

export default Page;