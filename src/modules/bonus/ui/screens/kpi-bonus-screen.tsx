import { BsSave } from "react-icons/bs";
import { useEffect, useMemo } from "react";
import { GoProject } from "react-icons/go";
import { Resolver, useForm } from "react-hook-form";
import { inferProcedureOutput } from "@trpc/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { convertAmountFromUnit } from "@/lib/utils";

import { AppRouter } from "@/trpc/routers/_app";
import { Kpi, KpiCategory, Project } from "@/generated/prisma";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import { Hint } from "@/components/hint";
import { Table } from "@/components/table";
import { Banner } from "@/components/banner";
import { Toolbar } from "@/components/toolbar";
import { MenuBar } from "@/components/menu-bar";
import { SelectionBadge } from "@/components/selection-badge";

import { createColumns } from "@/modules/bonus/ui/components/kpi-columns";

import { useCreateKpi } from "@/modules/bonus/api/use-create-kpi";
import { useCommentKpi } from "@/modules/comments/api/use-comment-kpi";
import { useDeleteBulkKpi } from "@/modules/bonus/api/use-delete-bulk-kpis";
import { useUpdateBulkKpi } from "@/modules/bonus/api/use-update-bulk-kpis";

import { period } from "@/modules/bonus/constants";
import { validateWeight } from "@/modules/bonus/util";
import { kpiFormSchema, KpiFormSchema } from "@/modules/bonus/schema";

interface Props {
  id: string;
  canPerform: {
    canSubmit: boolean;
    canWrite: boolean;
  };
  kpiForm: inferProcedureOutput<AppRouter["kpiBonus"]["getById"]>;
}

export const KpiBonusScreen = ({ id, canPerform, kpiForm }: Props) => {
  const mapKpiToFormValue = (kpi: Kpi) => ({
    id: kpi.id,
    name: kpi.name ?? "",
    weight: String(convertAmountFromUnit(kpi.weight, 2)),
    category: kpi.category ?? KpiCategory.FP,
    objective: kpi.objective ?? "",
    definition: kpi.definition ?? "",
    strategy: kpi.strategy ?? "",
    type: kpi.type ?? Project.PROJECT,
    target70: kpi.target70 ?? "",
    target80: kpi.target80 ?? "",
    target90: kpi.target90 ?? "",
    target100: kpi.target100 ?? "",
  });

  const kpis = kpiForm.data.kpiForm.kpis;

  const defaultKpiValues = useMemo(() => ({
    kpis: (kpis ?? []).map(mapKpiToFormValue),
  }), [kpis]);

  const form = useForm<KpiFormSchema>({
    resolver: zodResolver(kpiFormSchema) as Resolver<KpiFormSchema>,
    defaultValues: defaultKpiValues,
  });

  const { mutation: comment } = useCommentKpi(id);
  const { mutation: createKpi } = useCreateKpi(id);
  const { mutation: updateBulkKpi } = useUpdateBulkKpi(id);

  const table = useReactTable({
    data: kpiForm.data.kpiForm.kpis || [],
    columns: createColumns({ form, comment, canPerform: !canPerform.canWrite }),
    getCoreRowModel: getCoreRowModel(),
  });

  const { mutation: deleteBulkKpi } = useDeleteBulkKpi(table, id);

  const onSubmit = (value: KpiFormSchema) => {
    updateBulkKpi({  
      kpis: value.kpis.map(kpi => ({
        id: kpi.id,
        kpiBonusCreateSchema: {
          ...kpi,
        },
      })),
    });
  }

  const totalWeight = useMemo(() => (
    convertAmountFromUnit(
      kpiForm.data.kpiForm.kpis!.reduce((acc, kpi) => acc + kpi.weight, 0),
      2
    )
  ), [kpiForm.data.kpiForm.kpis]);

  const maxAllowedWeight = useMemo(() => validateWeight(kpiForm.data.preparer.rank), [kpiForm.data.preparer.rank]);

  const progressValue = useMemo(() => (
    Math.min((totalWeight / maxAllowedWeight) * 100, 100)
  ), [totalWeight, maxAllowedWeight]);

  useEffect(() => {
    if (kpis && kpis.length > 0) {
      form.reset({ kpis: kpis.map(mapKpiToFormValue) });
    }
  }, [kpis, form]);

  return (
    <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="grow-0 shrink flex flex-col bg-background h-[calc(-44px+100vh)] max-h-full relative w-full"
        >
          <div className="flex flex-col grow relative overflow-auto me-0 mb-0">
            <Banner
              title="KPI Bonus"
              className="ps-24"
              description="Reward employees with performance-based bonuses tied to goals and business impact."
              icon={GoProject}
              context={
                <>
                  <SelectionBadge label={period["IN_DRAFT"]} />
                  <div className="h-2" />
                </>
              }
            />
            <MenuBar 
              table={table} 
              canPerform={canPerform.canSubmit}
              title="Are you sure to delete these KPI?"
              onDelete={() => deleteBulkKpi({ 
                kpiFormId: kpiForm.data.fileId, 
                ids: table.getSelectedRowModel().rows.map((r) => r.original.id)
              })}  
            />
            <Toolbar 
              canPerform={canPerform.canSubmit}
              onCreate={() => createKpi({ kpiFormId: kpiForm.data.kpiForm.id! })}
              context={
                <div className="flex flex-row items-center gap-x-2 gap-y-1.5">
                  {canPerform.canSubmit && (
                    <Button type="submit" variant="secondary" size="sm">
                      <BsSave className="stroke-[0.25]" />
                      Save
                    </Button>
                  )}
                  <SelectionBadge label="Weight" />
                  <span className="text-sm text-primary">
                    {totalWeight.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <Hint label={`${totalWeight} / ${maxAllowedWeight}`}>
                    <Progress
                      className="h-1 w-40"
                      value={progressValue}
                    />
                  </Hint>
                  <Separator orientation="vertical" className="!h-4 mx-1" />
                  <SelectionBadge label="Total KPIs" />
                  <span className="text-sm text-primary">
                    {kpiForm.data.kpiForm.kpis!.length}
                  </span>
                </div>
              }
            />
            <div className="grow shrink-0 flex flex-col relative">
              <div className="relative float-start min-w-full select-none pb-[180px] px-24">
                <div className="relative">
                  <Table table={table} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
  );
}