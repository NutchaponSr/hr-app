import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { BsArrowUpSquareFill } from "react-icons/bs";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadSearchParams } from "@/search-params";
import { getQueryClient, trpc } from "@/trpc/server";

import { Banner } from "@/components/banner";
import { Header } from "@/components/header";

import { Tasks } from "@/modules/performance/ui/components/tasks";
import { BonusScreen } from "@/modules/bonus/ui/components/bonus-screen";
import { MeritScreen } from "@/modules/performance/ui/components/merit-screen";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const { year } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.task.getMany.queryOptions());
  void queryClient.prefetchQuery(trpc.kpiBonus.getOne.queryOptions({ year }));

  return (
    <>
      <Header />
      <main className="grid [grid-template-columns:minmax(96px,1fr)_minmax(auto,1248px)_minmax(96px,1fr)] w-full overflow-auto relative">
        <div className="col-start-2">
          <Banner 
            title="Performance" 
            description="Track and manage employee performance reviews and goals"
            icon={BsArrowUpSquareFill} 
          />
          <hr className="h-[1.25px] w-full border-t-[1.25px] border-border" />
        </div>
        <div className="col-start-2 my-5">
          <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Suspense fallback={<p>Loading</p>}>
                <BonusScreen year={year} />
                <MeritScreen />
                <Tasks />
              </Suspense>
            </HydrationBoundary>
          </section>
        </div>
      </main>
    </>
  );
}

export default Page;