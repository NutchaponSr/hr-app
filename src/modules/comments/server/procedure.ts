import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const commentProcedure = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({ 
        connectId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const res = await prisma.comment.findMany({
        where: {
          connectId: input.connectId,
        },
      });

      return res;
    }),
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        connectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await prisma.comment.create({
        data: {
          content: input.content,
          connectId: input.connectId,
          createdBy: ctx.user.employee.id,
        },
      });

      return res;
    })
})