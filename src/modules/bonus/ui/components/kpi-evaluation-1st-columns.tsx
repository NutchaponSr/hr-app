import { UseFormReturn } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";

import { FormGenerator } from "@/components/form-generator";

import { KpiBonusEvaluationsSchema } from "@/modules/bonus/schema";
import { KpiWithEvaluation } from "@/modules/bonus/types";
import { KpiInfoDisplay } from "./kpi-info-display";
import { EvaluationColumn } from "./evaluation-column";

interface Props {
  form: UseFormReturn<KpiBonusEvaluationsSchema>;
  permissions: {
    canPerformOwner: boolean;
    canPerformChecker: boolean;
    canPerformApprover: boolean;
  },
  hasChecker: boolean;
}

export const createColumns = ({ 
  form,
  permissions,
  hasChecker,
}: Props): ColumnDef<KpiWithEvaluation>[] => {
  const columns: ColumnDef<KpiWithEvaluation>[] = [
    {
      id: "kpi",
      header: "KPI Bonus",
      cell: ({ row }) => <KpiInfoDisplay kpi={row.original} />,
      meta: {
        width: hasChecker ? "w-[40%]" : "w-[50%]"
      },
    },
    {
      id: "owner",
      header: "Owner",
      cell: ({ row }) => (
        <EvaluationColumn
          form={form}
          rowIndex={row.index}
          role="Owner"
          weight={row.original.weight}
          disabled={permissions.canPerformOwner}
          evaluationId={row.original.kpiEvaluations[0]?.id}
          showAttachment={true}
        />
      ),
      meta: {
        width: hasChecker ? "w-[20%]" : "w-[25%]", // Adjust width based on hasChecker
      },
    },
  ];

  if (hasChecker) {
    columns.push({
      id: "checker",
      header: "Checker",
      cell: ({ row }) => (
        <EvaluationColumn
          form={form}
          rowIndex={row.index}
          role="Checker"
          weight={row.original.weight}
          disabled={permissions.canPerformChecker}
        />
      ),
      meta: {
        width: "w-[20%]",
      },
    });
  }

  columns.push({
    id: "approver",
    header: "Approver",
    cell: ({ row }) => (
      <EvaluationColumn
        form={form}
        rowIndex={row.index}
        role="Approver"
        weight={row.original.weight}
        disabled={permissions.canPerformApprover}
      />
    ),
    meta: {
      width: hasChecker ? "w-[20%]" : "w-[25%]",
    },
  });

  // Add comment column
  columns.push({
    id: "comment",
  });

  return columns;
}