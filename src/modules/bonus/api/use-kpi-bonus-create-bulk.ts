import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export const useKpiBonusCreateBulk = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation(trpc.kpiBonus.createBulkKpi.mutationOptions());

  const invalidate = (year: number, id: string) => {
    queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id }));
  };

  return { mutation, invalidate };
};


