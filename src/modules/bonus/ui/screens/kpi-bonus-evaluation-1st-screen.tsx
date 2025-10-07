import { inferProcedureOutput } from "@trpc/server";
import { BsPersonFill, BsSave } from "react-icons/bs";

import { AppRouter } from "@/trpc/routers/_app";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { createColumns } from "../components/kpi-evaluation-1st-columns";
import { APPROVAL_STATUSES, KpiWithEvaluation } from "../../types";
import { KpiBonusEvaluationsSchema } from "../../schema";
import { useKpiEvaluationForm } from "../../hooks/use-kpi-evaluation-form";
import { Form } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Role } from "../../permission";
import { useUpdateBulkKpiEvaluations } from "../../api/use-update-bulk-kpi-evaluations";
import { useCallback, useMemo } from "react";
import { KpiEvaluationTable } from "../components/kpi-evaluation-table";
import { getTotalWithWeight } from "../../util";
import { UserProfile } from "@/modules/auth/ui/components/user-profile";
import { RowData } from "@/components/row-data";
import { KpiSummaryTable } from "../components/kpi-summary-table";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { SelectionBadge } from "@/components/selection-badge";
import { Banner } from "@/components/banner";
import { GoProject } from "react-icons/go";
import { periods } from "../../constants";

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

  const kpis = kpiForm.data.kpiForm.kpis;
  const hasChecker = kpiForm.permission.ctx.checkerId !== null;

  const form = useKpiEvaluationForm({ kpis, role });

  const permissions = useMemo(() => ({
    canPerformOwner: !canPerform.ownerCanWrite,
    canPerformChecker: !canPerform.checkerCanWrite,
    canPerformApprover: !canPerform.approverCanWrite,
  }), [canPerform.ownerCanWrite, canPerform.checkerCanWrite, canPerform.approverCanWrite]);

  const columns = useMemo(() => {
    return createColumns({
      form,
      hasChecker,
      permissions,
    });
  }, [form, hasChecker, permissions]);

  const table = useReactTable({
    data: kpiForm.data.kpiForm.kpis || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = useCallback((data: KpiBonusEvaluationsSchema) => {
    updateBulkKpiEvaluations({ evaluations: data.evaluations });
  }, [updateBulkKpiEvaluations]);

  const { watch } = form;
  const evaluations = watch("evaluations");

  return (
    <Form {...form}>
      <div className="w-full max-w-full self-center z-100 mb-5">
        <Accordion type="multiple" defaultValue={["header"]}>
          <AccordionItem value="header">
            <Banner
              trigger
              title="KPI Bonus"
              className="ps-16"
              description="Reward employees with performance-based bonuses tied to goals and business impact."
              icon={GoProject}
              context={<SelectionBadge label={periods["EVALUATION_1ST"]} />}
            />
            <AccordionContent>
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
                    <KpiSummaryTable form={form} kpis={kpis || []} />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
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
                hasChecker={hasChecker}
                totalAchievementOwnerWithWeight={getTotalWithWeight(evaluations, kpis!, "achievementOwner")}
                totalAchievementCheckerWithWeight={getTotalWithWeight(evaluations, kpis!, "achievementChecker")}
                totalAchievementApproverWithWeight={getTotalWithWeight(evaluations, kpis!, "achievementApprover")}
                isApprovalStatus={APPROVAL_STATUSES.includes(kpiForm.data.status) && canPerform.canSubmit}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}