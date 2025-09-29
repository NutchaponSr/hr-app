import { BsSave } from "react-icons/bs";
import { inferProcedureOutput } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { createColumns } from "../components/kpi-evaluation-1st-columns";
import { useForm, type Resolver } from "react-hook-form";
import { KpiWithEvaluation } from "../../types";
import { kpiBonusEvaluationsSchema, KpiBonusEvaluationsSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Role } from "../../permission";
import { useUpdateBulkKpiEvaluations } from "../../api/use-update-bulk-kpi-evaluations";
import { useEffect, useMemo } from "react";
import { KpiEvaluationTable } from "../components/kpi-evaluation-table";
import { getTotalWithWeight } from "../../util";

interface Props {
  id: string;
  kpiForm: inferProcedureOutput<AppRouter["kpiBonus"]["getById"]>;
  canPerform: {
    canSubmit: boolean;
    ownerCanWrite: boolean;
    checkerCanWrite: boolean;
    approverCanWrite: boolean;
  };
  role: Role;
}

export const KpiBonusEvaluation1StScreen = ({ id, role, canPerform, kpiForm }: Props) => {
  const {
    mutation: updateBulkKpiEvaluations,
    opt: updateBulkKpiEvaluationsOpt
  } = useUpdateBulkKpiEvaluations(id);

  const mapValue = (kpi: KpiWithEvaluation, userRole: Role) => {
    const evaluation = kpi.kpiEvaluations[0];
    
    return {
      id: evaluation?.id || "",
      role: userRole,
      fileUrl: evaluation?.fileUrl ?? null,
      actualOwner: evaluation?.actualOwner ?? "",
      achievementOwner: Number(evaluation?.achievementOwner ?? 0),
      actualChecker: evaluation?.actualChecker ?? "",
      achievementChecker: Number(evaluation?.achievementChecker ?? 0),
      actualApprover: evaluation?.actualApprover ?? "",
      achievementApprover: Number(evaluation?.achievementApprover ?? 0),
    };
  };

  const kpis = kpiForm.data.kpiForm.kpis;
  const hasChecker = kpiForm.permission.ctx.checkerId !== null;

  const defaultValues = useMemo(() => ({
    evaluations: (kpis || []).map(kpi => mapValue(kpi, role))
  }), [kpis, role]);

  const form = useForm<KpiBonusEvaluationsSchema>({
    resolver: zodResolver(kpiBonusEvaluationsSchema) as Resolver<KpiBonusEvaluationsSchema>,
    defaultValues,
  });

  // create a stable columns array so cell components are not recreated on every render.
  // This prevents input fields from losing focus / accepting one char at a time.
  const columns = useMemo(() => {
    return createColumns({
      form,
      hasChecker,
      permissions: {
        canPerformOwner: !canPerform.ownerCanWrite,
        canPerformChecker: !canPerform.checkerCanWrite,
        canPerformApprover: !canPerform.approverCanWrite,
      },
    });
    // include only the minimal deps that affect column rendering
  }, [form, hasChecker, canPerform.ownerCanWrite, canPerform.checkerCanWrite, canPerform.approverCanWrite]);

  // Create the table once using the memoized columns so the table instance is stable.
  const table = useReactTable({
    data: kpiForm.data.kpiForm.kpis || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // (table is ready and memoized)

  const onSubmit = (data: KpiBonusEvaluationsSchema) => {
    updateBulkKpiEvaluations({ evaluations: data.evaluations });
  };

  const { watch } = form;
  const evaluations = watch("evaluations");

  useEffect(() => {
    if (!kpis) return;
    form.reset({
      evaluations: (kpis || []).map(kpi => mapValue(kpi, role)),
    }, {
      keepDirty: false,
      keepTouched: false,
    });
  }, [form, kpis, role]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
        <div className="min-h-9 px-16 sticky start-0 top-0 bg-background shrink-0 z-86">
          <div className="flex items-center w-full h-full pt-0">
            <div className="grow h-full">
              <div className="flex flex-row justify-end items-center h-full gap-0.5">
                  <div 
                    data-show={canPerform.canSubmit}
                    className="relative shrink-0 rounded overflow-hidden h-7 ml-1 data-[show=true]:inline-flex hidden"
                  >
                    <button 
                      type="submit" 
                      disabled={updateBulkKpiEvaluationsOpt.isPending}
                      className="transition flex items-center justify-center whitespace-nowrap px-2 font-medium bg-marine text-white text-sm hover:bg-marine-muted shadow-[inset_1px_0_0_rgba(55,53,47,0.16)] gap-1.5 data-[disabled=true]:opacity-80"
                    >
                      {updateBulkKpiEvaluationsOpt.isPending ? (
                        <>
                          <Loader className="!text-white size-4" />
                          Saving
                        </>
                      ) : (
                        <>
                          <BsSave className="stroke-[0.25] size-4" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div className="grow shrink-0 flex flex-col relative">
          <div className="relative float-start min-w-full select-none pb-[180px] px-16">
            <div className="relative">
              <KpiEvaluationTable 
                table={table}  
                totalAchievementOwnerWithWeight={getTotalWithWeight(evaluations, kpis!, "achievementOwner")}
                totalAchievementCheckerWithWeight={getTotalWithWeight(evaluations, kpis!, "achievementChecker")}
                totalAchievementApproverWithWeight={getTotalWithWeight(evaluations, kpis!, "achievementApprover")}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}