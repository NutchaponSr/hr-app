"use client";

import { inferProcedureOutput } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";
import { Resolver, useForm } from "react-hook-form";
import { meritEvaluationSchema, MeritEvaluationSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { meritEvaluationMapValue } from "../../utils";
import { CompetencyEvaluationTable } from "../components/competency-evaluation-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { createColumns as createCompetencyColumns } from "../components/competency-evaluation-columns";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BsPersonFill, BsSave, BsTriangleFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { createColumns as createCultureColumns } from "../components/culture-evaluation-columns";
import { CultureEvaluationTable } from "../components/culture-evaluation-table";
import { useEffect, useMemo } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserProfile } from "@/modules/auth/ui/components/user-profile";
import { RowData } from "@/components/row-data";
import { MeritSummaryTable } from "../components/merit-summary-table";
import { competencyLevels, cultureLevels } from "../../constants";

type ResponseType = inferProcedureOutput<AppRouter["kpiMerit"]["getByFormId"]>

interface Props {
  id: string;
  merit: ResponseType;
  canPerform: {
    canSubmit: boolean;
    ownerCanWrite: boolean;
    checkerCanWrite: boolean;
    approverCanWrite: boolean;
  };
}

export const MeritEvaluation1stScreen = ({ 
  id,
  merit,
  canPerform
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const defaultValues = meritEvaluationMapValue(merit);

  const updateEvaluation = useMutation(trpc.kpiMerit.updateEvaluation.mutationOptions());

  const form = useForm<MeritEvaluationSchema>({
    resolver: zodResolver(meritEvaluationSchema) as Resolver<MeritEvaluationSchema>,
    defaultValues,
  });

  const columns = useMemo(() => {
  return createCompetencyColumns({
    form, 
    hasChecker: true,
    permissions: {
      canPerformOwner: canPerform.ownerCanWrite,
      canPerformChecker: canPerform.checkerCanWrite,
      canPerformApprover: canPerform.approverCanWrite,
    },
  });
}, [form, canPerform.ownerCanWrite, canPerform.checkerCanWrite, canPerform.approverCanWrite]);

  const tableCompetency = useReactTable({
    data: merit.data.meritForm.competencyRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableCulture = useReactTable({
    data: merit.data.meritForm.cultureRecords,
    columns: createCultureColumns({ 
      form,
      hasChecker: merit.permission.ctx.checkerId !== null,
      permissions: {
        canPerformOwner: canPerform.ownerCanWrite,
        canPerformChecker: canPerform.checkerCanWrite,
        canPerformApprover: canPerform.approverCanWrite,
      },
    }),
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = (data: MeritEvaluationSchema) => {
    toast.loading("Updating merits...", { id: "update-bulk-merit-evaluations" });

    updateEvaluation.mutate({ meritEvaluationSchema: data }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getByFormId.queryOptions({ id }));
        toast.success("Merits Updated!", { id: "update-bulk-merit-evaluations" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "update-bulk-merit-evaluations" });
      },
    });
  }

  useEffect(() => {
    if (!merit) return;
  
    form.reset(meritEvaluationMapValue(merit), {
      keepDirty: false,
      keepTouched: false,
    });
  }, [merit, form]);

  return (
    <Form {...form}>
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
              kpis={merit.data.kpiForm!.kpis}
              competencyRecords={merit.data.meritForm.competencyRecords}  
              cultureRecords={merit.data.meritForm.cultureRecords}
            />
          </div>
        </div>
      </div>
      <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grow shrink-0 flex flex-col relative">
          <div className="bg-background px-16 flex justify-end items-center sticky top-0 z-99 py-1">
            {canPerform.canSubmit && (
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={false}
              >
                <BsSave className="stroke-[0.25]" />
                Save
              </Button>
            )}
          </div>
          <div className="relative float-start min-w-full select-none pb-[180px] px-16">
            <Accordion defaultValue={["competency", "culture"]} type="multiple" className="relative">
              <AccordionItem value="competency">
                <div className="relative">
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
                    <div className="flex w-full rounded bg-[#e8f2fa] dark:bg-[#233850] py-3 px-5">
                      <div className="flex flex-col min-w-0 w-full min-h-8 space-y-1">
                        <h2 className="max-w-full w-full whitespace-break-spaces [word-break:break-word] text-base font-semibold leading-[1.3] text-primary">
                          หลักเกณฑ์การประเมิน (Evaluation Score System)
                        </h2>
                        <div className="max-w-full w-full whitespace-break-spaces [word-break:break-word] text-primary text-sm leading-4.5">
                          วิเคราะห์ผลการปฏิบัติงาน เปรียบเทียบกับผลงานที่คาดหวัง (Expected Key Result) และการแสดงออกของ Competency
                        </div>
                      </div>
                    </div>
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
                    <CompetencyEvaluationTable form={form} table={tableCompetency} />
                  </AccordionContent>
                </div>
              </AccordionItem>
              <AccordionItem value="culture">
                <div className="relative">
                  <div className="z-87 relative grid grid-cols-3 gap-4">
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
                    <div className="flex w-full rounded bg-[#e8f2fa] dark:bg-[#233850] py-3 px-5">
                      <div className="flex flex-col min-w-0 w-full min-h-8 space-y-1">
                        <h2 className="max-w-full w-full whitespace-break-spaces [word-break:break-word] text-base font-semibold leading-[1.3] text-primary">
                          หลักเกณฑ์การประเมิน (Evaluation Score System)
                        </h2>
                        <div className="max-w-full w-full whitespace-break-spaces [word-break:break-word] text-primary text-sm leading-4.5">
                          วิเคราะห์ผลการปฏิบัติงาน เปรียบเทียบกับผลงานที่คาดหวัง (Expected Key Result) และการแสดงออกของวัฒนธรรมองค์กร (Culture)
                        </div>
                      </div>
                    </div>
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
                    <CultureEvaluationTable form={form} table={tableCulture} />
                  </AccordionContent>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </form>
    </Form>
  );
}
  