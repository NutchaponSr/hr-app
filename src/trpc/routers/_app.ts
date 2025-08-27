import { createTRPCRouter } from "@/trpc/init";

import { bonusProcedure } from "@/modules/bonus/server/procedure";
import { meritProcedure } from "@/modules/merit/server/procedure";
import { competencyProcedure } from "@/modules/competencies/server/procedure";
import { taskProcedure } from "@/modules/tasks/server/procedure";

export const appRouter = createTRPCRouter({
  task: taskProcedure,
  kpiBonus: bonusProcedure,
  kpiMerit: meritProcedure,
  competency: competencyProcedure,
});

export type AppRouter = typeof appRouter;