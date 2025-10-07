import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadSearchParams } from "@/search-params";
import { getQueryClient, trpc } from "@/trpc/server";

import { BonusView } from "@/modules/bonus/ui/views/bonus-view";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}

const Page = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const { period } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.kpiBonus.getById.queryOptions({ id, period }));  

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}> {/* TODO: Loading Skeleton */}
        <AuthGuard>
          <BonusView id={id} period={period} />
        </AuthGuard>
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;