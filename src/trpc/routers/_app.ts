import { createTRPCRouter } from "@/trpc/init";

import { taskProcedure } from "@/modules/tasks/server/procedure";
import { bonusProcedure } from "@/modules/bonus/server/procedure";
import { meritProcedure } from "@/modules/merit/server/procedure";
import { commentProcedure } from "@/modules/comments/server/procedure";
import { competencyProcedure } from "@/modules/competencies/server/procedure";
import { performanceProcedure } from "@/modules/performance/server/procedure";

export const appRouter = createTRPCRouter({
  task: taskProcedure,
  comment: commentProcedure,
  kpiBonus: bonusProcedure,
  kpiMerit: meritProcedure,
  competency: competencyProcedure,
  performance: performanceProcedure,
});

export type AppRouter = typeof appRouter;