import Link from "next/link";

import { PlusIcon } from "lucide-react";
import { GoProject } from "react-icons/go";

import { Stepper } from "@/modules/performance/ui/components/stepper";

export const MeritScreen = () => {
  return (
    <article className="relative col-span-1">
      <div className="min-h-12 relative">
        <div className="flex items-center h-12 w-full ps-2">
          <div className="flex items-center h-full grow-[10] overflow-hidden -ms-1">
            <div className="flex items-center h-8 px-2.5 py-1.5 max-w-[220px] text-tertiary text-xs whitespace-nowrap space-x-1.5">
              <GoProject className="size-3 shrink-0 stroke-[0.5]" />
              <span className="whitespace-nowrap text-ellipsis overflow-hidden font-medium">
                KPI Merit
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="basic-0 grow pt-4 px-6 text-sm text-foreground overflow-hidden">
        <div className="flex flex-col justify-center min-h-full">
          <Stepper 
            action={
              <div className="mt-1.5 ps-2.5">
                <Link href="/performance/merit" className="w-fit px-2 py-1 flex flex-row items-center transition bg-[#5448310a] hover:bg-[#54483114] rounded text-xs">
                  <PlusIcon className="size-4 stroke-[1.75] mr-1" />
                  Create KPIs
                </Link>
              </div>
            }
            date="Jan - Mar" 
            title="KPI Definition"
            description="Define measurable goals aligned with team and company priorities"
            status="Drafting"
          />
          <Stepper 
            date="Jan - Jun" 
            title="Evaluation 1st"
            description="Mid-year assessment of progress towards defined KPIs"
          />
          <Stepper 
            date="Jul - Dec" 
            title="Evaluation 2nd"
            description="Final review of KPI performance and eligibility for bonus"
          />
        </div>
      </div>
    </article>
  );
}