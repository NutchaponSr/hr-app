import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { FormGenerator } from "@/components/form-generator";
import { KpiBonusEvaluationsSchema } from "../../schema";
import { AchievementSelect } from "./achievement-select";
import { KpiAttachButton } from "./kpi-attach-button";

interface EvaluationColumnProps {
  form: UseFormReturn<KpiBonusEvaluationsSchema>;
  rowIndex: number;
  role: "Owner" | "Checker" | "Approver";
  weight: number;
  disabled: boolean;
  evaluationId?: string;
  showAttachment?: boolean;
}

export const EvaluationColumn = ({ 
  form, 
  rowIndex, 
  role, 
  weight, 
  disabled, 
  evaluationId,
  showAttachment = false 
}: EvaluationColumnProps) => {
  const roleKey = role.toLowerCase() as "owner" | "checker" | "approver";
  const achievementField = `evaluations.${rowIndex}.achievement${role}` as const;
  const actualField = `evaluations.${rowIndex}.actual${role}` as const;
  const fileUrlField = `evaluations.${rowIndex}.fileUrl` as const;

  return (
    <div className="flex flex-col gap-2">
      <FormField
        control={form.control}
        name={achievementField}
        render={({ field }) => (
          <AchievementSelect
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
            weight={weight}
          />
        )}
      />
      <FormGenerator
        form={form}
        variant="text"
        label="Actual"
        name={actualField}
        disabled={disabled}
      />
      {showAttachment && (
        <>
          <div className="relative after:absolute after:border-border after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t text-xs text-secondary uppercase text-center">
            <span className="uppercase z-10 bg-background [[data-slot=table-row]:nth-child(even)_&]:bg-sidebar relative px-2">
              or attach with
            </span>
          </div>
          <FormField
            control={form.control}
            name={fileUrlField}
            render={({ field }) => (
              <FormItem className="grow w-full">
                <KpiAttachButton 
                  id={evaluationId || ""}
                  value={field.value as string | null} 
                  onChange={field.onChange} 
                  canPerform={disabled} 
                />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};