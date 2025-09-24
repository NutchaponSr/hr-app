import { BsSave } from "react-icons/bs";
import { inferProcedureOutput } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";
import { Table } from "@/components/table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { createColumns } from "../components/kpi-evaluation-1st-columns";
import { useForm, type Resolver } from "react-hook-form";
import { KpiWithEvaluation } from "../../types";
import { kpiBonusEvaluationsSchema, KpiBonusEvaluationsSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useUpdateBulkKpiEvaluations } from "../../api/use-update-bulk-kpi-evaluations";
import { Loader } from "@/components/loader";

interface Props {
  id: string;
  kpiForm: inferProcedureOutput<AppRouter["kpiBonus"]["getById"]>;
  canPerform: {
    canSubmit: boolean;
    ownerCanWrite: boolean;
    checkerCanWrite: boolean;
    approverCanWrite: boolean;
  };
}

export const KpiBonusEvaluation1StScreen = ({ id, canPerform, kpiForm }: Props) => {
  const { 
    mutation: updateBulkKpiEvaluations, 
    opt: updateBulkKpiEvaluationsOpt
  } = useUpdateBulkKpiEvaluations(id);

  // ฟังก์ชัน mapValue นี้จะต้องแน่ใจว่า achievementApprover มีค่าเป็น number เสมอ (ไม่เป็น undefined)
  const mapValue = (kpi: KpiWithEvaluation): KpiBonusEvaluationsSchema["evaluations"][number] => ({
    id: kpi.kpiEvaluations[0]?.id,
    fileUrl: kpi.kpiEvaluations[0]?.fileUrl ?? null,
    actualOwner: kpi.kpiEvaluations[0]?.actualOwner ?? "",
    achievementOwner: Number(kpi.kpiEvaluations[0]?.achievementOwner ?? 0),
    actualChecker: kpi.kpiEvaluations[0]?.actualChecker ?? "",
    achievementChecker:
      kpi.kpiEvaluations[0]?.achievementChecker == null
        ? 0
        : Number(kpi.kpiEvaluations[0]?.achievementChecker),
    actualApprover: kpi.kpiEvaluations[0]?.actualApprover ?? "",
    achievementApprover:
      kpi.kpiEvaluations[0]?.achievementApprover == null
        ? 0
        : Number(kpi.kpiEvaluations[0]?.achievementApprover),
  });

  const kpis = kpiForm.data.kpiForm.kpis;

  const form = useForm<KpiBonusEvaluationsSchema>({
    resolver: zodResolver(kpiBonusEvaluationsSchema) as Resolver<KpiBonusEvaluationsSchema>,
    defaultValues: {
      evaluations: (kpis || []).map(mapValue)
    }
  });

  const table = useReactTable({
    data: kpiForm.data.kpiForm.kpis || [],
    columns: createColumns({ 
      form, 
      canPerformOwner: !canPerform.ownerCanWrite,
      canPerformChecker: !canPerform.checkerCanWrite,
      canPerformApprover: !canPerform.approverCanWrite,
    }),
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = (value: KpiBonusEvaluationsSchema) => {
    updateBulkKpiEvaluations({ evaluations: value.evaluations });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
        <div className="min-h-9 px-24 sticky start-0 top-0 bg-background shrink-0 z-86">
          <div className="flex items-center h-full pt-0 mb-2">
            <div className="grow h-full">
              <div className="flex flex-row justify-end items-center h-full gap-0.5">
                <div 
                  data-show={true}
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
          <div className="relative float-start min-w-full select-none pb-[180px] px-24">
            <div className="relative">
              <Table table={table} />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}