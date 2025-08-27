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

interface Props {
  year: number;
}

export const MeritView = ({ year }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { width, containerRef } = useContainerWidth({
    debounceMs: 150,
    observeResize: true
  });

  const queryOptions = trpc.kpiMerit.getOne.queryOptions({ year });
  const create = useMutation(trpc.kpiMerit.create.mutationOptions());

  const { data } = useSuspenseQuery({
    ...queryOptions,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <WarnningBanner message={data.warning} variant="warnning">
        <Button size="sm" variant="outlineWarnning" asChild>
          <Link href="/performance/bonus">
            <PlusIcon className="stroke-[2.5]" />
            KPI Bonus
          </Link>
        </Button>
      </WarnningBanner>
      <div className="z-[1] flex flex-col grow relative overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-[96px_1fr_96px] pb-[30vh]">
          <div className="min-w-0 col-start-2 col-end-2">
            <div ref={containerRef} className="max-w-full flex items-start flex-col w-full">
              <Banner
                title="KPI Merit"
                description="Evaluate employee achievements and align merit increases with performance outcomes."
                icon={GoProject}
              />


              {data.record ? (
                <>
                  <BullettedList
                    scroll={{
                      icon: BsFolderFill,
                      label: "Competency",
                    }}
                    label="Skills and behaviors needed for effective performance."
                  />
                  <BullettedList
                    scroll={{
                      icon: BsBuildingsFill,
                      label: "Culture",
                    }}
                    label="Shared values and ways of working in the organization."
                  />
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

                  <MeritCompetencyView width={width} data={data.record.competencyRecord} />
                  <div className="w-full my-px h-[30px]" />
                  <MeritCultureView width={width} data={data.record.cultureRecord} />
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
                    {!data.warning && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          create.mutate({ year }, {
                            onSuccess: () => {
                              queryClient.invalidateQueries(trpc.kpiMerit.getOne.queryOptions({ year }));
                            },
                            onError: (ctx) => {
                              toast.error(ctx.message);
                            }
                          })
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
          </div>
        </div>
      </div>
    </>
  );
}