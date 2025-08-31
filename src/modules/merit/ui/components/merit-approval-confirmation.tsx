import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";
import { authClient } from "@/lib/auth-client";

interface Props {
  id: string;
}

export const MeritApprovalConfirmation = ({ id }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = authClient.useSession();

  const [comment, setComment] = useState("");

  const confirm = useMutation(trpc.kpiMerit.confirm.mutationOptions());

  const handleConfirmation = (approve: boolean) => {
    confirm.mutate({
      id,
      approve,
      comment,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getById.queryOptions({ id }));
        setComment("");
      },
    });
  };

  const isLoading = confirm.isPending;
  const userName = data?.user.name || "";

  return (
    <div className="flex flex-col gap-3 pe-24">
      <header className="h-5.5 flex items-center relative">
        <h4 className="text-xs text-foreground leading-4 whitespace-nowrap text-ellipsis overflow-hidden font-medium ps-2">
          KPI Bonus confirmation
        </h4>
      </header>

      <div className="w-full mx-auto flex items-center gap-12">
        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={() => handleConfirmation(true)}
            disabled={isLoading}
          >
            Approve
          </Button>
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={() => handleConfirmation(false)}
            disabled={isLoading}
          >
            Decline
          </Button>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center grow">
            <div className="shrink-0 me-2">
              <div className="rounded-full outline-[1.25px] outline-foreground -outline-offset-[1.25px]">
                <UserAvatar
                  name={userName}
                  className={{
                    container: "size-6",
                    fallback: "text-sm font-normal"
                  }}
                />
              </div>
            </div>
            <div className="flex w-full">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={isLoading}
                className="placeholder:text-foreground w-full text-sm text-primary focus-visible:outline-none disabled:opacity-50"
                aria-label="Comment for bonus approval"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}