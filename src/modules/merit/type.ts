import { 
  Comment, 
  Competency, 
  CompetencyEvaluation, 
  CompetencyRecord, 
  CompetencyType, 
  Culture, 
  CultureRecord, 
  Employee, 
  MeritForm, 
  Position, 
  Task 
} from "@/generated/prisma";

export interface CompetencyWithInfo extends CompetencyRecord {
  competency: Competency | null;
  comments: (Comment & {
    employee: Employee;
  })[];
  competencyEvaluations: CompetencyEvaluation[];
  label: string;
  type: CompetencyType[];
}

export interface CultureWithInfo extends CultureRecord {
  culture: Culture | null
  comments: (Comment & {
    employee: Employee;
  })[];
  weight: number;
}

export interface MeritFormWithInfo extends Task {
  meritForm: MeritForm & {
    competencyRecords: CompetencyWithInfo[];
  }
}

export const MANAGER_UP: Position[] = [
  Position.President, 
  Position.MD, 
  Position.VP,
  Position.GM,
  Position.AGM,
  Position.MGR,
  Position.SMGR
];

export const CHIEF_DOWN: Position[] = [
  Position.Chief,
  Position.Foreman,
  Position.Staff,
  Position.Worker,
  Position.Officer,
];