import { Suspense } from "react";
import { ChartNoAxesCombinedIcon } from "lucide-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { TimelineCard } from "@/components/timeline-card";

import { Hero } from "../_components/hero";
import { Client } from "./client";

const Page = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.greeting.queryOptions({ name: "Pondpopza" }));

  const kpiSteps = [
    {
      step: 1,
      date: "Jan",
      title: "KPI Definition",
      completed: false,
    },
    {
      step: 2,
      date: "Jan - Jun",
      title: "Evaluation 1",
      completed: false
    },
    {
      step: 3,
      date: "Jul - Dec",
      title: "Evaluation 2",
      completed: false
    }
  ];

  return (
    <>
      <Hero />
      <hr className="h-[1.25px] w-full border-t-[1.25px] border-border" />
      <div className="my-10">
        <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <TimelineCard
            title="KPI Bonus"
            icon={<ChartNoAxesCombinedIcon className="size-6 stroke-[1.75] text-white" />}
            steps={kpiSteps}
            defaultValue={0}
          />

          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<p>Loading</p>}>
              <Client />
            </Suspense>
          </HydrationBoundary>
        </section>
      </div>
    </>
  );
}

export default Page;