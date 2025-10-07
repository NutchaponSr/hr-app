import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { usePeriod } from "@/hooks/use-period";

export const useKpiBonusCreateBulk = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { period } = usePeriod();

  const mutation = useMutation(trpc.kpiBonus.createBulkKpi.mutationOptions());

  const invalidate = (id: string) => {
    queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id, period }));
  };

  return { mutation, invalidate };
};


