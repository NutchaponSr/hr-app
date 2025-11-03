import { SelectionBadge } from "@/components/selection-badge";
import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";
import { Content } from "@/components/content";
import { UserProfile } from "@/modules/auth/ui/components/user-profile";
import { BsPersonFill } from "react-icons/bs";
import { Form } from "@/components/ui/form";
import { bonusEvaluationMapValue, validateWeight } from "../../util";
import { Resolver, useForm } from "react-hook-form";
import { kpiFormSchema, KpiFormSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateBulkKpis } from "../../api/use-update-bulk-kpis";
import { MenuBar } from "@/components/menu-bar";
import { Toolbar } from "@/components/toolbar";
import { createColumns } from "../components/kpi-columns";
import { useCommentKpi } from "@/modules/comments/api/use-comment-kpi";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useDeleteBulkKpis } from "../../api/use-delete-bulk-kpis";
import { useCreateKpi } from "../../api/use-create-kpi";
import { useEffect, useMemo, useRef } from "react";
import { convertAmountFromUnit } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table } from "@/components/table";
import { useExcelParser } from "@/hooks/use-excel-parser";
import { toast } from "sonner";
import { useCreateBulkKpis } from "../../api/use-create-bulk-kpis";
import { validateKpiRows } from "../../utils";
import { EmployeeEvaluateInfo } from "@/components/employee-evaluate-info";

interface Props {
  id: string;
  kpiForm: inferProcedureOutput<AppRouter["kpiBonus"]["getById"]>;
  canPerform: {
    canSubmit: boolean;
    canWrite: boolean;
  };
}

export const BonusDraftScreen = ({ 
  id, 
  kpiForm,
  canPerform
}: Props) => {
  const { mutation: comment } = useCommentKpi(id);
  const { mutation: createKpi } = useCreateKpi(id);
  const { mutation: createBulkKpis } = useCreateBulkKpis(id);
  const { mutation: updateBulkKpis } = useUpdateBulkKpis(id);

  const { handleFileParsing } = useExcelParser();

  const fileRef = useRef<HTMLInputElement>(null);
  
  const kpis = useMemo(() => 
    kpiForm.data.kpiForm.kpis?.map((kpi) => bonusEvaluationMapValue(kpi)) || [], 
    [kpiForm.data.kpiForm.kpis]
  );
  
  const form = useForm<KpiFormSchema>({
    resolver: zodResolver(kpiFormSchema) as Resolver<KpiFormSchema>,
    defaultValues: {
      kpis,
    },
  });
  
  const table = useReactTable({
    data: kpiForm.data.kpiForm.kpis || [],
    columns: createColumns({
      form,
      comment,
      canPerform: !canPerform.canWrite,
    }),
    getCoreRowModel: getCoreRowModel(),
  });

  const { 
    mutation: deleteBulkKpis,
    isPending: isDeleting,
  } = useDeleteBulkKpis(table, id);

  const onSubmit = (values: KpiFormSchema) => {
    updateBulkKpis({  
      kpis: values.kpis.map(kpi => ({
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

  useEffect(() => {
    if (kpis && kpis.length > 0) {
      form.reset({ kpis });
    }
  }, [kpis, form]);

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <EmployeeEvaluateInfo 
          name={kpiForm.data.preparer.fullName}
          position={kpiForm.data.preparer.position}
          division={kpiForm.data.preparer.division}
          department={kpiForm.data.preparer.department}
          weight={totalWeight}
        />
        
        <div className="flex flex-row gap-2 px-16">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] gap-x-4 my-2 max-w-full">
            <Content label="Owner" icon={BsPersonFill}>
              <UserProfile employee={kpiForm.data.preparer} />
            </Content>
            {kpiForm.data.checker && (
              <Content label="Checker" icon={BsPersonFill}>
                <UserProfile employee={kpiForm.data.checker} />
              </Content>
            )}
            <Content label="Approver" icon={BsPersonFill}>
              <UserProfile employee={kpiForm.data.approver} />
            </Content>
          </div>
        </div>

        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="contents"
        >
          <MenuBar 
            table={table} 
            canPerform={canPerform.canSubmit}
            title="Are you sure to delete these KPI?"
            onDelete={() => deleteBulkKpis({ 
              kpiFormId: kpiForm.data.fileId, 
              ids: table.getSelectedRowModel().rows.map((r) => r.original.id)
            })}  
          />
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

                const res = validateKpiRows(sheet1);

                if (!res.ok) {
                  throw new Error(res.errors.join(", "));
                }

                createBulkKpis({
                  kpiFormId: kpiForm.data.kpiForm.id!,
                  kpis: res.validRows,
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
          <Toolbar 
            canPerform={canPerform.canSubmit}
            isPending={isDeleting}
            onCreate={() => createKpi({ kpiFormId: kpiForm.data.kpiForm.id! })}
            context={
              <div className="flex flex-row items-center gap-x-2 gap-y-1.5">
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
                    value={Math.min((totalWeight / maxAllowedWeight) * 100, 100)}
                  />
                </Hint>
                <Separator orientation="vertical" className="!h-4 !w-[1.25px] mx-1" />
                <SelectionBadge label="Total KPIs" />
                <span className="text-sm text-primary">
                  {kpiForm.data.kpiForm.kpis!.length}
                </span>
              </div>
            }
            onUpload={() => fileRef.current?.click()}
          />
          <div className="grow shrink-0 flex flex-col relative">
            <div className="relative float-start min-w-full select-none pb-[180px] px-16">
              <div className="relative">
                <Table table={table} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
}