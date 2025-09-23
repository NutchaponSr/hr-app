import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export const useGetKpiForm = (id: string) => {
  const trpc = useTRPC();

  const { data: kpiForm } = useSuspenseQuery(trpc.kpiBonus.getById.queryOptions({ id }));

  return kpiForm;
}