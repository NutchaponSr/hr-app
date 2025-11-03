import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";
import { Role } from "../../permission";
import { KpiSummaryTable } from "../components/kpi-summary-table";
import { UserProfile } from "@/modules/auth/ui/components/user-profile";
import { RowData } from "@/components/row-data";
import { BsPersonFill, BsSave } from "react-icons/bs";
import { useKpiEvaluationForm } from "../../hooks/use-kpi-evaluation-form";
import { useCallback, useMemo } from "react";
import { convertAmountFromUnit } from "@/lib/utils";
import { EmployeeEvaluateInfo } from "@/components/employee-evaluate-info";
import { Form } from "@/components/ui/form";
import { KpiItem } from "../components/kpi-item";
import { useUpdateBulkKpiEvaluations } from "../../api/use-update-bulk-kpi-evaluations";
import { KpiBonusEvaluationsSchema } from "../../schema";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import React from "react";
import { Separator } from "@/components/ui/separator";

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
  hasChecker: boolean;
}

export const BonusEvaluationScreen = ({
  id,
  kpiForm,
  canPerform,
  role,
  hasChecker,
}: Props) => {
  const {
    mutation: updateBulkKpiEvaluations,
    opt: updateBulkKpiEvaluationsOpt
  } = useUpdateBulkKpiEvaluations(id);

  const form = useKpiEvaluationForm({
    kpis: kpiForm.data.kpiForm.kpis || [],
    role,
  });

  const totalWeight = useMemo(() => (
    convertAmountFromUnit(
      kpiForm.data.kpiForm.kpis!.reduce((acc, kpi) => acc + kpi.weight, 0),
      2
    )
  ), [kpiForm.data.kpiForm.kpis]);

  const onSubmit = useCallback((data: KpiBonusEvaluationsSchema) => {
    updateBulkKpiEvaluations({ evaluations: data.evaluations });
  }, [updateBulkKpiEvaluations]);

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
        
        <div className="w-full max-w-full self-center px-16">
          <div className="grid grid-cols-3 gap-8">
            <div className="grow-0 shrink-0">
              <div role="table" className="m-0 flex flex-col gap-1">
                <RowData icon={BsPersonFill} label="Owner">
                  <UserProfile employee={kpiForm.data.preparer} />
                </RowData>
                {kpiForm.data.checker && (
                  <RowData icon={BsPersonFill} label="Checker">
                    <UserProfile employee={kpiForm.data.checker} />
                  </RowData>
                )}
                <RowData icon={BsPersonFill} label="Approver">
                  <UserProfile employee={kpiForm.data.approver} />
                </RowData>
              </div>
            </div>
            <div className="grow-0 shrink-0 col-span-2">
              <KpiSummaryTable form={form} kpis={kpiForm.data.kpiForm.kpis || []} />
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
          {canPerform.canSubmit && (
            <div className="min-h-9 px-16 sticky start-0 top-0 bg-background shrink-0 flex items-center z-100">
              <div className="w-full flex justify-end items-center">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm" 
                  disabled={updateBulkKpiEvaluationsOpt.isPending}
                >
                  {updateBulkKpiEvaluationsOpt.isPending ? <Loader className="!text-white" /> : <BsSave className="stroke-[0.25]" />}
                  Save
                </Button>
              </div>
            </div>
          )}
          <div className="grow shrink-0 flex flex-col relative pb-[180px]">
            <div className="relative float-start min-w-full select-none px-16 space-y-4">
              {kpiForm.data.kpiForm.kpis?.map((kpi, index) => (
                <React.Fragment key={kpi.id}>
                  <KpiItem 
                    index={index}
                    form={form}
                    kpi={kpi}   
                    permissions={{
                      canPerformOwner: canPerform.ownerCanWrite,
                      canPerformChecker: canPerform.checkerCanWrite,
                      canPerformApprover: canPerform.approverCanWrite,
                    }}
                    hasChecker={hasChecker}
                  />
                  {index !== kpiForm.data.kpiForm.kpis!.length - 1 && (
                    <Separator className="!h-[1.25px]" />
                  )}
                </React.Fragment>
              ))} 
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
}