"use client";


import { usePaths } from "@/hooks/use-paths";

import { Header } from "@/components/header";
import { Main, MainContent, MainTitle, MainHeader } from "@/components/main";
import { Banner } from "@/components/banner";
import { BsBoxArrowUpRight, BsBullseye, BsCheck2Circle, BsGridFill, BsKanban, BsPeopleFill, BsWindowFullscreen } from "react-icons/bs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

const chartConfig = {
  inDraft: {
    label: "In Draft",
  },
  evaluation1st: {
    label: "Evaluation 1st",
  },
  evaluation2nd: {
    label: "Evaluation 2nd",
  },
} satisfies ChartConfig

interface Props {
  year: number;
}

export const AdminPerformanceView = ({ year }: Props) => {
  const trpc = useTRPC();
  const paths = usePaths();
  
  const currentYear = new Date().getFullYear();

  const { data } = useSuspenseQuery(trpc.performance.getMany.queryOptions({ year: currentYear }));
  const { data: kpiForms } = useSuspenseQuery(trpc.performance.getByYear.queryOptions({ year }));

  return (
    <>
      <Header paths={paths} />
      <Tabs
        asChild
        defaultValue="overviews"
      >
        <Main>
          <MainContent className="col-start-2 col-end-2 min-w-0 select-none">
            <Banner
              icon={BsWindowFullscreen}
              title="Admin's dashboard (KPI)"
            />

            <div className="border-b-[1.25px] border-border flex justify-between min-h-8">
              <TabsList>
                <TabsTrigger value="overviews">
                  <BsGridFill />
                  Overviews
                </TabsTrigger>
              </TabsList>

              <Button
                size="sm"
                variant="ghost"
              >
                <BsBoxArrowUpRight />
                Export
              </Button>
            </div>
          </MainContent>
          <MainContent className="col-start-2 col-end-2 min-w-0 select-none">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <div className="flex items-start justify-between p-3">
                  <div className="flex items-center gap-2 text-tertiary">
                    <BsPeopleFill className="size-3.5" />
                    <span className="text-xs font-medium">Employee</span>
                  </div>
                </div>
                <div className="flex flex-col items-start p-3">
                  <NumberTicker 
                    value={kpiForms.employees || 0}
                    className="text-3xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white"
                  />
                  <p className="text-tertiary text-xs">
                    Has KPI <span className="font-semibold underline underline-offset-1">{kpiForms.formCount}</span>
                  </p>
                </div>
              </Card>
              <Card>
                <div className="flex items-start justify-between p-3">
                  <div className="flex items-center gap-2 text-tertiary">
                    <BsCheck2Circle className="size-3.5 stroke-[0.25]" />
                    <span className="text-xs font-medium">Evaluated</span>
                  </div>
                </div>
                <div className="flex flex-col items-start p-3">
                  <NumberTicker 
                    value={kpiForms.formsEvaluted || 0}
                    className="text-3xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white"
                  />
                  <p className="text-tertiary text-xs">
                    In progress <span className="font-semibold underline underline-offset-1">{kpiForms.formsEvaluting}</span>
                  </p>
                </div>
              </Card>
              <Card>
                <div className="flex items-start justify-between p-3">
                  <div className="flex items-center gap-2 text-tertiary">
                    <BsBullseye className="size-3.5 stroke-[0.25]" />
                    <span className="text-xs font-medium">Average Score</span>
                  </div>
                </div>
                <div className="flex flex-col items-start p-3">
                  <NumberTicker 
                    value={kpiForms.finalScore || 0}
                    className="text-3xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white"
                  />
                  <div className="text-tertiary text-xs flex items-center">
                    {kpiForms.diffFromLastYear < 0 ? 
                      <TrendingDownIcon className="size-4 stroke-[1.75] text-red-500 mr-1" /> :
                      <TrendingUpIcon className="size-4 stroke-[1.75] text-green-600 mr-1" />
                    }
                    {kpiForms.diffFromLastYear < 0
                      ? <span className="text-red-500">-{kpiForms.diffFromLastYear}</span>
                      : <span className="text-green-600">+{kpiForms.diffFromLastYear}</span>
                    }
                    <span className="ml-1">
                      from last year
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </MainContent>
          <MainContent className="col-start-2 col-end-2 min-w-0 h-80 select-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <MainHeader>
                  <MainTitle>
                    <BsBullseye className="size-3 shrink-0" />
                    <span className="whitespace-nowrap text-ellipsis overflow-hidden font-medium">
                      Overviews
                    </span>
                  </MainTitle>
                </MainHeader> 
                <ChartContainer config={chartConfig} className="h-80 w-full">
                  <AreaChart accessibilityLayer data={data}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis />
                    <ChartTooltip 
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" className="w-40" />}
                    />
                    <Area dataKey="inDraft" radius={4} fill="var(--chart-1)" />
                    <Area dataKey="evaluation1st" radius={4} fill="var(--chart-2)" />
                    <Area dataKey="evaluation2nd" radius={4} fill="var(--chart-3)" />
                  </AreaChart>
                </ChartContainer>
              </div>
              <div>
                <MainHeader>
                  <MainTitle>
                    <BsKanban className="size-3 shrink-0" />
                    <span className="whitespace-nowrap text-ellipsis overflow-hidden font-medium">
                      Period
                    </span>
                  </MainTitle>
                </MainHeader> 
                <ChartContainer config={chartConfig} className="h-80 w-full">
                  <BarChart accessibilityLayer data={kpiForms.kpiForms}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="period"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis />
                    <ChartTooltip 
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" className="w-40" />}
                    />
                    <Bar dataKey="value" radius={4} fill="var(--chart-1)" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </MainContent>
        </Main>
      </Tabs>
    </>                       
  );
}