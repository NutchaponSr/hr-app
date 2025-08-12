import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GoProject } from "react-icons/go";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { auth } from "@/lib/auth";

import { getQueryClient, trpc } from "@/trpc/server";

import { Tabs } from "@/components/ui/tabs";

import { Hero } from "../../_components/hero";
import { Toolbar } from "../../_components/toolbar";
import { Suspense } from "react";
import { BonusView } from "@/modules/bonus/ui/views/bonus-view";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const currentYear = new Date().getFullYear();

  const queryClient = getQueryClient();


  void queryClient.prefetchQuery(
    trpc.kpiBonus.getByEmployeeId.queryOptions({ 
      employeeId: session.user.employeeId,
      year: currentYear,
    }),
  );

  return (
    <>
      <Hero 
        title="KPI Bonus" 
        description="Track and manage employee performance reviews and goals"
        icon={GoProject} 
      />
      <Tabs defaultValue={String(currentYear)}>
        <Toolbar />
      </Tabs>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <BonusView year={currentYear} employeeId={session.user.employeeId} />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}

export default Page;