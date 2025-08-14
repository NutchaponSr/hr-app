import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GoProject } from "react-icons/go";
import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { auth } from "@/lib/auth";

import { loadSearchParams } from "@/search-params";

import { getQueryClient, trpc } from "@/trpc/server";

import { BonusView } from "@/modules/bonus/ui/views/bonus-view";

import { Hero } from "../../_components/hero";

interface Props {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
  const { year } = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.kpiBonus.getByEmployeeId.queryOptions({ 
      employeeId: session.user.employeeId,
      year
    }),
  );

  return (
    <main className="flex flex-col grow-0 shrink bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative">
      <div className="z-[1] flex flex-col grow relative overflow-auto me-0 mb-0">
        <div className="w-full flex flex-col items-center shrink-0 grow-0 sticky top-0 left-0">
          <div className="max-w-full ps-24 w-full">
            <div className="h-6 w-full flex" />
            <Hero 
              title="KPI Bonus" 
              description="Track and manage employee performance reviews and goals"
              icon={GoProject} 
            />
          </div>
        </div>
          
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<p>Loading...</p>}> {/* TODO: Loading Skeleton */}
            <BonusView year={year} employeeId={session.user.employeeId} />
          </Suspense>
        </HydrationBoundary>
      </div>
    </main>
  );
}

export default Page;