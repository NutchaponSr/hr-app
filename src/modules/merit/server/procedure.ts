import path from "path";

import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { prisma } from "@/lib/prisma";

import { readCSV } from "@/seeds/utils/csv";
import { App, Period, Status } from "@/generated/prisma";

import { getUserRole, PermissionContext } from "@/modules/bonus/permission";
import { convertAmountToUnit } from "@/lib/utils";

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

export const meritProcedure = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const res = await prisma.meritForm.findFirst({
        where: {
          year: input.year,
          employeeId: ctx.user.employee.id,
        },
        include: {
          meritRecords: {
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
      })
    )
    .query(async ({ ctx, input }) => {
      const [record, years, kpiBonus] = await Promise.all([
        await prisma.meritRecord.findFirst({
          where: {
            period: Period.IN_DRAFT,
            meritForm: {
              year: input.year,
              employeeId: ctx.user.employee.id,
            },
          },
          include: {
            meritForm: {
              include: {
                competencyRecords: {
                  include: {
                    competency: true,
                  },
                  orderBy: {
                    id: "asc",
                  },
                },
                cultureRecords: {
                  include: {
                    culture: true,
                  },
                },
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
                  },
                },
                preparer: true,
                checker: true,
                approver: true,
              },
            },
          },
        }),
        await prisma.meritForm.findMany({
          select: {
            year: true,
          },
          where: {
            employeeId: ctx.user.employee.id,
          },
        }),
        await prisma.kpiForm.findFirst({
          where: {
            employeeId: ctx.user.employee.id,
            year: input.year,
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
        data: {
          ...record,
          competencies: record?.meritForm.competencyRecords.map((c, idx) => ({
            ...c,
            number: idx + 1,
            order: (idx + 1) * 100
          })),
          cultures: record?.meritForm.cultureRecords.map((c, idx) => {
            const cultureRecordsLength = record.meritForm.cultureRecords.length || 0;
            const weight = cultureRecordsLength > 0
              ? (30 / cultureRecordsLength) * 100
              : 0;

            return {
              ...c,
              number: idx + 1,
              order: (idx + 1) * 100,
              weight
            };
          }),
        },
        permission: {
          ctx: permissionContext,
          role: permissionContext ? getUserRole(permissionContext) : null,
        },
        hasKpiBonus: !!kpiBonus,
      }
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const res = await prisma.task.findUnique({
        where: {
          id: input.id,
        },
        include: {
          meritRecord: {
            include: {
              meritForm: {
                include: {
                  competencyRecords: {
                    include: {
                      competency: true,
                    },
                    orderBy: {
                      id: "asc",
                    },
                  },
                  cultureRecords: {
                    include: {
                      culture: true,
                    },
                  },
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
          checker: true,
          approver: true,
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
        data: {
          ...res,
          competencies: res.meritRecord?.meritForm.competencyRecords.map((c, idx) => ({
            ...c,
            number: idx + 1,
            order: (idx + 1) * 100
          })),
          cultures: res.meritRecord?.meritForm.cultureRecords.map((c, idx) => {
            const cultureRecordsLength = res.meritRecord?.meritForm.cultureRecords.length || 0;
            const weight = cultureRecordsLength > 0
              ? (30 / cultureRecordsLength) * 100
              : 0;

            return {
              ...c,
              number: idx + 1,
              order: (idx + 1) * 100,
              weight
            };
          }),
        },
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

      const cultures = await prisma.culture.findMany({
        orderBy: {
          id: "asc",
        },
      });

      const res = await prisma.meritForm.create({
        data: {
          year: input.year,
          employeeId: ctx.user.employee.id,
          meritRecords: {
            create: {
              period: Period.IN_DRAFT,
              task: {
                create: {
                  type: App.MERIT,
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
          competencyRecords: {
            createMany: {
              data: Array.from({ length: 4 }, () => ({}))
            }
          },
          cultureRecords: {
            createMany: {
              data: cultures.map((cul) => ({
                cultureId: cul.id,
              })),
            },
          },
        },
      });

      return res;
    }),
  updateCompetency: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        competencyId: z.string().nullable().optional(),
        output: z.string().nullable().optional(),
        input: z.string().nullable().optional(),
        weight: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, competencyId, ...updateFields } = input;

      const fieldsToUpdate = Object.fromEntries(
        Object.entries(updateFields).filter(([, value]) => value !== undefined)
      );

      // Build the update data object
      const updateData: Record<string, unknown> = {
        ...fieldsToUpdate,
      };

      // Handle weight conversion
      if (fieldsToUpdate.weight !== undefined) {
        updateData.weight = fieldsToUpdate.weight !== null ? convertAmountToUnit(Number(fieldsToUpdate.weight), 2) : null;
      }

      // Handle competencyId separately
      if (competencyId !== undefined) {
        updateData.competencyId = competencyId;
      }

      const res = await prisma.competencyRecord.update({
        where: {
          id,
        },
        data: updateData,
      });

      // Update merit form timestamp separately
      await prisma.meritForm.update({
        where: {
          id: res.meritFormId,
        },
        data: {
          updatedAt: new Date(),
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

      const task = await prisma.task.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const res = await prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          status: task.checkedBy ? Status.PENDING_CHECKER : Status.PENDING_APPROVER,
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