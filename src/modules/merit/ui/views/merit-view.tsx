"use client";

import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { BsFillPersonFill } from "react-icons/bs";
import { formatDistanceToNowStrict } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { STATUS_RECORD } from "@/types/kpi";

import { Accordion } from "@/components/ui/accordion";

import { Header } from "@/components/header";
import { Banner } from "@/components/banner";
import { ColumnData } from "@/components/column-data";
import { StatusBadge } from "@/components/status-badge";
import { SavingIndicator } from "@/components/saving-indicator";

import { CultureSection } from "@/modules/merit/ui/components/culture-section";
import { ApproveButton } from "@/modules/bonus/ui/components/bonus-approve-button";
import { CompetencySection } from "@/modules/merit/ui/components/competency-section";

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
              <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] w-full gap-y-2 gap-x-1">
                <ColumnData icon={BsFillPersonFill} header="Owner">
                  {merit.data.task.preparer.fullName}
                </ColumnData>
                {merit.data.task.checker && (
                  <ColumnData icon={BsFillPersonFill} header="Checker">
                    {merit.data.task.checker.fullName}
                  </ColumnData>
                )}
                <ColumnData icon={BsFillPersonFill} header="Approver">
                  {merit.data.task.approver.fullName}
                </ColumnData>
              </div>
            </div>
            <div className="col-start-2 col-end-2 min-w-0 select-none">
              <Accordion type="multiple" defaultValue={["competency", "culture"]}>
                <CompetencySection competencyRecords={merit.data.competencyRecords} />
                <CultureSection cultureRecord={merit.data.cultureRecords} />
              </Accordion>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}