import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { BonusView } from "@/modules/bonus/ui/views/bonus-view";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.kpiBonus.getById.queryOptions({ id }));  

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}> {/* TODO: Loading Skeleton */}
        <AuthGuard>
          <BonusView id={id} />
        </AuthGuard>
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;