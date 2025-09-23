import { BsTriangleFill } from "react-icons/bs";

import { Culture, CultureRecord, Employee, Comment as PrismaComment } from "@/generated/prisma";

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
import { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { MeritSchema } from "@/modules/merit/schema";
import { CultureTable } from "./culture-table";

interface Props {
  canPerform: boolean;
  form: UseFormReturn<MeritSchema>;
  fields: FieldArrayWithId<MeritSchema, "cultures", "fieldId">[];
  cultureRecord: (CultureRecord & {
    culture: Culture | null
    comments: (PrismaComment & {
      employee: Employee;
    })[];
    weight: number;
  })[];
}

export const CultureSection = ({ cultureRecord, ...props }: Props) => {
  const totalCompetenciesWeight = convertAmountFromUnit(
    cultureRecord.reduce((acc, kpi) => acc + (kpi.weight || 0), 0), 2
  );

  return (
    <AccordionItem value="culture">
      <div className="h-[42px] z-87 relative text-sm">
        <div className="flex items-center h-full pt-0 mb-2">
          <div className="flex items-center h-full overflow-hidden gap-1">
            <AccordionTrigger asChild>
              <Button variant="ghost" size="iconXs" className="group">
                <BsTriangleFill className="text-primary rotate-90 size-3 transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </AccordionTrigger>

            <h2 className="text-primary text-lg font-semibold">
              Culture
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
                value={(totalCompetenciesWeight / 30) * 100}
              />
            </Hint>
          </div>
        </div>
        <div className="relative mb-3 flex flex-col gap-8">
          <CultureTable {...props} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}