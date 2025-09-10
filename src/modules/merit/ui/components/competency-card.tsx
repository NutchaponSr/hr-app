import { Competency, CompetencyRecord } from "@/generated/prisma";

import { Card } from "@/components/card";
import { CompetencyCardHeader } from "./competency-card-header";

interface Props {
  competency: CompetencyRecord & { competency: Competency | null };
}

export const CompetencyCard = ({ competency }: Props) => {
  return (
    <Card>
      <CompetencyCardHeader competency={competency} canPerform={true} />
      <h1 className="max-w-full w-full whitespace-break-spaces break-words text-primary text-2xl inline font-semibold leading-[100%]">
        Competency&apos;s Name
      </h1>
    </Card>
  );
}