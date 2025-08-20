import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { loadSearchParams } from "@/search-params";

import { MeritView } from "@/modules/merit/ui/views/merit-view";

import { ErrorBoundary } from "react-error-boundary";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const { year } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.kpiMerit.getOne.queryOptions({ year }));

  return (
    <main className="flex flex-col grow-0 shrink bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}> {/* TODO: Loading Skeleton */}
          <ErrorBoundary fallback={<p>Error...</p>}>
            <MeritView year={year} />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}

export default Page;