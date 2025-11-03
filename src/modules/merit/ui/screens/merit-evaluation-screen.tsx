import { BsPersonFill, BsSave, BsTriangleFill } from "react-icons/bs";
import { Resolver, useForm } from "react-hook-form";
import { inferProcedureOutput } from "@trpc/server";
import { zodResolver } from "@hookform/resolvers/zod";

import { Period } from "@/generated/prisma";
import { AppRouter } from "@/trpc/routers/_app";

import { 
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { RowData } from "@/components/row-data";
import { EmployeeEvaluateInfo } from "@/components/employee-evaluate-info";

import { UserProfile } from "@/modules/auth/ui/components/user-profile";
import { MeritSummaryTable } from "@/modules/merit/ui/components/merit-summary-table";

import { meritEvaluationMapValue } from "@/modules/merit/utils";
import { meritEvaluationSchema, MeritEvaluationSchema } from "@/modules/merit/schema";
import { competencyLevels, cultureLevels } from "../../constants";
import { Card } from "@/components/card";
import { CompetencyCard } from "../components/competency-card";
import { CultureCard } from "../components/culture-card";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useSave } from "@/hooks/use-save";
import { Separator } from "@/components/ui/separator";

interface Props {
  id: string;
  period: Period;
  merit: inferProcedureOutput<AppRouter["kpiMerit"]["getByFormId"]>;
  hasChecker: boolean;
  canPerform: {
    canSubmit: boolean;
    ownerCanWrite: boolean;
    checkerCanWrite: boolean;
    approverCanWrite: boolean;
  };
}

export const MeritEvaluationScreen = ({ id, period, merit, hasChecker, canPerform }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { setSave } = useSave();

  const updateEvaluation = useMutation(trpc.kpiMerit.updateEvaluation.mutationOptions());

  const form = useForm<MeritEvaluationSchema>({
    resolver: zodResolver(meritEvaluationSchema) as Resolver<MeritEvaluationSchema>,
    defaultValues: meritEvaluationMapValue(merit, period),
  });

  const onSubmit = (data: MeritEvaluationSchema) => {
    toast.loading("Updating merits...", { id: "update-bulk-merit-evaluations" });

    updateEvaluation.mutate({ meritEvaluationSchema: data }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getByFormId.queryOptions({ id, period }));
        toast.success("Merits Updated!", { id: "update-bulk-merit-evaluations" });

        setSave(true);
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "update-bulk-merit-evaluations" });
      },
    });
  }

  useEffect(() => {
    if (!merit.data.meritForm) return;

    form.reset(meritEvaluationMapValue(merit, period));
  }, [merit, form, period]);


  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <EmployeeEvaluateInfo 
          name={merit.data.preparer.fullName}
          position={merit.data.preparer.position}
          division={merit.data.preparer.division}
          department={merit.data.preparer.department}
          weight={60}
        />

        <div className="w-full max-w-full self-center px-16">
          <div className="grid grid-cols-3 gap-8">
            <div className="grow-0 shrink-0">
              <div role="table" className="m-0 flex flex-col gap-1">
                <RowData icon={BsPersonFill} label="Owner">
                  <UserProfile employee={merit.data.preparer} />
                </RowData>
                {merit.data.checker && (
                  <RowData icon={BsPersonFill} label="Checker">
                    <UserProfile employee={merit.data.checker} />
                  </RowData>
                )}
                <RowData icon={BsPersonFill} label="Approver">
                  <UserProfile employee={merit.data.approver} />
                </RowData>
              </div>
            </div>
            <div className="grow-0 shrink-0 col-span-2">
              <MeritSummaryTable 
                form={form} 
                kpis={merit.data.kpiForm?.kpis || []} 
                competencyRecords={merit.data.meritForm.competencyRecords}
                cultureRecords={merit.data.meritForm.cultureRecords}
              />
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
          <div data-disabled={!canPerform.canSubmit} className="data-[disabled=false]:z-100 min-h-9 px-16 sticky start-0 top-0 bg-background shrink-0 flex items-center -z-1">
              <div className="absolute right-16 top-1 flex items-center gap-1">
                <div className="flex items-end gap-1">
                  <Button type="submit" variant="primary" size="sm" disabled={updateEvaluation.isPending}>
                    <BsSave className="stroke-[0.25]" />
                    Save
                  </Button>
                </div>
              </div>
          </div>

          <div className="grow shrink-0 flex flex-col relative">
            <div className="relative float-start min-w-full select-none pb-[180px] px-16">
              <Accordion
                defaultValue={["competency", "culture"]}
                type="multiple"
                className="space-y-4"
              >
                <AccordionItem value="competency">
                  <div className="z-87 relative flex">
                    <div className="flex flex-col items-start h-full pt-0 col-span-1">
                      <div className="flex items-center h-[42px] overflow-hidden gap-1">
                        <AccordionTrigger asChild>
                          <Button variant="ghost" size="iconXs" className="group">
                            <BsTriangleFill className="text-primary rotate-90 size-3 transition-transform group-data-[state=open]:rotate-180" />
                          </Button>
                        </AccordionTrigger>

                        <h2 className="text-primary text-2xl font-semibold">
                          Part 2: Competency
                        </h2>
                      </div>
                    </div>
                  </div>

                  <AccordionContent>
                    <div className="grid grid-cols-3 gap-4 pb-4">
                      <Card className="p-4">
                        <div className="flex flex-col min-w-0 w-full min-h-8 space-y-1">
                          <h2 className="max-w-full w-full whitespace-break-spaces [word-break:break-word] text-sm font-semibold leading-[1.3] text-primary">
                            หลักเกณฑ์การประเมิน (Evaluation Score System)
                          </h2>
                          <div className="max-w-full w-full whitespace-break-spaces [word-break:break-word] text-primary text-xs leading-4.5">
                            วิเคราะห์ผลการปฏิบัติงาน เปรียบเทียบกับผลงานที่คาดหวัง (Expected Key Result) และการแสดงออกของ Competency
                          </div>
                        </div>
                      </Card>
                      <div className="flex items-center gap-1 col-span-2">
                        <div className="flex flex-col shadow-[inset_0_0_0_1px_rgba(0,0,0,0.086)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] rounded">
                          <div className="flex items-center gap-2 bg-marine py-1 px-2 rounded-t">
                            <h3 className="text-white text-lg font-semibold">
                              เกณฑ์การประเมิน Competency
                            </h3>
                          </div>
                          <div className="flex items-center p-2">
                            {competencyLevels.map((item, index) => (
                              <div key={index} className="flex flex-col p-1 space-y-2 rounded">
                                <span className="font-medium leading-normal overflow-hidden pe-1.5">
                                  <div className="inline-flex items-center shrink min-w-0 max-w-full h-5 m-0 rounded-full px-2 text-xs dark:text-blue-neutral text-blue-muted bg-[#0063ae2c] dark:bg-[#3b98ff62]">
                                    <div className="whitespace-nowrap overflow-hidden text-ellipsis inline-flex items-center h-5 leading-5">
                                      <div className="flex items-center">
                                        <div className="me-1 rounded-full size-2 bg-blue inline-flex shrink-0" />
                                      </div>
                                      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.label}
                                      </span>
                                    </div>
                                  </div>
                                </span>

                                <div className="min-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow px-px text-xs text-primary">
                                  {item.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {merit.data.meritForm.competencyRecords.map((record, index) => (
                        <React.Fragment key={record.id}>
                          <CompetencyCard 
                            key={record.id} 
                            record={record} 
                            index={index}
                            form={form}
                            permissions={{
                              canPerformOwner: canPerform.ownerCanWrite,
                              canPerformChecker: canPerform.checkerCanWrite,
                              canPerformApprover: canPerform.approverCanWrite,
                            }}
                            hasChecker={hasChecker}   
                          />
                          {index !== merit.data.meritForm.competencyRecords.length - 1 && (
                            <Separator className="!h-[1.25px]" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="culture">
                  <div className="z-87 relative flex">
                    <div className="flex flex-col items-start h-full pt-0 col-span-1">
                      <div className="flex items-center h-[42px] overflow-hidden gap-1">
                        <AccordionTrigger asChild>
                          <Button variant="ghost" size="iconXs" className="group">
                            <BsTriangleFill className="text-primary rotate-90 size-3 transition-transform group-data-[state=open]:rotate-180" />
                          </Button>
                        </AccordionTrigger>

                        <h2 className="text-primary text-2xl font-semibold">
                          Part 3: Culture
                        </h2>
                      </div>
                    </div>
                  </div>

                  <AccordionContent>
                    <div className="grid grid-cols-3 gap-4 pb-4">
                      <Card className="p-4">
                        <div className="flex flex-col min-w-0 w-full min-h-8 space-y-1">
                          <h2 className="max-w-full w-full whitespace-break-spaces [word-break:break-word] text-sm font-semibold leading-[1.3] text-primary">
                            หลักเกณฑ์การประเมิน (Evaluation Score System)
                          </h2>
                          <div className="max-w-full w-full whitespace-break-spaces [word-break:break-word] text-primary text-xs leading-4.5">
                            วิเคราะห์ผลการปฏิบัติงาน เปรียบเทียบกับผลงานที่คาดหวัง (Expected Key Result) และการแสดงออกของ Competency
                          </div>
                        </div>
                      </Card>
                      <div className="flex items-center gap-1 col-span-2">
                        <div className="flex flex-col shadow-[inset_0_0_0_1px_rgba(0,0,0,0.086)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] rounded">
                          <div className="flex items-center gap-2 bg-marine py-1 px-2 rounded-t">
                            <h3 className="text-white text-lg font-semibold">
                              เกณฑ์การประเมิน Culture
                            </h3>
                          </div>
                          <div className="flex items-center p-2">
                            {cultureLevels.map((item, index) => (
                              <div key={index} className="flex flex-col p-1 space-y-2 rounded">
                                <span className="font-medium leading-normal overflow-hidden pe-1.5">
                                  <div className="inline-flex items-center shrink min-w-0 max-w-full h-5 m-0 rounded-full px-2 text-xs dark:text-blue-neutral text-blue-muted bg-[#0063ae2c] dark:bg-[#3b98ff62]">
                                    <div className="whitespace-nowrap overflow-hidden text-ellipsis inline-flex items-center h-5 leading-5">
                                      <div className="flex items-center">
                                        <div className="me-1 rounded-full size-2 bg-blue inline-flex shrink-0" />
                                      </div>
                                      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.label}
                                      </span>
                                    </div>
                                  </div>
                                </span>

                                <div className="min-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow px-px text-xs text-primary">
                                  {item.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {merit.data.meritForm.cultureRecords.map((record, index) => (
                        <React.Fragment key={record.id}>
                          <CultureCard 
                            key={record.id} 
                            record={record} 
                            index={index}
                            form={form}
                            permissions={{
                              canPerformOwner: canPerform.ownerCanWrite,
                              canPerformChecker: canPerform.checkerCanWrite,
                              canPerformApprover: canPerform.approverCanWrite,
                            }}
                            hasChecker={hasChecker}
                          />
                          {index !== merit.data.meritForm.cultureRecords.length - 1 && (
                            <Separator className="!h-[1.25px]" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
}