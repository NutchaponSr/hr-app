import { App } from "@/generated/prisma";
import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";


export type TaskWithInfo = inferProcedureOutput<AppRouter["task"]["getMany"]>[0]; 

export const tasks: Record<App, string> = {
  [App.BONUS]: "Bonus",
  [App.MERIT]: "Merit",
}