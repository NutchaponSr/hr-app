import { UseFormReturn } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";

import { CompetencyWithInfo } from "@/modules/merit/type";
import { MeritEvaluationSchema } from "@/modules/merit/schema";
import { competencyLevels, competencyTypes } from "../../constants";
import { convertAmountFromUnit } from "@/lib/utils";
import { FormGenerator } from "@/components/form-generator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Content } from "@/components/content";
import { PlanTargetCell } from "./plan-target-cell";
import { CardInfo } from "@/components/card-info";

interface Props {
  form: UseFormReturn<MeritEvaluationSchema>
  permissions: {
    canPerformOwner: boolean;
    canPerformChecker: boolean;
    canPerformApprover: boolean;
  },
  hasChecker: boolean;
}

export const createColumns = ({ hasChecker, form, permissions }: Props): ColumnDef<CompetencyWithInfo>[] => {
  const baseColumns: ColumnDef<CompetencyWithInfo>[] = [
    {
      id: "comptency",
      header: "Comptency",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <div className="self-center start-1.5 px-1 py-0.5 bg-[#006fc817] dark:bg-[#439bff3d] text-marine rounded text-[9px] uppercase tracking-wide leading-[1.3] font-medium whitespace-nowrap w-fit me-1.5">
                {competencyTypes[row.original.competency!.type]}
              </div>
            </div>
            <p className="text-sm text-primary">
              {row.original.competency?.name}
            </p>
            <p className="text-xs text-tertiary italic whitespace-break-spaces">
              {row.original.competency?.definition}
            </p>
          </div>
        </div>
      ),
      meta: {
        width: "w-[21%]"
      },
    },
    {
      id: "weight",
      header: "Weight",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <p className="text-sm text-primary">
            {convertAmountFromUnit(row.original.weight, 2).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })}
          </p>
        </div>
      ),
      meta: {
        width: hasChecker ? "w-[8%]" : "w-[9%]",
      },
    },
    {
      id: "plan-target",
      header: "Plan & Target",
      cell: ({ row, table }) => <PlanTargetCell row={row} table={table} />,
      meta: {
        width: "w-[20%]"
      },
    },
    {
      id: "owner",
      header: "Owner",
      cell: ({ row, table }) => {
        const heights = table.options.meta?.rowHeights?.[row.id] || { input: 0, output: 0 };
        
        return (
          <div className="flex flex-col gap-2">
            <FormGenerator 
              form={form}
              name={`competencies.${row.index}.inputEvidenceOwner`}
              label="Input Evidence"
              variant="text"
              disabled={!permissions.canPerformOwner}
              style={{ minHeight: heights.input - 20 }}
            />
            <FormGenerator 
              form={form}
              name={`competencies.${row.index}.outputEvidenceOwner`}
              label="Output Evidence"
              variant="text"
              disabled={!permissions.canPerformOwner}
              style={{ minHeight: heights.output - 20 }}
            />
            <FormField
              control={form.control}
              name={`competencies.${row.index}.levelOwner`}
              render={({ field }) => (
                <FormItem className="grow w-full">
                  <div className="flex items-center gap-0.5">
                    <FormLabel>Level</FormLabel>
                    <CardInfo data={competencyLevels} />
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)} disabled={!permissions.canPerformOwner}>
                    <FormControl>
                      <SelectTrigger size="sm" className="w-full">
                        <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                          <SelectValue placeholder="Empty" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Level 1</SelectItem>
                      <SelectItem value="2">Level 2</SelectItem>
                      <SelectItem value="3">Level 3</SelectItem>
                      <SelectItem value="4">Level 4</SelectItem>
                      <SelectItem value="5">Level 5</SelectItem>
                    </SelectContent>
                  </Select>
                  <Content label="Level * Weight">
                    <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                      {(((Number(field.value) || 0) / table.getRowCount()) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}
                    </p>
                  </Content>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      },
      meta: {
        width: hasChecker ? "w-[17%]" : "w-[25%]" 
      },
    },
  ];

  const checkerColumn: ColumnDef<CompetencyWithInfo> = {
    id: "checker",
    header: "Checker",
    cell: ({ row , table }) => {
      const heights = table.options.meta?.rowHeights?.[row.id] || { input: 0, output: 0 };
      
      return (
        <div className="flex flex-col gap-2">
          <FormGenerator 
            form={form}
            name={`competencies.${row.index}.inputEvidenceChecker`}
            label="Input Evidence"
            variant="text"
            disabled={!permissions.canPerformChecker}
            style={{ minHeight: heights.input - 20 }}
          />
          <FormGenerator 
            form={form}
            name={`competencies.${row.index}.outputEvidenceChecker`}
            label="Output Evidence"
            variant="text"
            disabled={!permissions.canPerformChecker}
            style={{ minHeight: heights.output - 20 }}
          />
          <FormField
            control={form.control}
            name={`competencies.${row.index}.levelChecker`}
            render={({ field }) => (
              <FormItem className="grow w-full">
                <div className="flex items-center gap-0.5">
                  <FormLabel>Level</FormLabel>
                  <CardInfo data={competencyLevels} />
                </div>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)} disabled={!permissions.canPerformChecker}>
                  <FormControl>
                    <SelectTrigger size="sm" className="w-full">
                      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                        <SelectValue placeholder="Empty" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                    <SelectItem value="5">Level 5</SelectItem>
                  </SelectContent>
                </Select>
                <Content label="Level * Weight">
                  <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                    {(((Number(field.value) || 0) / table.getRowCount()) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                  </p>
                </Content>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    },
    meta: {
      width: "w-[17%]"
    },
  };

  const tailColumns: ColumnDef<CompetencyWithInfo>[] = [
    {
      id: "approver",
    header: "Approver",
    cell: ({ row, table }) => {
      const heights = table.options.meta?.rowHeights?.[row.id] || { input: 0, output: 0 };

      return (
        <div className="flex flex-col gap-2">
          <FormGenerator 
            form={form}
            name={`competencies.${row.index}.inputEvidenceApprover`}
            label="Input Evidence"
            variant="text"
            disabled={!permissions.canPerformApprover}
            style={{ minHeight: heights.input - 20 }}
          />
          <FormGenerator 
            form={form}
            name={`competencies.${row.index}.outputEvidenceApprover`}
            label="Output Evidence"
            variant="text"
            disabled={!permissions.canPerformApprover}
            style={{ minHeight: heights.output - 20 }}
          />
          <FormField
            control={form.control}
            name={`competencies.${row.index}.levelApprover`}
            render={({ field }) => (
              <FormItem className="grow w-full">
                <div className="flex items-center gap-0.5">
                  <FormLabel>Level</FormLabel>
                  <CardInfo data={competencyLevels} />
                </div>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)} disabled={!permissions.canPerformApprover}>
                  <FormControl>
                    <SelectTrigger size="sm" className="w-full">
                      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                        <SelectValue placeholder="Empty" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                    <SelectItem value="5">Level 5</SelectItem>
                  </SelectContent>
                </Select>
                <Content label="Level * Weight">
                  <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                    {(((Number(field.value) || 0) / table.getRowCount()) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                  </p>
                </Content>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    },
      meta: {
        width: hasChecker ? "w-[17%]" : "w-[25%]"
      },
    },
    {
      id: "comment",
    },
  ];

  return hasChecker ? [...baseColumns, checkerColumn, ...tailColumns] : [...baseColumns, ...tailColumns];
}