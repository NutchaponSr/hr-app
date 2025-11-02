import { Suspense } from "react";
import { headers } from "next/headers";
import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { auth } from "@/lib/auth";

import { loadSearchParams } from "@/search-params";
import { getQueryClient, trpc } from "@/trpc/server";

import { HeaderSkeleton } from "@/components/header";

import { PerformanceView } from "@/modules/performance/ui/views/performance-view";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const { year } = await loadSearchParams(searchParams);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const canPerform = await auth.api.userHasPermission({
    body: {
      userId: session?.user.id,
      role: "ADMIN",
      permission: {
        backend: ["access"],
      },
    }
  })

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.task.getMany.queryOptions());
  void queryClient.prefetchQuery(trpc.task.getManyByYear.queryOptions({ year }));
  void queryClient.prefetchQuery(trpc.kpiMerit.getByYear.queryOptions({ year }));
  void queryClient.prefetchQuery(trpc.kpiBonus.getByYear.queryOptions({ year }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<HeaderSkeleton />}>
        <PerformanceView canPerform={canPerform.success} />
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;