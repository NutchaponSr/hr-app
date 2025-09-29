"use client";

import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { GoProject } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { STATUS_RECORD } from "@/types/kpi";
import { Period, Status } from "@/generated/prisma";

import { Stepper } from "@/modules/performance/ui/components/stepper";

interface Props {
  year: number;
}

export const MeritInfo = ({ year }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();

  const { data: merit } = useSuspenseQuery(trpc.kpiMerit.getByYear.queryOptions({ year }));
  const createForm = useMutation(trpc.kpiMerit.createForm.mutationOptions());

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
      </div>

      <div className="basic-0 grow pt-4 px-6 text-sm text-foreground overflow-hidden">
        <div className="flex flex-col justify-center min-h-full">
          <Stepper
            action={
              <div className="mt-1.5 ps-2.5">
                <button
                  disabled={createForm.isPending}
                  className="w-fit px-2 py-1 flex flex-row items-center transition bg-[#5448310a] hover:bg-[#54483114] dark:bg-[#252525] dark:hover:bg-[#2f2f2f] rounded text-xs"
                  onClick={() => {
                    if (!merit.task.inDraft) {
                      toast.loading("Creating form merit...", { id: "create-form-merit" });

                      createForm.mutate({ year, period: Period.IN_DRAFT }, {
                        onSuccess: ({ id }) => {
                          toast.success("Form created!", { id: "create-form-merit" });
                          router.push(`/performance/merit/${id}?period=${Period.IN_DRAFT}`);
                        },
                        onError: (ctx) => {
                          toast.error(ctx.message || "Something went wrong", { id: "create-form-merit" });
                        }
                      });
                    } else {
                      router.push(`/performance/merit/${merit.task.inDraft.id}?period=${Period.IN_DRAFT}`);
                    }
                  }}
                >
                  {!merit.task.inDraft ? (
                    <>
                      <PlusIcon className="size-4 stroke-[1.75] mr-1" />
                      Create Merit
                    </>
                  ) : (
                    "View form"
                  )}
                </button>
              </div>
            }
            date="Jan - Mar"
            title="Merit Definition"
            description="Define measurable goals that will inform merit evaluation"
            status={STATUS_RECORD[merit.task.inDraft?.status || Status.NOT_STARTED]}
          />   
          <Stepper
            action={
              merit.task.inDraft?.status !== Status.APPROVED
                ? null : (
                  <div className="mt-1.5 ps-2.5">
                    <button
                      disabled={createForm.isPending}
                      className="w-fit px-2 py-1 flex flex-row items-center transition bg-[#5448310a] hover:bg-[#54483114] dark:bg-[#252525] dark:hover:bg-[#2f2f2f] rounded text-xs"
                      onClick={() => {
                        if (!merit.task.evaluation1st) {

                          toast.loading("Creating form merit...", { id: "create-form-merit" });
                          createForm.mutate({ year, period: Period.EVALUATION_1ST }, {
                            onSuccess: ({ id }) => {
                              toast.success("Form created!", { id: "create-form-merit" });
                              router.push(`/performance/merit/${id}?period=${Period.EVALUATION_1ST}`);
                            },
                            onError: (ctx) => {
                              toast.error(ctx.message || "Something went wrong", { id: "create-form-merit" });
                            }
                          });
                        } else {
                          router.push(`/performance/merit/${merit.task.evaluation1st.id}?period=${Period.EVALUATION_1ST}`);
                        }
                      }}
                    >
                      Evaluate
                    </button>
                  </div>
                )
            }
            date="Jan - Jun"
            title="Evaluation 1st"
            description="Mid-year merit review to assess progress and performance"
            status={STATUS_RECORD[merit.task.evaluation1st?.status || Status.NOT_STARTED]} // TODO: Status when start evaluation form
          />   
          <Stepper
            date="Jul - Dec"
            title="Evaluation 2nd"
            description="Year-end merit review for final performance assessment and bonus eligibility"
            status={STATUS_RECORD[Status.NOT_STARTED]} // TODO: Status when start evaluation form
          />   
        </div>
      </div>
    </article>
  );
}