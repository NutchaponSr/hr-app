"use client";

import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";

import { convertAmountFromUnit, getBannerMessage } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";
import { STATUS_RECORD } from "@/types/kpi";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StatusBadge } from "@/components/status-badge";
import { WarnningBanner } from "@/components/warnning-banner";
import { SavingIndicator } from "@/components/saving-indicator";

import { StartWorkflowButton } from "@/modules/tasks/ui/components/start-workflow-button";

import { MeritScreen } from "../screens/merit-screen";
import { useStartWorkflowMerit } from "@/modules/tasks/api/use-start-workflow-merit";
import { canPerformMany, Role } from "@/modules/bonus/permission";
import { useState } from "react";
import { useApprovalMerit } from "@/modules/tasks/api/use-approval-merit";
import { ApprovalConfirmation } from "@/modules/tasks/ui/components/approval-confirmation";

interface Props {
  id: string;
}

export const MeritView = ({ id }: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const [error, setError] = useState("");

  const { data: merit } = useSuspenseQuery(trpc.kpiMerit.getByFormId.queryOptions({ id }));
  const { mutation: startWorkflow } = useStartWorkflowMerit(id);
  const { mutation: approval, opt: approvalOption } = useApprovalMerit(id);

  const permissions = canPerformMany(
    merit.permission.role as Role,
    ["approve", "reject", "submit", "write", "worflow"],
    merit.permission.ctx?.status
  );

  const status = STATUS_RECORD[merit.data.status];

  const totalWeight = convertAmountFromUnit(merit.data.meritForm.competencyRecords?.reduce((acc, kpi) => acc + kpi.weight, 0) || 0, 2);

  return (
    <>
      <Header
        paths={paths}
        nameMap={{
          [id]: String(merit.data.meritForm?.year)
        }}
        iconMap={{
          [id]: GoProject
        }}
        disabledPaths={["merit"]}
      >
        {merit.data.meritForm?.updatedAt && (
          <SavingIndicator label={`Edited ${formatDistanceToNowStrict(merit.data.meritForm.updatedAt, { addSuffix: true })}`} />
        )}
        <StatusBadge {...status} />
        <StartWorkflowButton 
          perform={permissions.worflow}
          title="Start Workflow Merit"
          onWorkflow={() => {
            setError("");

            if (totalWeight !== 30) {
              setError("The total competencies weight must equal 30%");
              return;
            }

            startWorkflow({ id: merit.data.id });
          }}
        />
      </Header>
      <WarnningBanner
        message={getBannerMessage(error, merit.data.status)}
        variant="danger"
      />

      <MeritScreen 
        id={id} 
        merit={merit} 
        canPerform={{
          canWrite: permissions.write,
          canSubmit: permissions.submit,
        }}
      />

      {permissions.approve && (
        <Footer>
          <ApprovalConfirmation 
            disabled={approvalOption.isPending}
            onClick={(confirm) => {
              setError("");

              if (totalWeight !== 30) {
                setError("The total competencies weight must equal 30%");
                return;
              }

              approval({ id: merit.data.id, confirm });
            }} 
          />
        </Footer>
      )}
    </>
  );
}