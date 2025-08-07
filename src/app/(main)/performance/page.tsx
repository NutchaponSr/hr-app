"use client"; 

import { ChartNoAxesCombinedIcon } from "lucide-react";
import { Hero } from "../_components/hero";
import { TimelineCard } from "@/components/timeline-card";

const Page = () => {
  const kpiSteps = [
    {
      step: 1,
      date: "Jan",
      title: "KPI Definition",
      completed: false,
      onClick: () => {}
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
        </section>
      </div>
    </>
  );
}

export default Page;