"use client";

import { Banner } from "@/components/banner";
import { BullettedList } from "@/components/bulletted-list";
import { WarnningBanner } from "@/components/warnning-banner";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { BsBuildingsFill, BsFolderFill } from "react-icons/bs";
import { GoProject } from "react-icons/go";
import { MeritCultureView } from "./merit-culture-view";
import { useContainerWidth } from "@/hooks/use-container";
import Image from "next/image";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { MeritCompetencyView } from "./merit-competency-view";
import Link from "next/link";
import { Header } from "@/components/header";
import { usePathname } from "next/navigation";
import { SavingIndicator } from "@/components/saving-indicator";
import { formatDistanceToNowStrict } from "date-fns";
import { StatusBadge } from "@/components/status-badge";
import { STATUS_RECORD } from "@/types/kpi";
import { Status } from "@/generated/prisma";
import { MeritApproveButton } from "../components/merit-approve-button";
import { canPerform, Role } from "@/modules/bonus/permission";
import { MeritInfo } from "../components/merit-info";
import { Comment } from "@/components/comment";

interface Props {
  year: number;
}

export const MeritView = ({ year }: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const { width, containerRef } = useContainerWidth({
    debounceMs: 150,
    observeResize: true
  });

  const queryOptions = trpc.kpiMerit.getInfo.queryOptions({ year });
  const createForm = useMutation(trpc.kpiMerit.createForm.mutationOptions());

  
  const { data: merit } = useSuspenseQuery({
    ...queryOptions,
    refetchOnWindowFocus: false,
  });
  
  const status = STATUS_RECORD[merit.data.task?.status || Status.NOT_STARTED];
  const perform = canPerform(
    merit.permission.role as Role,
    ["write"],
    merit.permission.ctx?.status || Status.NOT_STARTED
  );

  return (
    <>
      <Header paths={paths}>
        {merit.data.meritForm && (
          <SavingIndicator label={`Edited ${formatDistanceToNowStrict(merit.data.meritForm.updatedAt, { addSuffix: true })}`} />
        )}
        <StatusBadge {...status} />
        <MeritApproveButton id={merit.data.taskId} canElevate={perform} />
      </Header>
      {!merit.hasKpiBonus && (
        <WarnningBanner 
          variant="warning"
          message="KPI Bonus record not found. you must create KPI Bonus at first"
        >
          <Button size="sm" variant="outlineWarnning" asChild>
            <Link href="/performance/bonus">
              <PlusIcon className="stroke-[2.5]" />
              KPI Bonus
            </Link>
          </Button>
        </WarnningBanner>
      )}
      <main className="flex flex-col grow-0 shrink bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative">
        <div className="z-[1] flex flex-col grow relative overflow-y-auto overflow-x-hidden">
          <div className="grid grid-cols-[96px_1fr_96px] pb-[30vh]">
            <div className="min-w-0 col-start-2 col-end-2">
              <div ref={containerRef} className="max-w-full flex items-start flex-col w-full">
                <Banner
                  title="KPI Merit"
                  description="Evaluate employee achievements and align merit increases with performance outcomes."
                  icon={GoProject}
                />


                {(merit.data.competencies && merit.data.cultures && merit.data) ? (
                  <>
                    {merit.data?.task && <MeritInfo data={merit.data.task} />}
                    <div className="w-full my-px h-[30px]" />
                    <div className="flex items-center h-10 start-24 w-full">
                      <div role="tablist" className="flex items-center h-full grow-10 overflow-hidden -ms-1">
                        <div className="flex items-center shrink h-full">
                          <div className="inline-flex h-full">
                            <div role="tab" className="transition bg-primary/6 cursor-pointer flex items-center h-8 px-3 rounded-full whitespace-nowrap text-sm shrink-0 text-primary font-medium py-1.5">
                              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                2025
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <MeritCompetencyView perform={perform} width={width} data={merit.data.competencies} />
                    <div className="w-full my-px h-[30px]" />
                    <MeritCultureView width={width} data={merit.data.cultures} />
                  </>
                ) : (
                  <div className="w-full py-5">
                    <div className="flex flex-col items-center justify-center gap-3 h-full w-full">
                      <Image
                        src="/empty.svg"
                        alt="Empty"
                        width={240}
                        height={240}
                      />
                      <div className="text-center">
                        <h1 className="tracking-wid font-bold text-3xl text-primary">
                          KPI Merit
                        </h1>
                        <h2 className="text-tertiary text-lg font-medium">
                          Record not found!
                        </h2>
                      </div>
                      {merit.hasKpiBonus && (
                        <Button
                          size="lg"
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            createForm.mutate({ year }, {
                              onSuccess: () => {
                                queryClient.invalidateQueries(trpc.kpiMerit.getInfo.queryOptions({ year }));
                              },
                              onError: (ctx) => {
                                toast.error(ctx.message);
                              }
                            });
                          }}
                        >
                          <PlusIcon />
                          Merit
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full my-px h-[30px]" />
              {merit.data.task?.comments && (
                <Comment comments={merit.data.task.comments} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}