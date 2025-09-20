"use client";

import { toast } from "sonner";
import { useState } from "react";
import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { convertAmountFromUnit, getBannerMessage } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";
import { STATUS_RECORD } from "@/types/kpi";

import { Header } from "@/components/header";
import { StatusBadge } from "@/components/status-badge";
import { WarnningBanner } from "@/components/warnning-banner";
import { SavingIndicator } from "@/components/saving-indicator";

import { StartWorkflowButton } from "@/modules/tasks/ui/components/start-workflow-button";

import { canPerform, Role } from "@/modules/bonus/permission";

interface Props {
  id: string;
}

export const MeritView = ({ id }: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const [error, setError] = useState("");

  const { data: merit } = useSuspenseQuery(trpc.kpiMerit.getByFormId.queryOptions({ id }));

  const confirmForm = useMutation(trpc.task.confirmation.mutationOptions());
  const startWorkflow = useMutation(trpc.task.startWorkflow.mutationOptions());

  const status = STATUS_RECORD[merit.data.status];

  const totalCompetenciesWeight = convertAmountFromUnit(
    merit.data.competencyRecords?.reduce((acc, kpi) => acc + kpi.weight, 0) ?? 0,
    2
  );

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
      id: merit.data.id,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getByFormId.queryOptions({ id }));
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
      id: merit.data.id,
      confirm,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getByFormId.queryOptions({ id }));
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
          [id]: String(merit.data.meritForm?.year)
        }}
        iconMap={{
          [id]: GoProject
        }}
        disabledPaths={['merit']}
      >
        {merit.data.meritForm?.updatedAt && (
          <SavingIndicator label={`Edited ${formatDistanceToNowStrict(merit.data.meritForm.updatedAt, { addSuffix: true })}`} />
        )}
        <StatusBadge {...status} />
        <StartWorkflowButton 
          perform={revision}
          title="Start Workflow Merit"
          onWorkflow={onWorkflow}
        />
      </Header>
      <WarnningBanner
        message={getBannerMessage(error, merit.data.status)}
        variant="danger"
      />
    </>
  );
}