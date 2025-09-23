import { toast } from "sonner";
import { inferProcedureInput } from "@trpc/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

type RequestType = inferProcedureInput<AppRouter["comment"]["create"]>;

export const useCommentMerit = (id: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const comment = useMutation(trpc.comment.create.mutationOptions());

  const mutation = (value: RequestType) => {

    comment.mutate({ ...value }, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.kpiMerit.getByFormId.queryOptions({ id }),
        );

      },
      onError: (ctx) => {
        toast.error(ctx.message || "Something went wrong");
      },
    });
  }

  return { mutation, isPending: comment.isPending };
}