"use client";

import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { BsTriangleFill } from "react-icons/bs";
import { formatDistanceToNowStrict } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";

import { convertAmountFromUnit } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";
import { STATUS_RECORD } from "@/types/kpi";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { Hint } from "@/components/hint";
import { Header } from "@/components/header";
import { Banner } from "@/components/banner";
import { StatusBadge } from "@/components/status-badge";
import { SelectionBadge } from "@/components/selection-badge";
import { SavingIndicator } from "@/components/saving-indicator";

import { CompetencyCard } from "@/modules/merit/ui/components/competency-card";
import { ApproveButton } from "@/modules/bonus/ui/components/bonus-approve-button";

interface Props {
  id: string;
}

export const MeritView = ({ id }: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const { data: merit } = useSuspenseQuery(trpc.kpiMerit.getById.queryOptions({ id }));

  const status = STATUS_RECORD[merit.data.task.status];

  const totalCompetenciesWeight = convertAmountFromUnit(
    merit.data.competencyRecords.reduce((acc, kpi) => acc + (kpi.weight || 0), 0), 2
  );

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
                  <AccordionContent>
                    <div className="min-h-9 shrink-0 z-[100] top-0 sticky bg-background flex items-center mb-3">
                      <div className="flex flex-row items-center gap-x-2 gap-y-1.5">
                        <SelectionBadge label="Weight" />
                        <span className="text-sm text-primary">
                          {totalCompetenciesWeight.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <Hint label={`${totalCompetenciesWeight} / 30`}>
                          <Progress
                            className="h-1 w-40"
                            value={(totalCompetenciesWeight / 30) * 100}
                          />
                        </Hint>
                      </div>
                    </div>
                    <div className="relative mb-3 flex flex-col gap-8">
                      {merit.data.competencyRecords.map((competency, idx) => (
                        <CompetencyCard
                          key={competency.id}
                          order={idx + 1}
                          competency={competency}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="culture">
                  <div className="h-[42px] z-87 relative text-sm">
                    <div className="flex items-center h-full pt-0 mb-2">
                      <div className="flex items-center h-full overflow-hidden gap-1">
                        <AccordionTrigger asChild>
                          <Button variant="ghost" size="iconXs" className="group">
                            <BsTriangleFill className="text-primary rotate-90 size-3 transition-transform group-data-[state=open]:rotate-180" />
                          </Button>
                        </AccordionTrigger>

                        <h2 className="text-primary text-lg font-semibold">
                          Culture
                        </h2>
                      </div>
                    </div>
                  </div>

                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}