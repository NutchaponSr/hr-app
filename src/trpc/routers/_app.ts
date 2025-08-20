import { createTRPCRouter } from "@/trpc/init";

import { bonusProcedure } from "@/modules/bonus/server/procedure";
import { meritProcedure } from "@/modules/merit/server/procedure";
import { competencyProcedure } from "@/modules/competencies/server/procedure";

export const appRouter = createTRPCRouter({
  kpiBonus: bonusProcedure,
  kpiMerit: meritProcedure,
  competency: competencyProcedure,
});

export type AppRouter = typeof appRouter;