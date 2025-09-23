import { CompetencyType, Position } from "@/generated/prisma";

import { CHIEF_DOWN, MANAGER_UP, MeritFormWithInfo } from "@/modules/merit/type";

export function getAvailableCompetencyTypes(position: Position) {
  if (MANAGER_UP.includes(position)) {
    return [CompetencyType.MC, CompetencyType.FC];
  }

  if (CHIEF_DOWN.includes(position)) {
    return [CompetencyType.TC, CompetencyType.FC];
  }

  return [];
}