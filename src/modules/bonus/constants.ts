import { Project } from "@/generated/prisma";

export const projectTypes: Record<Project, string> = {
  [Project.IMPROVEMENT]: "Improvement",
  [Project.PROJECT]: "Project",
}