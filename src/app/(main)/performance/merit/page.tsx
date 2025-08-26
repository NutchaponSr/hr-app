import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { loadSearchParams } from "@/search-params";

import { Header } from "@/components/header";

import { MeritView } from "@/modules/merit/ui/views/merit-view";


interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const { year } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.kpiMerit.getOne.queryOptions({ year }));

  return (
    <>
      <Header />
      <main className="flex flex-col grow-0 shrink bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<p>Loading...</p>}> {/* TODO: Loading Skeleton */}
            <ErrorBoundary fallback={<p>Error...</p>}>
              <MeritView year={year} />
            </ErrorBoundary>
          </Suspense>
        </HydrationBoundary>
      </main>
    </>
  );
}

export default Page;