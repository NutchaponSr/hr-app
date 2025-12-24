"use client";

import { getMonth, getYear } from "date-fns";
import { useState } from "react";
import { GoProject } from "react-icons/go";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { STATUS_RECORD } from "@/types/kpi";
import { Period, Status } from "@/generated/prisma";

import { Stepper } from "@/modules/performance/ui/components/stepper";
import { useExportMerit } from "../../api/use-export-merit";
import { Button } from "@/components/ui/button";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { useCreateMeritForm } from "../../api/use-create-merit-form";
import { ChartConfig } from "@/components/ui/chart";
import { MainHeader, MainTitle } from "@/components/main";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChartInfo } from "@/components/bar-chart-info";
import { toast } from "sonner";

const chartConfig = {
  owner: {
    label: "Owner",
    color: "hsl(var(--chart-1))",
  },
  checker: {
    label: "Checker",
    color: "hsl(var(--chart-2))",
  },
  approver: {
    label: "Approver",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const isInDateRange = (year: number, startMonth: number, endMonth: number) => {
  // ถ้าเป็นปี 2025 หรือต่ำกว่า ให้สร้างได้เลย
  if (year <= 2025) {
    return true;
  }

  const now = new Date();
  const currentYear = getYear(now);
  const currentMonth = getMonth(now) + 1; // getMonth() returns 0-11

  // ถ้าปีปัจจุบันไม่ตรงกับปีที่เลือก ให้ return false
  if (currentYear !== year) {
    return false;
  }

  // เช็คว่าเดือนปัจจุบันอยู่ในช่วงที่กำหนดหรือไม่
  return currentMonth >= startMonth && currentMonth <= endMonth;
};

interface Props {
  year: number;
}

export const MeritInfo = ({ year }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "competency" | "culture"
  >("competency");

  const trpc = useTRPC();

  const { data: merit } = useSuspenseQuery(
    trpc.kpiMerit.getByYear.queryOptions({ year }),
  );

  const { mutation: exportExcel, opt: exportExcelOpt } = useExportMerit();
  const { mutation: createForm, opt: meritFormOption } = useCreateMeritForm();

  // Transform nested data for chart based on selected category
  const chartData = merit.chartInfo.map((item) => ({
    period: item.period,
    owner: item[selectedCategory].owner,
    checker: item[selectedCategory].checker,
    approver: item[selectedCategory].approver,
  }));

  const canCreateDraft = isInDateRange(year, 1, 3);
  const canEvaluate1st = isInDateRange(year, 1, 6);
  const canEvaluate2nd = isInDateRange(year, 7, 12);

  return (
    <div className="flex flex-col justify-between gap-4">
      <article className="relative select-none">
        <MainHeader>
          <div className="flex justify-between shrink-0 items-center h-8 pb-3.5 ms-2 w-full">
            <MainTitle>
              <GoProject className="size-3 stroke-[0.25]" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                Merit
              </span>
            </MainTitle>

            {merit.id && (
              <Button
                size="xs"
                variant="secondary"
                className="text-xs"
                disabled={exportExcelOpt.isPending}
                onClick={() => {
                  if (merit.id) {
                    exportExcel({ id: merit.id });
                  }
                }}
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
              title="Merit Definition"
              description="Define measurable goals that will inform merit evaluation"
              status={
                STATUS_RECORD[merit.task.inDraft?.status || Status.NOT_STARTED]
              }
              action={{
                label: merit.task.inDraft ? "View" : "Create",
                state: meritFormOption.isPending,
                condition: true,
                onClick: () => {
                  // if (!merit.task.inDraft && !canCreateDraft) {
                  //   toast.error(
                  //     `You can only create Merit Definition in January - March ${year}`,
                  //   );
                  //   return;
                  // }

                  createForm(
                    {
                      year,
                      period: Period.IN_DRAFT,
                    },
                    merit.task.inDraft,
                  );
                },
              }}
            />
            <Stepper
              date="Jan - Jun"
              title="Evaluation 1st"
              description="Mid-year merit review to assess progress and performance"
              status={
                STATUS_RECORD[
                  merit.task.evaluation1st?.status || Status.NOT_STARTED
                ]
              }
              action={{
                label: "Evaluate",
                state: meritFormOption.isPending,
                condition: merit.task.inDraft?.status === Status.APPROVED,
                onClick: () => {
                  // if (!merit.task.evaluation2nd && !canEvaluate1st) {
                  //   toast.error(
                  //     `You can only evaluate in January - June ${year}`,
                  //   );
                  //   return;
                  // }

                  createForm(
                    {
                      year,
                      period: Period.EVALUATION_1ST,
                    },
                    merit.task.evaluation1st,
                  );
                },
              }}
            />
            <Stepper
              date="Jul - Dec"
              title="Evaluation 2nd"
              description="Year-end merit review for final performance assessment and bonus eligibility"
              status={
                STATUS_RECORD[
                  merit.task.evaluation2nd?.status || Status.NOT_STARTED
                ]
              }
              action={{
                label: "Evaluate",
                state: meritFormOption.isPending,
                condition: merit.task.evaluation1st?.status === Status.APPROVED,
                onClick: () => {
                  if (!merit.task.evaluation2nd && !canEvaluate2nd) {
                    toast.error(
                      `You can only evaluate in July - December ${year}`,
                    );
                    return;
                  }

                  createForm(
                    {
                      year,
                      period: Period.EVALUATION_2ND,
                    },
                    merit.task.evaluation2nd,
                  );
                },
              }}
            />
          </div>
        </div>
      </article>
      <article className="relative select-none">
        <MainHeader>
          <MainTitle className="justify-between w-full max-w-full">
            <div className="flex items-center">
              <GoProject className="size-3 stroke-[0.25] me-1.5" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                Summary
              </span>
            </div>

            <Select
              value={selectedCategory}
              onValueChange={(value: "competency" | "culture") =>
                setSelectedCategory(value)
              }
            >
              <SelectTrigger size="sm" className="w-32">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="competency">Competency</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
              </SelectContent>
            </Select>
          </MainTitle>
        </MainHeader>

        <BarChartInfo
          dataKey={["period", "owner", "checker", "approver"]}
          data={chartData}
          chartConfig={chartConfig}
        />
      </article>
    </div>
  );
};
