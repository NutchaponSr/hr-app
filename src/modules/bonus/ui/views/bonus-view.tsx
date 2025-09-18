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
import { canPerform, canPerformMany, Role } from "@/modules/bonus/permission";

interface Props {
  id: string;
}

export const BonusView = ({
  id,
}: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const { data: kpiBonus } = useSuspenseQuery(trpc.kpiBonus.getByFormId.queryOptions({ formId: id }));
  const startWorkflow = useMutation(trpc.task.startWorkflow.mutationOptions());

  const status = STATUS_RECORD[kpiBonus.data.task.status];
  
  const permissions = canPerformMany(
    kpiBonus.permission.role as Role,
    ["approve", "reject", "submit"],
    kpiBonus.permission.ctx?.status
  );

  const canSubmit = permissions.submit;

  const onWorkflow = () => {
    // setError("");

    // if (totalWeight !== maxAllowedWeight) {
    //   setError(`Total weight (${totalWeight}%) equal allowed for ${kpiBonus.data.task.preparer.rank} position (${maxAllowedWeight}%)`);
    //   return;
    // }

    toast.loading("Starting workflow", { id: "start-workflow" });

    startWorkflow.mutate({
      id: kpiBonus.data.taskId,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiBonus.getByFormId.queryOptions({ formId: id }));
        toast.success("Worflow started!", { id: "start-workflow" });
      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong", { id: "start-workflow" });
      },
    });
  }

  return (
    <>
      <Header paths={paths}
        nameMap={{
          [id]: String(kpiBonus.data.kpiForm.year)
        }}
        iconMap={{
          [id]: GoProject
        }}
        disabledPaths={["bonus"]}
      >
        {kpiBonus.data.kpiForm.updatedAt && (
          <SavingIndicator label={`Edited ${formatDistanceToNowStrict(kpiBonus.data.kpiForm.updatedAt, { addSuffix: true })}`} />
        )}
        <StatusBadge {...status} />
        <StartWorkflowButton
          perform={canSubmit}
          onWorkflow={onWorkflow}
          title="Start Evaluation KPI Bonus"
        />
      </Header>
      <WarnningBanner
        message={getBannerMessage("", kpiBonus.data.task.status)}
        variant="danger"
      />
      
      <main className="grow-0 shrink flex flex-col bg-background h-[calc(-44px+100vh)] max-h-full relative w-full">
        
      </main>
    </>
  );
}