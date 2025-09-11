import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { CompetencyType } from "@/generated/prisma";

export const competencyProcedure = createTRPCRouter({
  getMany: protectedProcedure
    .query(async () => {
      const res = await prisma.competency.findMany();

      return res;
    })
});