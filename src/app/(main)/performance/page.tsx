import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadSearchParams } from "@/search-params";
import { getQueryClient, trpc } from "@/trpc/server";

import { PerformanceView } from "@/modules/performance/ui/views/performance-view";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const { year } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.task.getMany.queryOptions());
  void queryClient.prefetchQuery(trpc.kpiMerit.getOne.queryOptions({ year }));
  void queryClient.prefetchQuery(trpc.kpiBonus.getOne.queryOptions({ year }));

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading</p>}>
          <PerformanceView year={year} />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}

export default Page;