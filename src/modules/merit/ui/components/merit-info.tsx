"use client";

import { GoProject } from "react-icons/go";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { STATUS_RECORD } from "@/types/kpi";
import { Period, Status } from "@/generated/prisma";

import { Stepper } from "@/modules/performance/ui/components/stepper";
import { useExportMerit } from "../../api/use-export-merit";
import { Button } from "@/components/ui/button";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { useCreateMeritForm } from "../../api/use-create-merit-form";

interface Props {
  year: number;
}

export const MeritInfo = ({ year }: Props) => {
  const trpc = useTRPC();

  const { data: merit } = useSuspenseQuery(trpc.kpiMerit.getByYear.queryOptions({ year }));

  const {
    mutation: createForm,
    opt: meritFormOption,
  } = useCreateMeritForm();
  const {
    mutation: exportExcel,
    opt: exportExcelOpt,
  } = useExportMerit();

  return (
    <article className="relative select-none">
      <div className="flex justify-between shrink-0 items-center h-8 pb-3.5 ms-2">
        <div className="flex items-center text-xs font-medium text-secondary">
          <div className="flex items-center justify-center size-4 me-1.5">
            <GoProject className="size-3 stroke-[0.25]" />
          </div>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
            Merit 
          </span>
        </div>

        <Button 
          size="xs" 
          variant="secondary" 
          className="text-xs"
          disabled={exportExcelOpt.isPending}
          onClick={() => { 
            if (merit.id) { 
              exportExcel({ id: merit.id }); 
            }}
          }
        >
          <BsBoxArrowUpRight className="size-3 stroke-[0.2]" />
          Export
        </Button>
      </div>

      <div className="basic-0 grow pt-4 px-6 text-sm text-foreground overflow-hidden">
        <div className="flex flex-col justify-center min-h-full">
          <Stepper
            date="Jan - Mar"
            title="Merit Definition"
            description="Define measurable goals that will inform merit evaluation"
            status={STATUS_RECORD[merit.task.inDraft?.status || Status.NOT_STARTED]}
            actions={[
              {
                label: merit.task.inDraft ? "View" : "Create",
                state: meritFormOption.isPending,
                onClick: () => createForm({
                  year,
                  period: Period.IN_DRAFT
                }, merit.task.inDraft)
              }
            ]}
          />   
          <Stepper
            date="Jan - Jun"
            title="Evaluation 1st"
            description="Mid-year merit review to assess progress and performance"
            status={STATUS_RECORD[merit.task.evaluation1st?.status || Status.NOT_STARTED]}
            actions={[
              {
                label: "Evaluate",
                state: meritFormOption.isPending,
                condition: merit.task.inDraft?.status === Status.APPROVED,
                onClick: () => createForm({
                  year,
                  period: Period.EVALUATION_1ST
                }, merit.task.evaluation1st)
              },
            ]}
          />   
          <Stepper
            date="Jul - Dec"
            title="Evaluation 2nd"
            description="Year-end merit review for final performance assessment and bonus eligibility"
            status={STATUS_RECORD[Status.NOT_STARTED]}
            actions={[
              {
                label: "Evaluate",
                state: meritFormOption.isPending,
                condition: merit.task.evaluation1st?.status === Status.APPROVED,
                onClick: () => createForm({
                  year,
                  period: Period.EVALUATION_2ND
                }, merit.task.evaluation2nd)
              },
            ]}
          />   
        </div>
      </div>
    </article>
  );
}