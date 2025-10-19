"use client";

import { GoProject } from "react-icons/go";
import { useSuspenseQuery } from "@tanstack/react-query";

import { STATUS_RECORD } from "@/types/kpi";
import { Period, Status } from "@/generated/prisma";

import { useTRPC } from "@/trpc/client";

import { Stepper } from "@/modules/performance/ui/components/stepper";

import { useCreateKpiForm } from "@/modules/bonus/api/use-create-kpi-form";
import { useExportKpi } from "../../api/use-export-kpi";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { ChartConfig } from "@/components/ui/chart";
import { BarChartInfo } from "@/components/bar-chart-info";
import { MainHeader, MainTitle } from "@/components/main";

const chartConfig = {
  evaluation1st: {
    label: "Evaluation 1st",
  },
  evaluation2nd: {
    label: "Evaluation 2nd",
  },
} satisfies ChartConfig;

interface Props {
  year: number;
}

export const BonusInfo = ({ year }: Props) => {
  const trpc = useTRPC();

  const { data: kpiBonus } = useSuspenseQuery(trpc.kpiBonus.getByYear.queryOptions({ year }));

  const {
    mutation: createForm,
    opt: kpiFormOption,
  } = useCreateKpiForm();
  const {
    mutation: exportExcel,
    opt: exportExcelOpt,
  } = useExportKpi();

  return (
    <article className="relative select-none">
        <MainHeader>
          <div className="flex justify-between shrink-0 items-center h-8 pb-3.5 ms-2 w-full">
            <MainTitle>
              <GoProject className="size-3 stroke-[0.25]" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                KPI Bonus
              </span>
            </MainTitle>

            {kpiBonus.id && (
              <Button 
                size="xs" 
                variant="secondary" 
                className="text-xs"
                disabled={exportExcelOpt.isPending}
                onClick={() => { 
                  if (kpiBonus.id) { 
                    exportExcel({ id: kpiBonus.id }); 
                  }}
                }
              >
                <BsBoxArrowUpRight className="size-3 stroke-[0.2]" />
                Export
              </Button>
            )}
          </div>
        </MainHeader>


      <div className="basic-0 grow pt-4 px-6 text-sm text-foreground overflow-hidden">
        <div className="flex flex-col justify-center min-h-full">
          <Stepper
            date="Jan - Mar"
            title="KPI Definition"
            description="Define measurable goals aligned with team and company priorities"
            status={STATUS_RECORD[kpiBonus.task.inDraft?.status || Status.NOT_STARTED]}
            actions={[
              {
                label: kpiBonus.task.inDraft ? "View" : "Create",
                state: kpiFormOption.isPending,
                onClick: () => createForm({
                  year,
                  period: Period.IN_DRAFT
                }, kpiBonus.task.inDraft)
              }
            ]}
          />
          <Stepper
            date="Jan - Jun"
            title="Evaluation 1st"
            description="Mid-year assessment of progress towards defined KPIs"
            status={STATUS_RECORD[kpiBonus.task.evaluation1st?.status || Status.NOT_STARTED]}
            actions={[
              {
                label: "Evaluate",
                state: kpiFormOption.isPending,
                condition: kpiBonus.task.inDraft?.status === Status.APPROVED,
                onClick: () => createForm({
                  year,
                  period: Period.EVALUATION_1ST,
                }, kpiBonus.task.evaluation1st)
              },
            ]}
          />
          <Stepper
            date="Jul - Dec"
            title="Evaluation 2nd"
            description="Final review of KPI performance and eligibility for bonus"
            status={STATUS_RECORD[kpiBonus.task.evaluation2nd?.status || Status.NOT_STARTED]}
            actions={[
              {
                label: "Evaluate",
                state: kpiFormOption.isPending,
                condition: kpiBonus.task.evaluation1st?.status === Status.APPROVED,
                onClick: () => createForm({
                  year,
                  period: Period.EVALUATION_2ND,
                }, kpiBonus.task.evaluation2nd)
              },
            ]}
          />
        </div>
        <div className="h-6 w-full" />
        
        <MainHeader>
          <MainTitle>
            <GoProject className="size-3 stroke-[0.25]" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              Summary
            </span>
          </MainTitle>
        </MainHeader>

        <BarChartInfo 
          dataKey={["period", "owner", "checker", "approver"]}
          data={kpiBonus.chartInfo} 
          chartConfig={chartConfig} 
        />
      </div>
    </article>
  );
}