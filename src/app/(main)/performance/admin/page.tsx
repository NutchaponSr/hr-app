import { SearchParams } from "nuqs/server";

import { loadSearchParams } from "@/search-params";
import { AdminPerformanceView } from "@/modules/performance/ui/views/admin-performance-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const { year } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.performance.getMany.queryOptions({ year: new Date().getFullYear() }));
  void queryClient.prefetchQuery(trpc.performance.getByYear.queryOptions({ year }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <AdminPerformanceView year={year} />
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;