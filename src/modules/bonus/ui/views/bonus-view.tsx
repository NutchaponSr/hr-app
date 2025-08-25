"use client";

import toast from "react-hot-toast";
import { useRef, useEffect, useState } from "react";

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

import { createColumns } from "@/modules/bonus/ui/components/bonus-columns";

import { useCreateSheetStore } from "@/modules/performance/store/use-create-sheet-store";
import { Banner } from "@/components/banner";
import { GoProject } from "react-icons/go";

interface Props {
  year: number;
}

export const BonusView = ({
  year,
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isScrolledX, setIsScrolledX] = useState(false);

  const { setYear } = useYear();
  const { onOpen } = useCreateSheetStore();  

  const { data } = useSuspenseQuery(
    trpc.kpiBonus.getByEmployeeId.queryOptions({
      year,
    }),
  );

  const { table } = useTable({ data: data.record?.kpis || [], columns: createColumns(isScrolledX) });

  const deleteBulk = useMutation(trpc.kpiBonus.deleteBulk.mutationOptions());
  const createKpi = useMutation(trpc.kpiBonus.instantCreate.mutationOptions());
  const createKpiRecord = useMutation(trpc.kpiBonus.createRecord.mutationOptions());

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setIsScrolledX(scrollRef.current.scrollLeft > 96);
      }
    };

    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div ref={scrollRef} className="flex flex-col grow relative overflow-auto me-0 mb-0">
      <Banner 
        title="KPI Bonus" 
        description="Reward employees with performance-based bonuses tied to goals and business impact."
        icon={GoProject} 
        className="ps-24"
      />
      <Tabs defaultValue={String(year)} className="contents">
        <Toolbar
          table={table}
          onClick={() => onOpen("kpi-bonus")}
          tabTriggers={data.years.map((year) => ({
            value: year.toString(),
            onChange: () => setYear(year),
          }))}
          onDelete={() => {
            const ids = table.getSelectedRowModel().rows.map((row) => row.original.id);

            deleteBulk.mutate({ ids }, {
              onSuccess: () => {
                queryClient.invalidateQueries(
                  trpc.kpiBonus.getByEmployeeId.queryOptions({ year }),
                );
              },
              onError: (error) => {
                toast.error(error.message);
              },
            })
          }}
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
    </div>
  );
}