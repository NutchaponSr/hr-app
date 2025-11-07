"use client";

import { toast } from "sonner";
import { useMemo } from "react";
import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";

import { convertAmountFromUnit } from "@/lib/utils";

import { Period } from "@/generated/prisma";
import { STATUS_RECORD } from "@/types/kpi";

import { useSave } from "@/hooks/use-save";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StatusBadge } from "@/components/status-badge";
import { SavingIndicator } from "@/components/saving-indicator";

import { StartWorkflowButton } from "@/modules/tasks/ui/components/start-workflow-button";

import { useGetKpiForm } from "@/modules/bonus/api/use-get-kpi-form";
import { useStartWorkflowKpi } from "@/modules/tasks/api/use-start-workflow-kpi";

import { validateWeight } from "@/modules/bonus/util";
import { canPerformMany, Role } from "@/modules/bonus/permission";
import { ApprovalConfirmation } from "@/modules/tasks/ui/components/approval-confirmation";
import { useApprovalKpi } from "@/modules/tasks/api/use-approval-kpi";
import { BonusDraftScreen } from "../screens/bonus-draft-screen";
import { BonusEvaluationScreen } from "../screens/bonus-evaluation-screen";
import { Banner } from "@/components/banner";
import { periods } from "../../constants";
import { SelectionBadge } from "@/components/selection-badge";

interface Props {
  id: string;
  period: Period;
}

export const BonusView = ({
  id,
  period,
}: Props) => {
  const pathname = usePathname();

  const { save } = useSave();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const kpiForm = useGetKpiForm(id, period);
  const { mutation: startWorkflow } = useStartWorkflowKpi(id);
  const { mutation: approval, opt: approvalOption } = useApprovalKpi(id);

  const status = STATUS_RECORD[kpiForm.data.status];
  
  const permissions = canPerformMany(
    kpiForm.permission.role as Role,
    ["approve", "reject", "submit", "write", "worflow", "read:own"],
    kpiForm.permission.ctx?.status
  );

  const maxAllowedWeight = useMemo(
    () => validateWeight(kpiForm.data.preparer.rank),
    [kpiForm.data.preparer.rank]
  );

  const totalWeight = convertAmountFromUnit(kpiForm.data.kpiForm.kpis?.reduce((acc, kpi) => acc + kpi.weight, 0) || 0, 2);

  return (
    <>
      <Header 
        paths={paths}
        disabledPaths={["bonus"]}
        nameMap={{
          [id]: String(kpiForm.data.kpiForm.year)
        }}
        iconMap={{
          [id]: GoProject
        }}
      >
        {kpiForm.data.kpiForm.updatedAt && (
          <SavingIndicator label={`Edited ${formatDistanceToNowStrict(kpiForm.data.kpiForm.updatedAt, { addSuffix: true })}`} />
        )}
        <StatusBadge {...status} />
        <StartWorkflowButton
          perform={permissions.worflow}
          onWorkflow={() => {
            if (totalWeight !== maxAllowedWeight) {
              toast.error(`Total weight (${totalWeight}%) equal allowed for ${kpiForm.data.preparer.rank} position (${maxAllowedWeight}%)`);
              return;
            }

            startWorkflow({ id: kpiForm.data.id });
          }}
          title="Start Evaluation KPI Bonus"
        />
      </Header>
      <main className="grow-0 shrink flex flex-col bg-background h-[calc(-44px+100vh)] max-h-full relative w-full">
        <div className="relative overflow-y-auto me-0 mb-0">
          <Banner
            title="KPI Bonus"
            className="px-16"
            description="Reward employees with performance-based bonuses tied to goals and business impact."
            icon={GoProject}
            context={<SelectionBadge label={periods[period]} />}
          />
          {period === Period.IN_DRAFT ? (
            <BonusDraftScreen 
              id={id} 
              kpiForm={kpiForm} 
              canPerform={{
                canWrite: permissions.write,
                canSubmit: permissions.submit,
              }}
            />
          ) : (
            <BonusEvaluationScreen 
              id={id}
              kpiForm={kpiForm}
              role={kpiForm.permission.role as Role}
              hasChecker={!!kpiForm.permission.ctx?.checkerId}
              canPerform={{
                ownerCanWrite: permissions.write && kpiForm.permission.role === "preparer",
                checkerCanWrite: permissions.write && kpiForm.permission.role === "checker",
                approverCanWrite: permissions.write && kpiForm.permission.role === "approver",
                canSubmit: permissions.submit,
                canReadOwner: permissions["read:own"],
              }}
            />
          )}
        </div>
      </main>

      {permissions.approve && (
        <Footer>
          <ApprovalConfirmation 
            isSaved={save}
            disabled={approvalOption.isPending}
            onClick={(confirm) => {
              if (totalWeight !== maxAllowedWeight) {
                toast.error(`Total weight (${totalWeight}%) equal allowed for ${kpiForm.data.preparer.rank} position (${maxAllowedWeight}%)`);
                return;
              }

              approval({ id: kpiForm.data.id, confirm })}
            } 
          />
        </Footer>
      )}
    </>
  );
}