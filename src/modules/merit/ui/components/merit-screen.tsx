import Link from "next/link";

import { PlusIcon } from "lucide-react";
import { GoProject } from "react-icons/go";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Period, Status } from "@/generated/prisma";

import { useTRPC } from "@/trpc/client";

import { Stepper } from "@/modules/performance/ui/components/stepper";
import { STATUS_RECORD } from "@/types/kpi";

const DEFAULT_STEPPERS = [
  {
    date: "Jan - Mar",
    title: "KPI Definition",
    description: "Define measurable goals aligned with team and company priorities",
    period: Period.IN_DRAFT, // 👈 กำหนด period ให้ fallback
  },
  {
    date: "Jan - Jun",
    title: "Evaluation 1st",
    description: "Mid-year assessment of progress towards defined KPIs",
    period: Period.EVALUATION_1ST, // สมมติว่ามี enum แบบนี้
  },
  {
    date: "Jul - Dec",
    title: "Evaluation 2nd",
    description: "Final review of KPI performance and eligibility for bonus",
    period: Period.EVALUATION_2ND, // สมมติว่ามี enum แบบนี้
  },
];

interface Props {
  year: number;
}

export const MeritScreen = ({ year }: Props) => {
  const trpc = useTRPC();

  const { data: merit } = useSuspenseQuery(trpc.kpiMerit.getOne.queryOptions({ year }));

  const meritRecords = merit?.meritRecords || [];

  const displayRecords = DEFAULT_STEPPERS.map((step, idx) => {
    const record = meritRecords.find((r) => r.period === step.period);
  
    if (record) {
      return {
        ...step,
        task: record.task,
        period: record.period,
        isFallback: false,
      };
    }
  
    return {
      ...step,
      task: {
        id: `default-${idx}`,
        status: Status.NOT_STARTED,
      },
      period: step.period,
      isFallback: true,
    };
  });

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
          {displayRecords.map(({ task, period, isFallback, ...step }) => {
            const status = STATUS_RECORD[task.status];
            const showAction =
              !isFallback
                ? (merit?.isEvaluated
                    ? period !== Period.IN_DRAFT // ถ้า evaluated → ให้เฉพาะ eval
                    : period === Period.IN_DRAFT) // ถ้ายังไม่ evaluated → ให้เฉพาะ draft
                : period === Period.IN_DRAFT; // fallback → แสดงแค่ draft

            return (
              <Stepper
                key={task.id}
                action={
                  showAction && (<div className="mt-1.5 ps-2.5">
                    <Link
                      href="/performance/merit"
                      className="w-fit px-2 py-1 flex flex-row items-center transition bg-[#5448310a] hover:bg-[#54483114] rounded dark:bg-[#252525] dark:hover:bg-[#2f2f2f] text-xs"
                    >
                      {task.status === Status.NOT_STARTED && (
                        <PlusIcon className="size-4 stroke-[1.75] mr-1" />
                      )}
                      {task.status !== Status.NOT_STARTED
                        ? "View KPI"
                        : "Create KPI"}
                    </Link>
                  </div>)
                }
                date={step.date}
                title={step.title}
                description={step.description}
                status={status}
              />
            );
          })}       
        </div>
      </div>
    </article>
  );
}