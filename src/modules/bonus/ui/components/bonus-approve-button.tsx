"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConfirm } from "@/hooks/use-confirm";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { useKpiFormId } from "@/modules/bonus/hooks/use-kpi-form-id";
import { toast } from "sonner";

interface Props {
  taskId: string;
  canElevate: boolean;
}

export const ApproveButton = ({ taskId, canElevate }: Props) => {
  const trpc = useTRPC();
  const kpiFormId = useKpiFormId();
  const queryClient = useQueryClient();

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Start Evaluation KPI Bonus",
    confirmVariant: "primary"
  });
  
  const start = useMutation(trpc.kpiBonus.startEvaluation.mutationOptions());
  
  if (!canElevate) return null;

  const onClick = async () => {
    const ok = await confirm();
    
    if (ok) {
      toast.loading("Starting workflow...", { id: "start-workflow" });
      start.mutate({ id: taskId }, {
        onSuccess: () => {
          toast.success("Worflow started!", { id: "start-workflow" });
          queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id: kpiFormId }));
        },
        onError: (ctx) => {
          toast.error(ctx.message, { id: "start-workflow" });
        }
      });
    }
  }

  return (
    <>
      <ConfirmDialog />
      <Button size="sm" onClick={onClick}>
        Start Workflow
      </Button>
    </>
  );
}