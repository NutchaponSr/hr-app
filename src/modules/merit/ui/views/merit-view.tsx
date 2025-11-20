"use client";

import { toast } from "sonner";
import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";

import { convertAmountFromUnit } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";
import { STATUS_RECORD } from "@/types/kpi";

import { Period } from "@/generated/prisma";

import { useSave } from "@/hooks/use-save";

import { Banner } from "@/components/banner";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StatusBadge } from "@/components/status-badge";
import { SelectionBadge } from "@/components/selection-badge";
import { SavingIndicator } from "@/components/saving-indicator";

import { MeritDraftScreen } from "@/modules/merit/ui/screens/merit-draft-screen";
import { StartWorkflowButton } from "@/modules/tasks/ui/components/start-workflow-button";
import { ApprovalConfirmation } from "@/modules/tasks/ui/components/approval-confirmation";
import { MeritEvaluationScreen } from "@/modules/merit/ui/screens/merit-evaluation-screen";

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

  const { save } = useSave();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const query = trpc.kpiMerit.getByFormId.queryOptions({ id, period });

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
    ["approve", "reject", "submit", "write", "worflow", "read:own"],
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
            if (!save) {
              toast.error("Please confirm the form data first");
              return;
            }

            if (totalWeight !== 30) {
              toast.error("The total competencies weight must equal 30%");
              return;
            }

            startWorkflow({ id: merit.data.id });
          }}
        />
      </Header>
      <main className="grow-0 shrink flex flex-col bg-background h-[calc(-44px+100vh)] max-h-full relative w-full">
        <div className="flex flex-col grow relative overflow-auto me-0 mb-0">
          <Banner
            title="Merit"
            className="px-16"
            description="Evaluate employees based on their performance and achievements."
            icon={GoProject}
            context={<SelectionBadge label={periods[period]} />}
          />
          {period === Period.IN_DRAFT ? (
            <MeritDraftScreen 
              id={id} 
              period={period} 
              merit={merit} 
              canPerform={{
                canWrite: permissions.write,
                canSubmit: permissions.submit,
              }}
            />
          ) : (
            <MeritEvaluationScreen 
              id={id} 
              period={period} 
              merit={merit} 
              hasChecker={!!merit.permission.ctx?.checkerId}
              canPerform={{
                canSubmit: permissions.submit,
                ownerCanWrite: permissions.write && merit.permission.role === "preparer",
                checkerCanWrite: permissions.write && merit.permission.role === "checker",
                approverCanWrite: permissions.write && merit.permission.role === "approver",
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
              if (totalWeight !== 30) {
                toast.error("The total competencies weight must equal 30%");
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