import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { usePeriod } from "@/hooks/use-period";

type RequestType = inferProcedureInput<AppRouter["comment"]["create"]>;

export const useCommentKpi = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { period } = usePeriod();

  const comment = useMutation(trpc.comment.create.mutationOptions());

  const mutation = (value: RequestType) => {

    comment.mutate({ ...value }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiBonus.getById.queryOptions({ id, period }),
        );

      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong");
      },
    });
  }

  return { mutation, isPending: comment.isPending };
}