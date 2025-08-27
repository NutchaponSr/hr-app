import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  role: string;
}

export const BonusApprovalConfirmation = ({ id, role }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const approveChecker = useMutation(trpc.kpiBonus.approveChecker.mutationOptions());
  const declineChecker = useMutation(trpc.kpiBonus.declineChecker.mutationOptions());
  const approveApprover = useMutation(trpc.kpiBonus.approveApprover.mutationOptions());
  const declineApprover = useMutation(trpc.kpiBonus.declineApprover.mutationOptions());

  const onApprove = () => {
    if (role === "checker") {
      approveChecker.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id }));
        },
      });
    } else {
      approveApprover.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id }));
        },
      });
    }
  }

  const onDecline = () => {
    if (role === "checker") {
      declineChecker.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id }));
        },
      });
    } else {
      declineApprover.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id }));
        },
      });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="h-5.5 flex items-center relative">
        <h4 className="text-xs text-foreground leading-4 whitespace-nowrap text-ellipsis overflow-hidden font-medium ps-2">
          KPI Bonus confirmation
        </h4>
      </div>
      <div className="flex flex-row gap-2">
        <Button variant="secondary" className="rounded-full" onClick={onApprove}>
          Approve
        </Button>
        <Button variant="secondary" className="rounded-full" onClick={onDecline}>
          Decline
        </Button>
      </div>
    </div>
  );
}