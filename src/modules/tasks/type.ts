import { App, Status } from "@/generated/prisma";
import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";


export type TaskWithInfo = inferProcedureOutput<AppRouter["task"]["getMany"]>[0]; 

export const tasks: Record<App, string> = {
  [App.BONUS]: "Bonus",
  [App.MERIT]: "Merit",
}

export const statuses: Record<Status, string> = {
  [Status.NOT_STARTED]: "Not Started",
  [Status.IN_DRAFT]: "In Draft",
  [Status.PENDING_CHECKER]: "Pending Checker",
  [Status.PENDING_APPROVER]: "Pending Approver",
  [Status.REJECTED_BY_CHECKER]: "Rejected by Checker",
  [Status.REJECTED_BY_APPROVER]: "Rejected by Approver",
  [Status.APPROVED]: "Approved",
}

export const isFormatEmail = ["sineenard.k@somboon.co.th", "weerawat.m@somboon.co.th", "daychapon.pro@somboon.co.th"];