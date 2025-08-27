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
          queryClient.invalidateQueries(trpc.kpiBonus.getInfo.queryOptions({ year }));
        },
      });
    }
  }

  return (
    <>
      <ConfirmDialog />
      <Button size="sm" onClick={onClick}>
        Start Elevation
      </Button>
    </>
  );
}