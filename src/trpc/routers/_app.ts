import { createTRPCRouter } from "@/trpc/init";

import { taskProcedure } from "@/modules/tasks/server/procedure";
import { bonusProcedure } from "@/modules/bonus/server/procedure";
import { commentProcedure } from "@/modules/comments/server/procedure";
import { competencyProcedure } from "@/modules/competencies/server/procedure";

export const appRouter = createTRPCRouter({
  task: taskProcedure,
  comment: commentProcedure,
  kpiBonus: bonusProcedure,
  competency: competencyProcedure,
});

export type AppRouter = typeof appRouter;