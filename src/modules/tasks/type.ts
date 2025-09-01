import { App, Period, Status } from "@/generated/prisma";

export interface TaskWithInfo {
  info: {
    assignedBy: string;
    period?: Period;
    year?: number;
  };
  task: {
    id: string;
    type: App;
    status: Status;
    updatedAt: Date;
  };
}

export const tasks: Record<App, string> = {
  [App.BONUS]: "Bonus",
  [App.MERIT]: "Merit",
}