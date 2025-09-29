import { Suspense } from "react";
import { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadSearchParams } from "@/search-params";
import { getQueryClient, trpc } from "@/trpc/server";

import { MeritView } from "@/modules/merit/ui/views/merit-view";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}

const Page = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const { period } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.kpiMerit.getByFormId.queryOptions({ id }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading</p>}>
        <MeritView id={id} period={period} />
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;