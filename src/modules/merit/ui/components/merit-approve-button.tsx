"use client";

import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useYear } from "@/hooks/use-year";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  id?: string;
  canElevate: boolean;
}

export const MeritApproveButton = ({ id, canElevate }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { year } = useYear();

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Start Evaluation KPI Bonus"
  });
  
  
  const start = useMutation(trpc.kpiMerit.startEvaluation.mutationOptions());
  
  if (!canElevate || !id) return null;

  const onClick = async () => {
    const ok = await confirm();
    
    if (ok) {
      start.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.kpiMerit.getById.queryOptions({ id }));
          queryClient.invalidateQueries(trpc.kpiMerit.getOne.queryOptions({ year }));
          queryClient.invalidateQueries(trpc.kpiMerit.getInfo.queryOptions({ year }));
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