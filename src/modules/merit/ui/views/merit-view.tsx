"use client";

import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { STATUS_RECORD } from "@/types/kpi";

import { Header } from "@/components/header";
import { StatusBadge } from "@/components/status-badge";
import { SavingIndicator } from "@/components/saving-indicator";

import { ApproveButton } from "@/modules/bonus/ui/components/bonus-approve-button";
import { Banner } from "@/components/banner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BsTriangleFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/toolbar";
import { CompetencyCard } from "../components/competency-card";

interface Props {
  id: string;
}

export const MeritView = ({ id }: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const { data: merit } = useSuspenseQuery(trpc.kpiMerit.getById.queryOptions({ id }));

  const status = STATUS_RECORD[merit.data.task.status];

  return (
    <>
      <Header
        paths={paths}
        nameMap={{
          [id]: String(merit.data.year)
        }}
        iconMap={{
          [id]: GoProject
        }}
        disabledPaths={['merit']}
      >
        {merit.data.updatedAt && (
          <SavingIndicator label={`Edited ${formatDistanceToNowStrict(merit.data.updatedAt, { addSuffix: true })}`} />
        )}
        <StatusBadge {...status} />
        <ApproveButton
          canElevate={true}
          taskId={merit.data.taskId}
        />
      </Header>
      <main className="grow-0 shrink flex flex-col bg-background z-1 h-full max-h-full w-full">
        <div className="w-full h-full overflow-x-hidden overflow-y-auto me-0 mb-0">
          <div className="grid grid-cols-[minmax(20px,1fr)_minmax(auto,840px)_minmax(20px,1fr)] w-full gap-y-6 gap-x-14 pb-[30vh]">
            <div className="col-start-2 col-end-2 min-w-0 select-none">
              <Banner
                title="Merit"
                description="Evaluate employee achievements and align merit increases with performance outcomes."
                icon={GoProject}
              />
            </div>
            <div className="col-start-2 col-end-2 min-w-0 select-none">
              <Accordion type="multiple" defaultValue={["competency"]}>
                <AccordionItem value="competency">
                  <div className="h-[42px] z-87 relative text-sm">
                    <div className="flex items-center h-full pt-0 mb-2">
                      <div className="flex items-center h-full overflow-hidden gap-1">
                        <AccordionTrigger asChild>
                          <Button variant="ghost" size="iconXs" className="group">
                            <BsTriangleFill className="text-primary rotate-90 size-3 transition-transform group-data-[state=open]:rotate-180" />
                          </Button>
                        </AccordionTrigger>

                        <h2 className="text-primary text-lg font-semibold">
                          Competency
                        </h2>
                      </div>
                    </div>
                  </div>
                  <AccordionContent className="relative mb-3 flex flex-col gap-8">
                    {merit.data.competencyRecords.map((competency) => (
                      <CompetencyCard
                        key={competency.id}
                        competency={competency}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}