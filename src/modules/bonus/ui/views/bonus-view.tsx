"use client";

import { PlusIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useYear } from "@/hooks/use-year";
import { useTable } from "@/hooks/use-table";

import { useTRPC } from "@/trpc/client";

import { LayoutProvider } from "@/layouts/layout-provider";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { columns } from "@/modules/bonus/ui/components/columns";

import { Toolbar } from "@/components/toolbar";
import { useCreateSheetStore } from "@/modules/performance/store/use-create-sheet-store";

interface Props {
  year: number;
  employeeId: string;
}

export const BonusView = ({
  year,
  employeeId
}: Props) => {
  const trpc = useTRPC();
  const { setYear } = useYear();
  const { onOpen } = useCreateSheetStore();

  const { data } = useSuspenseQuery(
    trpc.kpiBonus.getByEmployeeId.queryOptions({
      year,
      employeeId,
    }),
  );

  const { table } = useTable({ data: data.record?.kpis || [], columns });

  return (
    <Tabs defaultValue={String(year)} className="contents">
      <Toolbar
        onClick={() => onOpen("kpi-bonus")}
        tabTriggers={data.years.map((year) => ({
          value: year.toString(),
          onChange: () => setYear(year),
        }))}
      />
      <TabsContent value={String(year)}>
        <div className="grow shrink-0 flex flex-col relative">
          <div className="h-full grow shrink-0">
            {!data.record ? (
              <div className="text-primary text-xs relative float-left min-w-full select-none pb-[180px] px-24">
                <div className="flex flex-wrap items-center justify-center gap-3 sticky start-24 h-36 -mx-24">
                  <Button variant="outline" onClick={() => onOpen("kpi-bonus")}>
                    <PlusIcon />
                    New KPI
                  </Button>
                </div>
              </div>
            ) : (
              <LayoutProvider 
                table={table}
                variant="table" 
              />
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}