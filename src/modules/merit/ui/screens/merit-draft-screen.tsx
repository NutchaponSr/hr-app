import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  BsPersonFill,
  BsSave,
  BsTriangleFill,
  BsDownload,
  BsFiletypeCsv,
  BsFloppy2Fill,
} from "react-icons/bs";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { Resolver, useForm } from "react-hook-form";
import { inferProcedureOutput } from "@trpc/server";
import { zodResolver } from "@hookform/resolvers/zod";

import { convertAmountFromUnit } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";
import { Period } from "@/generated/prisma";
import { AppRouter } from "@/trpc/routers/_app";

import { useSave } from "@/hooks/use-save";
import { useExcelParser } from "@/hooks/use-excel-parser";

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { Hint } from "@/components/hint";
import { Table } from "@/components/table";
import { Content } from "@/components/content";
import { SelectionBadge } from "@/components/selection-badge";
import { EmployeeEvaluateInfo } from "@/components/employee-evaluate-info";

import { UserProfile } from "@/modules/auth/ui/components/user-profile";
import { createColumns as createCultureColumns } from "@/modules/merit/ui/components/culture-columns";
import { createColumns as createCompetencyColumns } from "@/modules/merit/ui/components/competency-columns";

import { useCommentMerit } from "@/modules/comments/api/use-comment-merit";

import { meritDraftMapValue } from "@/modules/merit/utils";
import { meritSchema, MeritSchema } from "@/modules/merit/schema";

interface Props {
  id: string;
  period: Period;
  merit: inferProcedureOutput<AppRouter["kpiMerit"]["getByFormId"]>;
  canPerform: {
    canWrite: boolean;
    canSubmit: boolean;
  };
}

export const MeritDraftScreen = ({ id, period, merit, canPerform }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { setSave } = useSave();
  const { mutation: comment } = useCommentMerit(id);

  const update = useMutation(trpc.kpiMerit.update.mutationOptions());
  const updateBulk = useMutation(
    trpc.kpiMerit.updateRecordBulk.mutationOptions(),
  );

  const { handleFileParsing } = useExcelParser();

  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<MeritSchema>({
    resolver: zodResolver(meritSchema) as Resolver<MeritSchema>,
    defaultValues: meritDraftMapValue(merit),
  });

  const totalCompetenciesWeight = convertAmountFromUnit(
    merit.data.meritForm.competencyRecords?.reduce(
      (acc, kpi) => acc + kpi.weight,
      0,
    ) || 0,
    2,
  );
  const totalCultureWeight = convertAmountFromUnit(
    merit.data.meritForm.cultureRecords?.reduce(
      (acc, kpi) => acc + kpi.weight,
      0,
    ) || 0,
    2,
  );

  const competencyTb = useReactTable({
    data: merit.data.meritForm.competencyRecords || [],
    columns: createCompetencyColumns({
      form,
      comment,
      canPerform: canPerform.canWrite,
      ownerLevel: merit.data.preparer.rank,
    }),
    getCoreRowModel: getCoreRowModel(),
  });
  const cultureTb = useReactTable({
    data: merit.data.meritForm.cultureRecords || [],
    columns: createCultureColumns({
      form,
      comment,
      canPerform: canPerform.canWrite,
    }),
    getCoreRowModel: getCoreRowModel(),
  });

  const onSave = () => {
    toast.loading("Updating merit...", { id: "update-merit" });
    
    update.mutate(
      {
        id: merit.data.meritForm.id!,
        meritSchema: form.getValues(),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.kpiMerit.getByFormId.queryOptions({ id, period }));
          toast.success("Merit updated!", { id: "update-merit" });
          setSave(true);
        },
        onError: (ctx) => {
          toast.error(ctx.message || "Something went wrong", { id: "update-merit" });
        },
      },
    );
  }

  const onSubmit = (values: MeritSchema) => {
    toast.loading("Updating merit...", { id: "update-merit" });

    update.mutate(
      {
        id: merit.data.meritForm.id!,
        meritSchema: values,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.kpiMerit.getByFormId.queryOptions({ id, period }),
          );
          toast.success("Merit updated!", { id: "update-merit" });

          setSave(true);
        },
        onError: (ctx) => {
          toast.error(ctx.message || "Merit updated!", { id: "update-merit" });
        },
      },
    );
  };

  const handleChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    try {
      const sheet1 = await handleFileParsing(selectedFile, 0);
      const sheet2 = await handleFileParsing(selectedFile, 1);

      const updatedCompetencies = merit.data.meritForm.competencyRecords
        .map((competency, index) => {
          const matchedData = sheet1[index];

          if (matchedData) {
            return {
              id: competency.id,
              competencyId: matchedData.competencyId || "",
              input: matchedData.input || "",
              expectedLevel: matchedData.expectedLevel || "0",
              output: matchedData.output || "",
              weight: Number(matchedData.weight || 0),
            };
          }
          return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      const updatedCultures = merit.data.meritForm.cultureRecords
        .map((culture, index) => {
          const matchedData = sheet2[index];

          if (matchedData) {
            return {
              id: culture.id,
              code: culture.culture.code,
              evidence: matchedData.evidence || "",
            };
          }
          
          return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      toast.loading("Updating records from Excel...", { id: "update-bulk" });

      updateBulk.mutate(
        {
          competency: updatedCompetencies,
          culture: updatedCultures,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(
              trpc.kpiMerit.getByFormId.queryOptions({ id, period }),
            );
            toast.success("Records updated successfully from Excel!", {
              id: "update-bulk",
            });
            setSave(true);
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update records", {
              id: "update-bulk",
            });
          },
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }

      // Clear file input on error
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (!merit.data.meritForm) return;

    form.reset(meritDraftMapValue(merit), {
      keepDirty: false,
      keepTouched: false,
    });
  }, [form, merit]);

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

        <div className="flex flex-row gap-2 px-16">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] gap-x-4 my-2 max-w-full">
            <Content label="Owner" icon={BsPersonFill}>
              <UserProfile employee={merit.data.preparer} />
            </Content>
            {merit.data.checker && (
              <Content label="Checker" icon={BsPersonFill}>
                <UserProfile employee={merit.data.checker} />
              </Content>
            )}
            <Content label="Approver" icon={BsPersonFill}>
              <UserProfile employee={merit.data.approver} />
            </Content>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            ref={fileRef}
            className="sr-only"
            onChange={handleChangeUpload}
          />
          <div
            data-disabled={!canPerform.canSubmit}
            className="data-[disabled=false]:z-[101] sticky top-0 -z-1"
          >
            <div className="absolute right-16 top-1 flex items-center gap-1">
              <Button type="button" variant="primaryGhost" size="sm" onClick={onSave} disabled={update.isPending}>
                <BsFloppy2Fill className="stroke-[0.25]" />
                Save Draft
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={update.isPending}>
                <BsSave className="stroke-[0.25]" />
                Final Confirmation  
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="primary" size="sm">
                    <BsDownload className="stroke-[0.25]" />
                    Import
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[260px] p-1">
                  <h3 className="text-sm data-[inset]:pl-8 select-none flex items-center min-h-7 ps-1 font-medium text-primary">
                    Import
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto px-2 w-full"
                    onClick={() => fileRef.current?.click()}
                  >
                    <div className="flex items-center justify-center min-w-5 min-h-5 self-start">
                      <BsFiletypeCsv className="!stroke-[0.15] size-5 mt-0.5" />
                    </div>
                    <div className="grow shrink basis-auto">
                      <h5 className="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-start">
                        CSV
                      </h5>
                      <p className="text-xs text-tertiary break-words text-start">
                        Upload and process a CSV file
                      </p>
                    </div>
                  </Button>
                </PopoverContent>
              </Popover>
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
                  <div className="h-[42px] z-87 relative text-sm">
                    <div className="flex items-center h-full pt-0 mb-2">
                      <div className="flex items-center h-full overflow-hidden gap-1">
                        <AccordionTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="iconXs"
                            className="group"
                          >
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
                    <div className="min-h-9 shrink-0 z-[100] top-0 sticky bg-background flex items-center">
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
                            value={Math.min(
                              (totalCompetenciesWeight / 30) * 100,
                              100,
                            )}
                          />
                        </Hint>
                      </div>
                    </div>
                    <div className="relative mb-3 flex flex-col gap-8">
                      <Table table={competencyTb} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="culture">
                  <div className="h-[42px] z-87 relative text-sm">
                    <div className="flex items-center h-full pt-0 mb-2">
                      <div className="flex items-center h-full overflow-hidden gap-1">
                        <AccordionTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="iconXs"
                            className="group"
                          >
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
                    <div className="min-h-9 shrink-0 z-[100] top-0 sticky bg-background flex items-center">
                      <div className="flex flex-row items-center gap-x-2 gap-y-1.5">
                        <SelectionBadge label="Weight" />
                        <span className="text-sm text-primary">
                          {totalCultureWeight.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <Hint label={`${totalCultureWeight} / 30`}>
                          <Progress
                            className="h-1 w-40"
                            value={Math.min(
                              (totalCultureWeight / 30) * 100,
                              100,
                            )}
                          />
                        </Hint>
                      </div>
                    </div>
                    <div className="relative mb-3 flex flex-col gap-8">
                      <Table table={cultureTb} />
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
};
