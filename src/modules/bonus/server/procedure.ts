import path from "path";

import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { convertAmountToUnit, findKeyByValue } from "@/lib/utils";

import { readCSV } from "@/seeds/utils/csv";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { App, Period, Status } from "@/generated/prisma";

import { projectTypes } from "../constants";
import { getUserRole, PermissionContext } from "../permission";

interface ApprovalCSVProps {
  order: string;
  employeeId: string;
  employeeName: string;
  employeePositionLevel: string;
  checkerEMPID?: string;
  checkerName?: string;
  checkerPositionLevel?: string;
  approverEMPID: string;
  approverName: string;
  approverPositionLevel: string;
}

export const bonusProcedure = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await prisma.kpiForm.findFirst({
        where: {
          year: input.year,
          employeeId: ctx.user.employee.id,
        },
        include: {
          kpiRecords: {
            include: {
              task: true,
            },
          },
        },
      });

      return res;
    }),
  getInfo: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [record, years] = await Promise.all([
        await prisma.kpiRecord.findFirst({
          where: {
            AND: [
              {
                period: Period.IN_DRAFT,
              },
              {
                kpiForm: {
                  year: input.year,
                  employeeId: ctx.user.employee.id,
                },
              },
            ],
          },
          include: {
            kpiForm: {
              include: {
                kpis: true,
              },
            },
            task: {
              include: {
                comments: {
                  orderBy: {
                    createdAt: "desc",
                  },
                  include: {
                    employee: true,
                  }
                }
              }
            },
          }
        }),
        await prisma.kpiForm.findMany({
          select: {
            year: true,
          },
          where: {
            employeeId: ctx.user.employee.id,
          },
        }),
      ]);

      let permissionContext: PermissionContext | null = null;

      if (record) {
        permissionContext = {
          currentEmployeeId: ctx.user.employee.id,
          documentOwnerId: record.task.preparedBy,
          checkerId: record.task.checkedBy || undefined,
          approverId: record.task.approvedBy,
          status: record.task.status,
        };
      }

      return {
        years: years.map((f) => f.year),
        data: record,
        permission: {
          ctx: permissionContext,
          role: permissionContext ? getUserRole(permissionContext) : null,
        },
      };
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await prisma.task.findUnique({
        where: {
          id: input.id,
        },
        include: {
          kpiRecord: {
            include: {
              kpiForm: {
                include: {
                  kpis: true,
                },
              },
            },
          },
          comments: {
            include: {
              employee: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          preparer: true,
        },
      });

      if (!res) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      let permissionContext: PermissionContext | null = null;

      if (res) {
        permissionContext = {
          currentEmployeeId: ctx.user.employee.id,
          documentOwnerId: res.preparedBy,
          checkerId: res.checkedBy || undefined,
          approverId: res.approvedBy,
          status: res.status,
        };
      }

      return {
        data: res,
        permission: {
          ctx: permissionContext,
          role: permissionContext ? getUserRole(permissionContext) : null,
        },
      };
    }),
  createForm: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const approvalFile = path.join(process.cwd(), "src/data", "approval.csv");
      const approvalRecords = readCSV<ApprovalCSVProps>(approvalFile);

      const taregetApproval = approvalRecords.find((f) => f.employeeId === ctx.user.employee.id);

      if (!taregetApproval) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const res = await prisma.kpiForm.create({
        data: {
          year: input.year,
          employeeId: ctx.user.employee.id,
          kpiRecords: {
            create: {
              period: Period.IN_DRAFT,
              task: {
                create: {
                  type: App.BONUS,
                  status: Status.IN_DRAFT,
                  preparedBy: ctx.user.employee.id,
                  approvedBy: taregetApproval.approverEMPID,
                  ...(taregetApproval.checkerEMPID && {
                    checkedBy: taregetApproval.checkerEMPID,
                  }),
                },
              },
            },
          },
        },
      });

      return res;
    }),
  createKpi: protectedProcedure
    .input(
      z.object({
        kpiFormId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await prisma.kpi.create({
        data: {
          kpiFormId: input.kpiFormId,
        },
      });

      await prisma.kpiForm.update({
        where: {
          id: input.kpiFormId,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      return res;
    }),
  updateKpi: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().nullable().optional(),
        weight: z.string().nullable().optional(),
        strategy: z.string().nullable().optional(),
        type: z.string().nullable().optional(),
        target100: z.string().nullable().optional(),
        target90: z.string().nullable().optional(),
        target80: z.string().nullable().optional(),
        target70: z.string().nullable().optional(),
        definition: z.string().nullable().optional(),
        objective: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input;

      const fieldsToUpdate = Object.fromEntries(
        Object.entries(updateFields).filter(([, value]) => value !== undefined)
      );

      const res = await prisma.kpi.update({
        where: { id },
        data: {
          ...fieldsToUpdate,
          ...(fieldsToUpdate.type !== undefined && {
            type: fieldsToUpdate.type ? findKeyByValue(projectTypes, String(fieldsToUpdate.type)) : null
          }),
          ...(fieldsToUpdate.weight !== undefined && {
            weight: fieldsToUpdate.weight !== null ? convertAmountToUnit(Number(fieldsToUpdate.weight), 2) : null
          }),
          kpiForm: {
            update: {
              updatedAt: new Date(),
            },
          },
        },
      });

      return res;
    }),
  startEvaluation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // TODO: Validate weight

      const res = await prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          status: Status.PENDING_CHECKER,
        },
      });

      return res;
    }),
  confirm: protectedProcedure
    .input(
      z.object({
        approve: z.boolean(),
        comment: z.string().optional(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await prisma.task.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const permissionContext: PermissionContext = {
        currentEmployeeId: ctx.user.employee.id,
        documentOwnerId: task.preparedBy,
        checkerId: task.checkedBy || undefined,
        approverId: task.approvedBy,
        status: task.status,
      };

      const role = getUserRole(permissionContext);

      if (role === "checker") {
        if (input.approve) {
          await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.PENDING_APPROVER,
              ...(input.comment && {
                comments: {
                  create: {
                    content: input.comment,
                    createdBy: ctx.user.employee.id,
                  },
                },
              }),
            },
          });
        } else {
          await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.REJECTED_BY_CHECKER,
              ...(input.comment && {
                comments: {
                  create: {
                    content: input.comment,
                    createdBy: ctx.user.employee.id,
                  },
                },
              }),
            },
          });
        }
      } else if (role === "approver") {
        if (input.approve) {
          await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.APPROVED,
              ...(input.comment && {
                comments: {
                  create: {
                    content: input.comment,
                    createdBy: ctx.user.employee.id,
                  },
                },
              }),
            },
          });
        } else {
          await prisma.task.update({
            where: {
              id: input.id,
            },
            data: {
              status: Status.REJECTED_BY_APPROVER,
              ...(input.comment && {
                comments: {
                  create: {
                    content: input.comment,
                    createdBy: ctx.user.employee.id,
                  },
                },
              }),
            },
          });
        }
      }

      return { success: true };
    })
});