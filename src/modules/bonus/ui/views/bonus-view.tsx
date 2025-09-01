"use client";

import { GoProject } from "react-icons/go";
import { useRef, useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

import { Status } from "@/generated/prisma";
import { STATUS_RECORD } from "@/types/kpi";

import { useYear } from "@/hooks/use-year";
import { useTable } from "@/hooks/use-table";

import { useTRPC } from "@/trpc/client";

import { LayoutProvider } from "@/layouts/layout-provider";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { Banner } from "@/components/banner";
import { Header } from "@/components/header";
import { Toolbar } from "@/components/toolbar";
import { StatusBadge } from "@/components/status-badge";
import { SavingIndicator } from "@/components/saving-indicator";

import { createColumns } from "@/modules/bonus/ui/components/bonus-columns";
import { ApproveButton } from "@/modules/bonus/ui/components/bonus-approve-button";

import { canPerform, Role } from "@/modules/bonus/permission";

import { WarnningBanner } from "@/components/warnning-banner";
import { Comment } from "@/components/comment";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

interface Props {
  year: number;
}

export const BonusView = ({
  year,
}: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const scrollRef = useRef<HTMLDivElement>(null);

  const paths: string[] = pathname.split("/").filter(Boolean);

  const [isScrolledX, setIsScrolledX] = useState(false);

  const { setYear } = useYear();

  const { data: kpiBonus } = useSuspenseQuery(
    trpc.kpiBonus.getInfo.queryOptions({
      year,
    }),
  );

  const createKpi = useMutation(trpc.kpiBonus.createKpi.mutationOptions());
  const createForm = useMutation(trpc.kpiBonus.createForm.mutationOptions());

  const status = STATUS_RECORD[kpiBonus.data?.task.status || Status.NOT_STARTED];
  const perform = canPerform(
    kpiBonus.permission.role as Role,
    ["write"],
    kpiBonus.permission.ctx?.status || Status.NOT_STARTED
  );

  const { table } = useTable({
    data: kpiBonus.data?.kpiForm.kpis || [],
    columns: createColumns(isScrolledX, perform),
  });

  const onCreate = () => {
    const kpiFormId = kpiBonus.data?.kpiForm?.id;

    if (!kpiFormId) {
      toast.error("KPI Form not found");
      return;
    }

    createKpi.mutate({ kpiFormId }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiBonus.getInfo.queryOptions({ year }),
        );
      },
    })
  }

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
    <>
      <Header paths={paths}>
        {kpiBonus.data?.kpiForm && (
          <SavingIndicator label={`Edited ${formatDistanceToNowStrict(kpiBonus.data.kpiForm.updatedAt, { addSuffix: true })}`} />
        )}
        <StatusBadge {...status} />
        <ApproveButton
          id={kpiBonus.data?.taskId}
          canElevate={perform}
        />
      </Header>
      <main className="flex flex-col grow-0 shrink bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative">
        <div className="contents">
          {(kpiBonus.data?.task.status === Status.REJECTED_BY_CHECKER) && (
            <WarnningBanner
              message="This KPI record has been rejected by the Checker. Please review the feedback, make necessary corrections, and resubmit for approval."
              variant="danger"
            />
          )}
          <div ref={scrollRef} className="flex flex-col grow relative overflow-auto me-0 mb-0">
            <Banner
              title="KPI Bonus"
              description="Reward employees with performance-based bonuses tied to goals and business impact."
              icon={GoProject}
              className="ps-24"
            />
            <Tabs defaultValue={String(year)} className="contents">
              <Toolbar
                perform={perform}
                table={table}
                onClick={onCreate}
                tabTriggers={kpiBonus.years.map((year) => ({
                  value: year.toString(),
                  onChange: () => setYear(year),
                }))}
                // TODO: Delete bulk
                onDelete={() => {}}
              />
              <TabsContent value={String(year)}>
                <div className="grow shrink-0 flex flex-col relative">
                  <div className="h-full grow shrink-0">
                    {!kpiBonus.data ? (
                      <div className="text-primary text-xs relative float-left min-w-full select-none pb-[180px] px-24">
                        <div className="flex flex-wrap items-center justify-center gap-3 sticky start-24 h-36 -mx-24">
                          <Button
                            variant="outline"
                            onClick={() => {
                              createForm.mutate({ year }, {
                                onSuccess: () => {
                                  queryClient.invalidateQueries(
                                    trpc.kpiBonus.getInfo.queryOptions({ year }),
                                  );
                                },
                                onError: (ctx) => {
                                  toast.error(ctx.message);
                                }
                              })
                            }}
                            disabled={createForm.isPending}
                          >
                            <PlusIcon />
                            New KPI
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative float-left min-w-full select-none px-24">
                        <div className="relative">
                          <LayoutProvider
                            perform={perform}
                            table={table}
                            variant="table"
                            onCreate={onCreate}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              {kpiBonus.data?.task && (
                <Comment comments={kpiBonus.data.task.comments} />
              )}
            </Tabs>
          </div>
        </div>
      </main>
    </>
  );
}