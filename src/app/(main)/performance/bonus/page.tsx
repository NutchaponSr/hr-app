import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadSearchParams } from "@/search-params";

import { getQueryClient, trpc } from "@/trpc/server";

import { BonusView } from "@/modules/bonus/ui/views/bonus-view";
import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const { year } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(
      trpc.kpiBonus.getInfo.queryOptions({
        year,
      }),
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNAUTHORIZED')) {
      redirect('/auth/sign-in?callbackUrl=/performance/bonus');
    }
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}> {/* TODO: Loading Skeleton */}
        <BonusView year={year} />
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;