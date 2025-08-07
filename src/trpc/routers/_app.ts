import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const appRouter = createTRPCRouter({
  greeting: baseProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return `Hello ${input.name}`;
    })
});

export type AppRouter = typeof appRouter;