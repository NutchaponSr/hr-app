"use client";

import toast from "react-hot-toast";

import { 
  useMutation, 
  useQueryClient, 
  useSuspenseQuery 
} from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

import { useYear } from "@/hooks/use-year";
import { useTable } from "@/hooks/use-table";

import { useTRPC } from "@/trpc/client";

import { LayoutProvider } from "@/layouts/layout-provider";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { Toolbar } from "@/components/toolbar";

import { columns } from "@/modules/bonus/ui/components/columns";

import { useCreateSheetStore } from "@/modules/performance/store/use-create-sheet-store";

interface Props {
  year: number;
}

export const BonusView = ({
  year,
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { setYear } = useYear();
  const { onOpen } = useCreateSheetStore();

  const { data } = useSuspenseQuery(
    trpc.kpiBonus.getByEmployeeId.queryOptions({
      year,
    }),
  );

  const { table } = useTable({ data: data.record?.kpis || [], columns });

  const createKpi = useMutation(trpc.kpiBonus.instantCreate.mutationOptions());
  const createKpiRecord = useMutation(trpc.kpiBonus.createRecord.mutationOptions());

  return (
    <Tabs defaultValue={String(year)} className="contents">
      <Toolbar
        className="px-24 sticky left-0"
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
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      createKpiRecord.mutate({ year }, {
                        onSuccess: () => {
                          queryClient.invalidateQueries(
                            trpc.kpiBonus.getByEmployeeId.queryOptions({ year }),
                          );
                        }
                      })
                    }}
                  >
                    <PlusIcon />
                    New KPI
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative float-left min-w-full select-none pb-[180px] px-24">
                <div className="relative">
                  <LayoutProvider 
                    table={table}
                    variant="table" 
                    onCreate={() => {
                      createKpi.mutate({ year }, {
                        onSuccess: () => {
                          queryClient.invalidateQueries(
                            trpc.kpiBonus.getByEmployeeId.queryOptions({ year }),
                          );
                        },
                        onError: (error) => {
                          toast.error(error.message);
                        },
                      });
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}