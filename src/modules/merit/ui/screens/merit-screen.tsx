"use client";

import { inferProcedureOutput } from "@trpc/server";

import { Period } from "@/generated/prisma";
import { AppRouter } from "@/trpc/routers/_app";

import { MeritInDraftScreen } from "./merit-in-draft-screen";
import { MeritEvaluation1stScreen } from "./merit-evaluation-1st-screen";

interface Props {
  id: string;
  period: Period;
  merit: inferProcedureOutput<AppRouter["kpiMerit"]["getByFormId"]>;
  canPerform: {
    canWrite: boolean;
    canSubmit: boolean;
    ownerCanWrite: boolean;
    checkerCanWrite: boolean;
    approverCanWrite: boolean;
  };
}

export const MeritScreen = ({ period, ...props }: Props) => {
  switch (period) {
    case Period.IN_DRAFT: 
      return <MeritInDraftScreen {...props} />
    case Period.EVALUATION_1ST:
      return <MeritEvaluation1stScreen {...props} />
  }
}