import {
  Comment,
  Competency,
  CompetencyEvaluation,
  CompetencyRecord,
  CompetencyType,
  Culture,
  CultureEvaluation,
  CultureRecord,
  Employee,
  MeritForm,
  Position,
} from "@/generated/prisma";

export interface CompetencyWithInfo extends CompetencyRecord {
  competency: Competency | null;
  previousEvaluation: {
    owner: string | null | undefined;
    checker: string | null | undefined;
    approver: string | null | undefined;
  };
  comments: (Comment & {
    employee: Employee;
  })[];
  competencyEvaluations: CompetencyEvaluation[];
  label: string;
  type: CompetencyType[];
}

export interface CultureWithInfo extends CultureRecord {
  culture: Culture | null;
  cultureEvaluations: CultureEvaluation[];
  previousEvaluation: {
    owner: string | null | undefined;
    checker: string | null | undefined;
    approver: string | null | undefined;
  };
  comments: (Comment & {
    employee: Employee;
  })[];
  weight: number;
}

export interface MeritFormWithInfo extends MeritForm {
  competencyRecords: (CompetencyRecord & {
    competency: Competency | null;
    competencyEvaluations: CompetencyEvaluation[];
  })[];
  cultureRecords: (CultureRecord & {
    culture: Culture;
    cultureEvaluations: CultureEvaluation[];
  })[];
  employee: Employee;
}

export const MANAGER_UP: Position[] = [
  Position.President,
  Position.MD,
  Position.VP,
  Position.GM,
  Position.AGM,
  Position.MGR,
  Position.SMGR,
];

export const CHIEF_DOWN: Position[] = [
  Position.Chief,
  Position.Foreman,
  Position.Staff,
  Position.Worker,
  Position.Officer,
];

export const typeToName: Record<CompetencyType, string> = {
  [CompetencyType.MC]: "Managerial Competency",
  [CompetencyType.FC]: "Functional Competency",
  [CompetencyType.TC]: "Technical Competency",
  [CompetencyType.CC]: "Core Competency",
};
