import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { loadSearchParams } from "@/search-params";

import { MeritView } from "@/modules/merit/ui/views/merit-view";


interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const { year } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.kpiMerit.getInfo.queryOptions({ year }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}> {/* TODO: Loading Skeleton */}
        <ErrorBoundary fallback={<p>Error...</p>}>
          <MeritView year={year} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;