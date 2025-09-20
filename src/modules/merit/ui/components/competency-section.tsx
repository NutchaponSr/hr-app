import { BsTriangleFill } from "react-icons/bs";

import { Competency, CompetencyRecord, Employee, Comment as PrismaComment } from "@/generated/prisma";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { SelectionBadge } from "@/components/selection-badge";
import { convertAmountFromUnit } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Progress } from "@/components/ui/progress";

interface Props {
  competencyRecords: (CompetencyRecord & {
    competency: Competency | null
    comments: (PrismaComment & {
      employee: Employee;
    })[];
  })[];
  perform: boolean;
}

export const CompetencySection = ({ competencyRecords, perform }: Props) => {
  const totalCompetenciesWeight = convertAmountFromUnit(
    competencyRecords.reduce((acc, kpi) => acc + kpi.weight, 0), 2
  );

  const progressValue = Math.min((totalCompetenciesWeight / 30) * 100, 100);

  return (
    <AccordionItem value="competency">
      <div className="h-[42px] z-87 relative text-sm">
        <div className="flex items-center h-full pt-0 mb-2">
          <div className="flex items-center h-full overflow-hidden gap-1">
            <AccordionTrigger asChild>
              <Button variant="ghost" size="iconXs" className="group">
                <BsTriangleFill className="text-primary rotate-90 size-3 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </AccordionTrigger>

            <h2 className="text-primary text-lg font-semibold">
              Competency
            </h2>
          </div>
        </div>
      </div>
      <AccordionContent>
        <div className="min-h-9 shrink-0 z-[100] top-0 sticky bg-background flex items-center mb-3">
          <div className="flex flex-row items-center gap-x-2 gap-y-1.5">
            <SelectionBadge label="Weight" />
            <span className="text-sm text-primary">
              {totalCompetenciesWeight.toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
            <Hint label={`${totalCompetenciesWeight} / 30`}>
              <Progress
                className="h-1 w-40"
                value={progressValue}
              />
            </Hint>
          </div>
        </div>
        <div className="relative mb-3 flex flex-col gap-8">
          {/* {competencyRecords.map((competency, idx) => (

          ))} */}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}