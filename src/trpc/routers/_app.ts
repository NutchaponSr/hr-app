import { createTRPCRouter } from "@/trpc/init";

import { taskProcedure } from "@/modules/tasks/server/procedure";
import { bonusProcedure } from "@/modules/bonus/server/procedure";
import { meritProcedure } from "@/modules/merit/server/procedure";
import { competencyProcedure } from "@/modules/competencies/server/procedure";

export const appRouter = createTRPCRouter({
  task: taskProcedure,
  kpiMerit: meritProcedure,
  kpiBonus: bonusProcedure,
  competency: competencyProcedure,
});

export type AppRouter = typeof appRouter;