import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { CompetencyType } from "@/generated/prisma";

export const competencyProcedure = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum(CompetencyType),
      })
    )
    .query(async ({ input }) => {
      const res = await prisma.competency.findMany({
        where: {
          type: input.type,
        },
      });

      return res;
    })
});