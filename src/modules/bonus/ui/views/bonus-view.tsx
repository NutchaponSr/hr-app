"use client";

import { useMemo, useState } from "react";
import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";

import { convertAmountFromUnit, getBannerMessage } from "@/lib/utils";

import { STATUS_RECORD } from "@/types/kpi";

import { Header } from "@/components/header";
import { StatusBadge } from "@/components/status-badge";
import { SavingIndicator } from "@/components/saving-indicator";
import { WarnningBanner } from "@/components/warnning-banner";

import { KpiBonusScreen } from "@/modules/bonus/ui/screens/kpi-bonus-screen";

import { StartWorkflowButton } from "@/modules/tasks/ui/components/start-workflow-button";

import { useGetKpiForm } from "@/modules/bonus/api/use-get-kpi-form";
import { useStartWorkflowKpi } from "@/modules/tasks/api/use-start-workflow-kpi";

import { validateWeight } from "@/modules/bonus/util";
import { canPerformMany, Role } from "@/modules/bonus/permission";
import { Footer } from "@/components/footer";
import { ApprovalConfirmation } from "@/modules/tasks/ui/components/approval-confirmation";
import { useApprovalKpi } from "@/modules/tasks/api/use-approval-kpi";
import { Period } from "@/generated/prisma";
import { Banner } from "@/components/banner";
import { SelectionBadge } from "@/components/selection-badge";
import { periods } from "../../constants";

interface Props {
  id: string;
  period: Period;
}

export const BonusView = ({
  id,
  period,
}: Props) => {
  const pathname = usePathname();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const [error, setError] = useState("");

  const kpiForm = useGetKpiForm(id);
  const { mutation: startWorkflow } = useStartWorkflowKpi(id);
  const { mutation: approval, opt: approvalOption } = useApprovalKpi(id);

  const status = STATUS_RECORD[kpiForm.data.status];
  
  const permissions = canPerformMany(
    kpiForm.permission.role as Role,
    ["approve", "reject", "submit", "write", "worflow"],
    kpiForm.permission.ctx?.status
  );

  const maxAllowedWeight = useMemo(
    () => validateWeight(kpiForm.data.preparer.rank),
    [kpiForm.data.preparer.rank]
  );

  const totalWeight = convertAmountFromUnit(kpiForm.data.kpiForm.kpis?.reduce((acc, kpi) => acc + kpi.weight, 0) || 0, 2);

  return (
    <>
      <Header paths={paths}
        nameMap={{
          [id]: String(kpiForm.data.kpiForm.year)
        }}
        iconMap={{
          [id]: GoProject
        }}
        disabledPaths={["bonus"]}
      >
        {kpiForm.data.kpiForm.updatedAt && (
          <SavingIndicator label={`Edited ${formatDistanceToNowStrict(kpiForm.data.kpiForm.updatedAt, { addSuffix: true })}`} />
        )}
        <StatusBadge {...status} />
        <StartWorkflowButton
          perform={permissions.worflow}
          onWorkflow={() => {
            setError("");

            if (totalWeight !== maxAllowedWeight) {
              setError(`Total weight (${totalWeight}%) equal allowed for ${kpiForm.data.preparer.rank} position (${maxAllowedWeight}%)`);
              return;
            }

            startWorkflow({ id: kpiForm.data.id });
          }}
          title="Start Evaluation KPI Bonus"
        />
      </Header>
      <WarnningBanner
        message={getBannerMessage(error, kpiForm.data.status)}
        variant="danger"
      />

      <WarnningBanner
        message={`แบบประเมิน KPI Bonus ประจำปี ${kpiForm.data.kpiForm?.year} : ${kpiForm.data.preparer.fullName}`}
        variant="blue"
      />

      <main className="grow-0 shrink flex flex-col bg-background h-[calc(-44px+100vh)] max-h-full relative w-full">
        <div className="flex flex-col grow relative overflow-auto me-0 mb-0">
          <KpiBonusScreen   
            id={id} 
            period={period}
            kpiForm={kpiForm} 
            role={kpiForm.permission.role!}
            canPerform={{
              ownerCanWrite: permissions.write && kpiForm.permission.role === "preparer",
              checkerCanWrite: permissions.write && kpiForm.permission.role === "checker",
              approverCanWrite: permissions.write && kpiForm.permission.role === "approver",
              canSubmit: permissions.submit,
            }}
          />
        </div>
      </main>

      {permissions.approve && (
        <Footer>
          <ApprovalConfirmation 
            disabled={approvalOption.isPending}
            onClick={(confirm) => approval({ id: kpiForm.data.id, confirm })} 
          />
        </Footer>
      )}
    </>
  );
}