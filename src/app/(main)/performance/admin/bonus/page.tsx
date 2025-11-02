import { Suspense } from "react";
import { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadSearchParams } from "@/search-params";
import { getQueryClient, trpc } from "@/trpc/server";

import { AdminPerformanceView } from "@/modules/performance/ui/views/admin-performance-view";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const { year } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.performance.getByYear.queryOptions({ year }));
  void queryClient.prefetchQuery(trpc.performance.getMany.queryOptions({ year: new Date().getFullYear() }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <AdminPerformanceView year={year} />
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;