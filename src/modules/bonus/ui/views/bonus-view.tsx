"use client";

import { toast } from "sonner";
import { useState } from "react";
import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { BsFillPersonFill } from "react-icons/bs";
import { formatDistanceToNowStrict } from "date-fns";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { convertAmountFromUnit, getBannerMessage } from "@/lib/utils";

import { STATUS_RECORD } from "@/types/kpi";

import { useTRPC } from "@/trpc/client";
import { useUploadStore } from "@/store/use-upload-modal-store";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import {
  Main,
  MainContent
} from "@/components/main";
import { Hint } from "@/components/hint";
import { Banner } from "@/components/banner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toolbar } from "@/components/toolbar";
import { ColumnData } from "@/components/column-data";
import { StatusBadge } from "@/components/status-badge";
import { SelectionBadge } from "@/components/selection-badge";
import { SavingIndicator } from "@/components/saving-indicator";
import { WarnningBanner } from "@/components/warnning-banner";

import { KpiCard } from "@/modules/bonus/ui/components/kpi-card";
import { UserProfile } from "@/modules/auth/ui/components/user-profile";
import { StartWorkflowButton } from "@/modules/tasks/ui/components/start-workflow-button";
import { ApprovalConfirmation } from "@/modules/tasks/ui/components/approval-confirmation";

import { useBonusModalStore } from "@/modules/bonus/store/use-bonus-modal-store";

import { validateWeight } from "@/modules/bonus/util";
import { canPerform, Role } from "@/modules/bonus/permission";

interface Props {
  id: string;
}

export const BonusView = ({
  id,
}: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { openModal } = useUploadStore();
  const { onOpen } = useBonusModalStore();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const [error, setError] = useState("");

  const { data: kpiBonus } = useSuspenseQuery(trpc.kpiBonus.getById.queryOptions({ id }));

  const confirmForm = useMutation(trpc.task.confirmation.mutationOptions());
  const startWorkflow = useMutation(trpc.task.startWorkflow.mutationOptions());

  const status = STATUS_RECORD[kpiBonus.data.task.status];
  const perform = canPerform(
    kpiBonus.permission.role as Role,
    ["approve", "reject"],
    kpiBonus.permission.ctx?.status
  );

  const revision = canPerform(
    kpiBonus.permission.role as Role,
    ["submit"],
    kpiBonus.permission.ctx?.status
  );

  const totalWeight = convertAmountFromUnit(kpiBonus.data.kpis.reduce((acc, kpi) => acc + kpi.weight, 0), 2);

  const maxAllowedWeight = validateWeight(kpiBonus.data.task.preparer.rank);

  const progressValue = Math.min((totalWeight / maxAllowedWeight) * 100, 100);

  const onWorkflow = () => {
    setError("");

    if (totalWeight !== maxAllowedWeight) {
      setError(`Total weight (${totalWeight}%) equal allowed for ${kpiBonus.data.task.preparer.rank} position (${maxAllowedWeight}%)`);
      return;
    }

    toast.loading("Starting workflow", { id: "start-workflow" });

    startWorkflow.mutate({
      id: kpiBonus.data.taskId,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id }));
        toast.success("Worflow started!", { id: "start-workflow" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "start-workflow" });
      },
    });
  }

  const onApproval = (confirm: boolean) => {
    toast.loading("confirming workflow", { id: "confirm-workflow" });

    confirmForm.mutate({
      id: kpiBonus.data.taskId,
      confirm,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id }));
        toast.success("Worflow sent!", { id: "confirm-workflow" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "confirm-workflow" });
      },
    });
  }

  return (
    <>
      <Header paths={paths}
        nameMap={{
          [id]: String(kpiBonus.data.year)
        }}
        iconMap={{
          [id]: GoProject
        }}
        disabledPaths={["bonus"]}
      >
        {kpiBonus.data.updatedAt && (
          <SavingIndicator label={`Edited ${formatDistanceToNowStrict(kpiBonus.data.updatedAt, { addSuffix: true })}`} />
        )}
        <StatusBadge {...status} />
        <StartWorkflowButton
          perform={perform || revision}
          onWorkflow={onWorkflow}
          title="Start Evaluation KPI Bonus"
        />
      </Header>
      <WarnningBanner
        message={getBannerMessage(error, kpiBonus.data.task.status)}
        variant="danger"
      />
      <Main>
        <MainContent>
          <Banner
            title="KPI Bonus"
            description="Reward employees with performance-based bonuses tied to goals and business impact."
            icon={GoProject}
          />
        </MainContent>
        <MainContent>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] w-full gap-y-2 gap-x-1">
            <ColumnData icon={BsFillPersonFill} header="Owner">
              <UserProfile employee={kpiBonus.data.task.preparer} />
            </ColumnData>
            {kpiBonus.data.task.checker && (
              <ColumnData icon={BsFillPersonFill} header="Checker">
                <UserProfile employee={kpiBonus.data.task.checker} />
              </ColumnData>
            )}
            <ColumnData icon={BsFillPersonFill} header="Approver">
              <UserProfile employee={kpiBonus.data.task.approver} />
            </ColumnData>
          </div>
        </MainContent>
        <MainContent className="sticky top-0 z-86 bg-background">
          <Toolbar
            perform={perform || revision}
            onCreate={() => onOpen("create")}
            onUpload={() => openModal("kpi", kpiBonus.data.id)}
            context={
              <div className="flex flex-row items-center gap-x-2 gap-y-1.5">
                <SelectionBadge label="Weight" />
                <span className="text-sm text-primary">
                  {totalWeight.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </span>
                <Hint label={`${totalWeight} / ${maxAllowedWeight}`}>
                  <Progress
                    className="h-1 w-40"
                    value={progressValue}
                  />
                </Hint>
                <Separator orientation="vertical" className="!h-4 mx-1" />
                <SelectionBadge label="Total KPIs" />
                <span className="text-sm text-primary">
                  {kpiBonus.data.kpis.length}
                </span>
              </div>
            }
          />
        </MainContent>
        <MainContent>
          <div className="flex flex-col gap-8">
            {kpiBonus.data.kpis.map((kpi, idx) => (
              <KpiCard
                key={idx}
                kpi={kpi}
                canPerform={perform || revision}
              />
            ))}
          </div>
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