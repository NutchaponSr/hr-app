import { inferProcedureOutput } from "@trpc/server";

import { Period } from "@/generated/prisma";
import { AppRouter } from "@/trpc/routers/_app";

import { KpiBonusInDraftScreen } from "./kpi-bonus-in-draft-screen";
import { KpiBonusEvaluation1StScreen } from "./kpi-bonus-evaluation-1st-screen";
import { Role } from "../../permission";

interface Props {
  id: string;
  period: Period;
  kpiForm: inferProcedureOutput<AppRouter["kpiBonus"]["getById"]>;
  canPerform: {
    canSubmit: boolean;
    ownerCanWrite: boolean;
    checkerCanWrite: boolean;
    approverCanWrite: boolean;
  };
  role: Role;
}

export const KpiBonusScreen = ({ period, ...props }: Props) => {
  switch (period) {
    case Period.IN_DRAFT:
      return (
        <KpiBonusInDraftScreen
          id={props.id}
          kpiForm={props.kpiForm}
          canPerform={{
            canSubmit: props.canPerform.canSubmit,
            canWrite: props.canPerform.ownerCanWrite,
          }}
        />
      )
    case Period.EVALUATION_1ST:
      return (
        <KpiBonusEvaluation1StScreen {...props} />
      )
    case Period.EVALUATION_2ND:
      return (
        <KpiBonusEvaluation1StScreen {...props} />
      )
  }
}