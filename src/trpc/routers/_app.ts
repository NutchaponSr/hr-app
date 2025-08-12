import { createTRPCRouter } from "@/trpc/init";

import { bonusProcedure } from "@/modules/bonus/server/procedure";

export const appRouter = createTRPCRouter({
  kpiBonus: bonusProcedure,
});

export type AppRouter = typeof appRouter;