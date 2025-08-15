import { Project, Strategy } from "@/generated/prisma";

export const strategies: Record<Strategy, string> = {
  [Strategy.POEPLE_CAPABILITY]: "People Capability",
  [Strategy.POEPLE_CONTINUITY]: "People Continuity",
  [Strategy.POEPLE_EFFICIENCY]: "People Efficiency",
  [Strategy.OTHER]: "Other",
};

export const projectTypes: Record<Project, string> = {
  [Project.IMPROVEMENT]: "Improvement",
  [Project.PROJECT]: "Project",
}