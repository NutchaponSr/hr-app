"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.greeting.queryOptions({ name: "Pondpopza" }));

  return (
    <p>
      {data}
    </p>
  );
}