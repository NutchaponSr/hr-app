import { App, Status } from "@/generated/prisma";

export interface TaskWithInfo {
  info: {
    id: string;
    assignedBy: string;
    year: number;
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