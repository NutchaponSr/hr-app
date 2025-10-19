"use client";

import { inferProcedureOutput } from "@trpc/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { AppRouter } from "@/trpc/routers/_app";

import { Form } from "@/components/ui/form";

import { CompetencySection } from "../components/competency-section";
import { Accordion } from "@/components/ui/accordion";
import { meritSchema, MeritSchema } from "@/modules/merit/schema";
import { convertAmountFromUnit } from "@/lib/utils";
import { CultureSection } from "../components/culture-section";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { BsPersonFill, BsSave } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { Content } from "@/components/content";
import { UserProfile } from "@/modules/auth/ui/components/user-profile";
import { GoProject } from "react-icons/go";
import { SelectionBadge } from "@/components/selection-badge";
import { periods } from "@/modules/bonus/constants";
import { Banner } from "@/components/banner";
import { Period } from "@/generated/prisma";
import { useSave } from "@/hooks/use-save";
import { useExcelParser } from "@/hooks/use-excel-parser";


interface Props {
  id: string;
  period: Period;
  merit: inferProcedureOutput<AppRouter["kpiMerit"]["getByFormId"]>;
  canPerform: {
    canSubmit: boolean;
    canWrite: boolean;
  };
}

export const MeritInDraftScreen = ({ id, merit, canPerform, period }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { setSave } = useSave();
  const { handleFileParsing } = useExcelParser();

  const fileRef = useRef<HTMLInputElement>(null);

  const update = useMutation(trpc.kpiMerit.update.mutationOptions());
  const updateBulk = useMutation(trpc.kpiMerit.updateRecordBulk.mutationOptions());

  const buildDefaults = (merit: inferProcedureOutput<AppRouter["kpiMerit"]["getByFormId"]>): MeritSchema => ({
    competencies: merit.data.meritForm.competencyRecords?.map(record => ({
      id: record.id,
      competencyId: record.competencyId || "",
      input: record.input || "",
      output: record.output || "",
      weight: convertAmountFromUnit(record.weight, 2).toString(),
      types: record.type,
      label: record.label,
      t1: record.competency?.t1,
      t2: record.competency?.t2,
      t3: record.competency?.t3,
      t4: record.competency?.t4,
      t5: record.competency?.t5,
      comments: record.comments,
    })) || [],
    cultures: merit.data.meritForm.cultureRecords?.map(record => ({
      id: record.id,
      cultureId: record.cultureId,
      evidence: record.evidence || "",
      code: record.culture.code,
      name: record.culture.name,
      description: record.culture.description,
      weight: convertAmountFromUnit(record.weight, 2).toString(),
      comments: record.comments,
    })) || [],
  });

  const form = useForm<MeritSchema>({
    resolver: zodResolver(meritSchema),
    defaultValues: buildDefaults(merit),
  });

  const { fields: competencyFields } = useFieldArray({
    control: form.control,
    name: "competencies",
    keyName: "fieldId",
  });

  const { fields: cultureFields } = useFieldArray({
    control: form.control,
    name: "cultures",
    keyName: "fieldId",
  });

  const onSubmit = (value: MeritSchema) => {
    toast.loading("Updating merit...", { id: "update-merit" });

    update.mutate({
      id: merit.data.meritForm.id!,
      meritSchema: value,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getByFormId.queryOptions({ id, period }));
        toast.success("Merit updated!", { id: "update-merit" });

        setSave(true);
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Merit updated!", { id: "update-merit" });
      },
    });
  }

  useEffect(() => {
    if (!merit?.data?.meritForm) return;
    form.reset(buildDefaults(merit), {
      keepDirty: false,
      keepTouched: false,
    });
  }, [
    form,
    merit,
    merit?.data?.meritForm?.id,
    merit?.data?.meritForm?.updatedAt,
  ]);

  return (
    <Form {...form}>
      <Banner
        title="Merit"
        className="px-16"
        description="ตั้งแต่ระดับ ผู้ช่วยผู้จัดการทั่วไป ขึ้นไป (Evaluation Form of Asst. General Manager Above Level)"
        icon={GoProject}
        context={<SelectionBadge label={periods["IN_DRAFT"]} />}
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="contents"
      >
        <div className="sticky top-0 z-[101]">
          <div className="absolute right-16 top-1 flex items-center gap-1">
            {canPerform.canSubmit && (
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={update.isPending}
              >
                {update.isPending
                  ? <Loader className="!text-white" />
                  : <BsSave className="stroke-[0.25]" />
                }
                Save
              </Button>
            )}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              ref={fileRef}
              className="sr-only"
              onChange={async (e) => {
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

                  updateBulk.mutate({
                    competency: updatedCompetencies,
                    culture: updatedCultures,
                  }, {
                    onSuccess: () => {
                      queryClient.invalidateQueries(trpc.kpiMerit.getByFormId.queryOptions({ id, period }));
                      toast.success("Records updated successfully from Excel!", { id: "update-bulk" });
                      setSave(true);
                    },
                    onError: (error) => {
                      toast.error(error.message || "Failed to update records", { id: "update-bulk" });
                    },
                  });

                } catch (error) {
                  if (error instanceof Error) {
                    toast.error(error.message);
                  } else {
                    toast.error("Something went wrong");
                  }
                }
              }}
            />
            <Button
              size="sm"
              type="button"
              variant="primary"
              onClick={() => fileRef.current?.click()}
            >
              Upload
            </Button>
          </div>
        </div>
        <div className="grow shrink-0 flex flex-col relative">
          <div className="relative float-start min-w-full select-none pb-[180px] px-16">
            <Accordion defaultValue={["competency", "culture"]} type="multiple" className="relative">
              <CompetencySection
                form={form}
                fields={competencyFields}
                canPerform={canPerform.canWrite}
                competencyRecords={merit.data.meritForm.competencyRecords || []}
              />
              <CultureSection
                form={form}
                fields={cultureFields}
                canPerform={canPerform.canWrite}
                cultureRecord={merit.data.meritForm.cultureRecords || []}
              />
            </Accordion>
          </div>
        </div>
      </form>
    </Form>
  );
}