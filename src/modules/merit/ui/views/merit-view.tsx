"use client";

import { toast } from "sonner";
import { useState } from "react";
import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { BsFillPersonFill } from "react-icons/bs";
import { formatDistanceToNowStrict } from "date-fns";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { convertAmountFromUnit, getBannerMessage } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";
import { STATUS_RECORD } from "@/types/kpi";

import { Accordion } from "@/components/ui/accordion";

import { 
  Main, 
  MainContent
} from "@/components/main";
import { Banner } from "@/components/banner";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ColumnData } from "@/components/column-data";
import { StatusBadge } from "@/components/status-badge";
import { WarnningBanner } from "@/components/warnning-banner";
import { SavingIndicator } from "@/components/saving-indicator";

import { UserProfile } from "@/modules/auth/ui/components/user-profile";
import { CultureSection } from "@/modules/merit/ui/components/culture-section";
import { CompetencySection } from "@/modules/merit/ui/components/competency-section";
import { StartWorkflowButton } from "@/modules/tasks/ui/components/start-workflow-button";

import { canPerform, Role } from "@/modules/bonus/permission";
import { ApprovalConfirmation } from "@/modules/tasks/ui/components/approval-confirmation";

interface Props {
  id: string;
}

export const MeritView = ({ id }: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const [error, setError] = useState("");

  const { data: merit } = useSuspenseQuery(trpc.kpiMerit.getById.queryOptions({ id }));

  const confirmForm = useMutation(trpc.task.confirmation.mutationOptions());
  const startWorkflow = useMutation(trpc.task.startWorkflow.mutationOptions());

  const status = STATUS_RECORD[merit.data.task.status];

  const totalCompetenciesWeight = convertAmountFromUnit(merit.data.competencyRecords.reduce((acc, kpi) => acc + kpi.weight, 0), 2);

  const perform = canPerform(
    merit.permission.role as Role,
    ["approve", "reject"],
    merit.permission.ctx?.status
  );

  const revision = canPerform(
    merit.permission.role as Role,
    ["submit"],
    merit.permission.ctx?.status
  );

  const onWorkflow = () => {
    setError("");

    if (totalCompetenciesWeight !== 30) {
      setError("The total competencies weight must equal 30%");
      return;
    }

    toast.loading("Starting workflow...", { id: "start-workflow" });

    startWorkflow.mutate({
      id: merit.data.taskId,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getById.queryOptions({ id }));
        toast.success("Worflow started!", { id: "start-workflow" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "start-workflow" });
      },
    })
  }

  const onApproval = (confirm: boolean) => {
    toast.loading("confirming workflow", { id: "confirm-workflow" });

    confirmForm.mutate({
      id: merit.data.taskId,
      confirm,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getById.queryOptions({ id }));
        toast.success("Worflow sent!", { id: "confirm-workflow" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "confirm-workflow" });
      },
    });
  }

  return (
    <>
      <Header
        paths={paths}
        nameMap={{
          [id]: String(merit.data.year)
        }}
        iconMap={{
          [id]: GoProject
        }}
        disabledPaths={['merit']}
      >
        {merit.data.updatedAt && (
          <SavingIndicator label={`Edited ${formatDistanceToNowStrict(merit.data.updatedAt, { addSuffix: true })}`} />
        )}
        <StatusBadge {...status} />
        <StartWorkflowButton 
          perform={revision}
          title="Start Workflow Merit"
          onWorkflow={onWorkflow}
        />
      </Header>
      <WarnningBanner
        message={getBannerMessage(error, merit.data.task.status)}
        variant="danger"
      />
      <Main>
        <MainContent>
          <Banner
            title="Merit"
            description="Evaluate employee achievements and align merit increases with performance outcomes."
            icon={GoProject}
          />
        </MainContent>   
        <MainContent>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] w-full gap-y-2 gap-x-1">
            <ColumnData icon={BsFillPersonFill} header="Owner">
              <UserProfile employee={merit.data.task.preparer} />
            </ColumnData>
            {merit.data.task.checker && (
              <ColumnData icon={BsFillPersonFill} header="Checker">
                <UserProfile employee={merit.data.task.checker} />
              </ColumnData>
            )}
            <ColumnData icon={BsFillPersonFill} header="Approver">
              <UserProfile employee={merit.data.task.approver} />
            </ColumnData>
          </div>
        </MainContent>   
        <MainContent>
          <Accordion type="multiple" defaultValue={["competency", "culture"]}>
            <CompetencySection perform={perform || revision} competencyRecords={merit.data.competencyRecords} />
            <CultureSection perform={perform || revision} cultureRecord={merit.data.cultureRecords} />
          </Accordion>
        </MainContent>  
      </Main>
      {perform && (
        <Footer>
          <ApprovalConfirmation 
            disabled={confirmForm.isPending}
            onClick={onApproval}
          />
        </Footer>
      )}
    </>
  );
}