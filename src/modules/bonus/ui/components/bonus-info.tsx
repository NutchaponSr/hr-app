"use client";

import { toast } from "sonner";
import { GoProject } from "react-icons/go";
import { getMonth, getYear } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";

import { STATUS_RECORD } from "@/types/kpi";
import { Period, Status } from "@/generated/prisma";

import { useTRPC } from "@/trpc/client";

import { Stepper } from "@/modules/performance/ui/components/stepper";

import { useCreateKpiForm } from "@/modules/bonus/api/use-create-kpi-form";
import { useExportKpi } from "../../api/use-export-kpi";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { ChartConfig, ChartTooltipContent, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { MainHeader, MainTitle } from "@/components/main";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  label: {
    label: "Label",
    color: "var(--chart-1)",
  },
  value: {
    label: "Value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;
interface Props {
  year: number;
}

const isInDateRange = (year: number, startMonth: number, endMonth: number) => {
  if (year <= 2025) return true;

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

export const BonusInfo = ({ year }: Props) => {
  const trpc = useTRPC();

  const { data: kpiBonus } = useSuspenseQuery(
    trpc.kpiBonus.getByYear.queryOptions({ year }),
  );

  const { mutation: createForm, opt: kpiFormOption } = useCreateKpiForm();
  const { mutation: exportExcel, opt: exportExcelOpt } = useExportKpi();

  const canCreateDraft = isInDateRange(year, 1, 3);
  const canEvaluate = isInDateRange(year, 1, 12);

  return (
    <div className="flex flex-col justify-between gap-4">
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
              title="KPI Definition"
              description="Define measurable goals aligned with team and company priorities"
              status={
                STATUS_RECORD[
                  kpiBonus.task.inDraft?.status || Status.NOT_STARTED
                ]
              }
              action={{
                label: kpiBonus.task.inDraft ? "View" : "Create",
                state: kpiFormOption.isPending,
                condition: true,
                onClick: () => {
                  if (!kpiBonus.task.inDraft && !canCreateDraft) {
                    toast.error(
                      `You can only create KPI Definition in January - March ${year}`,
                    );
                    return;
                  }

                  createForm(
                    {
                      year,
                      period: Period.IN_DRAFT,
                    },
                    kpiBonus.task.inDraft,
                  );
                },
              }}
            />
            <Stepper
              date="Jan - Dec"
              title="Evaluation"
              description="Assessment of progress towards defined KPIs"
              status={
                STATUS_RECORD[
                  kpiBonus.task.evaluate?.status || Status.NOT_STARTED
                ]
              }
              action={{
                label: "Evaluate",
                state: kpiFormOption.isPending,
                condition: kpiBonus.task.inDraft?.status === Status.APPROVED,
                onClick: () => {
                  if (!kpiBonus.task.evaluate && !canEvaluate) {
                    toast.error(
                      `You can only evaluate in January - December ${year}`,
                    );
                    return;
                  }

                  createForm(
                    {
                      year,
                      period: Period.EVALUATION,
                    },
                    kpiBonus.task.evaluate,
                  );
                },
              }}
            />
          </div>
        </div>
      </article>
      <article>
        <MainHeader>
          <MainTitle>
            <GoProject className="size-3 stroke-[0.25]" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              Summary
            </span>
          </MainTitle>
        </MainHeader>

        <ChartContainer config={chartConfig} className="h-80 w-full">
          <BarChart accessibilityLayer data={kpiBonus.chartInfo}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis 
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip 
              cursor={false}
              content={<ChartTooltipContent indicator="dot" className="w-40" />}
            />
            {["label", "value"].slice(1).map((key, index) => (
              <Bar
                key={index}
                dataKey={key as string}
                label={{ value: key, fill: "var(--primary)", position: "top" }}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </article>
    </div>
  );
};
