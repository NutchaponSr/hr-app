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
        <div className="grid grid-cols-3 gap-12">
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
                      <CompetencyEvaluationTable form={form} table={tableCompetency} />
                    </AccordionContent>
                  </div>
                </AccordionItem>
                <AccordionItem value="culture">
                  <div className="relative">
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
                    <AccordionContent>
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
  