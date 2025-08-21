import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadSearchParams } from "@/search-params";

import { getQueryClient, trpc } from "@/trpc/server";


import { BonusView } from "@/modules/bonus/ui/views/bonus-view";

interface Props {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
  const { year } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.kpiBonus.getByEmployeeId.queryOptions({ 
      year
    }),
  );

  return (
    <main className="flex flex-col grow-0 shrink bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative">
      <div className="contents">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<p>Loading...</p>}> {/* TODO: Loading Skeleton */}
            <BonusView year={year} />
          </Suspense>
        </HydrationBoundary>
      </div>
    </main>
  );
}

export default Page;