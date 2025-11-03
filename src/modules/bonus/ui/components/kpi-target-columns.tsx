import { CheckIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";

import { cn, convertAmountFromUnit } from "@/lib/utils";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { KpiWithEvaluation } from "@/modules/bonus/types";
import { KpiBonusEvaluationsSchema } from "@/modules/bonus/schema";

type TargetRow = {
  id: string;
  title: string;
  detail: string | null;
};

interface Props {
  form: UseFormReturn<KpiBonusEvaluationsSchema>;
  kpi: KpiWithEvaluation;
  hasChecker: boolean;
  permissions: {
    canPerformOwner: boolean;
    canPerformChecker: boolean;
    canPerformApprover: boolean;
  },
  index: number;
}

export const createColumns = ({ form, permissions, index, kpi, hasChecker }: Props): ColumnDef<TargetRow>[] => {
  const ownerValue = form.watch(`evaluations.${index}.achievementOwner`);
  const checkerValue = form.watch(`evaluations.${index}.achievementChecker`);
  const approverValue = form.watch(`evaluations.${index}.achievementApprover`);

  return [
    {
      id: "title",
      header: "Success Target Range",
      cell: ({ row }) => (
        <div className="text-sm text-primary">{row.original.title}</div>
      ),
      footer: "% Success Weight",
      meta: {
        width: "w-[10%]",
      },
    },
    {
      id: "detail",
      header: "Target Detail",
      cell: ({ row }) => (
        <div className="flex items-center justify-start">
          <div className="text-sm text-secondary whitespace-pre-wrap break-words">
            {row.original.detail}
          </div>
        </div>
      ),
      meta: {
        width: hasChecker ? "w-[60%]" : "w-[70%]",
      },
    },
    {
      id: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const valueStr = ownerValue == null ? undefined : String(ownerValue);
        return (
          <RadioGroup
            className="items-center"
            value={valueStr}
            disabled={!permissions.canPerformOwner}
            onValueChange={(v) =>
              form.setValue(
                `evaluations.${index}.achievementOwner`,
                v ? parseFloat(v) : null,
                { shouldDirty: true, shouldTouch: true, shouldValidate: true }
              )
            }
          >
            {(() => {
              const id = `owner-${index}-${row.original.id}`;
              const checked = valueStr === row.original.id;
              return (
                <div className="flex items-center justify-center">
                  <RadioGroupItem
                    id={id}
                    value={row.original.id}
                    aria-label={id}
                    className="sr-only"
                    disabled={!permissions.canPerformOwner}
                  />
                  <label
                    htmlFor={id}
                    className={cn(
                      "size-5 rounded-xs border-[1.25px] border-foreground grid place-items-center cursor-pointer bg-background",
                      checked && "bg-marine text-white border-marine",
                      !permissions.canPerformOwner && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <CheckIcon className={cn("size-4", checked ? "opacity-100" : "opacity-0")} />
                  </label>
                </div>
              );
            })()}
          </RadioGroup>
        );
      },
      footer: () => (
        <div className="flex items-center justify-end overflow-hidden whitespace-nowrap">
          <div className="flex items-center">
            <span className="font-medium text-tertiary text-[10px] uppercase tracking-[1px] me-1 select-none mt-px">
              Value
            </span>
            <span className="text-xs text-secondary">
              {Number(form.watch(`evaluations.${index}.achievementOwner`)) / 100 * convertAmountFromUnit(kpi.weight, 2)} %
            </span>
          </div>
        </div>
      ),
      meta: {
        width: "w-[10%]",
      },
    },
    ...(hasChecker
      ? [
          {
            id: "checker",
            header: "Checker",
            cell: ({ row }) => {
              const valueStr = checkerValue == null ? undefined : String(checkerValue);
              return (
                <RadioGroup
                  className="items-center"
                  value={valueStr}
                  disabled={!permissions.canPerformChecker}
                  onValueChange={(v) =>
                    form.setValue(
                      `evaluations.${index}.achievementChecker`,
                      v ? parseFloat(v) : null,
                      { shouldDirty: true, shouldTouch: true, shouldValidate: true }
                    )
                  }
                >
                  {(() => {
                    const id = `checker-${index}-${row.original.id}`;
                    const checked = valueStr === row.original.id;
                    return (
                      <div className="flex items-center justify-center">
                        <RadioGroupItem
                          id={id}
                          value={row.original.id}
                          aria-label={id}
                          className="sr-only"
                          disabled={!permissions.canPerformChecker}
                        />
                        <label
                          htmlFor={id}
                          className={cn(
                            "size-5 rounded-xs border-[1.25px] border-foreground grid place-items-center cursor-pointer bg-background",
                            checked && "bg-marine text-white border-marine",
                            !permissions.canPerformChecker && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <CheckIcon className={cn("size-4", checked ? "opacity-100" : "opacity-0")} />
                        </label>
                      </div>
                    );
                  })()}
                </RadioGroup>
              );
            },
            footer: () => (
              <div className="flex items-center justify-end overflow-hidden whitespace-nowrap">
                <div className="flex items-center">
                  <span className="font-medium text-tertiary text-[10px] uppercase tracking-[1px] me-1 select-none mt-px">
                    Value
                  </span>
                  <span className="text-xs text-secondary">
                    {Number(form.watch(`evaluations.${index}.achievementChecker`)) / 100 * convertAmountFromUnit(kpi.weight, 2)} %
                  </span>
                </div>
              </div>
            ),
            meta: {
              width: "w-[10%]",
            },
          } as ColumnDef<TargetRow>,
        ]
      : []),
    {
      id: "approver",
      header: "Approver",
      cell: ({ row }) => {
        const valueStr = approverValue == null ? undefined : String(approverValue);
        return (
          <RadioGroup
            className="items-center"
            value={valueStr}
            disabled={!permissions.canPerformApprover}
            onValueChange={(v) =>
              form.setValue(
                `evaluations.${index}.achievementApprover`,
                v ? parseFloat(v) : null,
                { shouldDirty: true, shouldTouch: true, shouldValidate: true }
              )
            }
          >
            {(() => {
              const id = `approver-${index}-${row.original.id}`;
              const checked = valueStr === row.original.id;
              return (
                <div className="flex items-center justify-center">
                  <RadioGroupItem
                    id={id}
                    value={row.original.id}
                    aria-label={id}
                    className="sr-only"
                    disabled={!permissions.canPerformApprover}
                  />
                  <label
                    htmlFor={id}
                    className={cn(
                      "size-5 rounded-xs border-[1.25px] border-foreground grid place-items-center cursor-pointer bg-background",
                      checked && "bg-marine text-white border-marine",
                      !permissions.canPerformApprover && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <CheckIcon className={cn("size-4", checked ? "opacity-100" : "opacity-0")} />
                  </label>
                </div>
              );
            })()}
          </RadioGroup>
        );
      },
      footer: () => (
        <div className="flex items-center justify-end overflow-hidden whitespace-nowrap">
          <div className="flex items-center">
            <span className="font-medium text-tertiary text-[10px] uppercase tracking-[1px] me-1 select-none mt-px">
              Value
            </span>
            <span className="text-xs text-secondary">
              {Number(form.watch(`evaluations.${index}.achievementApprover`)) / 100 * convertAmountFromUnit(kpi.weight, 2)} %
            </span>
          </div>
        </div>
      ),
      meta: {
        width: "w-[10%]",
      },
    },
  ];
}