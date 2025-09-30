"use client";

import { useState } from "react";
import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";

import { convertAmountFromUnit, getBannerMessage } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";
import { STATUS_RECORD } from "@/types/kpi";

import { Period } from "@/generated/prisma";

import { Banner } from "@/components/banner";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StatusBadge } from "@/components/status-badge";
import { WarnningBanner } from "@/components/warnning-banner";
import { SelectionBadge } from "@/components/selection-badge";
import { SavingIndicator } from "@/components/saving-indicator";

import { MeritScreen } from "@/modules/merit/ui/screens/merit-screen";
import { StartWorkflowButton } from "@/modules/tasks/ui/components/start-workflow-button";
import { ApprovalConfirmation } from "@/modules/tasks/ui/components/approval-confirmation";

import { useApprovalMerit } from "@/modules/tasks/api/use-approval-merit";
import { useStartWorkflowMerit } from "@/modules/tasks/api/use-start-workflow-merit";

import { periods } from "@/modules/bonus/constants";
import { canPerformMany, Role } from "@/modules/bonus/permission";

interface Props {
  id: string;
  period: Period;
}

export const MeritView = ({ id, period }: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();


  const paths: string[] = pathname.split("/").filter(Boolean);

  const [error, setError] = useState("");

  const query = trpc.kpiMerit.getByFormId.queryOptions({ id });

  const { data: merit } = useSuspenseQuery({
    ...query,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
  
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

      <main className="grow-0 shrink flex flex-col bg-background h-[calc(-44px+100vh)] max-h-full relative w-full">
        <div className="flex flex-col grow relative overflow-auto me-0 mb-0">
          <Banner
            title="Merit"
            className="ps-16"
            description="ตั้งแต่ระดับ ผู้ช่วยผู้จัดการทั่วไป ขึ้นไป (Evaluation Form of Asst. General Manager Above Level)"
            icon={GoProject}
            context={<SelectionBadge label={periods[period]} />}
          />

          <MeritScreen 
            id={id} 
            period={period}
            merit={merit} 
            canPerform={{
              canWrite: permissions.write,
              canSubmit: permissions.submit,
              ownerCanWrite: permissions.write && merit.permission.role === "preparer",
              checkerCanWrite: permissions.write && merit.permission.role === "checker",
              approverCanWrite: permissions.write && merit.permission.role === "approver",
            }}
          />
        </div>
      </main>
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