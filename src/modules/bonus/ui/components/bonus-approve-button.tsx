"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useYear } from "@/hooks/use-year";
import { useConfirm } from "@/hooks/use-confirm";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

interface Props {
  id?: string;
  canElevate: boolean;
}

export const ApproveButton = ({ id, canElevate }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { year } = useYear();

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Start Evaluation KPI Bonus"
  });
  
  const start = useMutation(trpc.kpiBonus.startEvaluation.mutationOptions());
  
  if (!canElevate || !id) return null;

  const onClick = async () => {
    const ok = await confirm();
    
    if (ok) {
      start.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id }));
          queryClient.invalidateQueries(trpc.kpiBonus.getOne.queryOptions({ year }));
          queryClient.invalidateQueries(trpc.kpiBonus.getInfo.queryOptions({ year }));
        },
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